#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const TOOL_NAME = 'Cleaner Pro CLI';
const TRASH_DIR = '_TRASH';
const REPORT_FILE = 'clean-report.txt';

const CACHE_DIRS = new Set(['node_modules', '.cache', 'dist', 'build']);
const TEMP_EXTENSIONS = new Set(['.log', '.tmp']);
const ASSET_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico', '.avif',
  '.css', '.js', '.mjs', '.cjs'
]);
const HTML_EXTENSIONS = new Set(['.html', '.htm']);
const CSS_EXTENSIONS = new Set(['.css']);
const JS_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

const PROTECTED_DIRS = new Set(['img', 'images', 'assets']);
const PROTECTED_FILES = new Set(['index.html', 'main.js', 'style.css']);

const DEFAULT_OPTIONS = {
  dryRun: false,
  verbose: false,
};

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** i);
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function drawProgressBar(percent, width = 20) {
  const bounded = Math.max(0, Math.min(100, percent));
  const filled = Math.round((bounded / 100) * width);
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${bounded.toFixed(0)}%`;
}

function sanitizeForTrash(relPath) {
  const cleaned = relPath
    .replace(/^[.\\/]+/, '')
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\\/g, '/');
  return cleaned || 'unknown';
}

function isProtectedPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const fileName = path.basename(normalized).toLowerCase();
  if (PROTECTED_FILES.has(fileName)) return true;
  const parts = normalized.split('/').map((p) => p.toLowerCase());
  return parts.some((part) => PROTECTED_DIRS.has(part));
}

function getSafeRel(from, to) {
  let rel = path.relative(from, to);
  if (!rel || rel.startsWith('..')) return null;
  return rel.replace(/\\/g, '/');
}

function normalizeRefPath(baseDir, rawRef) {
  if (!rawRef || /^([a-z]+:)?\/\//i.test(rawRef) || rawRef.startsWith('data:') || rawRef.startsWith('#')) {
    return null;
  }

  let ref = rawRef.trim();
  ref = ref.split('#')[0].split('?')[0];
  if (!ref) return null;

  if (ref.startsWith('/')) return ref.slice(1);
  return path.normalize(path.join(baseDir, ref)).replace(/\\/g, '/');
}

function createReadline() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function askQuestion(rl, question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function safeStat(filePath) {
  try {
    return await fsp.stat(filePath);
  } catch {
    return null;
  }
}

async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

class CleanerPro {
  constructor(rootDir, options = {}) {
    this.rootDir = rootDir;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.resetState();
  }

  resetState() {
    this.state = {
      scannedFiles: 0,
      scannedBytes: 0,
      startAt: 0,
      endAt: 0,
      candidates: {
        cache: [],
        temp: [],
        unreferenced: [],
        duplicates: [],
      },
      protectedSkipped: [],
      references: new Set(),
      allAssets: [],
      indexables: {
        html: [],
        css: [],
        js: [],
      },
      fileRecords: [],
      errors: [],
      heavyFiles: [],
    };
  }

  logVerbose(message) {
    if (this.options.verbose) {
      console.log(`[verbose] ${message}`);
    }
  }

  async analyze() {
    this.resetState();
    this.state.startAt = Date.now();

    console.log('\nAnalisi in corso...\n');
    await this.walk(this.rootDir);

    await this.collectReferences();
    await this.detectDuplicates();
    this.detectUnreferencedAssets();

    this.state.endAt = Date.now();
    this.state.heavyFiles = [...this.state.fileRecords]
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    this.renderAnalysisSummary();
    return this.buildSummary();
  }

  async walk(currentPath) {
    let entries;
    try {
      entries = await fsp.readdir(currentPath, { withFileTypes: true });
    } catch (error) {
      this.state.errors.push(`Errore lettura directory ${currentPath}: ${error.message}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = getSafeRel(this.rootDir, fullPath);
      if (!relPath) continue;

      if (relPath.split('/')[0] === TRASH_DIR) {
        continue;
      }

      if (entry.isDirectory()) {
        if (CACHE_DIRS.has(entry.name)) {
          const dirSize = await this.computeDirectorySize(fullPath);
          this.state.candidates.cache.push({ type: 'cache', path: fullPath, relPath, size: dirSize, isDir: true });
          this.logVerbose(`Cache trovata: ${relPath} (${formatBytes(dirSize)})`);
        }

        await this.walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;

      const stat = await safeStat(fullPath);
      if (!stat) continue;

      const ext = path.extname(entry.name).toLowerCase();
      const record = { path: fullPath, relPath, size: stat.size, ext, base: entry.name };
      this.state.fileRecords.push(record);
      this.state.scannedFiles += 1;
      this.state.scannedBytes += stat.size;

      if (TEMP_EXTENSIONS.has(ext)) {
        this.state.candidates.temp.push({ type: 'temp', ...record, isDir: false });
      }

      if (ASSET_EXTENSIONS.has(ext)) {
        this.state.allAssets.push(record);
      }

      if (HTML_EXTENSIONS.has(ext)) this.state.indexables.html.push(record);
      if (CSS_EXTENSIONS.has(ext)) this.state.indexables.css.push(record);
      if (JS_EXTENSIONS.has(ext)) this.state.indexables.js.push(record);

      this.renderLiveAnalysisProgress();
    }
  }

  async computeDirectorySize(dirPath) {
    let total = 0;
    let stack = [dirPath];

    while (stack.length > 0) {
      const current = stack.pop();
      let entries;
      try {
        entries = await fsp.readdir(current, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else if (entry.isFile()) {
          const stat = await safeStat(fullPath);
          if (stat) total += stat.size;
        }
      }
    }

    return total;
  }

  renderLiveAnalysisProgress() {
    const elapsedSec = Math.max((Date.now() - this.state.startAt) / 1000, 0.001);
    const speed = this.state.scannedBytes / elapsedSec;

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(
      `Analizzati: ${this.state.scannedFiles} file | ${formatBytes(this.state.scannedBytes)} | Velocità: ${formatBytes(speed)}/s`
    );
  }

  async collectReferences() {
    if (this.state.scannedFiles > 0) process.stdout.write('\n');

    const extractFromHtml = (content) => {
      const refs = [];
      const regex = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
      let match;
      while ((match = regex.exec(content))) refs.push(match[1]);
      return refs;
    };

    const extractFromCss = (content) => {
      const refs = [];
      const regex = /url\((?:["']?)([^"')]+)(?:["']?)\)/gi;
      let match;
      while ((match = regex.exec(content))) refs.push(match[1]);
      return refs;
    };

    const extractFromJs = (content) => {
      const refs = [];
      const importRegex = /import\s+(?:[^'";]+\s+from\s+)?["']([^"']+)["']/gi;
      const requireRegex = /require\(\s*["']([^"']+)["']\s*\)/gi;
      let match;
      while ((match = importRegex.exec(content))) refs.push(match[1]);
      while ((match = requireRegex.exec(content))) refs.push(match[1]);
      return refs;
    };

    const processFile = async (file, extractor) => {
      try {
        const content = await fsp.readFile(file.path, 'utf8');
        const refs = extractor(content);
        const baseDir = path.dirname(file.relPath);

        for (const ref of refs) {
          const normalized = normalizeRefPath(baseDir, ref);
          if (!normalized) continue;
          this.state.references.add(normalized.toLowerCase());

          if (path.extname(normalized) === '') {
            const variants = ['.js', '.css', '.html', '.png', '.jpg', '.jpeg', '.svg'];
            for (const ext of variants) {
              this.state.references.add(`${normalized}${ext}`.toLowerCase());
            }
          }
        }
      } catch (error) {
        this.state.errors.push(`Errore parsing ${file.relPath}: ${error.message}`);
      }
    };

    for (const file of this.state.indexables.html) {
      await processFile(file, extractFromHtml);
    }
    for (const file of this.state.indexables.css) {
      await processFile(file, extractFromCss);
    }
    for (const file of this.state.indexables.js) {
      await processFile(file, extractFromJs);
    }
  }

  async detectDuplicates() {
    const groupsBySize = new Map();

    for (const file of this.state.fileRecords) {
      if (file.size === 0) continue;
      const arr = groupsBySize.get(file.size) || [];
      arr.push(file);
      groupsBySize.set(file.size, arr);
    }

    for (const [, files] of groupsBySize) {
      if (files.length < 2) continue;

      const groupsByHash = new Map();
      for (const file of files) {
        try {
          const hash = await hashFile(file.path);
          const arr = groupsByHash.get(hash) || [];
          arr.push(file);
          groupsByHash.set(hash, arr);
        } catch (error) {
          this.state.errors.push(`Errore hash ${file.relPath}: ${error.message}`);
        }
      }

      for (const [, hashGroup] of groupsByHash) {
        if (hashGroup.length > 1) {
          const [keep, ...dups] = hashGroup;
          for (const d of dups) {
            this.state.candidates.duplicates.push({ type: 'duplicate', ...d, duplicateOf: keep.relPath, isDir: false });
          }
        }
      }
    }
  }

  detectUnreferencedAssets() {
    for (const asset of this.state.allAssets) {
      const rel = asset.relPath.toLowerCase();
      if (!this.state.references.has(rel)) {
        this.state.candidates.unreferenced.push({ type: 'unreferenced', ...asset, isDir: false });
      }
    }
  }

  renderAnalysisSummary() {
    const summary = this.buildSummary();
    const elapsedSec = Math.max((this.state.endAt - this.state.startAt) / 1000, 0.001);
    const speed = this.state.scannedBytes / elapsedSec;

    const cacheSize = summary.byType.cache.size;
    const tempSize = summary.byType.temp.size;
    const unrefSize = summary.byType.unreferenced.size;

    console.log('Cache:');
    for (const item of this.state.candidates.cache) {
      console.log(`✔ ${item.relPath} (${formatBytes(item.size)})`);
    }
    if (this.state.candidates.cache.length === 0) console.log('• Nessuna cache rilevata');

    console.log('\nFile temporanei:');
    const logSize = this.state.candidates.temp.filter((f) => f.ext === '.log').reduce((acc, f) => acc + f.size, 0);
    const tmpSize = this.state.candidates.temp.filter((f) => f.ext === '.tmp').reduce((acc, f) => acc + f.size, 0);
    if (logSize > 0) console.log(`✔ .log (${formatBytes(logSize)})`);
    if (tmpSize > 0) console.log(`✔ .tmp (${formatBytes(tmpSize)})`);
    if (logSize === 0 && tmpSize === 0) console.log('• Nessun file temporaneo rilevato');

    console.log('\nAsset non utilizzati:');
    const imgSize = this.state.candidates.unreferenced
      .filter((f) => ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico', '.avif'].includes(f.ext))
      .reduce((acc, f) => acc + f.size, 0);
    const jsSize = this.state.candidates.unreferenced
      .filter((f) => JS_EXTENSIONS.has(f.ext))
      .reduce((acc, f) => acc + f.size, 0);
    const cssSize = this.state.candidates.unreferenced
      .filter((f) => CSS_EXTENSIONS.has(f.ext))
      .reduce((acc, f) => acc + f.size, 0);

    if (imgSize > 0) console.log(`✔ immagini non referenziate (${formatBytes(imgSize)})`);
    if (jsSize > 0) console.log(`✔ js inutilizzati (${formatBytes(jsSize)})`);
    if (cssSize > 0) console.log(`✔ css inutilizzati (${formatBytes(cssSize)})`);
    if (imgSize === 0 && jsSize === 0 && cssSize === 0) console.log('• Nessun asset non referenziato rilevato');

    console.log('\nFile protetti:');
    for (const skipped of this.state.protectedSkipped.slice(0, 5)) {
      console.log(`✔ ${skipped} (skipped)`);
    }
    if (this.state.protectedSkipped.length === 0) {
      console.log('• Nessun file protetto coinvolto in questa analisi');
    }

    console.log('\nIndicatori:');
    console.log(`• ${drawProgressBar(100, 28)}`);
    console.log(`• Numero file analizzati: ${this.state.scannedFiles}`);
    console.log(`• MB analizzati: ${(this.state.scannedBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`• Velocità media: ${(speed / (1024 * 1024)).toFixed(2)} MB/s`);

    console.log('\nRISULTATO ANALISI\n');
    console.log(`Spazio recuperabile: ${formatBytes(summary.totalSize)}`);
    console.log(`File coinvolti: ${summary.totalCount}`);
    console.log('\nDettaglio:');
    console.log(`- Cache: ${formatBytes(cacheSize)}`);
    console.log(`- Temporanei: ${formatBytes(tempSize)}`);
    console.log(`- Non usati: ${formatBytes(unrefSize + summary.byType.duplicates.size)}`);

    if (this.state.heavyFiles.length > 0) {
      console.log('\nFile più pesanti (top 5):');
      for (const file of this.state.heavyFiles.slice(0, 5)) {
        console.log(`- ${file.relPath} (${formatBytes(file.size)})`);
      }
    }

    if (this.state.errors.length > 0) {
      console.log(`\nAvvisi analisi: ${this.state.errors.length}`);
      if (this.options.verbose) {
        this.state.errors.slice(0, 10).forEach((e) => console.log(`! ${e}`));
      }
    }
  }

  buildSummary() {
    const byType = {
      cache: this.aggregate(this.state.candidates.cache),
      temp: this.aggregate(this.state.candidates.temp),
      unreferenced: this.aggregate(this.state.candidates.unreferenced),
      duplicates: this.aggregate(this.state.candidates.duplicates),
    };

    return {
      byType,
      totalSize: byType.cache.size + byType.temp.size + byType.unreferenced.size + byType.duplicates.size,
      totalCount: byType.cache.count + byType.temp.count + byType.unreferenced.count + byType.duplicates.count,
    };
  }

  aggregate(items) {
    return {
      count: items.length,
      size: items.reduce((acc, item) => acc + (item.size || 0), 0),
    };
  }

  buildActionList() {
    const all = [
      ...this.state.candidates.cache,
      ...this.state.candidates.temp,
      ...this.state.candidates.unreferenced,
      ...this.state.candidates.duplicates,
    ];

    const dedup = new Map();
    for (const item of all) {
      if (!dedup.has(item.relPath)) dedup.set(item.relPath, item);
    }

    const actions = [];
    this.state.protectedSkipped = [];

    for (const item of dedup.values()) {
      if (isProtectedPath(item.relPath)) {
        this.state.protectedSkipped.push(item.relPath);
        continue;
      }
      actions.push(item);
    }

    return actions;
  }

  async clean({ confirm = false } = {}) {
    const actions = this.buildActionList();
    if (!confirm) return { planned: actions.length };

    const trashRoot = path.join(this.rootDir, TRASH_DIR);
    await fsp.mkdir(trashRoot, { recursive: true });

    const total = actions.length;
    let moved = 0;
    let bytesMoved = 0;
    let errors = 0;
    const start = Date.now();

    console.log('\nPulizia in corso...\n');

    for (const item of actions) {
      const target = path.join(trashRoot, sanitizeForTrash(item.relPath));
      try {
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.rename(item.path, target);
        moved += 1;
        bytesMoved += item.size || 0;
        this.renderCleaningProgress({ moved, total, bytesMoved, current: item.relPath, action: 'MOVE TO TRASH', status: 'OK', start });
      } catch (error) {
        errors += 1;
        this.renderCleaningProgress({ moved, total, bytesMoved, current: item.relPath, action: 'MOVE TO TRASH', status: `ERRORE: ${error.code || error.message}`, start });
      }
    }

    process.stdout.write('\n');

    const result = {
      moved,
      bytesMoved,
      errors,
      total,
      trashPath: `./${TRASH_DIR}`,
      elapsedSec: Math.max((Date.now() - start) / 1000, 0.001),
    };

    await this.writeReport(result);
    return result;
  }

  renderCleaningProgress({ moved, total, bytesMoved, current, action, status, start }) {
    const percent = total === 0 ? 100 : (moved / total) * 100;
    const elapsedSec = Math.max((Date.now() - start) / 1000, 0.001);
    const speed = bytesMoved / elapsedSec;

    readline.cursorTo(process.stdout, 0);
    readline.clearScreenDown(process.stdout);

    process.stdout.write(`${drawProgressBar(percent, 24)}\n\n`);
    process.stdout.write(`File: ${current}\n`);
    process.stdout.write(`Azione: ${action}\n`);
    process.stdout.write(`Stato: ${status}\n\n`);
    process.stdout.write(`Velocità: ${(speed / (1024 * 1024)).toFixed(2)} MB/s\n`);
    process.stdout.write(`Progresso: ${moved} / ${total} file\n`);
    process.stdout.write(`Spazio liberato: ${formatBytes(bytesMoved)}\n`);
  }

  async writeReport(cleanResult) {
    const summary = this.buildSummary();
    const lines = [
      `${TOOL_NAME} - Report`,
      `Data: ${new Date().toISOString()}`,
      `Directory: ${this.rootDir}`,
      '',
      '=== ANALISI ===',
      `File analizzati: ${this.state.scannedFiles}`,
      `Dati analizzati: ${formatBytes(this.state.scannedBytes)}`,
      `Recuperabile: ${formatBytes(summary.totalSize)}`,
      '',
      'Dettaglio categorie:',
      `- Cache: ${summary.byType.cache.count} file/cartelle - ${formatBytes(summary.byType.cache.size)}`,
      `- Temporanei: ${summary.byType.temp.count} file - ${formatBytes(summary.byType.temp.size)}`,
      `- Non referenziati: ${summary.byType.unreferenced.count} file - ${formatBytes(summary.byType.unreferenced.size)}`,
      `- Duplicati: ${summary.byType.duplicates.count} file - ${formatBytes(summary.byType.duplicates.size)}`,
      '',
      'Top file pesanti:',
      ...this.state.heavyFiles.slice(0, 10).map((f) => `- ${f.relPath} (${formatBytes(f.size)})`),
      '',
      '=== PULIZIA ===',
      `File spostati: ${cleanResult.moved}/${cleanResult.total}`,
      `Spazio liberato: ${formatBytes(cleanResult.bytesMoved)}`,
      `Errori: ${cleanResult.errors}`,
      `Backup: ${cleanResult.trashPath}`,
      `Durata: ${cleanResult.elapsedSec.toFixed(2)}s`,
      '',
      'Note sicurezza:',
      '- Nessun file è stato eliminato definitivamente.',
      '- Tutti i file sono stati spostati in _TRASH per eventuale ripristino futuro.',
    ];

    await fsp.writeFile(path.join(this.rootDir, REPORT_FILE), lines.join('\n'), 'utf8');
  }
}

async function waitForAnyKey() {
  return new Promise((resolve) => {
    process.stdout.write('\nPremi un tasto per uscire...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      resolve();
    });
  });
}

function printDashboard(rootDir) {
  console.clear();
  console.log('==============================================');
  console.log(`  ${TOOL_NAME}`);
  console.log('==============================================');
  console.log(`Directory corrente: ${rootDir}`);
  console.log('Stato: Pronto\n');
  console.log('[1] Avvia Analisi');
  console.log('[2] Modalità Dry Run');
  console.log('[3] Esci\n');
}

async function runFromCli() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
  };

  const rootDir = process.cwd();
  const cleaner = new CleanerPro(rootDir, options);

  const rl = createReadline();
  try {
    if (!options.dryRun) {
      printDashboard(rootDir);
      const choice = await askQuestion(rl, 'Seleziona opzione [1-3]: ');

      if (choice === '3') {
        console.log('Uscita richiesta.');
        return;
      }
      if (choice === '2') options.dryRun = true;
      if (!['1', '2'].includes(choice)) {
        console.log('Opzione non valida. Uscita.');
        return;
      }
    } else {
      console.log(`${TOOL_NAME} | Modalità Dry Run\n`);
    }

    await cleaner.analyze();
    const planned = cleaner.buildActionList();

    if (options.dryRun) {
      console.log('\n[DRY RUN] Nessuna modifica applicata.');
      console.log(`Elementi candidati allo spostamento: ${planned.length}`);
      await cleaner.writeReport({ moved: 0, bytesMoved: 0, errors: 0, total: planned.length, trashPath: `./${TRASH_DIR}`, elapsedSec: 0 });
      console.log(`Report salvato in ${REPORT_FILE}`);
      return;
    }

    console.log('\nProcedere con la pulizia?\n');
    console.log('[ Y ] Sì');
    console.log('[ N ] No');
    console.log('\nSicurezza: "Tutti i file verranno spostati in _TRASH (recuperabili)"\n');

    const answer = (await askQuestion(rl, 'Conferma [Y/N]: ')).toLowerCase();
    if (answer !== 'y') {
      console.log('Pulizia annullata dall\'utente.');
      return;
    }

    const result = await cleaner.clean({ confirm: true });

    console.log('PULIZIA COMPLETATA\n');
    console.log(`File spostati: ${result.moved}`);
    console.log(`Spazio liberato: ${formatBytes(result.bytesMoved)}`);
    console.log(`\nPercorso backup:\n${result.trashPath}`);
    console.log(`\nErrori: ${result.errors}`);
    console.log(`Report salvato: ./${REPORT_FILE}`);
  } finally {
    rl.close();
  }

  await waitForAnyKey();
}

if (require.main === module) {
  runFromCli().catch((error) => {
    console.error(`Errore fatale: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { CleanerPro, runFromCli };

#!/usr/bin/env node
/**
 * Dev server launcher — apre automaticamente il browser.
 * Avvia:  npm run dev
 */
'use strict';

const { spawn } = require('child_process');
const net       = require('net');
const path      = require('path');

const PORT    = parseInt(process.env.PORT || '3000', 10);
const ROOT    = path.resolve(__dirname, '..');

/* ── trova una porta libera a partire da PORT ── */
function findFreePort(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(findFreePort(port + 1)));
    srv.once('listening', () => { srv.close(); resolve(port); });
    srv.listen(port, '127.0.0.1');
  });
}

/* ── apre il browser su Windows / macOS / Linux ── */
function openBrowser(url) {
  const map = { win32: 'start', darwin: 'open', linux: 'xdg-open' };
  const cmd = map[process.platform] || 'xdg-open';
  const args = process.platform === 'win32' ? ['', url] : [url];
  spawn(cmd, args, { stdio: 'ignore', detached: true, shell: true }).unref();
}

(async () => {
  const port = await findFreePort(PORT);
  const url  = `http://localhost:${port}`;

  console.log(`\n  🌾  Cascina Fontana — dev server`);
  console.log(`  →   ${url}\n`);

  const isWin  = process.platform === 'win32';
  const cmd    = isWin ? 'npx' : 'node';
  const args   = isWin
    ? ['serve', ROOT, '-p', String(port), '--no-port-switching']
    : [path.resolve(ROOT, 'node_modules', 'serve', 'build', 'main.js'), ROOT, '-p', String(port), '--no-port-switching'];

  const proc = spawn(cmd, args, {
    stdio: ['ignore', 'inherit', 'inherit'],
    cwd: ROOT,
    shell: isWin
  });

  proc.on('error', err => { console.error('serve error:', err.message); process.exit(1); });
  proc.on('exit',  code => process.exit(code ?? 0));

  /* aspetta che la porta risponda, poi apre il browser */
  const tryOpen = (attempts = 0) => {
    const client = net.createConnection({ port, host: '127.0.0.1' });
    client.once('connect', () => { client.destroy(); openBrowser(url); });
    client.once('error', () => {
      client.destroy();
      if (attempts < 20) setTimeout(() => tryOpen(attempts + 1), 200);
    });
  };
  setTimeout(() => tryOpen(), 400);
})();

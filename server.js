/**
 * Dev server locale — replica il comportamento Vercel:
 *   - Serve file statici dalla root
 *   - Espone GET /api/config leggendo le variabili da .env
 *
 * Avvio: npm run dev  (node server.js)
 */

'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

// ── Carica .env ──────────────────────────────────────────────────────────────
try {
  const raw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
} catch { /* .env opzionale */ }

// ── Configurazione ───────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html'  : 'text/html; charset=utf-8',
  '.css'   : 'text/css',
  '.js'    : 'application/javascript',
  '.json'  : 'application/json',
  '.png'   : 'image/png',
  '.jpg'   : 'image/jpeg',
  '.jpeg'  : 'image/jpeg',
  '.webp'  : 'image/webp',
  '.svg'   : 'image/svg+xml',
  '.ico'   : 'image/x-icon',
  '.woff2' : 'font/woff2',
  '.woff'  : 'font/woff',
  '.ttf'   : 'font/ttf',
  '.mp4'   : 'video/mp4',
  '.webm'  : 'video/webm',
};

// ── Server ───────────────────────────────────────────────────────────────────
http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;

  // ── GET /api/config ────────────────────────────────────────────────────────
  if (pathname === '/api/config' && req.method === 'GET') {
    const supaUrl = process.env.SUPABASE_URL;
    const anon    = process.env.SUPABASE_ANON_KEY;

    if (!supaUrl || !anon) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error: 'SUPABASE_URL / SUPABASE_ANON_KEY mancanti nel file .env',
      }));
    }

    res.writeHead(200, {
      'Content-Type' : 'application/json',
      'Cache-Control': 'no-cache',
    });
    return res.end(JSON.stringify({ SUPABASE_URL: supaUrl, SUPABASE_ANON: anon }));
  }

  // ── File statici ───────────────────────────────────────────────────────────
  let filePath = path.join(__dirname, pathname);

  // Redirect / → /main
  if (pathname === '/') {
    res.writeHead(302, { Location: '/main' });
    return res.end();
  }

  // Prova directory → index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Normalizza path traversal (sicurezza base)
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(__dirname))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not found');
    }
    const ext      = path.extname(resolved).toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });

}).listen(PORT, () => {
  console.log(`\n  Dev server → http://localhost:${PORT}\n`);
});

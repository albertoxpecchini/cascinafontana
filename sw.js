const VERSION = '20260426-2';
const PRECACHE = `cascina-precache-${VERSION}`;
const RUNTIME = `cascina-runtime-${VERSION}`;

const PUBLIC_PAGES = [
  '/main',
  '/storia',
  '/dati',
  '/galleria',
  '/prodotti',
  '/novita',
  '/contatti',
  '/shop',
];

const PRECACHE_URLS = [
  '/index.html',
  ...PUBLIC_PAGES.map(path => `${path}/index.html`),
  '/js/anime-animations.js?v=dce3399',
  '/js/gsap-animations.js',
  '/js/gsap-shop-gallery.js',
  '/js/performance.js',
  '/js/supabase.js',
  '/js/gallery.js',
  '/js/shop.js',
  '/js/prodotti.js',
  '/js/novita.js',
  '/js/contatti.js',
  '/js/contact.js',
  '/css/base.css',
  '/css/components.css',
  '/css/layout.css',
  '/css/variables.css',
  '/css/pages/main.css',
  '/css/pages/galleria.css',
  '/css/pages/shop.css',
  '/css/pages/contatti.css',
];

const CACHEABLE_CDN_HOSTS = new Set([
  'cdn.tailwindcss.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
]);

function isCacheableResponse(response) {
  return response && (response.ok || response.type === 'opaque');
}

function publicPageFallback(pathname) {
  if (pathname === '/' || pathname === '') return '/main/index.html';
  const clean = pathname.replace(/\/$/, '');
  const page = PUBLIC_PAGES.find(item => clean === item || clean === `${item}/index.html`);
  return page ? `${page}/index.html` : null;
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function staleWhileRevalidate(request, fallbackUrl = null) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request)
    || (fallbackUrl ? await caches.match(fallbackUrl) : null);

  const network = fetch(request)
    .then(response => {
      if (isCacheableResponse(response)) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    network.catch(() => {});
    return cached;
  }

  const response = await network;
  return response || new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await Promise.allSettled(
      PRECACHE_URLS.map(url => cache.add(new Request(url, { cache: 'reload' })))
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const allowed = new Set([PRECACHE, RUNTIME]);
    const keys = await caches.keys();
    await Promise.all(keys.map(key => allowed.has(key) ? null : caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (
      url.pathname === '/sw.js' ||
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/admin')
    ) {
      return;
    }

    const acceptsHtml = request.mode === 'navigate'
      || request.headers.get('accept')?.includes('text/html');

    if (acceptsHtml) {
      event.respondWith(staleWhileRevalidate(request, publicPageFallback(url.pathname)));
      return;
    }

    if (/\.(?:css|js|mjs|json|png|jpg|jpeg|webp|svg|gif|ico|woff2?|ttf)$/i.test(url.pathname)) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  const cacheableDestination = ['script', 'style', 'font', 'image'].includes(request.destination);
  if (cacheableDestination && CACHEABLE_CDN_HOSTS.has(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
});

const PUBLIC_PATHS = ['/main', '/storia', '/dati', '/galleria', '/prodotti', '/novita', '/contatti', '/shop'];
const PREFETCHED = new Set();

function onIdle(fn, timeout = 1600) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(fn, { timeout });
    return;
  }
  window.setTimeout(fn, Math.min(timeout, 600));
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!window.isSecureContext && location.hostname !== 'localhost') return;

  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.warn('[performance] Service worker non registrato:', err);
  });
}

function prefetchPath(path) {
  if (PREFETCHED.has(path)) return;
  PREFETCHED.add(path);

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  document.head.appendChild(link);
}

function initIntentPrefetch() {
  document.addEventListener('pointerover', event => {
    const link = event.target.closest?.('a[href^="/"]');
    if (!link) return;
    const url = new URL(link.href, location.origin);
    if (url.origin !== location.origin || url.pathname.startsWith('/admin')) return;
    prefetchPath(url.pathname);
  }, { passive: true });

  document.addEventListener('touchstart', event => {
    const link = event.target.closest?.('a[href^="/"]');
    if (!link) return;
    const url = new URL(link.href, location.origin);
    if (url.origin !== location.origin || url.pathname.startsWith('/admin')) return;
    prefetchPath(url.pathname);
  }, { passive: true });
}

function prefetchCorePages() {
  const current = location.pathname.replace(/\/$/, '');
  PUBLIC_PATHS
    .filter(path => path !== current)
    .slice(0, 4)
    .forEach(prefetchPath);
}

function optimizeImages(root = document) {
  const viewport = window.innerHeight || 800;
  root.querySelectorAll?.('img').forEach((img, index) => {
    img.decoding = img.decoding || 'async';

    const rect = img.getBoundingClientRect();
    const nearViewport = rect.top < viewport * 1.25;
    if (nearViewport && index < 6) {
      img.loading = 'eager';
      img.fetchPriority = index === 0 ? 'high' : 'auto';
    } else if (!img.loading) {
      img.loading = 'lazy';
    }
  });
}

function keepFooterVisible() {
  document.querySelectorAll('footer, footer *').forEach(el => {
    if (el.style.opacity === '0') el.style.opacity = '1';
    if (el.style.visibility === 'hidden') el.style.visibility = 'visible';
  });
}

function observeDynamicImages() {
  if (!('MutationObserver' in window)) return;
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) optimizeImages(node);
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function warmPublicDataCache() {
  if (!window.__ENV__?.SUPABASE_URL || !window.__ENV__?.SUPABASE_ANON) return;

  import('/js/supabase.js')
    .then(module => module.warmPublicDataCache?.())
    .catch(() => {});
}

function init() {
  registerServiceWorker();
  optimizeImages();
  keepFooterVisible();
  initIntentPrefetch();
  observeDynamicImages();

  window.addEventListener('pageshow', keepFooterVisible, { passive: true });
  window.addEventListener('load', () => {
    onIdle(prefetchCorePages, 1200);
    onIdle(warmPublicDataCache, 2200);
  }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

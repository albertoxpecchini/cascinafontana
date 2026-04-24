// ══════════════════════════════════════════════════════════════
// Anime.js v4 — Cascina Fontana — Edizione Completa
// Usa: animate, createTimeline, createTimer, createAnimatable,
//      createDraggable, createScope, createLayout, onScroll,
//      engine, spring, stagger, splitText, svg, utils
// ══════════════════════════════════════════════════════════════

import {
  animate,
  createTimeline,
  createTimer,
  createAnimatable,
  createDraggable,
  createScope,
  createLayout,
  onScroll,
  engine,
  spring,
  stagger,
  splitText,
  svg,
  utils,
} from '/node_modules/animejs/dist/bundles/anime.esm.min.js';

const BRAND     = '#3ECF8E';
const BRAND_RGB = '62,207,142';

// Engine — impostazioni globali
engine.defaults.ease     = 'out(3)';
engine.defaults.duration = 700;
// pauseOnDocumentHidden è già true di default

// Guard: GSAP è caricato su main, galleria, shop
const hasGsap = typeof window.gsap !== 'undefined';

// ──────────────────────────────────────────────────────────────
// 1. BARRA PROGRESSO SCROLL (onScroll sync:linear)
// ──────────────────────────────────────────────────────────────
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px', 'width:0%',
    `background:linear-gradient(90deg,${BRAND},#18E299)`,
    'z-index:9999', 'pointer-events:none',
    `box-shadow:0 0 10px ${BRAND}55`,
  ].join(';');
  document.body.appendChild(bar);

  // onScroll con sync:'linear' lega il progresso all'animazione allo scroll
  animate(bar, {
    width:    '100%',
    ease:     'none',
    duration: 1000,
    autoplay: onScroll({ sync: 'linear' }),
  });
}

// ──────────────────────────────────────────────────────────────
// 2. PARTICELLE HERO (createTimer per il loop canvas)
// ──────────────────────────────────────────────────────────────
function initHeroParticles() {
  if (!document.getElementById('hero-title')) return;
  const hero = document.querySelector('section');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particelle con proprietà casuali (utils.random)
  const pts = Array.from({ length: 70 }, () => ({
    x:     utils.random(0, canvas.width),
    y:     utils.random(0, canvas.height),
    r:     utils.random(0.3, 2.2),
    vx:    (Math.random() - 0.5) * 0.30,
    vy:    (Math.random() - 0.5) * 0.30,
    phase: utils.random(0, Math.PI * 2),
    spd:   utils.random(0.010, 0.028),
    conn:  [],
  }));

  // createTimer integra il loop nel motore anime.js
  // (si ferma automaticamente se pauseOnDocumentHidden = true)
  createTimer({
    loop: true,
    onUpdate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.phase += p.spd;
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;

        // Connetti particelle vicine
        for (let j = i + 1; j < pts.length; j++) {
          const q  = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${BRAND_RGB},${(0.08 * (1 - d / 90)).toFixed(2)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }

        const a = 0.10 + 0.20 * Math.sin(p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BRAND_RGB},${a.toFixed(2)})`;
        ctx.fill();
      });
    },
  });
}

// ──────────────────────────────────────────────────────────────
// 3. SCIA CURSORE (animate + utils)
// ──────────────────────────────────────────────────────────────
function initCursorSparkle() {
  if ('ontouchstart' in window) return;
  let lastT = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastT < 65) return;
    lastT = now;

    const dot = document.createElement('span');
    dot.style.cssText = `position:fixed;pointer-events:none;z-index:9998;border-radius:50%;width:6px;height:6px;background:${BRAND};`;
    document.body.appendChild(dot);

    utils.set(dot, {
      x:       e.clientX - 3,
      y:       e.clientY - 3,
      opacity: 0.85,
      scale:   1,
    });

    animate(dot, {
      opacity:  0,
      scale:    0,
      x:        e.clientX + utils.random(-20, 20),
      y:        e.clientY + utils.random(-20, 20),
      duration: 800,
      ease:     'out(4)',
      onComplete: () => dot.remove(),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 4. ALONE AMBIENTALE (createAnimatable + spring)
// ──────────────────────────────────────────────────────────────
function initAmbientGlow() {
  if ('ontouchstart' in window) return;

  const glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed', 'width:700px', 'height:700px', 'border-radius:50%',
    `background:radial-gradient(circle,rgba(${BRAND_RGB},.035) 0%,transparent 70%)`,
    'pointer-events:none', 'z-index:0',
    'transform:translate(-50%,-50%)', 'top:0', 'left:0',
  ].join(';');
  document.body.appendChild(glow);

  // createAnimatable: ogni update del cursore usa spring per il x/y
  const a = createAnimatable(glow, {
    x: { ease: spring(1, 28, 8, 0) },
    y: { ease: spring(1, 28, 8, 0) },
  });

  document.addEventListener('mousemove', e => {
    a.x(e.clientX);
    a.y(e.clientY);
  });
}

// ──────────────────────────────────────────────────────────────
// 5. GLOW CARD (createAnimatable spring per tracking cursore)
// ──────────────────────────────────────────────────────────────
function initCardGlow() {
  if ('ontouchstart' in window) return;

  const sel = [
    '[class*="rounded-xl"][class*="border-white"]',
    '[class*="rounded-2xl"][class*="border-white"]',
    '.card',
  ].join(',');

  document.querySelectorAll(sel).forEach(card => {
    if (card._glow) return;
    card._glow = true;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.style.overflow = 'hidden';

    const glow = document.createElement('span');
    glow.style.cssText = [
      'position:absolute', 'pointer-events:none',
      'width:300px', 'height:300px', 'border-radius:50%',
      `background:radial-gradient(circle,rgba(${BRAND_RGB},.14) 0%,transparent 70%)`,
      'z-index:0', 'top:0', 'left:0',
    ].join(';');
    card.appendChild(glow);

    utils.set(glow, { opacity: 0, x: -150, y: -150 });

    // createAnimatable: aggiornamento fluido con spring per x/y
    const a = createAnimatable(glow, {
      x:       { ease: spring(1, 55, 10, 0) },
      y:       { ease: spring(1, 55, 10, 0) },
      opacity: { ease: 'out(2)', duration: 350 },
    });

    card.addEventListener('mouseenter', () => a.opacity(1));
    card.addEventListener('mouseleave', () => a.opacity(0));
    card.addEventListener('mousemove', ev => {
      const r = card.getBoundingClientRect();
      a.x(ev.clientX - r.left - 150);
      a.y(ev.clientY - r.top  - 150);
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 6. RIPPLE BOTTONI (animate)
// ──────────────────────────────────────────────────────────────
function initButtonRipple() {
  document.querySelectorAll(
    'a[class*="bg-brand"],button[class*="bg-brand"],.btn-primary,.btn-brand'
  ).forEach(el => {
    if (el._rip) return;
    el._rip = true;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';

    el.addEventListener('click', function (ev) {
      const r   = this.getBoundingClientRect();
      const dim = Math.max(r.width, r.height) * 2.6;
      const rip = document.createElement('span');
      rip.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:10;width:${dim}px;height:${dim}px;background:rgba(255,255,255,.24);`;
      utils.set(rip, {
        x:       ev.clientX - r.left - dim / 2,
        y:       ev.clientY - r.top  - dim / 2,
        scale:   0,
        opacity: .65,
      });
      this.appendChild(rip);
      animate(rip, {
        scale:   1,
        opacity: 0,
        duration: 680,
        ease:    'out(3)',
        onComplete: () => rip.remove(),
      });
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 7. BOTTONI MAGNETICI (createAnimatable spring)
// ──────────────────────────────────────────────────────────────
function initMagneticCTA() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('[class*="bg-brand"]').forEach(btn => {
    if (btn._mag) return;
    btn._mag = true;

    const a = createAnimatable(btn, {
      x: { ease: spring(1, 80, 13, 0) },
      y: { ease: spring(1, 80, 13, 0) },
    });

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      a.x((e.clientX - r.left - r.width  / 2) * 0.24);
      a.y((e.clientY - r.top  - r.height / 2) * 0.24);
    });
    btn.addEventListener('mouseleave', () => { a.x(0); a.y(0); });
  });
}

// ──────────────────────────────────────────────────────────────
// 8. LOGO NAV (animate + createAnimatable)
// ──────────────────────────────────────────────────────────────
function initLogoAnimation() {
  const logo = document.querySelector('header a[href="/main"]')
            || document.querySelector('header a[href="/"]');
  if (!logo || logo._logoAnim) return;
  logo._logoAnim = true;

  animate(logo, { opacity: [0, 1], x: [-12, 0], duration: 900, delay: 80 });

  const a = createAnimatable(logo, {
    scale: { ease: spring(1, 100, 12, 0) },
  });
  logo.addEventListener('mouseenter', () => a.scale(1.07));
  logo.addEventListener('mouseleave', () => a.scale(1));
}

// ──────────────────────────────────────────────────────────────
// 9. SOTTOLINEATURA NAV (createAnimatable spring)
// ──────────────────────────────────────────────────────────────
function initNavUnderline() {
  document.querySelectorAll('header nav a').forEach(link => {
    if (link._ul) return;
    link._ul = true;
    if (getComputedStyle(link).position === 'static') link.style.position = 'relative';

    const ul = document.createElement('span');
    ul.style.cssText = `position:absolute;bottom:-2px;left:0;height:1.5px;width:100%;background:${BRAND};border-radius:2px;pointer-events:none;`;
    utils.set(ul, { scaleX: 0, transformOrigin: 'left' });
    link.appendChild(ul);

    const a = createAnimatable(ul, {
      scaleX: { ease: spring(1, 100, 14, 0) },
    });
    link.addEventListener('mouseenter', () => a.scaleX(1));
    link.addEventListener('mouseleave', () => a.scaleX(0));
  });
}

// ──────────────────────────────────────────────────────────────
// 10. TESTO SPLIT + REVEAL H2 (splitText + onScroll)
// ──────────────────────────────────────────────────────────────
function initHeadingReveal() {
  const fold = window.innerHeight;

  document.querySelectorAll('h2').forEach(h => {
    if (h._split || h.getBoundingClientRect().top <= fold) return;
    h._split = true;

    const s = splitText(h, { type: 'words' });
    utils.set(s.words, { opacity: 0, y: 24 });

    animate(s.words, {
      opacity: [0, 1],
      y:       [24, 0],
      delay:   stagger(55, { from: 'first' }),
      ease:    spring(1, 100, 16, 0),
      autoplay: onScroll({ target: h, enter: 'top 85%' }),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 11. REVEAL GRIGLIA STAGGERED (animate + stagger + onScroll)
// ──────────────────────────────────────────────────────────────
function initGridReveal() {
  const fold = window.innerHeight;

  document.querySelectorAll('.grid').forEach(grid => {
    const items = [...grid.children];
    if (items.length < 2 || grid._rev) return;
    grid._rev = true;

    const below = items.filter(it => it.getBoundingClientRect().top > fold + 50);
    if (!below.length) return;

    utils.set(below, { opacity: 0, y: 28, scale: 0.96 });
    animate(below, {
      opacity: [0, 1],
      y:       [28, 0],
      scale:   [0.96, 1],
      delay:   stagger(90, { from: 'first', start: 50 }),
      duration: 700,
      ease:    'out(3)',
      autoplay: onScroll({ target: grid, enter: 'top 86%' }),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 12. REVEAL SEZIONI (solo pagine senza GSAP)
// ──────────────────────────────────────────────────────────────
function initSectionReveals() {
  const fold = window.innerHeight;

  document.querySelectorAll('section > div[class*="max-w"]').forEach(el => {
    if (el._srev || el.getBoundingClientRect().top <= fold) return;
    el._srev = true;

    utils.set(el, { opacity: 0, y: 30 });
    animate(el, {
      opacity: [0, 1],
      y:       [30, 0],
      duration: 750,
      ease:    'out(3)',
      autoplay: onScroll({ target: el, enter: 'top 85%' }),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 13. REVEAL FOOTER (createTimeline + stagger + onScroll)
// ──────────────────────────────────────────────────────────────
function initFooterReveal() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const grid = footer.querySelector('.grid');
  if (!grid) return;

  const cols = [...grid.children];
  utils.set(cols, { opacity: 0, y: 22 });

  // createTimeline: sequenza coordinata per le colonne footer
  const tl = createTimeline({
    autoplay: onScroll({ target: footer, enter: 'top 92%' }),
    defaults: { ease: 'out(3)', duration: 600 },
  });

  cols.forEach((col, i) => {
    tl.add(col, { opacity: [0, 1], y: [22, 0] }, i * 65);
  });
}

// ──────────────────────────────────────────────────────────────
// 14. TIMELINE STORIA (animate + createTimeline + onScroll)
// ──────────────────────────────────────────────────────────────
function initStoriaTimeline() {
  const lineEl = document.querySelector('[class*="bg-brand"][class*="w-1"]');
  if (!lineEl) return;

  lineEl.style.transformOrigin = 'top center';
  utils.set(lineEl, { scaleY: 0 });

  animate(lineEl, {
    scaleY:   [0, 1],
    duration: 1800,
    ease:     'out(4)',
    delay:    300,
  });

  // Pallini timeline con spring staggerato
  const dots = [...document.querySelectorAll('[class*="rounded-full"][class*="bg-brand"]')];
  utils.set(dots, { scale: 0, opacity: 0 });
  animate(dots, {
    scale:   [0, 1.25, 1],
    opacity: [0, 1],
    delay:   stagger(260, { start: 550 }),
    ease:    spring(1, 120, 12, 0),
  });

  // Righe contenuto: alternano da sinistra e destra (createTimeline)
  const rows = [...document.querySelectorAll('[class*="items-start"][class*="gap"]')];
  rows.forEach((row, i) => {
    const xFrom = i % 2 === 0 ? -38 : 38;
    utils.set(row, { opacity: 0, x: xFrom });
    animate(row, {
      opacity: [0, 1],
      x:       [xFrom, 0],
      duration: 720,
      ease:    'out(3)',
      delay:   650 + i * 180,
      autoplay: onScroll({ target: row, enter: 'top 88%' }),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 15. PHOTO STRIP DRAGGABLE (createDraggable + spring)
// ──────────────────────────────────────────────────────────────
function initPhotoDraggable() {
  const strip = document.getElementById('photo-strip');
  if (!strip) return;

  strip.style.cursor = 'grab';

  createDraggable(strip, {
    x:           true,
    y:           false,
    releaseEase: spring(1, 80, 14, 0),
    onGrab()    { strip.style.cursor = 'grabbing'; },
    onRelease() { strip.style.cursor = 'grab'; },
  });
}

// ──────────────────────────────────────────────────────────────
// 16. SHOP LAYOUT FILTER (createLayout per animazioni FLIP)
// ──────────────────────────────────────────────────────────────
function initShopLayout() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;

  const layout = createLayout(grid, {
    duration:  400,
    ease:      spring(1, 80, 14, 0),
    enterFrom: { opacity: 0, scale: 0.88 },
    leaveTo:   { opacity: 0, scale: 0.88 },
  });

  // Chiama record() PRIMA della mutazione DOM
  const filterBtns = [
    ...document.querySelectorAll('.filter-btn'),
    ...document.querySelectorAll('[data-category-btn]'),
  ];
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => layout.record(), true); // capture phase
  });
}

// ──────────────────────────────────────────────────────────────
// 17. GALLERIA — REVEAL DINAMICO (MutationObserver + stagger)
// ──────────────────────────────────────────────────────────────
function initGalleryReveal() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  new MutationObserver(mutations => {
    const added = [];
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) added.push(n);
    }));
    if (!added.length) return;

    utils.set(added, { opacity: 0, scale: 0.88, y: 24 });
    animate(added, {
      opacity: [0, 1],
      scale:   [0.88, 1],
      y:       [24, 0],
      delay:   stagger(60, { from: 'first' }),
      ease:    spring(1, 80, 14, 0),
    });
  }).observe(grid, { childList: true });
}

// ──────────────────────────────────────────────────────────────
// 18. FORM INTERAZIONI (createAnimatable + animate)
// ──────────────────────────────────────────────────────────────
function initFormAnimations() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('input, textarea').forEach(inp => {
    const a = createAnimatable(inp, {
      scale: { ease: spring(1, 100, 14, 0) },
    });
    inp.addEventListener('focus', () => a.scale(1.013));
    inp.addEventListener('blur',  () => a.scale(1));
  });

  form.addEventListener('submit', () => {
    const bad = [...form.querySelectorAll(':invalid')];
    if (!bad.length) return;
    animate(bad, {
      x:        [0, -8, 8, -6, 6, -4, 4, 0],
      duration: 480,
      ease:     'linear',
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 19. SHIMMER DIVISORI (animate loop)
// ──────────────────────────────────────────────────────────────
function initDividerShimmer() {
  document.querySelectorAll('.h-px, [class*="h-px"]').forEach((div, i) => {
    animate(div, {
      opacity:   [0.3, 1, 0.3],
      duration:  3500,
      ease:      'inOut(2)',
      loop:      true,
      alternate: true,
      delay:     i * 380,
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 20. H1 PAGINE INTERNE (animate su pagine senza hero GSAP)
// ──────────────────────────────────────────────────────────────
function initPageTitleEntrance() {
  if (document.getElementById('hero-title')) return;
  const h1 = document.querySelector('h1');
  if (!h1) return;

  const s = splitText(h1, { type: 'chars' });
  utils.set(s.chars, { opacity: 0, y: 20, rotate: -5 });

  // createTimeline per l'entrata carattere per carattere
  createTimeline({ defaults: { ease: spring(1, 100, 14, 0) } })
    .add(s.chars, {
      opacity: [0, 1],
      y:       [20, 0],
      rotate:  [-5, 0],
      delay:   stagger(35, { from: 'first' }),
    });
}

// ──────────────────────────────────────────────────────────────
// 21. HERO SUBTITLE WORD REVEAL (createTimeline + splitText)
// ──────────────────────────────────────────────────────────────
function initHeroSubtitleReveal() {
  const sub = document.querySelector('.hero-subtitle');
  if (!sub) return;

  const s = splitText(sub, { type: 'words' });
  utils.set(s.words, { opacity: 0, y: 14 });

  // Entra dopo che GSAP ha animato il titolo (delay 850ms)
  createTimeline({ defaults: { ease: spring(1, 90, 15, 0) } })
    .add(s.words, {
      opacity: [0, 1],
      y:       [14, 0],
      delay:   stagger(55, { start: 850 }),
    });
}

// ──────────────────────────────────────────────────────────────
// 22. PARALLASSE SEZIONI (onScroll scrub)
// ──────────────────────────────────────────────────────────────
function initParallaxImages() {
  document.querySelectorAll('img[class*="object-cover"]').forEach(img => {
    if (img._px) return;
    img._px = true;

    animate(img, {
      y:        ['-8%', '8%'],
      ease:     'none',
      autoplay: onScroll({
        target: img,
        sync:   'linear',
        enter:  'top bottom',
        leave:  'bottom top',
      }),
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 23. COUNTER NUMERI (createTimer per conteggio)
// ──────────────────────────────────────────────────────────────
function initNumberCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    const timer = createTimer({
      duration: 1800,
      ease:     'out(3)',
      autoplay: onScroll({ target: el, enter: 'top 85%' }),
      onUpdate(t) {
        const val = Math.round(t.progress * target);
        el.textContent = val.toLocaleString('it-IT');
      },
    });
  });
}

// ──────────────────────────────────────────────────────────────
// INIT — createScope raggruppa tutto
// ──────────────────────────────────────────────────────────────
function init() {
  const scope = createScope({ root: document.documentElement });

  scope.add(() => {
    // ── Universali (tutte le pagine) ──
    initScrollProgress();
    initCursorSparkle();
    initAmbientGlow();
    initCardGlow();
    initButtonRipple();
    initMagneticCTA();
    initNavUnderline();
    initLogoAnimation();
    initFooterReveal();
    initDividerShimmer();
    initNumberCounters();

    // ── Solo su pagine senza GSAP (storia, prodotti, contatti, novita) ──
    if (!hasGsap) {
      initHeadingReveal();
      initGridReveal();
      initSectionReveals();
      initPageTitleEntrance();
      initParallaxImages();
    }

    // ── Homepage (main) ──
    initHeroParticles();
    initHeroSubtitleReveal();
    initPhotoDraggable();

    // ── Storia ──
    initStoriaTimeline();

    // ── Shop ──
    initShopLayout();

    // ── Galleria ──
    initGalleryReveal();

    // ── Contatti ──
    initFormAnimations();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

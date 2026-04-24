// ══════════════════════════════════════════════════════════════
// GSAP Animations — Galleria & Shop — Cascina Fontana
// ══════════════════════════════════════════════════════════════

if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
  console.warn('[gsap-shop-gallery] GSAP non disponibile.');
} else {
  gsap.registerPlugin(ScrollTrigger);
  document.addEventListener('DOMContentLoaded', initShopGalleryAnimations);
}

function initShopGalleryAnimations() {

  // ─── HERO ENTRANCE ───────────────────────────────────────────
  // Funziona su entrambe le pagine (galleria e shop)
  (function initHero() {
    const h1    = document.querySelector('h1');
    const lead  = document.querySelector('section p:first-child');
    const sub   = document.querySelector('section p.text-white\\/45, section p[class*="text-white/4"]');
    const badges = document.querySelectorAll('section .flex-wrap.items-center.justify-center > span');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (lead)   tl.from(lead,   { opacity: 0, y: 12, duration: 0.6 }, 0);
    if (h1)     tl.from(h1.querySelectorAll('span'), {
      opacity: 0, y: 32, duration: 0.8, stagger: 0.12
    }, 0.15);
    if (sub)    tl.from(sub,    { opacity: 0, y: 14, duration: 0.6 }, 0.45);
    if (badges.length) tl.from(badges, {
      opacity: 0, y: 10, scale: 0.9, duration: 0.5, stagger: 0.08,
      ease: 'back.out(1.5)'
    }, 0.65);
  })();

  // ─── GALLERIA ────────────────────────────────────────────────
  (function initGalleria() {
    const grid    = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lightbox-img');
    if (!grid) return;

    // Anima i nuovi item quando il Supabase loader li inserisce
    const mo = new MutationObserver(mutations => {
      const added = [];
      mutations.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && n.classList.contains('gallery-item')) added.push(n);
      }));
      if (!added.length) return;

      gsap.from(added, {
        opacity: 0,
        scale:   0.88,
        y:       28,
        duration: 0.55,
        stagger:  0.07,
        ease:    'back.out(1.4)',
        clearProps: 'all',
      });
    });
    mo.observe(grid, { childList: true });

    // Lightbox: apre con GSAP (il bug is-open→active è già corretto in gallery.js)
    if (lightbox && lbImg) {
      let lbOpen = false;
      const moLb = new MutationObserver(() => {
        const isActive = lightbox.classList.contains('active');
        if (isActive && !lbOpen) {
          lbOpen = true;
          gsap.fromTo(lbImg,
            { scale: 0.82, opacity: 0, y: 20 },
            { scale: 1,    opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.6)' }
          );
          gsap.fromTo(lightbox,
            { backdropFilter: 'blur(0px)' },
            { backdropFilter: 'blur(8px)', duration: 0.4 }
          );
        } else if (!isActive && lbOpen) {
          lbOpen = false;
        }
      });
      moLb.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
    }
  })();

  // ─── SHOP ────────────────────────────────────────────────────
  (function initShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;

    // Anima prodotti al caricamento dinamico
    const mo = new MutationObserver(mutations => {
      const added = [];
      mutations.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && !n.classList.contains('skeleton')) added.push(n);
      }));
      if (!added.length) return;

      gsap.from(added, {
        opacity: 0,
        y:       30,
        scale:   0.94,
        duration: 0.55,
        stagger:  { amount: 0.4, from: 'start' },
        ease:    'power3.out',
        clearProps: 'transform,opacity',
      });
    });
    mo.observe(grid, { childList: true });

    // Filter buttons — highlight attivo
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => {
          gsap.to(b, {
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            borderColor: 'rgba(255,255,255,0.1)',
            duration: 0.2,
          });
        });
        gsap.to(this, {
          backgroundColor: 'rgba(62,207,142,0.1)',
          color: '#3ECF8E',
          borderColor: '#3ECF8E',
          duration: 0.25,
          ease: 'power2.out',
        });
      });

      // Hover bounce
      btn.addEventListener('mouseenter', function () {
        gsap.to(this, { y: -2, duration: 0.2, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(this, { y: 0,  duration: 0.25, ease: 'back.out(2)' });
      });
    });

    // Sezione trust (3 card sotto la griglia prodotti)
    ScrollTrigger.create({
      trigger: grid,
      start:   'bottom 80%',
      once:    true,
      onEnter: () => {
        gsap.from('[class*="grid-cols"][class*="gap"] > [class*="rounded"]', {
          opacity: 0,
          y:       24,
          duration: 0.5,
          stagger:  0.12,
          ease:    'power2.out',
        });
      },
    });
  })();

  // ─── SCROLL REVEAL GENERICO (sezioni con max-w) ───────────────
  document.querySelectorAll('section > div[class*="max-w"]').forEach(el => {
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    ScrollTrigger.create({
      trigger:  el,
      start:    'top 86%',
      once:     true,
      onEnter:  () => {
        if (el.classList.contains('animated')) return;
        el.classList.add('animated');
        gsap.from(el, { opacity: 0, y: 28, duration: 0.65, ease: 'power2.out' });
      },
    });
  });
}

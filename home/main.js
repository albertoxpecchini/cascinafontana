(() => {
  'use strict';

  // Burger menu
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Shop filter
  const chips = document.querySelectorAll('.chip');
  const products = document.querySelectorAll('.product');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      const cat = chip.dataset.cat;
      products.forEach(p => {
        p.classList.toggle('is-hidden', cat !== 'all' && p.dataset.cat !== cat);
      });
    });
  });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    '.section__header, .section__text, .cards > *, .chain__step, .sus-item, ' +
    '.gal-item, .timeline li, .cert, .product, .tm, .faq details, ' +
    '.downloads li, .sistema-visual, .img-wrap, .map, .newsletter-card, .form'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal-init'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('reveal-in'), i * 40);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
  }
})();

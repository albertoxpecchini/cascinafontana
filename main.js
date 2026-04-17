'use strict';

/* mobile menu */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* active menu + pager via IntersectionObserver */
const sections = document.querySelectorAll('.slide');
const menuLinks = menu ? menu.querySelectorAll('a') : [];
const pager = document.getElementById('pager');
const pagerLinks = pager ? pager.querySelectorAll('a') : [];

if ('IntersectionObserver' in window && sections.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      menuLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      pagerLinks.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id));
    });
  }, { threshold: 0.5 });
  sections.forEach(s => io.observe(s));
}

/* shop filter */
const chips = document.querySelectorAll('.chip');
const products = document.querySelectorAll('.product');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('is-on'));
  chip.classList.add('is-on');
  const cat = chip.dataset.cat;
  products.forEach(p => {
    const match = cat === 'all' || p.dataset.cat === cat;
    p.classList.toggle('is-hidden', !match);
  });
}));

/* contact form → web3forms */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Invio…';
    btn.disabled = true;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.success) {
        btn.textContent = 'Inviato ✓';
        form.reset();
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
      } else throw new Error(data.message || 'error');
    } catch (err) {
      console.error(err);
      btn.textContent = 'Errore — riprova';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    }
  });
}

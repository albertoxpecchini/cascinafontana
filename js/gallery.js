import { fetchGalleria } from '/js/supabase.js';

export function initCarousel(carouselId, trackId, prevBtnId, nextBtnId, dotsId, opts = {}) {
  const carousel = document.getElementById(carouselId);
  const track    = document.getElementById(trackId);
  const prevBtn  = document.getElementById(prevBtnId);
  const nextBtn  = document.getElementById(nextBtnId);
  const dotsEl   = document.getElementById(dotsId);

  if (!track) return;

  const interval        = opts.interval ?? 5000;
  const autoplay        = opts.autoplay !== false;
  const reducedMotion   = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let slides  = [];
  let dots    = [];
  let timer   = null;
  let isHover = false;
  let isFocus = false;

  if (carousel) {
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'carosello');
    carousel.setAttribute('tabindex', '0');
  }

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Vai alla slide ${i + 1}`);
      d.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      d.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsEl.appendChild(d);
      return d;
    });
  }

  function startTimer() {
    if (!autoplay || reducedMotion || slides.length < 2) return;
    if (isHover || isFocus) return;
    stopTimer();
    timer = setInterval(() => goTo(current + 1), interval);
  }
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function resetTimer() { stopTimer(); startTimer(); }

  // Pausa su hover / focus
  if (carousel) {
    carousel.addEventListener('mouseenter', () => { isHover = true;  stopTimer(); });
    carousel.addEventListener('mouseleave', () => { isHover = false; startTimer(); });
    carousel.addEventListener('focusin',    () => { isFocus = true;  stopTimer(); });
    carousel.addEventListener('focusout',   () => { isFocus = false; startTimer(); });
    // Pausa quando la tab è nascosta
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopTimer(); else startTimer();
    });
    // Tastiera
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); resetTimer(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); resetTimer(); }
    });
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Swipe touch
  let touchStartX = 0;
  let touchStartY = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Ignora se più verticale che orizzontale (scroll)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
      resetTimer();
    }
  });

  fetchGalleria().then(data => {
    if (!data.length) {
      track.innerHTML = `<div class="carousel-slide" style="background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;color:var(--color-placeholder);">Nessuna immagine</div>`;
    } else {
      track.innerHTML = data.map((img, i) =>
        `<img class="carousel-slide" src="${img.url}" alt="${img.caption ?? ''}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''}>`
      ).join('');
    }
    slides = Array.from(track.querySelectorAll('.carousel-slide'));
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'));
    buildDots();
    startTimer();
  }).catch(err => {
    console.error('[gallery]', err);
    track.innerHTML = `<div class="carousel-slide" style="background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;">Errore caricamento immagini</div>`;
  });

  return { goTo, next: () => goTo(current + 1), prev: () => goTo(current - 1), pause: stopTimer, play: startTimer };
}

export async function loadGalleryGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let data;
  try {
    data = await fetchGalleria();
  } catch (err) {
    console.error('[gallery]', err);
    container.innerHTML = `<div class="empty-state"><p>Errore nel caricamento della galleria.</p></div>`;
    return;
  }

  if (!data.length) {
    container.innerHTML = `<div class="empty-state"><p>Nessuna immagine disponibile.</p></div>`;
    return;
  }

  container.innerHTML = data.map((img, i) => `
    <div class="gallery-item" data-index="${i}">
      <img src="${img.url}" alt="${img.caption ?? ''}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''}>
      ${img.caption ? `<span class="gallery-item-caption">${img.caption}</span>` : ''}
    </div>
  `).join('');

  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox || !lbImg) return;

  function openLightbox(i) {
    lbImg.src = data[i].url;
    lbImg.alt = data[i].caption ?? '';
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  container.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

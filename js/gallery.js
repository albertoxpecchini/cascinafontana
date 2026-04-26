import { fetchGalleria } from '/js/supabase.js';

export function initCarousel(carouselId, trackId, prevBtnId, nextBtnId, dotsId) {
  const track   = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const dotsEl  = document.getElementById(dotsId);

  if (!track) return;

  let current = 0;
  let slides  = [];
  let dots    = [];

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
      return d;
    });
  }

  let timer = setInterval(() => goTo(current + 1), 4000);
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); resetTimer(); }
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
    buildDots();
  }).catch(err => {
    console.error('[gallery]', err);
    track.innerHTML = `<div class="carousel-slide" style="background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;">Errore caricamento immagini</div>`;
  });

  return { goTo };
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

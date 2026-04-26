import { fetchProdotti } from '/js/supabase.js';

function prodottoCard(p, index = 0) {
  const loading = index < 4 ? 'eager' : 'lazy';
  const priority = index === 0 ? ' fetchpriority="high"' : '';
  return `
    <div class="card">
      ${p.image_url
        ? `<img class="card-img" src="${p.image_url}" alt="${p.titolo}" loading="${loading}" decoding="async"${priority}>`
        : `<div class="card-img" style="background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;color:var(--color-placeholder);">📦</div>`
      }
      <h3>${p.titolo}</h3>
      ${p.categoria  ? `<span class="badge badge-gray">${p.categoria}</span>` : ''}
      ${p.descrizione ? `<p>${p.descrizione}</p>` : ''}
    </div>
  `;
}

export async function loadProdotti(containerId, { limit = null, featuredFirst = false } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const data = await fetchProdotti({ limit, featuredFirst });
    container.innerHTML = data.length
      ? data.map((item, index) => prodottoCard(item, index)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><p>Nessun prodotto disponibile.</p></div>`;
  } catch (err) {
    console.error('[prodotti]', err);
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>Errore nel caricamento.</p></div>`;
  }
}

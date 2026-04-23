import { supabase } from '/js/supabase.js';

function prodottoCard(p) {
  return `
    <div class="card">
      ${p.image_url
        ? `<img class="card-img" src="${p.image_url}" alt="${p.titolo}" loading="lazy">`
        : `<div class="card-img" style="background:var(--color-gray-100);display:flex;align-items:center;justify-content:center;color:var(--color-placeholder);">📦</div>`
      }
      <h3>${p.titolo}</h3>
      ${p.categoria ? `<span class="badge badge-gray">${p.categoria}</span>` : ''}
      ${p.descrizione ? `<p>${p.descrizione}</p>` : ''}
    </div>
  `;
}

export async function loadProdotti(containerId, { limit = null, featuredFirst = false } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let query = supabase
    .from('prodotti')
    .select('id,titolo,descrizione,categoria,image_url,in_evidenza');

  if (featuredFirst) query = query.order('in_evidenza', { ascending: false });
  query = query.order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);

  const { data } = await query;

  container.innerHTML = data?.length
    ? data.map(prodottoCard).join('')
    : `<div class="empty-state" style="grid-column:1/-1"><p>Nessun prodotto disponibile.</p></div>`;
}

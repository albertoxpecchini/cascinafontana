import { supabase } from '/js/supabase.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function newsItem(item) {
  return `
    <div class="news-item">
      <span class="news-item-date">${formatDate(item.created_at)}</span>
      <span class="news-item-title">${item.title ?? item.titolo ?? ''}</span>
      ${item.description ? `<span class="news-item-body">${item.description}</span>` : ''}
    </div>
  `;
}

export async function loadNovita(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let query = supabase
    .from('updates')
    .select('created_at,title,titolo,description')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;

  container.innerHTML = data?.length
    ? data.map(newsItem).join('')
    : `<div class="empty-state"><p>Nessun aggiornamento disponibile.</p></div>`;
}

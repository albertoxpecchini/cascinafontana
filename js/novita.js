import { fetchUpdates } from '/js/supabase.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function newsItem(item) {
  const title = item.title ?? item.titolo ?? '';
  return `
    <div class="news-item">
      <span class="news-item-date">${formatDate(item.created_at)}</span>
      <span class="news-item-title">${title}</span>
      ${item.description ? `<span class="news-item-body">${item.description}</span>` : ''}
    </div>
  `;
}

export async function loadNovita(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const data = await fetchUpdates({ limit });
    container.innerHTML = data.length
      ? data.map(newsItem).join('')
      : `<div class="empty-state"><p>Nessun aggiornamento disponibile.</p></div>`;
  } catch (err) {
    console.error('[novita]', err);
    container.innerHTML = `<div class="empty-state"><p>Errore nel caricamento degli aggiornamenti.</p></div>`;
  }
}

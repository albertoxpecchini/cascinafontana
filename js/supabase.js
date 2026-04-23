import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const url  = window.__ENV__?.SUPABASE_URL  ?? '';
const anon = window.__ENV__?.SUPABASE_ANON ?? '';

if (!url || !anon) {
  console.warn('[supabase] Env mancanti — imposta window.__ENV__ prima di questo modulo.');
}

export const supabase = createClient(url, anon, {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
  },
});

// Avvia il loop di refresh anche senza un listener attivo (pagine non-admin).
supabase.auth.startAutoRefresh();

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/** Reindirizza a `redirectTo` se non c'è una sessione valida. */
export async function requireAuth(redirectTo = '/main') {
  const session = await getSession();
  if (!session) window.location.replace(redirectTo);
  return session;
}

// ── DB helpers ───────────────────────────────────────────────────────────────

/**
 * Prodotti dello shop (tabella `listings`).
 * @param {{ availableOnly?: boolean }} opts
 */
export async function fetchListings({ availableOnly = true } = {}) {
  let q = supabase
    .from('listings')
    .select('id,title,price,description,category,image_url,status')
    .order('created_at', { ascending: false });

  if (availableOnly) q = q.eq('status', 'available');

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/**
 * Prodotti aziendali (tabella `prodotti`).
 * @param {{ limit?: number|null, featuredFirst?: boolean }} opts
 */
export async function fetchProdotti({ limit = null, featuredFirst = false } = {}) {
  let q = supabase
    .from('prodotti')
    .select('id,titolo,descrizione,categoria,image_url,in_evidenza');

  if (featuredFirst) q = q.order('in_evidenza', { ascending: false });
  q = q.order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/**
 * Aggiornamenti/novità (tabella `updates`).
 * @param {{ limit?: number|null }} opts
 */
export async function fetchUpdates({ limit = null } = {}) {
  let q = supabase
    .from('updates')
    .select('id,title,titolo,description,created_at')
    .order('created_at', { ascending: false });

  if (limit) q = q.limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/**
 * Immagini della galleria (tabella `galleria`).
 * @param {{ limit?: number|null }} opts
 */
export async function fetchGalleria({ limit = null } = {}) {
  let q = supabase
    .from('galleria')
    .select('id,url,caption,ordine')
    .order('ordine', { ascending: true });

  if (limit) q = q.limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const url  = window.__ENV__?.SUPABASE_URL  ?? '';
const anon = window.__ENV__?.SUPABASE_ANON ?? '';

if (!url || !anon) {
  console.warn('[supabase] Env mancanti — imposta window.__ENV__ prima di questo modulo.');
}

export const supabase = (url && anon)
  ? createClient(url, anon, {
      auth: {
        autoRefreshToken:   true,
        persistSession:     true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Avvia il loop di refresh anche senza un listener attivo (pagine non-admin).
if (supabase) supabase.auth.startAutoRefresh();

const DATA_CACHE_PREFIX = 'cascina:data:';
const DATA_CACHE_TTL = 2 * 60 * 1000;
const DATA_CACHE_STALE_TTL = 24 * 60 * 60 * 1000;
const dataMemory = new Map();

function readDataCache(key) {
  try {
    const raw = localStorage.getItem(DATA_CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDataCache(key, data) {
  const entry = { timestamp: Date.now(), data };
  dataMemory.set(key, entry);
  try {
    localStorage.setItem(DATA_CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    /* localStorage can be full or disabled; memory cache still works. */
  }
}

async function cachedPublicQuery(key, loader, { ttl = DATA_CACHE_TTL, staleTtl = DATA_CACHE_STALE_TTL } = {}) {
  const now = Date.now();
  const memory = dataMemory.get(key);
  if (memory && now - memory.timestamp < ttl) {
    return memory.data;
  }

  const stored = readDataCache(key);
  if (stored?.data && now - stored.timestamp < ttl) {
    dataMemory.set(key, stored);
    return stored.data;
  }

  if (stored?.data && now - stored.timestamp < staleTtl) {
    dataMemory.set(key, stored);
    loader().then(data => writeDataCache(key, data)).catch(() => {});
    return stored.data;
  }

  const data = await loader();
  writeDataCache(key, data);
  return data;
}

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function getSession() {
  if (!supabase) return null;
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
  return cachedPublicQuery(`listings:${availableOnly}`, async () => {
    let q = supabase
      .from('listings')
      .select('id,title,price,description,category,image_url,status')
      .order('created_at', { ascending: false });

    if (availableOnly) q = q.eq('status', 'available');

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  });
}

/**
 * Prodotti aziendali (tabella `prodotti`).
 * @param {{ limit?: number|null, featuredFirst?: boolean }} opts
 */
export async function fetchProdotti({ limit = null, featuredFirst = false } = {}) {
  return cachedPublicQuery(`prodotti:${limit ?? 'all'}:${featuredFirst}`, async () => {
    let q = supabase
      .from('prodotti')
      .select('id,titolo,descrizione,categoria,image_url,in_evidenza');

    if (featuredFirst) q = q.order('in_evidenza', { ascending: false });
    q = q.order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  });
}

/**
 * Aggiornamenti/novità (tabella `updates`).
 * @param {{ limit?: number|null }} opts
 */
export async function fetchUpdates({ limit = null } = {}) {
  return cachedPublicQuery(`updates:${limit ?? 'all'}`, async () => {
    let q = supabase
      .from('updates')
      .select('id,title,description,created_at')
      .order('created_at', { ascending: false });

    if (limit) q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  });
}

/**
 * Immagini della galleria (tabella `galleria`).
 * @param {{ limit?: number|null }} opts
 */
export async function fetchGalleria({ limit = null } = {}) {
  return cachedPublicQuery(`galleria:${limit ?? 'all'}`, async () => {
    let q = supabase
      .from('galleria')
      .select('id,url,caption,ordine')
      .order('ordine', { ascending: true });

    if (limit) q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  });
}

export function warmPublicDataCache() {
  if (!supabase) return Promise.resolve([]);

  return Promise.allSettled([
    fetchGalleria(),
    fetchProdotti({ featuredFirst: true }),
    fetchUpdates({ limit: 6 }),
    fetchListings({ availableOnly: true }),
  ]);
}

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const url  = window.__ENV__?.SUPABASE_URL  ?? '';
const anon = window.__ENV__?.SUPABASE_ANON ?? '';

if (!url || !anon) {
  console.warn('[supabase] Missing env vars — set window.__ENV__ before importing this module.');
}

export const supabase = createClient(url, anon);

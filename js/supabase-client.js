// Cascina Fontana — Supabase client
// SETUP:
//   1. Create project at https://supabase.com
//   2. Paste project URL + anon key below
//   3. Run supabase/schema.sql in SQL editor
//   4. Create admin user: Authentication > Users > Add user
//
// Prerequisite: include <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// BEFORE this file.

const SUPABASE_URL = 'https://fjdfxynwshejyjvxhqry.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZMazYnk5gt3LtkjZjbVVqA_pBnV1DL0';

if (!window.supabase || typeof window.supabase.createClient !== 'function') {
  console.error('[Cascina Fontana] Supabase SDK not loaded.');
} else if (SUPABASE_URL.includes('YOUR_PROJECT')) {
  console.warn('[Cascina Fontana] Supabase not configured — edit js/supabase-client.js');
  window.sb = null;
} else {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'cf-auth' }
  });
}

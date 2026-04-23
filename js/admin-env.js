/**
 * Admin Environment Setup
 * Inietta automaticamente le credenziali Supabase prima di caricare i moduli
 */

(function() {
  // Credenziali Supabase
  window.__ENV__ = {
    SUPABASE_URL: 'https://fjdfxynwshejyjvxhqry.supabase.co',
    SUPABASE_ANON_KEY: 'sbp_16c85a2d94ab24db666f6858bd0495d336aac935',
  };

  // Verifica che le credenziali siano presenti
  if (!window.__ENV__.SUPABASE_URL || !window.__ENV__.SUPABASE_ANON_KEY) {
    console.error('[admin] Credenziali Supabase mancanti!');
  } else {
    console.log('[admin] Ambiente Supabase configurato correttamente');
  }
})();

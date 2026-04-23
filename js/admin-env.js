/**
 * Admin Environment Setup
 * Inietta automaticamente le credenziali Supabase prima di caricare i moduli
 */

(function() {
  // Credenziali Supabase
  window.__ENV__ = {
    SUPABASE_URL: 'https://fjdfxynwshejyjvxhqry.supabase.co',
    SUPABASE_ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGZ4eW53c2hlanlqdnhocXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODUxMzMsImV4cCI6MjA5MjE2MTEzM30.T1-vWQbfHNjKEBN1jIpJ9gsj2xcOCdFGaRMZIJXkv80',
  };

  // Verifica che le credenziali siano presenti
  if (!window.__ENV__.SUPABASE_URL || !window.__ENV__.SUPABASE_ANON) {
    console.error('[admin] Credenziali Supabase mancanti!');
  } else {
    console.log('[admin] Ambiente Supabase configurato correttamente');
  }
})();

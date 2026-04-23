/**
 * Admin Authentication Helper
 * Protegge i pannelli admin richiedendo un PIN/password
 */

window.__ADMIN_AUTH__ = {
  // Cambia questo PIN prima di andare in produzione!
  PIN: '1234',
  STORAGE_KEY: 'admin_session_token',
  SESSION_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 ore

  /**
   * Verifica se l'utente è autenticato
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.STORAGE_KEY);
    if (!token) return false;

    const [timestamp, pin] = token.split(':');
    const now = Date.now();
    const age = now - parseInt(timestamp);

    if (age > this.SESSION_EXPIRY_MS) {
      localStorage.removeItem(this.STORAGE_KEY);
      return false;
    }

    return pin === this.PIN;
  },

  /**
   * Autentica l'utente (salva token)
   */
  authenticate(pin) {
    if (pin === this.PIN) {
      const token = Date.now() + ':' + pin;
      localStorage.setItem(this.STORAGE_KEY, token);
      return true;
    }
    return false;
  },

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  /**
   * Protegge una pagina admin
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.replace('/admin/login.html');
    }
  }
};

// Auto-check se siamo in una pagina admin
if (window.location.pathname.includes('/admin/') && 
    !window.location.pathname.endsWith('login.html') &&
    !window.location.pathname.endsWith('index.html')) {
  window.__ADMIN_AUTH__.requireAuth();
}

// Cascina Fontana — Campino's Member helper
// Queries public.campinos_members via RLS (user_id = auth.uid()).
// Requires: supabase-client.js loaded first (window.sb).

/**
 * Fetch membership status for the current logged-in user.
 * Returns { isMember, isActive, membership, error }.
 *   - isMember:   true if a row exists in campinos_members
 *   - isActive:   true if row exists AND is_active = true
 *   - membership: the raw row (or null)
 *   - error:      Supabase error object (or null)
 */
async function getIsCampinosMember() {
  if (!window.sb) {
    return { isMember: false, isActive: false, membership: null, error: { message: 'Supabase non configurato.' } };
  }

  // Ensure there is an active session
  const { data: sessionData, error: sessionErr } = await window.sb.auth.getSession();
  if (sessionErr || !sessionData.session) {
    return { isMember: false, isActive: false, membership: null, error: sessionErr || { message: 'Nessuna sessione attiva.' } };
  }

  // RLS filters by user_id = auth.uid() — we just select our own row
  const { data, error } = await window.sb
    .from('campinos_members')
    .select('id, user_id, is_active, created_at')
    .maybeSingle();

  if (error) {
    return { isMember: false, isActive: false, membership: null, error };
  }

  return {
    isMember:   !!data,
    isActive:   !!(data && data.is_active),
    membership: data,
    error:      null
  };
}

/**
 * Route-guard / UI-gate for Campino's Member sections.
 *
 * Shows loading → checks session + membership → renders content or error.
 *
 * @param {HTMLElement} containerEl  — element where loading/error/blocked UI is injected
 * @param {Object}      opts
 * @param {Function}    opts.onAuthorized(membership)  — called when user is an active member
 * @param {string}      [opts.loginUrl='/admin/login.html'] — redirect target when not logged in
 * @param {boolean}     [opts.redirectOnNoSession=true]     — auto-redirect vs. show message
 * @param {string}      [opts.blockedTitle="Accesso riservato"]
 * @param {string}      [opts.blockedMsg="Questa sezione è riservata ai membri Campino's attivi."]
 */
async function guardCampinosMember(containerEl, opts) {
  const o = Object.assign({
    onAuthorized:       null,
    loginUrl:           '/admin/login.html',
    redirectOnNoSession: true,
    blockedTitle:       'Accesso riservato',
    blockedMsg:         "Questa sezione è riservata ai membri Campino's attivi."
  }, opts);

  // --- Loading state ---
  containerEl.innerHTML =
    '<div style="text-align:center;padding:2rem;color:#5b616e;font-size:14px;">' +
      '<div style="margin-bottom:8px;">⏳</div>Verifica membership…' +
    '</div>';

  // 1) Session check
  if (!window.sb) {
    containerEl.innerHTML = _guardBox('Errore', 'Supabase non configurato (js/supabase-client.js).', 'error');
    return null;
  }

  const { data: sessionData, error: sessionErr } = await window.sb.auth.getSession();
  if (sessionErr || !sessionData.session) {
    if (o.redirectOnNoSession) {
      window.location.href = o.loginUrl;
      return null;
    }
    containerEl.innerHTML = _guardBox('Non autenticato', 'Effettua il login per continuare.', 'warn', o.loginUrl);
    return null;
  }

  // 2) Membership check
  const result = await getIsCampinosMember();

  if (result.error) {
    containerEl.innerHTML = _guardBox('Errore', 'Impossibile verificare la membership: ' + _esc(result.error.message), 'error');
    return null;
  }

  if (!result.isActive) {
    containerEl.innerHTML = _guardBox(o.blockedTitle, o.blockedMsg, 'blocked');
    return null;
  }

  // 3) Authorized — clear container, invoke callback
  containerEl.innerHTML = '';
  if (typeof o.onAuthorized === 'function') {
    o.onAuthorized(result.membership);
  }
  return result.membership;
}

/* ---------- internal helpers ---------- */

function _esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}

function _guardBox(title, msg, type, loginUrl) {
  var colors = { error: '#0a0b0d', warn: '#0a0b0d', blocked: '#5b616e' };
  var icons  = { error: '⚠️', warn: '🔒', blocked: '🚫' };
  var c = colors[type] || '#0a0b0d';
  var html =
    '<div style="max-width:420px;margin:3rem auto;text-align:center;padding:2rem;' +
      'border:1px solid ' + c + '33;border-radius:12px;background:#ffffff;">' +
      '<div style="font-size:2rem;margin-bottom:8px;">' + (icons[type] || '') + '</div>' +
      '<h3 style="margin:0 0 8px;font-size:18px;color:' + c + ';">' + _esc(title) + '</h3>' +
      '<p style="margin:0;font-size:14px;color:#5b616e;">' + _esc(msg) + '</p>';
  if (loginUrl) {
    html += '<p style="margin-top:16px;"><a href="' + _esc(loginUrl) +
            '" style="color:#0667d0;font-size:13px;">Vai al login →</a></p>';
  }
  html += '</div>';
  return html;
}

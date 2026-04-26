/**
 * Cascina Fontana — UI utilities
 * Toast (stack, top-right) e Snackbar (singleton, bottom-center).
 * Iniettano stili una volta sola, niente dipendenze.
 */

const STYLE_ID = 'cf-ui-styles';
const TOAST_HOST_ID = 'cf-toast-host';
const SNACKBAR_ID = 'cf-snackbar';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const css = `
    #${TOAST_HOST_ID}{position:fixed;top:84px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 32px);width:360px}
    .cf-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(20,20,20,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;font:500 13px/1.4 Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45);transform:translateX(120%);opacity:0;transition:transform .35s cubic-bezier(.2,.9,.3,1.1),opacity .25s ease}
    .cf-toast.show{transform:translateX(0);opacity:1}
    .cf-toast .cf-toast-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;background:#3ECF8E}
    .cf-toast.error  .cf-toast-dot{background:#ef4444}
    .cf-toast.info   .cf-toast-dot{background:#60a5fa}
    .cf-toast .cf-toast-body{flex:1;min-width:0}
    .cf-toast .cf-toast-title{font-weight:600;color:#fff;margin-bottom:2px}
    .cf-toast .cf-toast-msg{color:rgba(255,255,255,.6);font-weight:400;font-size:12.5px}
    .cf-toast .cf-toast-close{background:none;border:0;color:rgba(255,255,255,.4);font-size:16px;line-height:1;cursor:pointer;padding:2px 4px;border-radius:4px;transition:color .15s,background .15s}
    .cf-toast .cf-toast-close:hover{color:#fff;background:rgba(255,255,255,.06)}

    #${SNACKBAR_ID}{position:fixed;left:50%;bottom:20px;transform:translate(-50%,140%);z-index:9998;display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(15,15,15,.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;font:500 13px/1.4 Inter,system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.5);max-width:calc(100vw - 32px);opacity:0;transition:transform .4s cubic-bezier(.2,.9,.3,1.1),opacity .25s ease;pointer-events:none}
    #${SNACKBAR_ID}.show{transform:translate(-50%,0);opacity:1;pointer-events:auto}
    #${SNACKBAR_ID} .cf-snackbar-msg{flex:1;color:rgba(255,255,255,.85)}
    #${SNACKBAR_ID} .cf-snackbar-action{background:none;border:0;color:#3ECF8E;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;padding:4px 8px;border-radius:6px;transition:background .15s}
    #${SNACKBAR_ID} .cf-snackbar-action:hover{background:rgba(62,207,142,.12)}
    #${SNACKBAR_ID}.error{border-color:rgba(239,68,68,.35)}
    #${SNACKBAR_ID}.error .cf-snackbar-action{color:#fca5a5}

    @media (prefers-reduced-motion:reduce){
      .cf-toast,#${SNACKBAR_ID}{transition:opacity .2s ease!important;transform:none!important}
      .cf-toast.show,#${SNACKBAR_ID}.show{transform:translate(-50%,0)!important}
      .cf-toast.show{transform:none!important}
    }
  `;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

function ensureToastHost() {
  let host = document.getElementById(TOAST_HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = TOAST_HOST_ID;
    host.setAttribute('role', 'region');
    host.setAttribute('aria-label', 'Notifiche');
    document.body.appendChild(host);
  }
  return host;
}

/**
 * Mostra una toast (stack in alto a destra).
 * @param {string|{title?:string,message?:string,variant?:'success'|'error'|'info',duration?:number}} input
 */
export function toast(input) {
  injectStyles();
  const opts = typeof input === 'string' ? { message: input } : (input || {});
  const variant = opts.variant || 'success';
  const duration = opts.duration ?? 4000;
  const host = ensureToastHost();

  const el = document.createElement('div');
  el.className = `cf-toast ${variant}`;
  el.setAttribute('role', variant === 'error' ? 'alert' : 'status');
  el.innerHTML = `
    <span class="cf-toast-dot" aria-hidden="true"></span>
    <div class="cf-toast-body">
      ${opts.title ? `<div class="cf-toast-title">${escapeHtml(opts.title)}</div>` : ''}
      ${opts.message ? `<div class="cf-toast-msg">${escapeHtml(opts.message)}</div>` : ''}
    </div>
    <button class="cf-toast-close" aria-label="Chiudi">&times;</button>
  `;

  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));

  const remove = () => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  };
  el.querySelector('.cf-toast-close').addEventListener('click', remove);
  if (duration > 0) setTimeout(remove, duration);

  return { close: remove };
}

/**
 * Mostra una snackbar (singleton in basso, opzionale azione).
 * @param {string|{message:string,action?:string,onAction?:()=>void,variant?:'success'|'error',duration?:number}} input
 */
export function snackbar(input) {
  injectStyles();
  const opts = typeof input === 'string' ? { message: input } : (input || {});
  const variant = opts.variant || 'success';
  const duration = opts.duration ?? 4000;

  let el = document.getElementById(SNACKBAR_ID);
  if (el) el.remove();

  el = document.createElement('div');
  el.id = SNACKBAR_ID;
  el.className = variant;
  el.setAttribute('role', variant === 'error' ? 'alert' : 'status');
  el.innerHTML = `
    <span class="cf-snackbar-msg">${escapeHtml(opts.message || '')}</span>
    ${opts.action ? `<button class="cf-snackbar-action" type="button">${escapeHtml(opts.action)}</button>` : ''}
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));

  const close = () => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  };

  if (opts.action && opts.onAction) {
    el.querySelector('.cf-snackbar-action').addEventListener('click', () => {
      try { opts.onAction(); } finally { close(); }
    });
  }
  if (duration > 0) setTimeout(close, duration);

  return { close };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

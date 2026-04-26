import { snackbar } from '/js/ui.js';

export function initContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const original  = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso…';

    const body = {
      nome:      form.elements['nome']?.value?.trim(),
      email:     form.elements['email']?.value?.trim(),
      telefono:  form.elements['telefono']?.value?.trim() || null,
      tipo:      form.elements['tipo']?.value || 'generale',
      messaggio: form.elements['messaggio']?.value?.trim(),
    };

    try {
      const res = await fetch('/api/contatti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      snackbar({ message: 'Messaggio inviato — ti risponderemo presto.' });
      form.reset();
    } catch {
      snackbar({
        message: 'Errore nell\'invio. Riprova o scrivici via email.',
        variant: 'error',
        action: 'Email',
        onAction: () => { window.location.href = 'mailto:pzkko@yahoo.com'; },
        duration: 7000,
      });
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = original;
    }
  });
}

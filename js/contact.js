export function initContactForm(formId, feedbackId) {
  const form     = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);
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
      messaggio: form.elements['messaggio']?.value?.trim(),
    };

    try {
      const res = await fetch('/api/contatti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (feedback) {
        feedback.textContent = 'Messaggio inviato! Ti risponderemo presto.';
        feedback.className   = 'form-feedback success';
      }
      form.reset();
    } catch {
      if (feedback) {
        feedback.textContent = 'Errore nell\'invio. Riprova o contattaci via email.';
        feedback.className   = 'form-feedback error';
      }
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = original;
    }
  });
}

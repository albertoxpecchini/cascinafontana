import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, messaggio, telefono } = req.body ?? {};

  if (!nome?.trim() || !email?.trim() || !messaggio?.trim()) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }

  // Sanitizzazione di base
  const safeName    = nome.slice(0, 100);
  const safeEmail   = email.slice(0, 200);
  const safeMsg     = messaggio.slice(0, 4000);
  const safeTel     = telefono?.slice(0, 30) ?? '';

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? 'noreply@cascinafontana.xyz',
    to:   process.env.CONTACT_TO   ?? 'info@cascinafontana.xyz',
    subject: `Contatto da ${safeName} — Cascina Fontana`,
    html: `
      <p><strong>Nome:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      ${safeTel ? `<p><strong>Telefono:</strong> ${safeTel}</p>` : ''}
      <hr>
      <p style="white-space:pre-wrap;">${safeMsg}</p>
    `,
    reply_to: safeEmail,
  });

  if (error) {
    console.error('[contatti] Resend error:', error);
    return res.status(500).json({ error: 'Errore invio email' });
  }

  return res.status(200).json({ ok: true });
}

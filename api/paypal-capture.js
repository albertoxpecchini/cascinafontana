import { PAYPAL_BASE, getAccessToken } from './paypal-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderID } = req.body ?? {};
  if (!orderID) {
    return res.status(400).json({ error: 'orderID obbligatorio' });
  }

  try {
    const accessToken = await getAccessToken();

    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const capture = await captureRes.json();
    if (!captureRes.ok) {
      console.error('[paypal-capture] error:', capture);
      return res.status(500).json({ error: capture.message ?? 'Errore cattura pagamento' });
    }

    if (capture.status !== 'COMPLETED') {
      return res.status(402).json({ error: `Pagamento non completato: ${capture.status}` });
    }

    return res.status(200).json({ ok: true, orderID, status: capture.status });
  } catch (err) {
    console.error('[paypal-capture]', err);
    return res.status(500).json({ error: 'Errore interno' });
  }
}

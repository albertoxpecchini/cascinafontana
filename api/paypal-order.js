import { PAYPAL_BASE, getAccessToken } from './paypal-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { itemId, qty = 1, price, title } = req.body ?? {};

  if (!itemId || !price) {
    return res.status(400).json({ error: 'itemId e price obbligatori' });
  }

  const amount = (parseFloat(price) * parseInt(qty, 10)).toFixed(2);
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Importo non valido' });
  }

  try {
    const accessToken = await getAccessToken();

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: itemId,
          description:  title ?? 'Prodotto Cascina Fontana',
          amount: { currency_code: 'EUR', value: amount },
        }],
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) {
      console.error('[paypal-order] error:', order);
      return res.status(500).json({ error: order.message ?? 'Errore PayPal' });
    }

    return res.status(201).json({ id: order.id });
  } catch (err) {
    console.error('[paypal-order]', err);
    return res.status(500).json({ error: 'Errore interno' });
  }
}

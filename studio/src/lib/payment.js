// Payment module. PLACEHOLDER: no money is taken yet.
//
// Flow on /osszegzes:  buildOrder() -> startPayment(order) -> (provider) -> submitOrder(order) -> /koszonjuk
//
// Never trust a price sent by the browser: the server that creates the payment must look the
// price up itself (src/config/business.ts -> pricing) by order.product.sku.

/**
 * Starts the payment for a prepared order.
 * @returns {Promise<{ status: 'redirect', url: string } | { status: 'placeholder' }>}
 */
export async function startPayment(order) {
  // ╔═════════════════════════════════════════════════════════════════════════╗
  // ║  PAYMENT PROVIDER INTEGRATION POINT                                     ║
  // ║                                                                         ║
  // ║  Stripe Checkout:                                                       ║
  // ║    const res = await fetch(`${BASE}api/fizetes/stripe`, {               ║
  // ║      method: 'POST', headers: { 'Content-Type': 'application/json' },   ║
  // ║      body: JSON.stringify(order) });                                    ║
  // ║    // server: stripe.checkout.sessions.create({ mode: 'payment',        ║
  // ║    //   line_items, customer_email, metadata: { orderId },              ║
  // ║    //   success_url: '.../koszonjuk?rendeles={orderId}', cancel_url })  ║
  // ║    return { status: 'redirect', url: (await res.json()).url };          ║
  // ║                                                                         ║
  // ║  Barion:                                                                ║
  // ║    server calls POST https://api.barion.com/v2/Payment/Start with       ║
  // ║    POSKey, PaymentRequestId = order.orderId, Transactions[].Total,      ║
  // ║    RedirectUrl (/koszonjuk), CallbackUrl -> redirect to GatewayUrl.     ║
  // ║                                                                         ║
  // ║  After a confirmed payment (webhook / callback) the SERVER should call  ║
  // ║  the order hand-off (see submitOrder in order.js).                      ║
  // ╚═════════════════════════════════════════════════════════════════════════╝
  void order;
  return { status: 'placeholder' };
}

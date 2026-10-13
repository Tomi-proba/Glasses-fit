// Payment module – currently a placeholder (no real payment is taken).
//
// Everything that a real provider (Stripe, Barion, …) needs is prepared here:
//   1. loadCheckoutConfig()  – price / currency / provider come from public/checkout.config.json
//   2. buildOrderPayload()   – collects site config + customer + billing data into one JSON object
//   3. startPayment()        – THE place to integrate the provider (see the marked block below)
//
// Never trust the price sent by the browser: the server that creates the payment must
// look the price up itself (e.g. from the same checkout.config.json) by `product.sku`.

export const ORDER_SCHEMA_VERSION = 1;

const FALLBACK = { productName: 'Weboldal csomag', price: 0, currency: 'HUF', locale: 'hu-HU', provider: 'placeholder', allowZipExport: false };

export async function loadCheckoutConfig(url = 'checkout.config.json') {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(String(res.status));
    return { ...FALLBACK, ...(await res.json()) };
  } catch {
    return FALLBACK;
  }
}

export function formatPrice(checkout) {
  return new Intl.NumberFormat(checkout.locale || 'hu-HU', {
    style: 'currency',
    currency: checkout.currency || 'HUF',
    maximumFractionDigits: 0,
  }).format(checkout.price || 0);
}

function orderId() {
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
  return `WEB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${rnd}`;
}

/**
 * Builds the JSON that is sent at purchase time.
 * @param {object} p
 * @param {object} p.siteConfig  – the full site.config.json produced by the configurator
 * @param {object} p.customer    – { name, email, phone }
 * @param {object} p.billing     – { type: 'person'|'company', name, companyName, taxNumber, country, zip, city, address }
 * @param {object} p.consents    – { terms: boolean, privacy: boolean, marketing: boolean }
 * @param {object} p.checkout    – the loaded checkout config
 */
export function buildOrderPayload({ siteConfig, customer, billing, consents, checkout, note = '' }) {
  return {
    schemaVersion: ORDER_SCHEMA_VERSION,
    orderId: orderId(),
    createdAt: new Date().toISOString(),
    product: {
      sku: 'premium-website',
      name: checkout.productName,
      price: checkout.price,
      currency: checkout.currency,
    },
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: (customer.phone || '').trim(),
    },
    billing: {
      type: billing.type === 'company' ? 'company' : 'person',
      name: (billing.type === 'company' ? billing.companyName : billing.name || customer.name).trim(),
      taxNumber: billing.type === 'company' ? (billing.taxNumber || '').trim() : '',
      country: (billing.country || 'HU').trim(),
      zip: (billing.zip || '').trim(),
      city: (billing.city || '').trim(),
      address: (billing.address || '').trim(),
    },
    consents: { terms: !!consents.terms, privacy: !!consents.privacy, marketing: !!consents.marketing, acceptedAt: new Date().toISOString() },
    note: note.trim(),
    siteConfig,
    client: { userAgent: navigator.userAgent, language: navigator.language },
  };
}

/** Field-level validation; returns { field: message } for invalid fields. */
export function validateOrder({ customer, billing, consents }) {
  const errors = {};
  const req = (v) => String(v || '').trim() !== '';
  if (!req(customer.name)) errors.name = 'Add meg a neved.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email || '')) errors.email = 'Érvényes e-mail címet adj meg.';
  if (billing.type === 'company') {
    if (!req(billing.companyName)) errors.companyName = 'Add meg a cégnevet.';
    if (!/^\d{8}-?\d-?\d{2}$/.test((billing.taxNumber || '').trim())) errors.taxNumber = 'Adószám formátuma: 12345678-1-23';
  }
  if (!/^\d{4}$/.test((billing.zip || '').trim()) && (billing.country || 'HU') === 'HU') errors.zip = '4 jegyű irányítószám.';
  if (!req(billing.city)) errors.city = 'Add meg a települést.';
  if (!req(billing.address)) errors.address = 'Add meg a címet.';
  if (!consents.terms) errors.terms = 'Az ÁSZF elfogadása kötelező.';
  if (!consents.privacy) errors.privacy = 'Az adatkezelési tájékoztató elfogadása kötelező.';
  return errors;
}

/**
 * Starts the payment for a prepared order.
 * Returns { status: 'redirect', url } | { status: 'placeholder', order } | throws on error.
 */
export async function startPayment(order, checkout) {
  // ╔══════════════════════════════════════════════════════════════════════╗
  // ║  PAYMENT PROVIDER INTEGRATION POINT                                  ║
  // ║                                                                      ║
  // ║  Replace this block with the real integration. Typical flow:         ║
  // ║                                                                      ║
  // ║  Stripe:                                                             ║
  // ║    const res = await fetch('/api/checkout/stripe', {                 ║
  // ║      method: 'POST', headers: { 'Content-Type': 'application/json' },║
  // ║      body: JSON.stringify(order) });                                 ║
  // ║    // server: stripe.checkout.sessions.create({ line_items, mode:    ║
  // ║    //   'payment', customer_email, success_url, cancel_url,          ║
  // ║    //   metadata: { orderId } }) and store `order` in a database     ║
  // ║    const { url } = await res.json();                                 ║
  // ║    return { status: 'redirect', url };                               ║
  // ║                                                                      ║
  // ║  Barion:                                                             ║
  // ║    server calls POST https://api.barion.com/v2/Payment/Start with    ║
  // ║    POSKey, PaymentRequestId = order.orderId, Transactions[].Total,   ║
  // ║    RedirectUrl, CallbackUrl → returns GatewayUrl to redirect to.     ║
  // ║                                                                      ║
  // ║  Select the provider with checkout.config.json → "provider".         ║
  // ╚══════════════════════════════════════════════════════════════════════╝
  switch (checkout.provider) {
    case 'placeholder':
    default:
      await new Promise((r) => setTimeout(r, 600)); // simulate the round trip
      return { status: 'placeholder', order };
  }
}

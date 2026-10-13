// Order data: everything we need to build and deliver the customer's website.
import { pricing } from '../config/business';
import { saveLastOrder } from './store.js';

export const ORDER_SCHEMA_VERSION = 1;

function orderId() {
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0');
  return `VS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${rnd}`;
}

/**
 * Collects the site config and the customer's details into one JSON object.
 * @param {{ siteConfig: object, customer: { name: string, email: string, phone?: string },
 *   billing: { type: 'person'|'company', name?: string, companyName?: string, taxNumber?: string, country?: string, zip: string, city: string, address: string },
 *   consents: { terms: boolean, privacy: boolean }, note?: string }} input
 */
export function buildOrder({ siteConfig, customer, billing, consents, note = '' }) {
  const company = billing.type === 'company';
  return {
    schemaVersion: ORDER_SCHEMA_VERSION,
    orderId: orderId(),
    createdAt: new Date().toISOString(),
    product: {
      sku: pricing.sku,
      name: pricing.productName,
      amount: pricing.amount,
      currency: pricing.currency,
      vat: pricing.vatExempt ? { rate: 0, note: 'Alanyi adómentes (AAM)' } : null,
    },
    customer: { name: customer.name.trim(), email: customer.email.trim(), phone: (customer.phone || '').trim() },
    billing: {
      type: company ? 'company' : 'person',
      name: (company ? billing.companyName : billing.name || customer.name).trim(),
      taxNumber: company ? (billing.taxNumber || '').trim() : '',
      country: billing.country || 'HU',
      zip: billing.zip.trim(),
      city: billing.city.trim(),
      address: billing.address.trim(),
    },
    consents: { terms: !!consents.terms, privacy: !!consents.privacy, acceptedAt: new Date().toISOString() },
    note: note.trim(),
    payment: { provider: 'placeholder', status: 'pending' },
    siteConfig,
  };
}

/** Field-level validation; returns { field: message } for invalid fields. */
export function validateOrder({ customer, billing, consents }) {
  const errors = {};
  const filled = (v) => String(v || '').trim() !== '';
  if (!filled(customer.name)) errors.name = 'Add meg a neved.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email || '')) errors.email = 'Érvényes e-mail címet adj meg, ide küldjük a visszaigazolást.';
  if (filled(customer.phone) && !/^[+\d][\d\s/()-]{6,}$/.test(customer.phone.trim())) errors.phone = 'Ellenőrizd a telefonszámot.';
  if (billing.type === 'company') {
    if (!filled(billing.companyName)) errors.companyName = 'Add meg a cég nevét.';
    if (!/^\d{8}-?\d-?\d{2}$/.test((billing.taxNumber || '').trim())) errors.taxNumber = 'Az adószám formátuma: 12345678-1-23.';
  }
  if (!/^\d{4}$/.test((billing.zip || '').trim())) errors.zip = 'Négyjegyű irányítószámot adj meg.';
  if (!filled(billing.city)) errors.city = 'Add meg a települést.';
  if (!filled(billing.address)) errors.address = 'Add meg az utcát és a házszámot.';
  if (!consents.terms) errors.terms = 'A megrendeléshez el kell fogadnod az ÁSZF-et.';
  if (!consents.privacy) errors.privacy = 'A megrendeléshez el kell fogadnod az adatkezelési tájékoztatót.';
  return errors;
}

/**
 * Hands the order over for processing.
 *
 * PLACEHOLDER: stores it in this browser only, so /koszonjuk can show it.
 * LATER: POST it to a server endpoint that e-mails it (e.g. Resend, Postmark, SMTP) and/or
 * saves it to a database, ideally from the payment provider's webhook after a confirmed payment:
 *
 *   await fetch(`${BASE}api/rendeles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
 */
export async function submitOrder(order) {
  // Only a light summary is kept locally; uploaded images can exceed the browser's storage quota.
  saveLastOrder({ orderId: order.orderId, createdAt: order.createdAt, product: order.product, customer: order.customer, siteName: order.siteConfig?.brand?.name || '' });
  return { ok: true, orderId: order.orderId };
}

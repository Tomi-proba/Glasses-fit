// Everything about the studio itself lives here: change the name, contact details and price in one place.
export const business = {
  name: 'Vonal Stúdió', // working name, replace with the final business name
  legalName: 'Vonal Stúdió (egyéni vállalkozó)',
  tagline: 'Prémium weboldal napok alatt.',
  description:
    'Tervezd meg a weboldalad élő előnézettel, rendeld meg online, mi pedig napokon belül élesítjük. Egyszeri 250 000 Ft, alanyi adómentesen.',
  email: 'hello@example.com',
  phone: '+36 30 123 4567',
  address: 'Budapest',
  taxNote: 'Alanyi adómentes (AAM), az ár nem tartalmaz ÁFA-t.',
  social: [
    { type: 'instagram', url: 'https://instagram.com/' },
    { type: 'linkedin', url: 'https://linkedin.com/' },
  ],
};

// The price is configuration, not code: checkout, buttons and copy all read it from here.
export const pricing = {
  sku: 'premium-website',
  productName: 'Prémium weboldal',
  amount: 250000,
  currency: 'HUF',
  locale: 'hu-HU',
  vatExempt: true,
};

export function formatPrice(p = pricing) {
  return new Intl.NumberFormat(p.locale, { style: 'currency', currency: p.currency, maximumFractionDigits: 0 }).format(p.amount);
}

// Packages and prices come from pricing.json, so they can be changed without touching code.
import data from './pricing.json';

export type PackageId = 'alap' | 'premium';
export interface Package {
  id: PackageId;
  name: string;
  priceFrom: number;
  summary: string;
  featuresTitle: string;
  features: string[];
  highlight?: boolean;
}

export const PACKAGES = data.packages as Package[];
export const VAT_NOTE = data.vatNote;
export const MONTHLY_NOTE = data.monthlyNote;
export const packageById = (id: string) => PACKAGES.find((p) => p.id === id);

/** "200 000 Ft-tól" */
export function priceFrom(amount: number) {
  const money = new Intl.NumberFormat(data.locale, { style: 'currency', currency: data.currency, maximumFractionDigits: 0 }).format(amount);
  return `${money}\u2011tól`; // non-breaking hyphen: "Ft-tól" never wraps
}

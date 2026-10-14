// Structured data (schema.org JSON-LD) and the indexing switch for the example sites.

/**
 * The example sites describe made-up businesses (fake address and phone). Letting them into Google or AI
 * answers would send real people to an arcade that does not exist, so by default they are noindex and
 * left out of the sitemap. A real client's site is built with INDEX_EXAMPLES=1 (or simply without this
 * switch), and then everything below is indexed as is.
 */
export const INDEX_EXAMPLES = process.env.INDEX_EXAMPLES === '1';

export const EXAMPLE_SLUGS = ['ingatlan-premium', 'ingatlan-alap', 'jatekterem-premium', 'jatekterem-alap', 'medence-premium'];

const DAYS: Record<string, string> = {
  hétfő: 'Monday', kedd: 'Tuesday', szerda: 'Wednesday', csütörtök: 'Thursday', péntek: 'Friday', szombat: 'Saturday', vasárnap: 'Sunday',
};

/** [['Hétfő', '14:00-22:00'], …] → OpeningHoursSpecification, days with the same hours grouped. */
export function openingHours(rows: [string, string][]) {
  const groups = new Map<string, string[]>();
  for (const [day, range] of rows) {
    const d = DAYS[day.toLowerCase()];
    if (!d || !/\d/.test(range)) continue;
    groups.set(range, [...(groups.get(range) ?? []), d]);
  }
  return [...groups].map(([range, days]) => {
    const [opens, closes] = range.split(/[-–]/).map((t) => t.trim());
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes: closes === '24:00' ? '23:59' : closes };
  });
}

export function faqPage(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

/** "1072 Budapest, Nagy Diófa utca 9." → PostalAddress */
export function postalAddress(address: string) {
  const m = address.match(/^(\d{4})\s+([^,]+),\s*(.+?)\.?$/);
  return {
    '@type': 'PostalAddress',
    streetAddress: m ? m[3] : address,
    postalCode: m?.[1],
    addressLocality: m?.[2] ?? 'Budapest',
    addressCountry: 'HU',
  };
}

export const offer = (name: string, price: number, extra: Record<string, unknown> = {}) => ({
  '@type': 'Offer', name, price: String(price), priceCurrency: 'HUF', ...extra,
});

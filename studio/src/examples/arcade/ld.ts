// Pixel Pont structured data: an EntertainmentBusiness with address, hours, prices and the FAQ.
import { brand, hours, tokens, parties, machines, faq } from './content';
import { openingHours, faqPage, postalAddress, offer } from '../../lib/seo';

export function arcadeLd(pageUrl: string, image: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EntertainmentBusiness',
      '@id': `${pageUrl}#business`,
      name: brand.full,
      description: brand.description,
      url: pageUrl,
      image,
      telephone: brand.phone.replace(/\s/g, ''),
      email: brand.email,
      address: postalAddress(brand.address),
      geo: { '@type': 'GeoCoordinates', latitude: brand.map.lat, longitude: brand.map.lon },
      openingHoursSpecification: openingHours(hours),
      priceRange: '200-189000 Ft',
      currenciesAccepted: 'HUF',
      paymentAccepted: 'Készpénz, bankkártya',
      isAccessibleForFree: false,
      publicAccess: true,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Lépcső nélküli bejárat', value: true },
        ...machines.map((m) => ({ '@type': 'LocationFeatureSpecification', name: `${m.kind}: ${m.name}`, value: `${m.count} db` })),
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Zsetonok és szülinapi csomagok',
        itemListElement: [
          ...tokens.map((t) => offer(`${t.what}${t.note ? ` (${t.note})` : ''}`, t.price)),
          ...parties.map((p) => offer(`Szülinapi buli: ${p.name}, ${p.guests}, ${p.length}`, p.price, { description: p.includes.join('. ') })),
        ],
      },
    },
    faqPage(faq),
  ];
}

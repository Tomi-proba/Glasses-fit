// Kékvíz structured data: a HomeAndConstructionBusiness with address, hours, prices and the FAQ.
import { brand, pools, covers, faq } from './content';
import { openingHours, faqPage, postalAddress, offer } from '../../lib/seo';

export function poolLd(pageUrl: string, image: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      '@id': `${pageUrl}#business`,
      name: brand.name,
      description: brand.description,
      url: pageUrl,
      image,
      telephone: brand.phone.replace(/\s/g, ''),
      email: brand.email,
      address: postalAddress(brand.address),
      geo: { '@type': 'GeoCoordinates', latitude: brand.map.lat, longitude: brand.map.lon },
      openingHoursSpecification: openingHours(brand.hours),
      areaServed: ['Budapest', 'Pest megye', 'Fejér megye', 'Komárom-Esztergom megye'],
      priceRange: '690000-6900000 Ft',
      knowsAbout: ['medenceépítés', 'vasbeton medence', 'teleszkópos medencefedés', 'medencegépészet', 'hőszivattyú'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Medenceépítés és medencefedések',
        itemListElement: [
          ...pools.map((p) => offer(p.name, p.price, { description: p.note, priceSpecification: { '@type': 'PriceSpecification', minPrice: p.price, priceCurrency: 'HUF' } })),
          ...covers.map((c) => offer(`${c.name} medencefedés (${c.height})`, c.price, { description: c.text, priceSpecification: { '@type': 'PriceSpecification', minPrice: c.price, priceCurrency: 'HUF' } })),
        ],
      },
    },
    faqPage(faq),
  ];
}

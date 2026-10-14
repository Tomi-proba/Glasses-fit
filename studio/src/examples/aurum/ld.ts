// Aurum structured data: a RealEstateAgent with address, hours, the listings as offers, and the FAQ.
import { brand, properties, agents, openingRows, faq } from './content';
import { openingHours, faqPage, postalAddress, offer } from '../../lib/seo';

const KIND: Record<string, string> = { Villa: 'SingleFamilyResidence', 'Családi ház': 'SingleFamilyResidence', Lakás: 'Apartment', Penthouse: 'Apartment' };

export function aurumLd(pageUrl: string, image: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${pageUrl}#business`,
      name: brand.name,
      description: brand.description,
      url: pageUrl,
      image,
      telephone: brand.phone.replace(/\s/g, ''),
      email: brand.email,
      address: postalAddress(brand.address),
      geo: { '@type': 'GeoCoordinates', latitude: brand.map.lat, longitude: brand.map.lon },
      openingHoursSpecification: openingHours(openingRows),
      areaServed: ['Budapest', 'Budakeszi', 'Balatonfüred', 'Tihany'],
      employee: agents.map((a) => ({ '@type': 'Person', name: a.name, jobTitle: a.role, telephone: a.phone.replace(/\s/g, '') })),
      makesOffer: properties.map((p) => offer(p.title, p.price, {
        description: p.summary,
        itemOffered: {
          '@type': KIND[p.type] ?? 'Accommodation',
          name: p.title,
          numberOfRooms: p.rooms,
          floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' },
          address: { '@type': 'PostalAddress', addressLocality: p.location, addressCountry: 'HU' },
        },
      })),
    },
    faqPage(faq),
  ];
}

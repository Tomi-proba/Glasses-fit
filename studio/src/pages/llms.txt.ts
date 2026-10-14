import type { APIRoute } from 'astro';
import { business } from '../config/business';
import { PACKAGES, VAT_NOTE, MONTHLY_NOTE } from '../config/pricing';

// llms.txt (https://llmstxt.org): a short plain-text summary for AI assistants and AI search.
// Built from the same config as the pages, so prices never drift.
export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const ft = (n: number) => `${new Intl.NumberFormat('hu-HU').format(n)} Ft`;
  const body = `# ${business.name}

> ${business.description}

- E-mail: ${business.email}
- Telefon: ${business.phone}
- Helyszín: ${business.address}

## Csomagok
${PACKAGES.map((p) => `- ${p.name}: ${ft(p.priceFrom)}-tól. ${p.summary} Tartalma: ${p.features.join('; ')}.`).join('\n')}
- ${VAT_NOTE} ${MONTHLY_NOTE}

## Oldalak
- [Főoldal](${base.href}): munkáink, csomagok, gyakori kérdések, kapcsolat
- [Tervező](${new URL('tervezo/', base).href}): öt perc alatt megtervezhető weboldal élő előnézettel
- [Ajánlatkérés](${new URL('ajanlatkeres/', base).href}): ingyenes, nem kötelez semmire, két munkanapon belül válaszolunk
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

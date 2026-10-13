// "Szöveg javaslat" (copy suggestions).
//
// PLACEHOLDER: today it fills simple templates from the business name and activity.
// LATER: replace the body of suggestCopy() with a call to a server endpoint that asks the
// Claude API to write the texts. The API key must stay on the server, never in the browser:
//
//   const res = await fetch(`${BASE}api/szoveg-javaslat`, {
//     method: 'POST', headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, activity, tagline, fields }),
//   });
//   return await res.json(); // same shape as below
//
// (An Astro server endpoint in src/pages/api/szoveg-javaslat.ts can call the Anthropic SDK.)

export const AI_COPY_ENABLED = false; // flips to true once the endpoint exists

// Hungarian definite article: "az" before a vowel, "a" otherwise.
const art = (word) => (/^[aáeéiíoóöőuúüű]/i.test(word) ? 'az' : 'a');

/**
 * @param {{ name: string, activity: string, tagline?: string }} input
 * @returns {Promise<{ tagline: string, heroTitle: string, heroSubtitle: string, aboutTitle: string, aboutText: string[] }>}
 */
export async function suggestCopy({ name, activity, tagline }) {
  const who = name?.trim() || 'vállalkozásunk';
  const what = activity?.trim() || 'szolgáltatásaink';
  await new Promise((r) => setTimeout(r, 400));
  return {
    tagline: tagline?.trim() || `Megbízható ${what}, személyes figyelemmel.`,
    heroTitle: `Ahol ${art(what)} ${what} élmény.`,
    heroSubtitle: `${who}: szakértelem, pontosság és nyugodt, barátságos légkör minden alkalommal.`,
    aboutTitle: `Ismerd meg ${art(who)} ${who} csapatát.`,
    aboutText: [
      `${art(who) === 'az' ? 'Az' : 'A'} ${who} azzal a céllal jött létre, hogy ${art(what)} ${what} terén a lehető legjobb élményt nyújtsa. Minden ügyfelünkre időt szánunk, és előre egyeztetjük, mire van szüksége.`,
      'Tapasztalt csapattal, minőségi eszközökkel és átlátható árakkal dolgozunk.',
    ],
  };
}

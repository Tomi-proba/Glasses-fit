/** Builds a link that respects the deploy base path (e.g. /Glasses-fit/ on GitHub Pages). */
export const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const url = (path = '') => BASE + String(path).replace(/^\//, '');

import { ICON_PATHS } from '../template/icons.js';

/** Inline Phosphor (light) icon as an SVG string. */
export function icon(name: keyof typeof ICON_PATHS | string, cls = 'icon') {
  const body = (ICON_PATHS as Record<string, string>)[name] ?? '';
  return `<svg class="${cls}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

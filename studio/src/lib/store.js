// The visitor's website design lives in localStorage, shared by /tervezo and /ajanlatkeres.
import { defaultConfig, sampleConfig } from '../template/samples.js';

const CONFIG_KEY = 'studio:config:v1';
const BACKUP_KEY = 'studio:config:backup';
const STEP_KEY = 'studio:step';
const PACKAGE_KEY = 'studio:package';
const QUOTE_DRAFT_KEY = 'studio:quote-draft';
const LAST_QUOTE_KEY = 'studio:last-quote';

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // private mode or quota (large images)
  }
};

/** Fills in keys missing from `saved` (e.g. after a template update) from `base`. */
export function mergeDefaults(base, saved) {
  if (Array.isArray(base) || Array.isArray(saved)) return saved ?? base;
  if (base && typeof base === 'object') {
    const out = { ...base };
    for (const [k, v] of Object.entries(saved || {})) out[k] = k in base ? mergeDefaults(base[k], v) : v;
    return out;
  }
  return saved ?? base;
}

export const hasSavedConfig = () => read(CONFIG_KEY) !== null;
export const loadConfig = () => {
  const saved = read(CONFIG_KEY);
  // Designs saved by an older, section-based version of the tervező are not compatible.
  if (!saved || saved.version !== 2 || !Array.isArray(saved.pages) || !saved.pages.length) return defaultConfig();
  return mergeDefaults(defaultConfig(), saved);
};
export const saveConfig = (config) => write(CONFIG_KEY, config);

/** Starts from a gallery sample; the previous design is kept as a one-step backup. */
export function startFromSample(id) {
  const current = read(CONFIG_KEY);
  if (current) write(BACKUP_KEY, current);
  const config = sampleConfig(id);
  saveConfig(config);
  return { config, hadPrevious: !!current };
}
export function restoreBackup() {
  const backup = read(BACKUP_KEY);
  if (!backup) return null;
  saveConfig(backup);
  return mergeDefaults(defaultConfig(), backup);
}
export const resetConfig = () => {
  const config = defaultConfig();
  saveConfig(config);
  return config;
};

export const loadStep = () => Number(read(STEP_KEY)) || 0;
export const saveStep = (n) => write(STEP_KEY, n);
/** The package picked in the tervező: 'alap' or 'premium'. */
export const loadPackage = () => (read(PACKAGE_KEY) === 'alap' ? 'alap' : 'premium');
export const savePackage = (id) => write(PACKAGE_KEY, id);
export const loadQuoteDraft = () => read(QUOTE_DRAFT_KEY) || {};
export const saveQuoteDraft = (d) => write(QUOTE_DRAFT_KEY, d);
export const clearQuoteDraft = () => { try { localStorage.removeItem(QUOTE_DRAFT_KEY); } catch { /* ignore */ } };
export const loadLastQuote = () => read(LAST_QUOTE_KEY);
export const saveLastQuote = (q) => write(LAST_QUOTE_KEY, q);

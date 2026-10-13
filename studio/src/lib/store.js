// The visitor's website design lives in localStorage, shared by /tervezo and /osszegzes.
import { defaultConfig, sampleConfig } from '../template/samples.js';

const CONFIG_KEY = 'studio:config:v1';
const BACKUP_KEY = 'studio:config:backup';
const STEP_KEY = 'studio:step';
const CUSTOMER_KEY = 'studio:customer';
const ORDER_KEY = 'studio:last-order';

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
export const loadCustomer = () => read(CUSTOMER_KEY) || {};
export const saveCustomer = (c) => write(CUSTOMER_KEY, c);
export const loadLastOrder = () => read(ORDER_KEY);
export const saveLastOrder = (o) => write(ORDER_KEY, o);

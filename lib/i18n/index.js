import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";

export const translations = { en, te, hi };

/**
 * Get a nested translation value by dot-separated key.
 * Example: getTranslation("en", "header.govName")
 */
export function getTranslation(lang, key) {
  const keys = key.split(".");
  let value = translations[lang] || translations.en;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  // Fallback to English if not found
  if (value === undefined) {
    let fallback = translations.en;
    for (const k of keys) {
      fallback = fallback?.[k];
      if (fallback === undefined) return key;
    }
    return fallback;
  }
  return value;
}

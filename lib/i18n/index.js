import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";

export const translations = { en, te, hi };

/**
 * Get a nested translation value by dot-separated key.
 */
export function getTranslation(lang, key) {
  const keys = key.split(".");
  let value = translations[lang] || translations.en;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
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

/**
 * Get localized value from a multilingual object { en, te, hi }.
 * Falls back to English if the selected language is unavailable.
 */
export function getLocalizedValue(obj, lang = "en") {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.en || obj.te || obj.hi || "";
}

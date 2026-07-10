"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getTranslation, getLocalizedValue as _glv } from "../lib/i18n/index";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  // Restore from localStorage after mount (avoid hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("sevasetu_lang");
    if (saved && ["en", "te", "hi"].includes(saved)) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  // Update document lang and localStorage when language changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sevasetu_lang", language);
      document.documentElement.lang = language === "te" ? "te" : language === "hi" ? "hi" : "en";
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang) => {
    if (["en", "te", "hi"].includes(lang)) {
      setLanguageState(lang);
    }
  }, []);

  // Translation function
  const t = useCallback((key) => {
    return getTranslation(language, key);
  }, [language]);

  // Get localized value from an object like { en: "...", te: "...", hi: "..." }
  const getLocalizedValue = useCallback((obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return _glv(obj, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedValue, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

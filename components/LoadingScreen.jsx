"use client";

import "../app/loading-screen.css";
import { useLanguage } from "../context/LanguageContext";

const LOADER_TEXT = {
  en: { title: "SevaSetu", subtitle: "Telangana Public Service Navigator", status: "Loading government services..." },
  te: { title: "సేవాసేతు", subtitle: "తెలంగాణ ప్రజా సేవల మార్గదర్శి", status: "ప్రభుత్వ సేవలను సిద్ధం చేస్తున్నాము..." },
  hi: { title: "सेवासेतु", subtitle: "तेलंगाना जन सेवा मार्गदर्शक", status: "सरकारी सेवाएँ तैयार की जा रही हैं..." },
};

export default function LoadingScreen() {
  let lang = "en";
  try {
    if (typeof window !== "undefined") {
      lang = localStorage.getItem("sevasetu_lang") || "en";
    }
  } catch {}
  const text = LOADER_TEXT[lang] || LOADER_TEXT.en;
  return (
    <div className="loading-screen">
      <div className="loader-emblem-glow" />

      <div className="emblem-scene">
        <div className="emblem-medallion">
          <div className="emblem-front">
            <img
              src="/assets/national-emblem-india.png"
              alt="National Emblem of India - Ashoka Lion Capital"
              width={110}
              height={110}
            />
          </div>
          <div className="emblem-back">
            <div className="back-symbol">
              <span className="back-text-ts">TS</span>
              <span className="back-text-sub">Government of Telangana</span>
            </div>
          </div>
        </div>
      </div>

      <div className="emblem-shadow" />

      <h1 className="loader-title">{text.title}</h1>
      <p className="loader-subtitle">{text.subtitle}</p>

      <div className="loader-track">
        <div className="loader-progress" />
      </div>

      <p className="loader-status">{text.status}</p>
    </div>
  );
}

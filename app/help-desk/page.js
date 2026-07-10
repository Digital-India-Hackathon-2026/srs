"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useChatbot } from "../../context/ChatbotContext";
import { useLanguage } from "../../context/LanguageContext";

function HelpDeskContent() {
  const { openChatbot } = useChatbot();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Auto-open chatbot when this page loads
  useEffect(() => {
    const service = searchParams.get("service") || "";
    setTimeout(() => openChatbot(service), 300);
  }, [openChatbot, searchParams]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
      <div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#163A63] to-[#1a4a7a] flex items-center justify-center shadow-lg mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <h2 className="text-xl font-black text-[#163A63] mb-2">{t("helpDesk.greeting")}</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{t("helpDesk.subtitle")}</p>
        <p className="text-xs text-gray-400">
          {t("helpDesk.description")}
        </p>
        <button
          onClick={() => openChatbot()}
          className="mt-6 inline-flex items-center gap-2 bg-[#163A63] hover:bg-[#0f2540] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
          aria-label="Open SevaSetu AI Assistant"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          {t("landing.openHelpDesk")}
        </button>
      </div>
    </div>
  );
}

export default function HelpDeskPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>}>
        <HelpDeskContent />
      </Suspense>
      <Footer />
    </div>
  );
}

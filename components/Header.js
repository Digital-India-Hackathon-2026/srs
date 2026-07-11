"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useChatbot } from "../context/ChatbotContext";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { openChatbot } = useChatbot();

  const navLinks = [
    { label: t("nav.services"),       href: "/services" },
    { label: t("nav.helpDesk"),       href: "#chatbot", action: () => openChatbot() },
    { label: t("nav.draftGenerator"), href: "/application-draft" },
    { label: t("nav.offices"),        href: "/offices" },
    { label: t("nav.about"),          href: "/about" },
  ];

  return (
    <header className="w-full sticky top-0 z-40">
      {/* ── Top utility bar ── */}
      <div className="bg-[#0a1a2e] text-gray-300 text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-2">
          <span className="font-medium truncate">
            {t("header.govName")} &nbsp;|&nbsp; {t("header.portalName")}
          </span>
          <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
            <span className="text-gray-400">{t("header.language")}:</span>
            <select
              className="bg-white/10 border border-white/20 text-white text-xs rounded px-1.5 py-0.5 outline-none cursor-pointer ml-1"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="en" className="text-black bg-white">English</option>
              <option value="te" className="text-black bg-white">తెలుగు</option>
              <option value="hi" className="text-black bg-white">हिन्दी</option>
            </select>
          </span>
        </div>
      </div>

      {/* ── Main nav bar: Logo | Navigation (flex:1 evenly) | Language (mobile) ── */}
      <div className="bg-[#0f2540] border-b-4 border-[#e07b00]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex items-center" style={{ height: "68px" }}>

          {/* Logo section — fixed width */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0" style={{ width: "300px" }} aria-label="Home">
            <Image src="/images/sevasetu-logo.png" alt="SevaSetu" width={52} height={52} className="hidden sm:block object-contain h-[52px] w-auto" priority />
            <Image src="/images/sevasetu-logo.png" alt="SevaSetu" width={38} height={38} className="block sm:hidden object-contain h-[38px] w-auto" priority />
            <div className="min-w-0 hidden sm:block">
              <div className="text-white font-black text-base leading-tight tracking-tight group-hover:text-[#e8c97a] transition-colors">
                {t("header.siteName")}
              </div>
              <div className="text-gray-400 text-[10px] mt-0.5 truncate">{t("header.siteSubtitle")}</div>
            </div>
          </Link>

          {/* Navigation — fills remaining space, evenly distributed */}
          <nav className="flex-1 hidden lg:flex items-center justify-evenly" aria-label="Main navigation">
            {/* Home link */}
            <Link
              href="/"
              className={`px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 ${
                pathname === "/" ? "text-white border-[#e07b00]" : "text-gray-300 border-transparent hover:text-white hover:border-[#e07b00]/50"
              }`}
            >
              {t("common.home")}
            </Link>

            {navLinks.map((link) => {
              const active = link.href !== "#chatbot" && (pathname === link.href || pathname.startsWith(link.href + "/"));
              if (link.action) {
                return (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 text-gray-300 border-transparent hover:text-white hover:border-[#e07b00]/50"
                    aria-label="Open SevaSetu AI Assistant"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 ${
                    active ? "text-white border-[#e07b00]" : "text-gray-300 border-transparent hover:text-white hover:border-[#e07b00]/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Language selector — visible on mobile only (desktop is in utility bar) */}
          <div className="flex items-center gap-2 flex-shrink-0 lg:hidden ml-auto">
            <select
              className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1.5 outline-none cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="en" className="text-black bg-white">EN</option>
              <option value="te" className="text-black bg-white">తె</option>
              <option value="hi" className="text-black bg-white">हि</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

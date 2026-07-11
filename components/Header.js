"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useChatbot } from "../context/ChatbotContext";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { openChatbot } = useChatbot();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: t("common.home"),        href: "/" },
    { label: t("nav.services"),       href: "/services" },
    { label: t("nav.helpDesk"),       href: "#chatbot", action: () => { openChatbot(); setMenuOpen(false); } },
    { label: t("nav.draftGenerator"), href: "/application-draft" },
    { label: t("nav.offices"),        href: "/offices" },
    { label: t("nav.about"),          href: "/about" },
  ];

  const isActive = (href) => href !== "#chatbot" && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="w-full sticky top-0 z-40 no-print">
      {/* ── Top utility bar ── */}
      <div className="bg-[#0a1a2e] text-gray-300 text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
          <span className="font-medium truncate text-[11px] sm:text-xs">
            {t("header.govName")} &nbsp;|&nbsp; <span className="hidden sm:inline">{t("header.portalName")}</span>
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

      {/* ── Main nav bar ── */}
      <div className="bg-[#0f2540] border-b-4 border-[#e07b00]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: "60px" }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 min-w-0" aria-label="Home">
            <Image src="/images/sevasetu-logo.png" alt="SevaSetu" width={40} height={40} className="object-contain flex-shrink-0" style={{ width: "auto", height: "40px" }} priority />
            <div className="min-w-0 hidden sm:block">
              <div className="text-white font-black text-sm leading-tight tracking-tight group-hover:text-[#e8c97a] transition-colors truncate">
                {t("header.siteName")}
              </div>
              <div className="text-gray-400 text-[10px] mt-0.5 truncate max-w-[180px]">{t("header.siteSubtitle")}</div>
            </div>
            <span className="sm:hidden text-white font-black text-sm">{t("header.siteName")}</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden nav:flex flex-1 items-center justify-evenly ml-4" aria-label="Main navigation">
            {navLinks.map((link) => {
              if (link.action) {
                return (
                  <button key={link.label} onClick={link.action}
                    className="px-3 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 text-gray-300 border-transparent hover:text-white hover:border-[#e07b00]/50"
                    aria-label="Open SevaSetu AI Assistant"
                  >{link.label}</button>
                );
              }
              return (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all border-b-2 ${
                    isActive(link.href) ? "text-white border-[#e07b00]" : "text-gray-300 border-transparent hover:text-white hover:border-[#e07b00]/50"
                  }`}
                >{link.label}</Link>
              );
            })}
          </nav>

          {/* Right side: language (mobile) + hamburger */}
          <div className="flex items-center gap-2 ml-auto nav:ml-0">
            {/* Language selector — mobile */}
            <select
              className="nav:hidden bg-white/10 border border-white/20 text-white text-xs rounded px-2 py-1.5 outline-none cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="en" className="text-black bg-white">EN</option>
              <option value="te" className="text-black bg-white">తె</option>
              <option value="hi" className="text-black bg-white">हि</option>
            </select>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile slide-in menu ── */}
      <div
        className={`nav:hidden fixed inset-0 z-50 transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />

        {/* Menu panel — slides from right */}
        <div
          className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0f2540] shadow-2xl flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Image src="/images/sevasetu-logo.png" alt="" width={32} height={32} className="object-contain" style={{ width: "auto", height: "32px" }} />
              <span className="text-white font-black text-sm">{t("header.siteName")}</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white p-1.5 hover:bg-white/10 rounded" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              if (link.action) {
                return (
                  <button key={link.label} onClick={link.action}
                    className="w-full text-left px-5 py-3.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-l-4 border-transparent hover:border-[#e07b00]"
                  >{link.label}</button>
                );
              }
              return (
                <Link key={link.href} href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-5 py-3.5 text-sm font-semibold transition-colors border-l-4 ${
                    isActive(link.href)
                      ? "text-white bg-white/10 border-[#e07b00]"
                      : "text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-[#e07b00]/50"
                  }`}
                >{link.label}</Link>
              );
            })}
          </nav>

          {/* Language selector — in menu */}
          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">{t("header.language")}</p>
            <div className="flex gap-2">
              {[{code:"en",label:"English"},{code:"te",label:"తెలుగు"},{code:"hi",label:"हिंदी"}].map(l => (
                <button key={l.code} onClick={() => setLanguage(l.code)}
                  className={`flex-1 py-2 text-xs font-semibold rounded transition-colors ${language === l.code ? "bg-[#e07b00] text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                >{l.label}</button>
              ))}
            </div>
          </div>

          {/* Helpline */}
          <div className="px-5 py-3 bg-[#0a1a2e]">
            <p className="text-xs text-gray-400">{t("header.helpline")}: <strong className="text-white">1800-599-4788</strong></p>
          </div>
        </div>
      </div>
    </header>
  );
}

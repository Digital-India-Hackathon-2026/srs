"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t("nav.services"),        href: "/services" },
    { label: t("nav.helpDesk"),        href: "/help-desk" },
    { label: t("nav.draftGenerator"),  href: "/application-draft" },
    { label: t("nav.offices"),         href: "/offices" },
    { label: t("nav.about"),           href: "/about" },
  ];

  return (
    <header className="w-full">
      <div className="bg-[#0a1a2e] text-gray-300 text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="font-medium truncate">
            {t("header.govName")} &nbsp;|&nbsp; {t("header.portalName")}
          </span>
          <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
            {t("header.helpline")}:&nbsp;<strong className="text-white">1800-599-4788</strong>
          </span>
        </div>
      </div>

      <div className="bg-[#0f2540] border-b-4 border-[#e07b00] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group min-w-0" aria-label="Home">
            <div className="flex-shrink-0">
              <Image src="/images/sevasetu-logo.png" alt="SevaSetu" width={70} height={70} className="hidden sm:block object-contain h-[70px] w-auto" priority />
              <Image src="/images/sevasetu-logo.png" alt="SevaSetu" width={45} height={45} className="block sm:hidden object-contain h-[45px] w-auto" priority />
            </div>
            <div className="min-w-0">
              <div className="text-white font-black text-base sm:text-xl leading-tight tracking-tight group-hover:text-[#e8c97a] transition-colors">
                {t("header.siteName")}
              </div>
              <div className="text-gray-300 text-[11px] sm:text-xs mt-0.5 truncate">{t("header.siteSubtitle")}</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gray-400 text-xs hidden md:block">{t("header.language")}:</span>
            <select
              className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1.5 outline-none cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              <option value="en" className="text-black bg-white">English</option>
              <option value="te" className="text-black bg-white">తెలుగు</option>
              <option value="hi" className="text-black bg-white">हिन्दी</option>
            </select>
          </div>
        </div>
      </div>

      <nav className="bg-[#1a3a5c] px-4 border-b border-white/10" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link key={link.href} href={link.href} className={`px-3 sm:px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${active ? "text-white border-[#e07b00] bg-white/5" : "text-gray-300 border-transparent hover:text-white hover:bg-white/5"}`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

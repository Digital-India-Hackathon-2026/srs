"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0f2540] text-gray-400 text-xs mt-auto">
      <div className="border-t-4 border-[#e07b00]" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/images/sevasetu-logo.png" alt="" width={42} height={42} className="object-contain h-[42px] w-auto flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm leading-tight">{t("header.siteName")}</p>
                <p className="text-gray-400 text-[11px] mt-0.5">{t("header.siteTagline")}</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">{t("header.siteSubtitle")}</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">{t("footer.quickLinks")}</p>
            <div className="space-y-1.5">
              <Link href="/services" className="block hover:text-white transition-colors">{t("nav.services")}</Link>
              <Link href="/help-desk" className="block hover:text-white transition-colors">{t("nav.helpDesk")}</Link>
              <Link href="/offices" className="block hover:text-white transition-colors">{t("nav.offices")}</Link>
              <Link href="/about" className="block hover:text-white transition-colors">{t("nav.about")}</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">{t("footer.officialPortals")}</p>
            <div className="space-y-1.5">
              <a href="https://meeseva.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="block hover:text-white">MeeSeva Portal</a>
              <a href="https://telangana.gov.in" target="_blank" rel="noopener noreferrer" className="block hover:text-white">Telangana Government</a>
              <a href="https://www.ghmc.gov.in" target="_blank" rel="noopener noreferrer" className="block hover:text-white">GHMC</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-yellow-300/80 font-medium">{t("footer.disclaimer")}</p>
          <div className="flex flex-wrap gap-4 justify-between text-gray-500">
            <span>{t("footer.rights")}</span>
            <span>{t("footer.dataSource")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

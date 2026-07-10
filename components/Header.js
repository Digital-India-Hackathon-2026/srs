"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Services",        href: "/services"  },
  { label: "AI Help Desk",    href: "/help-desk" },
  { label: "Draft Generator", href: "/application-draft" },
  { label: "MeeSeva Offices", href: "/offices"   },
  { label: "About",           href: "/about"     },
];

function LangSelector() {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("sevasetu_lang");
    if (saved) setLangState(saved);
  }, []);

  function handleChange(val) {
    setLangState(val);
    localStorage.setItem("sevasetu_lang", val);
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-gray-400 text-xs hidden md:block">Language:</span>
      <select
        className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1.5 outline-none cursor-pointer"
        value={lang}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Select language"
      >
        <option value="en" className="text-black bg-white">English</option>
        <option value="te" className="text-black bg-white">తెలుగు</option>
        <option value="hi" className="text-black bg-white">हिन्दी</option>
      </select>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full">

      {/* ── Top utility bar ─────────────────────────────────────── */}
      <div className="bg-[#0a1a2e] text-gray-300 text-xs py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="font-medium truncate">
            Government of Telangana &nbsp;|&nbsp; Official Citizen Service Portal
          </span>
          <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
            Helpline:&nbsp;<strong className="text-white">1800-599-4788</strong>&nbsp;(Toll Free)
          </span>
        </div>
      </div>

      {/* ── Main branding bar ───────────────────────────────────── */}
      <div className="bg-[#0f2540] border-b-4 border-[#e07b00] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo + brand text */}
          <Link href="/" className="flex items-center gap-3 group min-w-0" aria-label="SevaSetu Telangana Home">

            {/* Logo image — desktop 70px, mobile 45px */}
            <div className="flex-shrink-0">
              <Image
                src="/images/sevasetu-logo.png"
                alt="SevaSetu Telangana Logo"
                width={70}
                height={70}
                className="hidden sm:block object-contain h-[70px] w-auto"
                priority
              />
              <Image
                src="/images/sevasetu-logo.png"
                alt="SevaSetu Telangana Logo"
                width={45}
                height={45}
                className="block sm:hidden object-contain h-[45px] w-auto"
                priority
              />
            </div>

            {/* Brand text beside logo */}
            <div className="min-w-0">
              <div className="text-white font-black text-base sm:text-xl leading-tight tracking-tight group-hover:text-[#e8c97a] transition-colors">
                SevaSetu Telangana
              </div>
              <div className="text-gray-300 text-[11px] sm:text-xs mt-0.5 truncate">
                AI-powered guide for Telangana government services
              </div>
              <div className="text-gray-400 text-[10px] hidden sm:block mt-0.5">
                Telangana Public Service Navigator
              </div>
            </div>
          </Link>

          {/* Language selector */}
          <LangSelector />
        </div>
      </div>

      {/* ── Nav strip ───────────────────────────────────────────── */}
      <nav className="bg-[#1a3a5c] px-4 border-b border-white/10" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 sm:px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${
                  active
                    ? "text-white border-[#e07b00] bg-white/5"
                    : "text-gray-300 border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

    </header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Globe,
  HelpCircle,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { telanganaServices, activeServices } from "../lib/telanganaServices";
import { useLanguage } from "../context/LanguageContext";
import { useChatbot } from "../context/ChatbotContext";
import { getServiceField } from "../lib/serviceData";

const POPULAR_IDS = ["income-certificate", "caste-certificate", "birth-certificate", "death-certificate", "passport", "aadhaar-update"];

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { openChatbot } = useChatbot();
  const [query, setQuery] = useState("");
  const [noMatch, setNoMatch] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions = query.trim().length > 0
    ? telanganaServices.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      ) : [];

  function handleSearch() {
    setOpen(false);
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = telanganaServices.find(s => s.name.toLowerCase().includes(q));
    if (match) router.push(`/services/${match.id}`);
    else setNoMatch(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ══════════ HERO — Two column: text left, Secretariat image right ══════════ */}
      <section className="relative bg-[#0f2540] overflow-hidden" style={{ minHeight: "580px" }}>
        {/* RIGHT SIDE — Secretariat image with subtle perspective */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-[57%] h-full overflow-hidden"
          style={{ perspective: "1600px" }}
        >
          <img
            src="/images/telangana-secretariat.webp"
            alt="Telangana Secretariat"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: "perspective(1600px) rotateY(-2deg) scale(1.015)",
              transformOrigin: "right center",
              backfaceVisibility: "hidden",
            }}
          />
          {/* Narrow feathered blend — only 130px wide at the left join */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "-1px",
              width: "130px",
              background: "linear-gradient(to right, #0f2540 0%, rgba(15,37,64,0.75) 25%, rgba(15,37,64,0.30) 60%, rgba(15,37,64,0) 100%)",
            }}
          />
        </div>

        {/* Left side content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16 flex items-center" style={{ minHeight: "580px" }}>
          <div className="max-w-[540px]">
            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-6">
              <ShieldCheck size={13} className="text-[#4ade80]" />
              Verified Official Source Data &nbsp;|&nbsp; Telangana Government Services
            </div>

            {/* Heading — large, matching reference proportions */}
            <h1 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.5rem] font-black text-white leading-[1.08] mb-5">
              Access Telangana<br />
              Government Services<br />
              Without <span className="text-[#e07b00]">Confusion</span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-[15px] leading-relaxed mb-7 max-w-[460px]">
              Find verified documents, eligibility, application steps, official links,
              <strong className="text-white"> MeeSeva guidance</strong>, and multilingual AI support for
              Telangana citizens.
            </p>

            {/* Search bar */}
            <div className="max-w-[480px] relative" ref={wrapperRef}>
              <div className="flex bg-white rounded-md overflow-hidden shadow-xl">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder="What service are you looking for? Example: Income Certificate"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setNoMatch(false); setOpen(true); }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && setOpen(true)}
                  />
                </div>
                <button onClick={handleSearch} className="bg-[#e07b00] hover:bg-[#c96e00] text-white font-bold px-5 text-sm transition-colors flex items-center gap-1.5">
                  <Search size={14} /> Search
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {open && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 overflow-hidden">
                  {suggestions.slice(0, 5).map(s => (
                    <button key={s.id} onClick={() => { setOpen(false); router.push(`/services/${s.id}`); }} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-800 border-b border-gray-50 last:border-0 text-left">
                      <span className="font-medium">{getServiceField(s.id, "name", language) || s.name}</span>
                      <ArrowRight size={12} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
              {noMatch && <p className="mt-2 text-yellow-200 text-xs">{t("landing.serviceNotFound")}</p>}
            </div>

            {/* Statistics row — four items */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                <div><span className="text-white font-bold text-sm block">13</span><span className="text-gray-400 text-[10px]">Services Available</span></div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-yellow-400" />
                <div><span className="text-white font-bold text-sm block">33</span><span className="text-gray-400 text-[10px]">Districts Covered</span></div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-300" />
                <div><span className="text-gray-300 text-xs block">Verified Official</span><span className="text-gray-400 text-[10px]">Data</span></div>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-orange-300" />
                <div><span className="text-gray-300 text-xs block">AI Help Desk</span><span className="text-gray-400 text-[10px]">Available</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet: show image below */}
        <img src="/images/telangana-secretariat.webp" alt="Telangana Secretariat" className="lg:hidden w-full h-48 object-cover object-center" />
      </section>

      {/* ══════════ POPULAR SERVICES ══════════ */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f2540]">Popular Services</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fully verified Telangana government services available now</p>
            </div>
            <Link href="/services" className="text-sm font-semibold text-[#0f2540] hover:text-[#e07b00] flex items-center gap-1 transition-colors">
              View all services <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service cards — horizontal row matching reference */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {activeServices.filter(s => POPULAR_IDS.includes(s.id)).map(s => {
              const name = getServiceField(s.id, "name", language) || s.name;
              const dept = getServiceField(s.id, "department", language) || s.department;
              return (
                <Link key={s.id} href={`/services/${s.id}`} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-[#e07b00]/30 transition-all duration-200 flex flex-col">
                  <div className="w-9 h-9 rounded-full bg-[#e07b00]/10 flex items-center justify-center mb-3">
                    <FileText size={16} className="text-[#e07b00]" />
                  </div>
                  <h3 className="text-[13px] font-bold text-[#0f2540] mb-0.5 leading-snug">{name}</h3>
                  <p className="text-[10px] text-gray-400 flex-1">{dept}</p>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-[#e07b00] mt-3 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ WHY SEVASETU ══════════ */}
      <section className="bg-[#f8f9fb] border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-9">
            <h2 className="text-xl font-black text-[#0f2540]">{t("landing.whySevaSetu")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("landing.whySubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <ShieldCheck size={20} className="text-[#2d7a4f]" />, title: "Verified Official Guidance", desc: "Links directly to official government portals." },
              { icon: <Users size={20} className="text-[#0f2540]" />, title: "Telugu, Hindi & English", desc: "Multilingual support for all citizens." },
              { icon: <FileText size={20} className="text-[#e07b00]" />, title: "No Middlemen", desc: "Direct guidance — no agents, no extra fees." },
              { icon: <MapPin size={20} className="text-[#0f2540]" />, title: "Office Finder", desc: "Find nearest MeeSeva in 33 districts." },
              { icon: <Bot size={20} className="text-[#2d7a4f]" />, title: "AI Help Desk", desc: "Ask in plain language, get verified answers." },
              { icon: <Globe size={20} className="text-[#e07b00]" />, title: "Telangana-First", desc: "Built exclusively for Telangana citizens." },
            ].map(c => (
              <div key={c.title} className="flex gap-3.5 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all">
                <div className="flex-shrink-0 mt-0.5">{c.icon}</div>
                <div>
                  <p className="font-bold text-sm text-[#0f2540] mb-0.5">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="bg-[#0f2540] py-10 text-center text-white">
        <h3 className="text-lg font-black mb-2">{t("landing.needHelp")}</h3>
        <p className="text-gray-300 text-sm mb-5 max-w-md mx-auto">{t("landing.needHelpDesc")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => openChatbot()} className="inline-flex items-center gap-2 bg-[#e07b00] hover:bg-[#c96e00] text-white font-bold px-6 py-2.5 rounded text-sm transition-colors" aria-label="Open SevaSetu AI Assistant">
            <Bot size={15} /> {t("landing.openHelpDesk")}
          </button>
          <Link href="/services" className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-bold px-6 py-2.5 rounded text-sm transition-colors">
            <FileText size={15} /> {t("landing.browseServices")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

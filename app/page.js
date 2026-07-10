"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const POPULAR_IDS = ["passport", "driving-licence", "income-certificate", "aadhaar-update", "birth-certificate", "caste-certificate"];

const WHY_CARDS = [
  { iconName: "shield",  color: "text-[#2d7a4f]", title: "Verified Official Source Guidance",   desc: "Every service page links directly to the official Telangana government portal or MeeSeva." },
  { iconName: "users",   color: "text-[#1a3a5c]", title: "Telugu, Hindi & English Support",      desc: "Full multilingual support so no citizen is left behind due to a language barrier." },
  { iconName: "file",    color: "text-[#e07b00]", title: "No Middlemen",                         desc: "Direct guidance on documents, steps and official portals. No agents, no fees beyond official charges." },
  { iconName: "map",     color: "text-[#1a3a5c]", title: "MeeSeva & District Office Guidance",   desc: "Find the nearest MeeSeva centre or government office in 8 Telangana districts." },
  { iconName: "bot",     color: "text-[#2d7a4f]", title: "AI Help Desk",                         desc: "Ask questions in plain language. Answers come only from the verified Telangana service knowledge base." },
  { iconName: "globe",   color: "text-[#e07b00]", title: "Telangana-First Platform",             desc: "Built exclusively for Telangana citizens first, with plans to expand to all Indian states." },
];

function WhyIcon({ name, className }) {
  const props = { size: 22, className };
  switch (name) {
    case "shield": return <ShieldCheck {...props} />;
    case "users":  return <Users {...props} />;
    case "file":   return <FileText {...props} />;
    case "map":    return <MapPin {...props} />;
    case "bot":    return <Bot {...props} />;
    case "globe":  return <Globe {...props} />;
    default:       return <ShieldCheck {...props} />;
  }
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [noMatch, setNoMatch] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions =
    query.trim().length > 0
      ? telanganaServices.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.category.toLowerCase().includes(query.toLowerCase()) ||
            s.department.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  function handleSearch() {
    setOpen(false);
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = telanganaServices.find((s) =>
      s.name.toLowerCase().includes(q)
    );
    if (match && match.status === "active") {
      router.push(`/services/${match.id}`);
    } else {
      setNoMatch(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setOpen(false);
  }

  function handleQueryChange(e) {
    setQuery(e.target.value);
    setNoMatch(false);
    setOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#0f2540] text-white px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded px-3 py-1 text-xs font-semibold mb-5">
            <ShieldCheck size={12} className="text-[#4ade80]" />
            Verified Official Source Data &nbsp;|&nbsp; Telangana Government Services
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4">
            Access Telangana Government Services<br className="hidden md:block" /> Without Confusion
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Find verified documents, eligibility, application steps, official links, MeeSeva guidance,
            and multilingual AI support for Telangana citizens.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative" ref={wrapperRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  className="w-full pl-9 pr-4 py-3 rounded border border-white/20 bg-white text-gray-800 text-sm outline-none focus:ring-2 focus:ring-[#e07b00]"
                  placeholder="What service are you looking for? Example: Income Certificate"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query.trim() && setOpen(true)}
                  aria-label="Search services"
                  autoComplete="off"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#e07b00] hover:bg-[#c96e00] active:bg-[#b56000] text-white font-bold px-4 sm:px-5 py-3 rounded text-sm transition-colors whitespace-nowrap flex items-center gap-2"
                aria-label="Search"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-xl z-30 text-left overflow-hidden">
                {suggestions.map((s) =>
                  s.status === "active" ? (
                    <button
                      key={s.id}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/services/${s.id}`);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-800 border-b border-gray-100 last:border-0 text-left"
                    >
                      <div className="min-w-0 mr-2">
                        <span className="font-semibold block">{s.name}</span>
                        <span className="text-gray-400 text-xs block truncate">{s.department}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[11px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">Active</span>
                        <ArrowRight size={13} className="text-gray-400" />
                      </div>
                    </button>
                  ) : (
                    <div
                      key={s.id}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 border-b border-gray-100 last:border-0 cursor-default"
                    >
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-semibold">
                        Coming Soon
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* No-match message */}
            {noMatch && (
              <div className="mt-2 text-yellow-200 text-sm bg-black/30 border border-yellow-400/30 rounded px-3 py-2.5 text-left">
                Service not available yet. Try:{" "}
                {["Income Certificate", "Caste Certificate", "Residence Certificate", "Birth Certificate"].map((name, i) => {
                  const svc = telanganaServices.find((s) => s.name === name);
                  return (
                    <span key={name}>
                      {i > 0 && ", "}
                      <button
                        className="underline hover:text-white"
                        onClick={() => svc && router.push(`/services/${svc.id}`)}
                      >
                        {name}
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-300">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-400" /> 13 Services Available</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-yellow-300" /> 8 Districts Covered</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-blue-300" /> Verified Official Data</span>
            <span className="flex items-center gap-1.5"><HelpCircle size={13} className="text-orange-300" /> AI Help Desk Available</span>
          </div>
        </div>
      </section>

      {/* ── Popular Services ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1a3a5c]">Popular Services</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fully verified Telangana government services available now</p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-[#1a3a5c] hover:text-[#e07b00] flex items-center gap-1 transition-colors flex-shrink-0 ml-4"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeServices.filter(s => POPULAR_IDS.includes(s.id)).map((s) => (
            <div
              key={s.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-[#1a3a5c] transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-[#2d7a4f] bg-green-50 border border-green-200 rounded px-2 py-0.5">
                  {s.category}
                </span>
                <FileText size={16} className="text-gray-300 flex-shrink-0" />
              </div>
              <h3 className="font-black text-[#1a3a5c] text-base mb-1">{s.name}</h3>
              <p className="text-xs text-gray-500 mb-1 font-medium">{s.department}</p>
              <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-4">{s.shortDesc}</p>
              <Link
                href={`/services/${s.id}`}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] active:bg-[#081c35] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors"
              >
                View Details <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why SevaSetu ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-200 px-4 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-black text-[#1a3a5c]">Why SevaSetu?</h2>
            <p className="text-sm text-gray-500 mt-1">
              Built to make Telangana government services easier for every citizen
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_CARDS.map((c) => (
              <div
                key={c.title}
                className="flex gap-4 p-4 rounded border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <WhyIcon name={c.iconName} className={c.color} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1a2733] mb-1">{c.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────────────────── */}
      <section className="bg-[#1a3a5c] px-4 py-8 text-center text-white">
        <h3 className="text-base sm:text-lg font-black mb-2">Need help with a specific service?</h3>
        <p className="text-gray-300 text-sm mb-5">
          Use our AI Help Desk to ask questions in plain language about any Telangana service.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/help-desk"
            className="inline-flex items-center gap-2 bg-[#e07b00] hover:bg-[#c96e00] active:bg-[#b56000] text-white font-bold px-5 py-2.5 rounded text-sm transition-colors"
          >
            <Bot size={15} /> Open AI Help Desk
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-bold px-5 py-2.5 rounded text-sm transition-colors"
          >
            <FileText size={15} /> Browse All Services
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

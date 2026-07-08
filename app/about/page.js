import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, CheckCircle2, FileText, Globe, MapPin, ShieldCheck, Users } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "About – SevaSetu Telangana",
  description: "About SevaSetu: AI-powered Telangana government service navigator.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">About</span>
          </nav>
          <div className="flex items-center gap-4">
            <Image
              src="/images/sevasetu-logo.png"
              alt="SevaSetu Telangana"
              width={64}
              height={64}
              className="object-contain h-16 w-auto flex-shrink-0 hidden sm:block"
            />
            <div>
              <h1 className="text-2xl font-black">About SevaSetu Telangana</h1>
              <p className="text-gray-300 text-sm mt-1">
                Bridging the gap between Telangana citizens and government services.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">

        {/* The Problem */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
            The Problem
          </div>
          <div className="p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Millions of Telangana citizens need to access government services — Income Certificates,
              Caste Certificates, Birth Certificates, and more — but the process is often confusing,
              fragmented, and inaccessible.
            </p>
            <p>
              Common challenges faced by citizens include:
            </p>
            <ul className="space-y-2 pl-2">
              {[
                "Not knowing which documents to carry before visiting an office",
                "Visiting wrong offices or submitting incomplete applications",
                "Relying on unofficial agents who charge extra fees",
                "Language barriers — official portals are often only in English",
                "No single place to find verified, up-to-date guidance for Telangana services",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#2d7a4f] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
            Our Solution
          </div>
          <div className="p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>SevaSetu Telangana</strong> is a citizen guidance platform that consolidates
              verified, official information for Telangana government services into one easy-to-use portal.
            </p>
            <p>
              We do not replace official portals — we help citizens prepare to use them correctly.
              Every piece of information on SevaSetu is sourced directly from official Telangana
              government portals and MeeSeva.
            </p>
          </div>
        </div>

        {/* Key features */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
            What SevaSetu Offers
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <FileText size={18} className="text-[#1a3a5c]" />, title: "Verified Service Guidance", desc: "Complete document checklists, eligibility criteria, step-by-step processes and official links for Telangana services." },
                { icon: <Users size={18} className="text-[#2d7a4f]" />, title: "Telugu, Hindi & English", desc: "Full multilingual support. Citizens can access guidance in their preferred language, with Telugu given equal importance." },
                { icon: <Bot size={18} className="text-[#e07b00]" />, title: "AI Help Desk", desc: "An AI assistant trained only on verified Telangana service data. Citizens can ask plain language questions and get accurate, grounded answers." },
                { icon: <MapPin size={18} className="text-[#1a3a5c]" />, title: "Office Finder", desc: "Find the nearest MeeSeva centre, Revenue Office, GHMC, Aadhaar centre or RTO across 8 Telangana districts." },
                { icon: <ShieldCheck size={18} className="text-[#2d7a4f]" />, title: "No Middlemen", desc: "Direct official-source guidance. Citizens are empowered to apply themselves without depending on unofficial agents." },
                { icon: <Globe size={18} className="text-[#e07b00]" />, title: "Telangana-First", desc: "Built exclusively for Telangana citizens first, with architecture designed to scale to all Indian states." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 p-3 rounded border border-gray-100">
                  <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-[#1a2733] mb-1">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Approach */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
            Our Approach: Telangana-First
          </div>
          <div className="p-6 text-sm text-gray-700 leading-relaxed space-y-3">
            <p>
              We believe the right approach to solving public service access is to go deep in one
              state before expanding. By focusing on Telangana first, we can ensure:
            </p>
            <ul className="space-y-2 pl-2">
              {[
                "Data is accurate, verified and updated regularly from official sources",
                "Telugu language support is a priority, not an afterthought",
                "Local offices, MeeSeva centres and district-level guidance are included",
                "The platform reflects the actual Telangana citizen experience",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#2d7a4f] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="pt-1">
              After establishing a strong foundation in Telangana, SevaSetu will expand to other
              Indian states — eventually becoming a pan-India government service navigator.
            </p>
          </div>
        </div>

        {/* Future */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
            Future Roadmap
          </div>
          <div className="p-6 text-sm text-gray-700 space-y-2 leading-relaxed">
            {[
              "Phase 1 (Current): 4 active services — Income, Caste, Residence, Birth Certificate",
              "Phase 2: Expand to 10+ Telangana services including Ration Card, Aadhaar Update, Driving Licence",
              "Phase 3: Expand to all Telangana districts with hyperlocal office data",
              "Phase 4: Add Andhra Pradesh, Karnataka, Maharashtra state coverage",
              "Phase 5: Pan-India government service navigator",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#1a3a5c] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 leading-relaxed">
          <strong>Disclaimer:</strong> SevaSetu is a student-built guidance platform created for a hackathon.
          All information is sourced from official Telangana government portals and verified as of July 2026.
          Users must verify final details from official portals before taking action.
          SevaSetu is not affiliated with the Government of Telangana.
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="inline-flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold px-5 py-2.5 rounded text-sm transition-colors">
            <FileText size={14} /> Browse Services <ArrowRight size={14} />
          </Link>
          <Link href="/help-desk" className="inline-flex items-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white font-bold px-5 py-2.5 rounded text-sm transition-colors">
            <Bot size={14} /> Open Help Desk
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

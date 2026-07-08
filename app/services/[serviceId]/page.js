import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Info,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getServiceById, telanganaServices } from "../../../lib/telanganaServices";

export async function generateStaticParams() {
  return telanganaServices.map((s) => ({ serviceId: s.id }));
}

export async function generateMetadata({ params }) {
  const service = getServiceById(params.serviceId);
  if (!service) return { title: "Service Not Found – SevaSetu Telangana" };
  return {
    title: `${service.name} – SevaSetu Telangana`,
    description: service.shortDesc,
  };
}

export default function ServiceDetailPage({ params }) {
  const service = getServiceById(params.serviceId);

  if (!service) notFound();

  if (service.status === "coming-soon") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-center">
          <Clock size={44} className="mx-auto text-[#e07b00] mb-4" />
          <h1 className="text-2xl font-black text-[#1a3a5c] mb-2">{service.name}</h1>
          <p className="text-gray-500 mb-2">{service.department}</p>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Detailed guidance for this service is coming soon. Please visit the official portal or your nearest MeeSeva centre.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/services" className="inline-flex items-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] font-bold px-4 py-2 rounded text-sm hover:bg-[#1a3a5c] hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to Services
            </Link>
            <a href={service.officialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white font-bold px-4 py-2 rounded text-sm hover:bg-[#0f2540] transition-colors">
              <ExternalLink size={14} /> Visit Official Portal
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb + page title */}
      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-gray-200">{service.name}</span>
          </nav>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black">{service.name}</h1>
              <p className="text-gray-300 text-sm mt-0.5">{service.department}</p>
            </div>
            <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1 rounded flex items-center gap-1.5">
              <ShieldCheck size={12} /> Verified — Last updated {service.lastVerified}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Back button */}
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-[#1a3a5c] font-semibold hover:text-[#e07b00] transition-colors"
            >
              <ArrowLeft size={14} /> Back to all services
            </Link>

            {/* Overview */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <Info size={13} /> Overview
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-700 leading-relaxed">{service.overview}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Where to Apply",    value: service.applyAt },
                    { label: "Processing Time",   value: service.processingTime, icon: <Clock size={12} className="text-[#e07b00]" /> },
                    { label: "Category",          value: service.category },
                    { label: "Last Verified",     value: service.lastVerified },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-200 rounded p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-[#1a3a5c] flex items-center gap-1">
                        {item.icon}{item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Required */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <FileText size={13} /> Documents Required
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {service.documents.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <CheckCircle2 size={15} className="text-[#2d7a4f] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <Users size={13} /> Eligibility
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {service.eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <Info size={15} className="text-[#1a3a5c] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Process */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <ArrowRight size={13} /> Step-by-Step Application Process
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {service.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-6 h-6 rounded-full bg-[#1a3a5c] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>

                {service.fees && (
                  <div className="mt-4 bg-[#fff4e0] border border-[#f5d8a0] rounded p-3 text-sm text-[#7a4a00]">
                    <strong>Fee Note:</strong> {service.fees}
                  </div>
                )}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-red-400">
              <div className="bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <AlertTriangle size={13} /> Common Mistakes to Avoid
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {service.mistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-red-50 last:border-0 last:pb-0">
                      <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-800">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────── */}
          <aside className="space-y-4">
            {/* Official source */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#2d7a4f]" /> Official Portal
              </div>
              <p className="text-xs text-gray-500 mb-3 break-all">{service.officialLink}</p>
              <a
                href={service.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors"
              >
                <ExternalLink size={13} /> Visit Official Portal
              </a>
            </div>

            {/* Find office */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#1a3a5c]" /> Apply in Person
              </div>
              <p className="text-xs text-gray-600 mb-3">Find the nearest MeeSeva centre or government office in your district.</p>
              <Link
                href="/offices"
                className="w-full inline-flex items-center justify-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white text-xs font-bold px-4 py-2.5 rounded transition-colors"
              >
                <MapPin size={13} /> Find Nearest Office
              </Link>
            </div>

            {/* AI Help Desk */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                <Bot size={12} className="text-[#2d7a4f]" /> Have Questions?
              </div>
              <p className="text-xs text-gray-600 mb-3">Ask our AI Help Desk about documents, eligibility or the application process.</p>
              <Link
                href={`/help-desk?service=${service.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2d7a4f] hover:bg-[#236040] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors"
              >
                <Bot size={13} /> Ask AI Help Desk
              </Link>
            </div>

            {/* Meta info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Apply At</span>
                <span className="text-right max-w-[150px]">{service.applyAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Processing Time</span>
                <span>{service.processingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Last Verified</span>
                <span>{service.lastVerified}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 leading-relaxed">
              <strong>Note:</strong> SevaSetu is a guidance portal. Always verify final details and fees from the official government portal before applying.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
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
import PassportGuidanceSection from "../../../components/PassportGuidance";
import { getServiceById } from "../../../lib/telanganaServices";
import { getServiceField, loc } from "../../../lib/serviceData";
import { useLanguage } from "../../../context/LanguageContext";
import { useChatbot } from "../../../context/ChatbotContext";

export default function ServiceDetailPage() {
  const params = useParams();
  const { t, language } = useLanguage();
  const { openChatbot } = useChatbot();
  const service = getServiceById(params.serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Service not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Get localized values with English fallback
  const name = getServiceField(service.id, "name", language) || service.name;
  const dept = getServiceField(service.id, "department", language) || service.department;
  const cat = getServiceField(service.id, "category", language) || service.category;
  const overview = getServiceField(service.id, "overview", language) || service.overview;
  const whereToApply = getServiceField(service.id, "whereToApply", language) || service.applyAt;
  const processingTime = getServiceField(service.id, "processingTime", language) || service.processingTime;
  const fees = getServiceField(service.id, "fees", language) || service.fees;
  const docs = getServiceField(service.id, "documents", language) || service.documents || [];
  const elig = getServiceField(service.id, "eligibility", language) || service.eligibility || [];
  const steps = getServiceField(service.id, "steps", language) || service.steps || [];
  const mistakes = getServiceField(service.id, "mistakes", language) || service.mistakes || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb + title */}
      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">{t("common.home")}</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">{t("nav.services")}</Link>
            <span>/</span>
            <span className="text-gray-200">{name}</span>
          </nav>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black">{name}</h1>
              <p className="text-gray-300 text-sm mt-0.5">{dept}</p>
            </div>
            <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1 rounded flex items-center gap-1.5">
              <ShieldCheck size={12} /> {t("serviceDetails.verified")} — {service.lastVerified}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-[#1a3a5c] font-semibold hover:text-[#e07b00]">
              <ArrowLeft size={14} /> {t("serviceDetails.backToServices")}
            </Link>

            {/* Overview */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                <Info size={13} /> {t("serviceDetails.overview")}
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-700 leading-relaxed">{overview}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: t("serviceDetails.whereToApply"), value: whereToApply },
                    { label: t("serviceDetails.processingTime"), value: processingTime, icon: <Clock size={12} className="text-[#e07b00]" /> },
                    { label: t("serviceDetails.category"), value: cat },
                    { label: t("serviceDetails.lastVerified"), value: service.lastVerified },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-200 rounded p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-[#1a3a5c] flex items-center gap-1">{item.icon}{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            {docs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                  <FileText size={13} /> {t("serviceDetails.documentsRequired")}
                </div>
                <div className="p-5 space-y-2">
                  {docs.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-gray-100 last:border-0">
                      <CheckCircle2 size={15} className="text-[#2d7a4f] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {elig.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                  <Users size={13} /> {t("serviceDetails.eligibility")}
                </div>
                <div className="p-5 space-y-2">
                  {elig.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-gray-100 last:border-0">
                      <Info size={15} className="text-[#1a3a5c] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                  <ArrowRight size={13} /> {t("serviceDetails.applicationProcess")}
                </div>
                <div className="p-5 space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-[#1a3a5c] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                  {fees && (
                    <div className="mt-4 bg-[#fff4e0] border border-[#f5d8a0] rounded p-3 text-sm text-[#7a4a00]">
                      <strong>{t("serviceDetails.feeNote")}:</strong> {fees}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mistakes */}
            {mistakes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-red-400">
                <div className="bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                  <AlertTriangle size={13} /> {t("serviceDetails.commonMistakes")}
                </div>
                <div className="p-5 space-y-2">
                  {mistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-red-50 last:border-0">
                      <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-800">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.id === "passport" && <PassportGuidanceSection />}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#2d7a4f]" /> {t("serviceDetails.officialPortal")}
              </div>
              <p className="text-xs text-gray-500 mb-3 break-all">{service.officialLink}</p>
              <a href={service.officialLink} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors">
                <ExternalLink size={13} /> {t("serviceDetails.visitPortal")}
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#1a3a5c]" /> {t("serviceDetails.applyInPerson")}
              </div>
              <Link href="/offices" className="w-full inline-flex items-center justify-center gap-2 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white text-xs font-bold px-4 py-2.5 rounded transition-colors">
                <MapPin size={13} /> {t("serviceDetails.findOffice")}
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1.5">
                <Bot size={12} className="text-[#2d7a4f]" /> {t("serviceDetails.haveQuestions")}
              </div>
              <button onClick={() => openChatbot(service.id)} className="w-full inline-flex items-center justify-center gap-2 bg-[#2d7a4f] hover:bg-[#236040] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors" aria-label="Open SevaSetu AI Assistant">
                <Bot size={13} /> {t("serviceDetails.askHelpDesk")}
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500 space-y-1.5">
              <div className="flex justify-between"><span className="font-semibold text-gray-600">{t("serviceDetails.whereToApply")}</span><span className="text-right max-w-[150px]">{whereToApply}</span></div>
              <div className="flex justify-between"><span className="font-semibold text-gray-600">{t("serviceDetails.processingTime")}</span><span>{processingTime}</span></div>
              <div className="flex justify-between"><span className="font-semibold text-gray-600">{t("serviceDetails.lastVerified")}</span><span>{service.lastVerified}</span></div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

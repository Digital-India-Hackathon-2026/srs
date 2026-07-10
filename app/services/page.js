"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { telanganaServices } from "../../lib/telanganaServices";
import { serviceNames, serviceDepartments, serviceCategories, serviceDescriptions, getLocalizedServiceValue } from "../../lib/serviceTranslations";
import { useLanguage } from "../../context/LanguageContext";

export default function ServicesPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white">{t("common.home")}</Link>
            <span>/</span>
            <span className="text-gray-200">{t("nav.services")}</span>
          </nav>
          <h1 className="text-2xl font-black">{t("services.pageTitle")}</h1>
          <p className="text-gray-300 text-sm mt-1">{t("services.pageSubtitle")}</p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs bg-green-100 text-green-700 border border-green-200 font-bold px-2.5 py-0.5 rounded">
            {telanganaServices.length} {t("services.available")}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {telanganaServices.map((s) => {
            const name = getLocalizedServiceValue(serviceNames[s.id], language) || s.name;
            const dept = getLocalizedServiceValue(serviceDepartments[s.id], language) || s.department;
            const cat = getLocalizedServiceValue(serviceCategories[s.category], language) || s.category;
            const desc = getLocalizedServiceValue(serviceDescriptions[s.id], language) || s.shortDesc;

            return (
              <div key={s.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-[#1a3a5c] transition-all flex flex-col">
                <div className="border-l-4 border-[#1a3a5c] p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#1a3a5c] flex-shrink-0" />
                      <h3 className="font-black text-[#1a3a5c] text-sm leading-tight">{name}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0">
                      {cat}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-1">{dept}</p>
                  <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-3">{desc}</p>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                    <Clock size={11} className="text-[#C89A2B]" />
                    {s.processingTime}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/services/${s.id}`} className="inline-flex items-center gap-1 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">
                      {t("services.viewDetails")} <ArrowRight size={11} />
                    </Link>
                    {s.hasDraftGenerator && (
                      <Link href={`/application-draft/${s.id}`} className="inline-flex items-center gap-1 border border-[#C89A2B] text-[#C89A2B] hover:bg-[#C89A2B] hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">
                        <Sparkles size={10} /> {t("services.draftGenerator")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

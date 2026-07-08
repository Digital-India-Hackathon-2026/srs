import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { telanganaServices } from "../../lib/telanganaServices";

export const metadata = {
  title: "All Services – SevaSetu Telangana",
  description: "Browse all Telangana government services on SevaSetu.",
};

const categoryColors = {
  Certificate: "bg-blue-50 text-blue-700 border-blue-200",
  Identity:    "bg-green-50 text-green-700 border-green-200",
  Transport:   "bg-orange-50 text-orange-700 border-orange-200",
  Scheme:      "bg-purple-50 text-purple-700 border-purple-200",
};

export default function ServicesPage() {
  const active     = telanganaServices.filter((s) => s.status === "active");
  const comingSoon = telanganaServices.filter((s) => s.status === "coming-soon");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page title bar */}
      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">Services</span>
          </nav>
          <h1 className="text-2xl font-black">All Telangana Government Services</h1>
          <p className="text-gray-300 text-sm mt-1">
            Select a service to view documents required, eligibility, step-by-step application process and official links.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Active services */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-black text-[#1a3a5c] uppercase tracking-wide">
              Available Services
            </h2>
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 font-bold px-2 py-0.5 rounded">
              {active.length} Active
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {active.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-[#1a3a5c] transition-all"
              >
                <div className="border-l-4 border-[#1a3a5c] p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={15} className="text-[#1a3a5c]" />
                        <h3 className="font-black text-[#1a3a5c] text-base">{s.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500">{s.department}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${categoryColors[s.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {s.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.shortDesc}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} className="text-[#e07b00]" />
                      {s.processingTime}
                    </div>
                    <Link
                      href={`/services/${s.id}`}
                      className="inline-flex items-center gap-1.5 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                    >
                      View Details <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-black text-gray-500 uppercase tracking-wide">
              Coming Soon
            </h2>
            <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 font-bold px-2 py-0.5 rounded">
              {comingSoon.length} Services
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {comingSoon.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-gray-200 rounded-lg p-4 opacity-70"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-600 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.department}</p>
                  </div>
                  <span className="text-[11px] font-bold bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded flex-shrink-0">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{s.shortDesc}</p>
                <button
                  disabled
                  className="w-full text-xs font-bold py-1.5 rounded border border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

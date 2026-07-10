import Link from "next/link";
import { ArrowRight, Clock, FileText, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { telanganaServices } from "../../lib/telanganaServices";

export const metadata = {
  title: "All Services – SevaSetu Telangana",
  description: "Browse all Telangana government services on SevaSetu.",
};

const categoryColors = {
  Certificate:        "bg-blue-50 text-blue-700 border-blue-200",
  Identity:           "bg-green-50 text-green-700 border-green-200",
  "Identity & Travel":"bg-green-50 text-green-700 border-green-200",
  Transport:          "bg-orange-50 text-orange-700 border-orange-200",
  Scheme:             "bg-purple-50 text-purple-700 border-purple-200",
  Platform:           "bg-teal-50 text-teal-700 border-teal-200",
  Finance:            "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">Services</span>
          </nav>
          <h1 className="text-2xl font-black">All Telangana Government Services</h1>
          <p className="text-gray-300 text-sm mt-1">
            {telanganaServices.length} services available. Select a service to view documents, eligibility, steps and official links.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs bg-green-100 text-green-700 border border-green-200 font-bold px-2.5 py-0.5 rounded">
            {telanganaServices.length} Services Available
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {telanganaServices.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-[#1a3a5c] transition-all flex flex-col">
              <div className="border-l-4 border-[#1a3a5c] p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#1a3a5c] flex-shrink-0" />
                    <h3 className="font-black text-[#1a3a5c] text-sm leading-tight">{s.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${categoryColors[s.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {s.category}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-1">{s.department}</p>
                <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-3">{s.shortDesc}</p>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                  <Clock size={11} className="text-[#C89A2B]" />
                  {s.processingTime}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link
                    href={`/services/${s.id}`}
                    className="inline-flex items-center gap-1 bg-[#1a3a5c] hover:bg-[#0f2540] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                  >
                    View Details <ArrowRight size={11} />
                  </Link>
                  {s.hasDraftGenerator && (
                    <Link
                      href={`/application-draft/${s.id === "driving-licence" ? "driving-licence" : s.id}`}
                      className="inline-flex items-center gap-1 border border-[#C89A2B] text-[#C89A2B] hover:bg-[#C89A2B] hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      <Sparkles size={10} /> Draft Generator
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

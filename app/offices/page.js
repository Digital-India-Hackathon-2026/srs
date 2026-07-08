"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin, Phone, Search } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DISTRICTS = [
  "Hyderabad",
  "Medchal-Malkajgiri",
  "Rangareddy",
  "Warangal",
  "Karimnagar",
  "Nalgonda",
  "Nizamabad",
  "Khammam",
];

const OFFICES_BY_DISTRICT = {
  "Hyderabad": [
    { name: "MeeSeva Centre, Himayatnagar", type: "MeeSeva", address: "Himayatnagar, Hyderabad – 500029", phone: "1800-599-4788", maps: "MeeSeva+Centre+Himayatnagar+Hyderabad" },
    { name: "GHMC Zonal Office, Khairatabad", type: "GHMC", address: "Khairatabad, Hyderabad – 500004", phone: "040-23225237", maps: "GHMC+Zonal+Office+Khairatabad+Hyderabad" },
    { name: "Aadhaar Seva Kendra, Punjagutta", type: "Aadhaar", address: "Punjagutta, Hyderabad – 500082", phone: "1947", maps: "Aadhaar+Seva+Kendra+Punjagutta+Hyderabad" },
    { name: "Mandal Revenue Office, Secunderabad", type: "Revenue Office", address: "Secunderabad, Hyderabad – 500003", phone: "040-27840844", maps: "Mandal+Revenue+Office+Secunderabad" },
    { name: "RTO Hyderabad Central", type: "RTO", address: "Nampally, Hyderabad – 500001", phone: "040-23223000", maps: "RTO+Hyderabad+Central+Nampally" },
  ],
  "Medchal-Malkajgiri": [
    { name: "MeeSeva Centre, Kompally", type: "MeeSeva", address: "Kompally, Medchal – 500014", phone: "1800-599-4788", maps: "MeeSeva+Centre+Kompally+Medchal" },
    { name: "Mandal Revenue Office, Medchal", type: "Revenue Office", address: "Medchal, Medchal-Malkajgiri – 501401", phone: "040-27260202", maps: "Mandal+Revenue+Office+Medchal+Telangana" },
    { name: "MeeSeva Centre, Uppal", type: "MeeSeva", address: "Uppal, Malkajgiri – 500039", phone: "1800-599-4788", maps: "MeeSeva+Centre+Uppal+Hyderabad" },
    { name: "Aadhaar Seva Kendra, Ghatkesar", type: "Aadhaar", address: "Ghatkesar, Medchal-Malkajgiri – 501301", phone: "1947", maps: "Aadhaar+Kendra+Ghatkesar+Telangana" },
  ],
  "Rangareddy": [
    { name: "MeeSeva Centre, LB Nagar", type: "MeeSeva", address: "LB Nagar, Rangareddy – 500074", phone: "1800-599-4788", maps: "MeeSeva+Centre+LB+Nagar+Hyderabad" },
    { name: "Mandal Revenue Office, Rajendranagar", type: "Revenue Office", address: "Rajendranagar, Rangareddy – 500030", phone: "040-24010501", maps: "Mandal+Revenue+Office+Rajendranagar+Hyderabad" },
    { name: "MeeSeva Centre, Kukatpally", type: "MeeSeva", address: "Kukatpally, Rangareddy – 500072", phone: "1800-599-4788", maps: "MeeSeva+Centre+Kukatpally+Hyderabad" },
    { name: "RTO Rangareddy", type: "RTO", address: "Meerpet, Rangareddy – 500097", phone: "040-24452626", maps: "RTO+Rangareddy+Meerpet+Hyderabad" },
  ],
  "Warangal": [
    { name: "MeeSeva Centre, Hanamkonda", type: "MeeSeva", address: "Hanamkonda, Warangal – 506001", phone: "1800-599-4788", maps: "MeeSeva+Centre+Hanamkonda+Warangal" },
    { name: "Mandal Revenue Office, Warangal Urban", type: "Revenue Office", address: "Warangal Urban, Warangal – 506002", phone: "0870-2578900", maps: "Mandal+Revenue+Office+Warangal+Urban" },
    { name: "Aadhaar Seva Kendra, Hanamkonda", type: "Aadhaar", address: "Hanamkonda, Warangal – 506001", phone: "1947", maps: "Aadhaar+Kendra+Hanamkonda+Warangal" },
    { name: "RTO Warangal", type: "RTO", address: "Warangal, Telangana – 506002", phone: "0870-2440204", maps: "RTO+Office+Warangal+Telangana" },
  ],
  "Karimnagar": [
    { name: "MeeSeva Centre, Karimnagar Town", type: "MeeSeva", address: "Karimnagar Town, Karimnagar – 505001", phone: "1800-599-4788", maps: "MeeSeva+Centre+Karimnagar+Telangana" },
    { name: "Mandal Revenue Office, Karimnagar", type: "Revenue Office", address: "Karimnagar, Telangana – 505001", phone: "0878-2245566", maps: "Mandal+Revenue+Office+Karimnagar+Telangana" },
    { name: "RTO Karimnagar", type: "RTO", address: "Karimnagar, Telangana – 505001", phone: "0878-2242323", maps: "RTO+Office+Karimnagar+Telangana" },
    { name: "GHMC / Municipal Office, Karimnagar", type: "Municipal Office", address: "Karimnagar, Telangana – 505001", phone: "0878-2240011", maps: "Municipal+Office+Karimnagar+Telangana" },
  ],
  "Nalgonda": [
    { name: "MeeSeva Centre, Nalgonda Town", type: "MeeSeva", address: "Nalgonda Town, Nalgonda – 508001", phone: "1800-599-4788", maps: "MeeSeva+Centre+Nalgonda+Telangana" },
    { name: "Mandal Revenue Office, Nalgonda", type: "Revenue Office", address: "Nalgonda, Telangana – 508001", phone: "08682-245566", maps: "Mandal+Revenue+Office+Nalgonda+Telangana" },
    { name: "RTO Nalgonda", type: "RTO", address: "Nalgonda, Telangana – 508001", phone: "08682-243434", maps: "RTO+Office+Nalgonda+Telangana" },
  ],
  "Nizamabad": [
    { name: "MeeSeva Centre, Nizamabad Town", type: "MeeSeva", address: "Nizamabad Town, Nizamabad – 503001", phone: "1800-599-4788", maps: "MeeSeva+Centre+Nizamabad+Telangana" },
    { name: "Mandal Revenue Office, Nizamabad", type: "Revenue Office", address: "Nizamabad, Telangana – 503001", phone: "08462-225566", maps: "Mandal+Revenue+Office+Nizamabad+Telangana" },
    { name: "RTO Nizamabad", type: "RTO", address: "Nizamabad, Telangana – 503001", phone: "08462-224848", maps: "RTO+Office+Nizamabad+Telangana" },
  ],
  "Khammam": [
    { name: "MeeSeva Centre, Khammam Town", type: "MeeSeva", address: "Khammam Town, Khammam – 507001", phone: "1800-599-4788", maps: "MeeSeva+Centre+Khammam+Telangana" },
    { name: "Mandal Revenue Office, Khammam", type: "Revenue Office", address: "Khammam, Telangana – 507001", phone: "08742-225566", maps: "Mandal+Revenue+Office+Khammam+Telangana" },
    { name: "RTO Khammam", type: "RTO", address: "Khammam, Telangana – 507001", phone: "08742-224545", maps: "RTO+Office+Khammam+Telangana" },
    { name: "Municipal Office, Khammam", type: "Municipal Office", address: "Khammam, Telangana – 507001", phone: "08742-221122", maps: "Municipal+Office+Khammam+Telangana" },
  ],
};

const TYPE_COLORS = {
  MeeSeva:        "bg-blue-100 text-blue-800 border-blue-200",
  GHMC:           "bg-purple-100 text-purple-800 border-purple-200",
  Aadhaar:        "bg-green-100 text-green-800 border-green-200",
  "Revenue Office": "bg-yellow-100 text-yellow-800 border-yellow-200",
  RTO:            "bg-orange-100 text-orange-800 border-orange-200",
  "Municipal Office": "bg-teal-100 text-teal-800 border-teal-200",
};

export default function OfficesPage() {
  const [district, setDistrict] = useState("Hyderabad");
  const [pinInput, setPinInput] = useState("");
  const [filterType, setFilterType] = useState("All");

  const allOffices = OFFICES_BY_DISTRICT[district] || [];
  const officeTypes = ["All", ...new Set(allOffices.map((o) => o.type))];
  const filtered = filterType === "All" ? allOffices : allOffices.filter((o) => o.type === filterType);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">MeeSeva Offices</span>
          </nav>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MapPin size={22} /> MeeSeva & Government Offices
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Find the nearest MeeSeva centre, Revenue Office, GHMC, Aadhaar centre or RTO in your district.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Search controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                Select District
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                value={district}
                onChange={(e) => { setDistrict(e.target.value); setFilterType("All"); }}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                PIN Code (optional)
              </label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                placeholder="e.g. 500029"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => setFilterType("All")}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
              >
                <Search size={14} /> Search Offices
              </button>
            </div>
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {officeTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                filterType === t
                  ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c] hover:text-[#1a3a5c]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing <strong>{filtered.length}</strong> office{filtered.length !== 1 ? "s" : ""} in <strong>{district}</strong>
          {filterType !== "All" ? ` — Type: ${filterType}` : ""}
        </p>

        {/* Office cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((office) => (
            <div
              key={office.name}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="border-l-4 border-[#1a3a5c] p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-sm text-[#1a3a5c] leading-tight">{office.name}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_COLORS[office.type] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {office.type}
                  </span>
                </div>
                <p className="flex items-start gap-1.5 text-xs text-gray-500 mb-1">
                  <MapPin size={12} className="flex-shrink-0 mt-0.5 text-[#1a3a5c]" />
                  {office.address}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <Phone size={12} className="flex-shrink-0 text-[#2d7a4f]" />
                  {office.phone}
                </p>
                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + " " + office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white text-xs font-bold py-2 rounded transition-colors"
                  >
                    <ExternalLink size={12} /> Get Directions
                  </a>
                  <a
                    href={`tel:+91${office.phone.replace(/[^0-9]/g, "")}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2d7a4f] hover:bg-[#236040] text-white text-xs font-bold py-2 rounded transition-colors"
                  >
                    <Phone size={12} /> Call Office
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MeeSeva note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <strong>MeeSeva Helpline:</strong> 1800-599-4788 (Toll Free, Mon–Sat 8AM–8PM) &nbsp;|&nbsp;
          Online portal: <a href="https://tg.meeseva.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">tg.meeseva.gov.in</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

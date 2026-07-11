"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, MapPin, Phone, Search } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DISTRICTS = [
  "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad",
  "Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal",
  "Kamareddy","Karimnagar","Khammam","Kumuram Bheem Asifabad",
  "Mahabubabad","Mahabubnagar","Mancherial","Medak",
  "Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda",
  "Narayanpet","Nirmal","Nizamabad","Peddapalli",
  "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet",
  "Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri",
];

const TYPE_COLORS = {
  MeeSeva: "bg-blue-100 text-blue-800 border-blue-200",
  Aadhaar: "bg-green-100 text-green-800 border-green-200",
  RTO: "bg-orange-100 text-orange-800 border-orange-200",
  "Revenue Office": "bg-yellow-100 text-yellow-800 border-yellow-200",
  GHMC: "bg-purple-100 text-purple-800 border-purple-200",
  Municipality: "bg-teal-100 text-teal-800 border-teal-200",
};

export default function OfficesPage() {
  const [district, setDistrict] = useState("Hyderabad");
  const [pin, setPin] = useState("");
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchMsg, setSearchMsg] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => { fetchOffices(district); }, []);

  async function fetchOffices(d) {
    setLoading(true);
    setSearchMsg("");
    try {
      const res = await fetch(`/api/offices?district=${encodeURIComponent(d)}`);
      const data = await res.json();
      setOffices(data.offices || []);
      setDistrict(d);
      setFilterType("All");
    } catch { setOffices([]); }
    setLoading(false);
  }

  async function searchByPin() {
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setSearchMsg("Please enter a valid 6-digit PIN code.");
      return;
    }
    setLoading(true);
    setSearchMsg("");
    try {
      const res = await fetch(`/api/offices?pin=${pin}&district=${encodeURIComponent(district)}`);
      const data = await res.json();

      if (data.error) {
        setOffices([]);
        setSearchMsg(data.error);
        setLoading(false);
        return;
      }

      // PIN-first API returns { pinInfo, offices, mismatch }
      const allResults = data.offices || [];
      setOffices(allResults);

      // Auto-update district to match PIN
      if (data.pinInfo?.district) {
        setDistrict(data.pinInfo.district);
      }

      // Build message
      let msg = "";
      if (data.mismatch) msg += data.mismatch + " ";
      if (allResults.length > 0 && data.pinInfo) {
        msg += `Showing government service centres near ${data.pinInfo.locality} — PIN ${pin}.`;
      }
      if (allResults.length === 0) {
        msg = `No matching offices found within 10 km.`;
      }
      setSearchMsg(msg);
      setFilterType("All");
    } catch { setOffices([]); setSearchMsg("Search failed. Please try again."); }
    setLoading(false);
  }

  const types = ["All", ...new Set(offices.map(o => o.type))];
  const filtered = offices.filter(o => {
    const typeMatch = filterType === "All" || o.type === filterType;
    const textMatch = !searchText || o.name.toLowerCase().includes(searchText.toLowerCase()) || o.address.toLowerCase().includes(searchText.toLowerCase());
    return typeMatch && textMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <span className="text-gray-200">Government Offices</span>
          </nav>
          <h1 className="text-2xl font-black flex items-center gap-2"><MapPin size={22} /> MeeSeva & Government Offices</h1>
          <p className="text-gray-300 text-sm mt-1">Find the nearest office in all 33 Telangana districts.</p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Search controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
          <div className="grid sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Select District</label>
              <select value={district} onChange={e => fetchOffices(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]">
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">PIN Code</label>
              <input value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. 500029" maxLength={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
            </div>
            <button onClick={searchByPin} className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors">
              <Search size={14} /> Search
            </button>
          </div>
          {/* Text search */}
          <div className="mt-3">
            <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search by office name or area..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
          </div>
        </div>

        {/* Info message */}
        {searchMsg && <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">{searchMsg}</p>}

        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${filterType === t ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
              {t}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing <strong>{filtered.length}</strong> office{filtered.length !== 1 ? "s" : ""} in <strong>{district}</strong>
          {filterType !== "All" ? ` — ${filterType}` : ""}
        </p>

        {/* Office cards */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading offices...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No offices found. Try a different district or PIN code.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(office => (
              <div key={office.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="border-l-4 border-[#1a3a5c] p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-[#1a3a5c] leading-tight">{office.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_COLORS[office.type] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {office.type}
                    </span>
                  </div>
                  <p className="flex items-start gap-1.5 text-xs text-gray-500 mb-1">
                    <MapPin size={11} className="flex-shrink-0 mt-0.5 text-[#1a3a5c]" />{office.address}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Phone size={11} className="text-[#2d7a4f]" />{office.phone}
                  </p>
                  {office.distance != null && (
                    <p className="text-[10px] text-blue-600 font-semibold mb-1">📍 {office.distance.toFixed(1)} km away</p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Clock size={11} />{office.hours}
                  </p>
                  <div className="flex gap-2">
                    <a href={office.mapsUrl || office.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white text-xs font-bold py-2 rounded-lg transition-colors">
                      <ExternalLink size={11} /> Get Directions
                    </a>
                    {office.phone && office.phone !== "N/A" ? (
                      <a href={`tel:${office.phone.replace(/[^0-9+]/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-1 bg-[#2d7a4f] hover:bg-[#236040] text-white text-xs font-bold py-2 rounded-lg transition-colors">
                        <Phone size={11} /> Call Office
                      </a>
                    ) : (
                      <span className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-200 text-gray-400 text-xs font-bold py-2 rounded-lg cursor-not-allowed">
                        <Phone size={11} /> Phone unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Helpline */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
          <strong>MeeSeva Helpline:</strong> 1800-599-4788 (Toll Free, Mon–Sat 8AM–8PM) &nbsp;|&nbsp;
          Portal: <a href="https://meeseva.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">meeseva.telangana.gov.in</a>
        </div>

        {/* MVP Coverage Note */}
        <p className="mt-3 text-xs text-gray-400 text-center italic">
          PIN-code search currently supports Hyderabad metropolitan areas (Hyderabad, Medchal–Malkajgiri, Rangareddy). Telangana-wide coverage is being expanded.
        </p>
      </main>

      <Footer />
    </div>
  );
}

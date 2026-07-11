"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy, Edit3, ExternalLink, Loader2, Lock, Printer, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0, PHASE_EXTRACTING = 1, PHASE_CONFIRM = 2, PHASE_QUESTIONS = 3, PHASE_REVIEW = 4;

const UPDATE_TYPES = [
  { id: "name", label: "Name (Spelling Correction)", desc: "Correct spelling or name format as per official documents", docRequired: true, docLabel: "Proof of Identity", docHint: "PAN Card / Passport / Voter ID showing correct name" },
  { id: "address", label: "Address (Change of Address)", desc: "Update residential address with valid proof", docRequired: true, docLabel: "Proof of Address", docHint: "Utility Bill / Bank Statement / Rent Agreement / Voter ID" },
  { id: "dob", label: "Date of Birth (Correction)", desc: "Correct DOB as per valid birth proof", docRequired: true, docLabel: "Proof of Date of Birth", docHint: "Birth Certificate / SSC Marksheet / Passport / PAN" },
  { id: "gender", label: "Gender (Correction)", desc: "Update gender as per supporting document", docRequired: true, docLabel: "Gender Change Document", docHint: "Affidavit / Court Order / Medical Certificate" },
  { id: "mobile", label: "Mobile Number (Update / Link)", desc: "Update or link new mobile number (OTP-based)", docRequired: false, docLabel: null, docHint: "Verified via OTP on UIDAI Self-Service Portal" },
  { id: "email", label: "Email ID (Update / Add)", desc: "Update or add email address (OTP-based)", docRequired: false, docLabel: null, docHint: "Verified via OTP on UIDAI Self-Service Portal" },
  { id: "biometrics", label: "Biometrics (Photo / Fingerprint / Iris)", desc: "Update photo, fingerprint, or iris scan — must visit centre", docRequired: false, docLabel: null, docHint: "Visit nearest Aadhaar Enrolment Centre with valid ID proof" },
];

const DYNAMIC_DOCS = {
  name: { id: "poiDoc", label: "Proof of Identity", hint: "PAN Card / Passport / Voter ID showing correct name spelling", required: true },
  address: { id: "poaDoc", label: "Proof of Address", hint: "Utility Bill / Bank Statement / Rent Agreement / Voter ID with new address", required: true },
  dob: { id: "dobDoc", label: "Proof of Date of Birth", hint: "Birth Certificate / SSC Marksheet / Passport / PAN Card", required: true },
  gender: { id: "genderDoc", label: "Gender Change Document", hint: "Affidavit on stamp paper / Court Order / Medical Certificate", required: true },
};

function getSupportingDocSlots(selectedUpdates) {
  return selectedUpdates
    .map(u => DYNAMIC_DOCS[u])
    .filter(Boolean);
}

function toDateInputValue(v) {
  if (!v) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) { const [d, m, y] = v.split("/"); return `${y}-${m}-${d}`; }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return "";
}
function toStoredValue(v) {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { const [y, m, d] = v.split("-"); return `${d}/${m}/${y}`; }
  return v;
}

export default function AadhaarUpdateDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [selectedUpdates, setSelectedUpdates] = useState([]);
  const [files, setFiles] = useState({});
  const [extractedFields, setExtractedFields] = useState({});
  const [sources, setSources] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [processing, setProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState([]);
  const [ocrError, setOcrError] = useState("");
  const [ocrMethod, setOcrMethod] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("sv_draft");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.serviceId === "aadhaar-update") {
          if (data.ocr && data.ocr.extractedFields && Object.keys(data.ocr.extractedFields).length > 0) {
            setExtractedFields(data.ocr.extractedFields);
            setSources(data.ocr.sources || {});
            setConfidence(data.ocr.confidence || {});
            setSelectedUpdates(data.updateTypes || []);
            setPhase(PHASE_CONFIRM);
          } else {
            setOcrError(prev => prev || "Could not extract details from documents. Please enter details manually.");
            setPhase(PHASE_QUESTIONS);
          }
        }
        sessionStorage.removeItem("sv_draft");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (phase === PHASE_UPLOAD) {
      setFiles({});
      setAnswers({});
    }
  }, [selectedUpdates]);

  function resetDraft() { setPhase(PHASE_UPLOAD); setSelectedUpdates([]); setFiles({}); setExtractedFields({}); setSources({}); setConfidence({}); setAnswers({}); setOcrError(""); setOcrMethod(""); setProgressSteps([]); }
  function toggleUpdate(id) { setSelectedUpdates(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function handleFile(slotId, e) { const file = e.target.files?.[0]; if (file) { setFiles(prev => ({ ...prev, [slotId]: file })); setOcrError(""); } }
  function removeFile(slotId) { setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; }); }
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function setAnswer(id, value) { setAnswers(prev => ({ ...prev, [id]: value })); }

  function getFullDraft() {
    return { ...extractedFields, ...answers };
  }

  function getReadiness() {
    const draft = getFullDraft();
    const requiredFromUpdates = [];
    if (selectedUpdates.includes("name")) requiredFromUpdates.push("correctedName");
    if (selectedUpdates.includes("address")) requiredFromUpdates.push("correctedAddress", "correctedCity", "correctedDistrict", "correctedState", "correctedPinCode");
    if (selectedUpdates.includes("dob")) requiredFromUpdates.push("correctedDob");
    if (selectedUpdates.includes("gender")) requiredFromUpdates.push("correctedGender");
    if (selectedUpdates.includes("mobile")) requiredFromUpdates.push("mobileNumber");
    if (selectedUpdates.includes("email")) requiredFromUpdates.push("emailId");
    const filled = requiredFromUpdates.filter(f => draft[f] && draft[f].trim());
    const pct = requiredFromUpdates.length > 0 ? Math.round((filled.length / requiredFromUpdates.length) * 100) : 100;
    return { pct, status: pct >= 90 ? "Ready to generate" : pct >= 60 ? "Needs review" : "Missing information", filled: filled.length, total: requiredFromUpdates.length };
  }

  async function handleExtract() {
    setProcessing(true); setOcrError(""); setExtractedFields({}); setSources({}); setConfidence({}); setPhase(PHASE_EXTRACTING); setProgressSteps(["Reading uploaded documents..."]);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const formData = new FormData();
      if (files.existingAadhaar) formData.append("existingAadhaar", files.existingAadhaar);
      selectedUpdates.forEach(u => formData.append("updateType", u));
      const res = await fetch("/api/ocr/aadhaar-update", { method: "POST", body: formData, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setProgressSteps(data.progress || ["Processing complete"]); setOcrMethod(data.ocrMethod || "unknown");
      if (data.success && data.extractedFields && Object.keys(data.extractedFields).length > 0) {
        setExtractedFields(data.extractedFields); setSources(data.sources || {}); setConfidence(data.confidence || {}); setPhase(PHASE_CONFIRM);
      } else { setOcrError(data.error || "Could not extract details."); setPhase(PHASE_QUESTIONS); }
    } catch (err) { clearTimeout(timeoutId); setOcrError(err.name === "AbortError" ? "Extraction took too long." : "Extraction unavailable. Enter details manually."); setPhase(PHASE_QUESTIONS); }
    finally { setProcessing(false); }
  }

  function copyField(v) { navigator.clipboard.writeText(v); showToast("Copied!"); }
  function copyFullDraft() {
    const d = getFullDraft();
    const lines = ["AADHAAR UPDATE / CORRECTION APPLICATION DRAFT — SevaSetu Telangana","Submit on: https://ssup.uidai.gov.in","═".repeat(55),"","── UPDATE SUMMARY ──",`Updates requested: ${selectedUpdates.join(", ")}`,"","── EXISTING AADHAAR DETAILS ──"];
    const existingLabels = { fullName: "Full Name", dateOfBirth: "Date of Birth", gender: "Gender", aadhaarNumber: "Aadhaar Number", address: "Address", city: "City / Town", district: "District", state: "State", pinCode: "PIN Code" };
    for (const [k, label] of Object.entries(existingLabels)) { if (d[k]) lines.push(`${label}: ${d[k]}`); }
    lines.push("","── UPDATED DETAILS ──");
    const updateLabels = { correctedName: "Corrected Name", correctedDob: "Corrected Date of Birth", correctedGender: "Corrected Gender", correctedAddress: "Corrected Address", correctedCity: "City / Town", correctedDistrict: "District", correctedState: "State", correctedPinCode: "PIN Code", mobileNumber: "Mobile Number", emailId: "Email ID" };
    for (const [k, label] of Object.entries(updateLabels)) { if (d[k]) lines.push(`${label}: ${d[k]}`); }
    lines.push("","── SUPPORTING DOCUMENTS ──");
    const docSlots = getSupportingDocSlots(selectedUpdates);
    for (const slot of docSlots) { const f = files[slot.id]; lines.push(`${slot.label}: ${f ? f.name : "Will be uploaded on portal"}`); }
    if (files.existingAadhaar) lines.push(`Existing Aadhaar Card: ${files.existingAadhaar.name}`);
    lines.push("","── APPLICANT DECLARATION ──","I hereby declare that all the above information is true and correct to the best of my knowledge.","I confirm that the supporting documents provided are genuine and valid.","I understand that providing false information may lead to legal action under the Aadhaar Act, 2016.","","═".repeat(55),"Disclaimer: Draft for reference only. Submit officially at ssup.uidai.gov.in","Generated by SevaSetu AI");
    navigator.clipboard.writeText(lines.join("\n")); showToast("Full draft copied!");
  }

  // ═══════ PHASE 0: UPLOAD ═══════
  if (phase === PHASE_UPLOAD) {
    const uniqueDocIds = [...new Set(getSupportingDocSlots(selectedUpdates).map(s => s.id))];
    const allRequiredUploaded = files.existingAadhaar && uniqueDocIds.every(id => files[id]);

    return (
      <div className="min-h-screen flex flex-col"><Header />
        <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
          <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1"><Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span><span className="text-gray-200">Aadhaar Update</span></nav>
          <h1 className="text-2xl font-black">Aadhaar Update / Correction Draft</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Select what you want to update, upload your existing Aadhaar and supporting documents.</p>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3"><Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" /><p className="text-xs text-green-800">Documents processed only for this draft. Not stored permanently.</p></div>

          {/* Select what to update */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-3 flex items-center gap-2"><Sparkles size={15} /> What do you want to update?</h2>
            <p className="text-xs text-gray-400 mb-3">Select all that apply — only relevant fields will be shown.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {UPDATE_TYPES.map(u => {
                const selected = selectedUpdates.includes(u.id);
                return (
                  <button key={u.id} onClick={() => toggleUpdate(u.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${selected ? "border-[#1a3a5c] bg-blue-50" : "border-gray-100 bg-white hover:border-gray-300"}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${selected ? "border-[#1a3a5c] bg-[#1a3a5c]" : "border-gray-300"}`}>
                        {selected && <Check size={10} className="text-white" />}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{u.label}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{u.desc}</p>
                        {u.docRequired && <span className="text-[9px] text-blue-600 font-semibold mt-1 inline-block">📄 Doc required</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload existing Aadhaar */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Documents</h2>
            <div className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex-1"><span className="text-sm font-medium text-gray-700">Existing Aadhaar Card</span><span className="text-red-500 text-xs ml-1">*</span><p className="text-[10px] text-gray-400">Current Aadhaar — we extract name, DOB, gender, address</p>{files.existingAadhaar && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files.existingAadhaar.name}</p>}</div>
              {files.existingAadhaar ? <button onClick={() => removeFile("existingAadhaar")} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button> : <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg"><Upload size={12} /> Choose<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile("existingAadhaar", e)} /></label>}
            </div>

            {/* Dynamic supporting docs */}
            {selectedUpdates.length > 0 && getSupportingDocSlots(selectedUpdates).map(slot => (
              <div key={slot.id} className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-1"><span className="text-sm font-medium text-gray-700">{slot.label}</span>{slot.required && <span className="text-red-500 text-xs ml-1">*</span>}<p className="text-[10px] text-gray-400">{slot.hint}</p>{files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}</div>
                {files[slot.id] ? <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button> : <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg"><Upload size={12} /> Choose<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(slot.id, e)} /></label>}
              </div>
            ))}

            {selectedUpdates.length === 0 && (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-center"><p className="text-xs text-gray-400">Select what you want to update above to see additional document upload slots.</p></div>
            )}

            {selectedUpdates.includes("biometrics") && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3"><p className="text-xs font-semibold text-amber-800">📌 Biometrics Update</p><p className="text-[10px] text-amber-700 mt-1">Photo, fingerprint, and iris updates cannot be done online. You must visit your nearest Aadhaar Enrolment / Update Centre with valid ID proof. This draft will include a guidance note for your visit.</p></div>
            )}
          </div>

          <button onClick={handleExtract} disabled={processing || !files.existingAadhaar || selectedUpdates.length === 0} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Extract Details & Generate Draft</button>
          <button onClick={() => { setSelectedUpdates(prev => prev.length > 0 ? prev : ["name","address","dob","gender","mobile","email"]); setPhase(PHASE_QUESTIONS); }} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c] underline">Skip — enter all details manually</button>
        </main><Footer />
      </div>
    );
  }

  // ═══════ PHASE 1: EXTRACTING ═══════
  if (phase === PHASE_EXTRACTING) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-8 text-white text-center"><h1 className="text-xl font-black">Extracting Details...</h1></div>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center justify-center"><Loader2 size={40} className="animate-spin text-[#1a3a5c] mb-6" /><div className="space-y-2 w-full">{progressSteps.map((s, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={14} className="text-green-500" /><span>{s}</span></div>)}</div>
        <button onClick={() => { setProcessing(false); setOcrError("Cancelled."); setPhase(PHASE_QUESTIONS); }} className="mt-8 text-xs text-gray-400 hover:text-[#1a3a5c] underline">Cancel — enter manually</button>
      </main><Footer /></div>
  );

  // ═══════ PHASE 2: CONFIRM ═══════
  if (phase === PHASE_CONFIRM) {
    const fieldLabels = { fullName: "Full Name", dateOfBirth: "Date of Birth", gender: "Gender", aadhaarNumber: "Aadhaar Number", address: "Address", city: "City / Town", district: "District", state: "State", pinCode: "PIN Code" };

    return (
      <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 2 of 4 — Verify</p><h2 className="text-lg font-black">Existing Aadhaar Details</h2></div></div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            {Object.entries(extractedFields).filter(([k]) => fieldLabels[k]).map(([key, val]) => { const conf = confidence[key] || 0; const lowConf = conf > 0 && conf < 0.7; return (
              <div key={key} className={`p-3 rounded-lg border ${lowConf ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
                <div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-gray-600 uppercase">{fieldLabels[key]}</span><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lowConf ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>{conf > 0 ? `${Math.round(conf * 100)}%` : "✓"}</span></div>
                <input type={key === "dateOfBirth" ? "date" : "text"} value={key === "dateOfBirth" ? toDateInputValue(val) : (val || "")} onChange={e => setExtractedFields(prev => ({ ...prev, [key]: key === "dateOfBirth" ? toStoredValue(e.target.value) : e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                {lowConf && <p className="text-[10px] text-yellow-700 mt-1">⚠ Low confidence — please verify.</p>}
              </div>
            ); })}
          </div>
          <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">Confirm & Enter Updated Details <ChevronRight size={14} /></button>
        </main><Footer /></div>
    );
  }

  // ═══════ PHASE 3: QUESTIONS ═══════
  if (phase === PHASE_QUESTIONS) {
    function renderUpdateFields() {
      const groups = [];

      if (selectedUpdates.includes("name")) {
        groups.push({ title: "Name Correction", fields: [{ id: "correctedName", label: "Corrected Full Name (as per PoI document)", type: "text", required: true }] });
      }
      if (selectedUpdates.includes("dob")) {
        groups.push({ title: "Date of Birth Correction", fields: [{ id: "correctedDob", label: "Corrected Date of Birth (as per valid proof)", type: "date", required: true }] });
      }
      if (selectedUpdates.includes("gender")) {
        groups.push({ title: "Gender Correction", fields: [{ id: "correctedGender", label: "Corrected Gender", type: "radio", options: ["Male", "Female", "Transgender"], required: true }] });
      }
      if (selectedUpdates.includes("address")) {
        groups.push({ title: "Address Update", fields: [
          { id: "correctedAddress", label: "New Address (House No., Street, Locality)", type: "text", required: true },
          { id: "correctedCity", label: "City / Town / Village", type: "text", required: true },
          { id: "correctedDistrict", label: "District", type: "text", required: true },
          { id: "correctedState", label: "State", type: "text", required: true },
          { id: "correctedPinCode", label: "PIN Code", type: "text", required: true },
        ]});
      }
      if (selectedUpdates.includes("mobile")) {
        groups.push({ title: "Mobile Number", fields: [{ id: "mobileNumber", label: "New Mobile Number (10 digits)", type: "text", required: true }] });
      }
      if (selectedUpdates.includes("email")) {
        groups.push({ title: "Email ID", fields: [{ id: "emailId", label: "Email Address", type: "text", required: false }] });
      }

      return groups;
    }

    const questionGroups = renderUpdateFields();

    return (
      <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 3 of 4 — Updated Details</p><h2 className="text-lg font-black">Enter Updated Details</h2></div></div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
          {/* Update summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"><p className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1"><Sparkles size={12} /> Updates requested: <strong>{selectedUpdates.join(", ")}</strong></p></div>

          {Object.keys(extractedFields).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Already extracted from Aadhaar ({Object.keys(extractedFields).length} fields)</p>
              <div className="flex flex-wrap gap-1.5">{Object.entries(extractedFields).map(([k, v]) => <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{k.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(v).substring(0, 18)}</strong></span>)}</div>
            </div>
          )}
          {ocrError && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2"><AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">{ocrError}</p></div>}

          {questionGroups.map(group => (
            <div key={group.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3>
              <div className="space-y-4">
                {group.fields.filter(f => !extractedFields[f.id]).map(q => (
                  <div key={q.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      {q.label} {q.required && <span className="text-red-500">*</span>}{answers[q.id] && <CheckCircle2 size={11} className="text-green-500" />}
                    </label>
                    {q.type === "radio" ? (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map(opt => (
                          <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
                            <input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}
                          </label>
                        ))}
                      </div>
                    ) : q.type === "date" ? (
                      <input type="date" value={toDateInputValue(answers[q.id] || "")} onChange={e => setAnswer(q.id, toStoredValue(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                    ) : (
                      <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {selectedUpdates.includes("biometrics") && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-800 mb-1">📌 Biometrics Update — Centre Visit Required</p>
              <p className="text-[10px] text-amber-700">Photo, fingerprint, and iris updates require a physical visit to an Aadhaar Enrolment / Update Centre. Bring original Aadhaar and valid ID proof. This draft will include a guidance note for your visit.</p>
            </div>
          )}

          <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">Generate Final Draft <ChevronRight size={14} /></button>
        </main><Footer /></div>
    );
  }

  // ═══════ PHASE 4: REVIEW ═══════
  const draft = getFullDraft();
  const readiness = getReadiness();
  const docSlots = getSupportingDocSlots(selectedUpdates);

  const draftSections = [
    {
      title: "Update Summary",
      fields: [{ label: "Updates Requested", id: "_updates", value: selectedUpdates.join(", ") }],
    },
    {
      title: "Existing Aadhaar Details",
      fields: [
        { label: "Full Name", id: "fullName" }, { label: "Date of Birth", id: "dateOfBirth" }, { label: "Gender", id: "gender" },
        { label: "Address", id: "address" }, { label: "City / Town", id: "city" }, { label: "District", id: "district" },
        { label: "State", id: "state" }, { label: "PIN Code", id: "pinCode" },
      ],
    },
    {
      title: "Updated Details",
      fields: [
        ...(selectedUpdates.includes("name") ? [{ label: "Corrected Name", id: "correctedName" }] : []),
        ...(selectedUpdates.includes("dob") ? [{ label: "Corrected DOB", id: "correctedDob" }] : []),
        ...(selectedUpdates.includes("gender") ? [{ label: "Corrected Gender", id: "correctedGender" }] : []),
        ...(selectedUpdates.includes("address") ? [{ label: "New Address", id: "correctedAddress" }, { label: "New City/Town", id: "correctedCity" }, { label: "New District", id: "correctedDistrict" }, { label: "New State", id: "correctedState" }, { label: "New PIN Code", id: "correctedPinCode" }] : []),
        ...(selectedUpdates.includes("mobile") ? [{ label: "New Mobile Number", id: "mobileNumber" }] : []),
        ...(selectedUpdates.includes("email") ? [{ label: "Email ID", id: "emailId" }] : []),
      ].filter(f => draft[f.id]),
    },
    {
      title: "Supporting Documents",
      fields: [
        { label: "Existing Aadhaar Card", id: "_aadhaarDoc", value: files.existingAadhaar?.name || "Will be uploaded" },
        ...docSlots.map(s => ({ label: s.label, id: `_${s.id}`, value: files[s.id]?.name || "Will be uploaded on portal" })),
      ],
    },
    {
      title: "Declaration",
      fields: [
        { label: "Declaration", id: "_declaration", value: "I hereby declare that all the above information is true and correct to the best of my knowledge. The supporting documents provided are genuine and valid. I understand that providing false information may lead to legal action under the Aadhaar Act, 2016." },
      ],
    },
  ];

  if (selectedUpdates.includes("biometrics")) {
    draftSections.push({
      title: "Biometrics Update — Guidance",
      fields: [{ label: "Action Required", id: "_biometricsNote", value: "Photo, fingerprint, and iris updates cannot be done online. Please visit your nearest Aadhaar Enrolment / Update Centre with:\n• Original Aadhaar card\n• Valid identity proof\nA list of centres is available at: https://eaadhaar.uidai.gov.in" }],
    });
  }

  return (
    <div className="min-h-screen flex flex-col print:block"><Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div><span className="text-sm font-bold text-[#1a3a5c]">Aadhaar Update Draft</span><span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${readiness.pct >= 90 ? "bg-green-100 text-green-700" : readiness.pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{readiness.status} ({readiness.pct}%)</span></div>
          <div className="flex gap-2">
            <button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw size={11} /> Start Over</button>
            <button onClick={() => setPhase(PHASE_QUESTIONS)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><Edit3 size={11} /> Edit</button>
            <button onClick={copyFullDraft} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white"><ClipboardCopy size={11} /> Copy All</button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]"><Printer size={11} /> Print / PDF</button>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800"><strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference purposes only. Final submission must be completed through the official UIDAI portal (ssup.uidai.gov.in) or your nearest Aadhaar Enrolment Centre.</div>

        {draftSections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
            <div className="p-4 space-y-1.5">
              {sec.fields.map(f => {
                const value = f.id.startsWith("_") ? f.value : draft[f.id] || "";
                if (!value) return null;
                const source = sources[f.id];
                return (
                  <div key={f.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase block">{f.label}</span>
                      <span className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{value}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {source && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{source}</span>}
                      {value && !f.id.startsWith("_declaration") && !f.id.startsWith("_biometricsNote") && (
                        <button onClick={() => copyField(value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">Readiness</span>
            <span className={`text-xs font-bold ${readiness.pct >= 90 ? "text-green-600" : "text-yellow-600"}`}>{readiness.filled}/{readiness.total} • {readiness.pct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${readiness.pct >= 90 ? "bg-green-500" : "bg-yellow-400"}`} style={{ width: `${readiness.pct}%` }} />
          </div>
          {readiness.pct < 90 && <button onClick={() => setPhase(PHASE_QUESTIONS)} className="mt-2 text-xs text-[#1a3a5c] underline">Complete missing fields →</button>}
        </div>

        <div className="text-center pt-2 print:hidden">
          <a href="https://ssup.uidai.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540]"><ExternalLink size={14} /> Open Official UIDAI Portal</a>
        </div>
      </main>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}
      <Footer /><style>{`@media print{header,footer,nav,.print\\:hidden,.no-print,.fixed.z-50{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy, Edit3, ExternalLink, Loader2, Lock, Plus, Printer, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0, PHASE_EXTRACTING = 1, PHASE_CONFIRM = 2, PHASE_QUESTIONS = 3, PHASE_REVIEW = 4;

const UPLOAD_SLOTS = [
  { id: "headAadhaar", label: "Head of Family Aadhaar Card", hint: "Aadhaar of the head of the family — name, DOB, gender, address", required: true },
  { id: "addressProof", label: "Address Proof", hint: "Electricity Bill / Property Tax Receipt / Bank Passbook / Rent Agreement", required: true },
  { id: "identityProof", label: "Identity Proof of Head of Family", hint: "Voter ID / PAN / Passport / Driving Licence", required: true },
  { id: "photo", label: "Passport-size Photograph", hint: "Recent colour photo of head of family, white background", required: true },
  { id: "existingCard", label: "Existing Ration Card (if applicable)", hint: "Current card for correction or member addition", required: false },
  { id: "incomeProof", label: "Income Proof (if applicable)", hint: "Salary slip / IT Return / BPL Certificate / Self-declaration", required: false },
  { id: "familyAadhaar", label: "Aadhaar of Other Family Members (if applicable)", hint: "Aadhaar of spouse, children, and dependents", required: false },
  { id: "lpgDoc", label: "LPG Connection Document (if applicable)", hint: "LPG consumer number / distributor proof", required: false },
];

const CATEGORY_OPTIONS = [
  { id: "phh", label: "PHH (Priority Household)" },
  { id: "aay", label: "AAY (Antyodaya Anna Yojana)" },
  { id: "nonPriority", label: "Non-Priority / Above Poverty Line" },
];

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

export default function RationCardDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedFields, setExtractedFields] = useState({});
  const [sources, setSources] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
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
        if (data.serviceId === "ration-card") {
          if (data.ocr && data.ocr.extractedFields && Object.keys(data.ocr.extractedFields).length > 0) {
            setExtractedFields(data.ocr.extractedFields);
            setSources(data.ocr.sources || {});
            setConfidence(data.ocr.confidence || {});
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

  function resetDraft() { setPhase(PHASE_UPLOAD); setFiles({}); setExtractedFields({}); setSources({}); setConfidence({}); setAnswers({}); setFamilyMembers([]); setOcrError(""); setOcrMethod(""); setProgressSteps([]); }
  function handleFile(slotId, e) { const file = e.target.files?.[0]; if (file) { setFiles(prev => ({ ...prev, [slotId]: file })); setOcrError(""); } }
  function removeFile(slotId) { setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; }); }
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function setAnswer(id, value) { setAnswers(prev => ({ ...prev, [id]: value })); }

  function addFamilyMember() { setFamilyMembers(prev => [...prev, { name: "", dob: "", gender: "", relation: "", aadhaar: "" }]); }
  function updateFamilyMember(idx, field, value) { setFamilyMembers(prev => { const n = [...prev]; n[idx] = { ...n[idx], [field]: value }; return n; }); }
  function removeFamilyMember(idx) { setFamilyMembers(prev => prev.filter((_, i) => i !== idx)); }

  function getFullDraft() {
    return { ...extractedFields, ...answers, familyMembers };
  }

  function getReadiness() {
    const draft = getFullDraft();
    const required = ["headName", "headDob", "headGender", "headMobile", "category", "address", "city", "district", "state", "pinCode"];
    const filled = required.filter(f => draft[f] && draft[f].trim());
    const pct = Math.round((filled.length / required.length) * 100);
    return { pct, status: pct >= 90 ? "Ready to generate" : pct >= 60 ? "Needs review" : "Missing information", filled: filled.length, total: required.length };
  }

  async function handleExtract() {
    setProcessing(true); setOcrError(""); setExtractedFields({}); setSources({}); setConfidence({}); setPhase(PHASE_EXTRACTING); setProgressSteps(["Reading uploaded documents..."]);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const formData = new FormData();
      if (files.headAadhaar) formData.append("headAadhaar", files.headAadhaar);
      const res = await fetch("/api/ocr/ration-card", { method: "POST", body: formData, signal: controller.signal });
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
    const lines = ["RATION CARD APPLICATION DRAFT - SevaSetu Telangana","Submit on: https://meeseva.telangana.gov.in","=".repeat(55),"","-- HEAD OF FAMILY --",`Name: ${d.headName || ""}`,`Date of Birth: ${d.headDob || ""}`,`Gender: ${d.headGender || ""}`,`Mobile: ${d.headMobile || ""}`,`Email: ${d.headEmail || ""}`,"","-- FAMILY MEMBERS --"];
    if (d.familyMembers && d.familyMembers.length > 0) { d.familyMembers.forEach((m, i) => { lines.push(`  ${i+1}. ${m.name || "-"} | DOB: ${m.dob || "-"} | Gender: ${m.gender || "-"} | Relation: ${m.relation || "-"} | Aadhaar: ${m.aadhaar || "-"}`); }); }
    else { lines.push("  (No additional members listed)"); }
    lines.push("","-- CATEGORY --",`Category: ${d.category || ""}`);
    lines.push("","-- LPG CONNECTION --",`Consumer Number: ${d.lpgConsumerNo || "N/A"}`,`Distributor: ${d.lpgDistributor || "N/A"}`);
    lines.push("","-- ADDRESS --",`${d.address || ""}`,`${d.city || ""}, ${d.district || ""}, ${d.state || ""} - ${d.pinCode || ""}`);
    lines.push("","-- SUPPORTING DOCUMENTS --","- Head of Family Aadhaar Card","- Address Proof","- Identity Proof of Head of Family","- Passport-size Photograph");
    if (files.existingCard) lines.push("- Existing Ration Card: " + files.existingCard.name);
    if (files.incomeProof) lines.push("- Income Proof: " + files.incomeProof.name);
    if (files.lpgDoc) lines.push("- LPG Connection Document: " + files.lpgDoc.name);
    lines.push("","-- DECLARATION --","I hereby declare that all information provided is true and correct.","I confirm that all family members listed are eligible for inclusion in the ration card.","I understand that providing false information may lead to cancellation of benefits.","","=".repeat(55),"Disclaimer: Draft for reference only. Submit officially at meeseva.telangana.gov.in","Generated by SevaSetu AI");
    navigator.clipboard.writeText(lines.join("\n")); showToast("Full draft copied!");
  }

  // ═══════ PHASE 0: UPLOAD ═══════
  if (phase === PHASE_UPLOAD) {
    const requiredSlots = UPLOAD_SLOTS.filter(s => s.required);
    const optionalSlots = UPLOAD_SLOTS.filter(s => !s.required);
    const allRequiredUploaded = requiredSlots.every(s => files[s.id]);
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
          <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1"><Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span><span className="text-gray-200">Ration Card</span></nav>
          <h1 className="text-2xl font-black">Ration Card Application Draft</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload required documents. We extract details and ask only what is missing.</p>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3"><Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" /><p className="text-xs text-green-800">Documents processed only for this draft. Not stored permanently.</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Required Documents</h2>
            {requiredSlots.map(slot => (
              <div key={slot.id} className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-1"><span className="text-sm font-medium text-gray-700">{slot.label}</span><span className="text-red-500 text-xs ml-1">*</span><p className="text-[10px] text-gray-400">{slot.hint}</p>{files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}</div>
                {files[slot.id] ? <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button> : <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg"><Upload size={12} /> Choose<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(slot.id, e)} /></label>}
              </div>
            ))}
          </div>
          <details className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm open:shadow-md transition-shadow">
            <summary className="text-sm font-semibold text-gray-600 cursor-pointer">Optional Documents ({optionalSlots.length})</summary>
            <div className="mt-4 space-y-2">
              {optionalSlots.map(slot => (
                <div key={slot.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex-1"><span className="text-sm font-medium text-gray-700">{slot.label}</span><p className="text-[10px] text-gray-400">{slot.hint}</p>{files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}</div>
                  {files[slot.id] ? <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button> : <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg"><Upload size={12} /> Choose<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(slot.id, e)} /></label>}
                </div>
              ))}
            </div>
          </details>
          <button onClick={handleExtract} disabled={processing || !allRequiredUploaded} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Extract Details & Generate Draft</button>
          <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c] underline">Skip — enter all details manually</button>
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
      <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 2 of 4 — Verify</p><h2 className="text-lg font-black">Extracted Details from Aadhaar</h2></div></div>
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
          <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">Confirm & Fill Remaining <ChevronRight size={14} /></button>
        </main><Footer /></div>
    );
  }

  // ═══════ PHASE 3: QUESTIONS ═══════
  if (phase === PHASE_QUESTIONS) {
    const mapFields = {
      headName: extractedFields.fullName || "",
      headDob: extractedFields.dateOfBirth || "",
      headGender: extractedFields.gender || "",
      headAddress: extractedFields.address || "",
      headCity: extractedFields.city || "",
      headDistrict: extractedFields.district || "",
      headState: extractedFields.state || "",
      headPinCode: extractedFields.pinCode || "",
    };

    return (
      <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 3 of 4 — Complete Missing Info</p><h2 className="text-lg font-black">Fill Remaining Details</h2></div></div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
          {Object.keys(extractedFields).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Already extracted ({Object.keys(extractedFields).length} fields)</p>
              <div className="flex flex-wrap gap-1.5">{Object.entries(extractedFields).map(([k, v]) => <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{k.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(v).substring(0, 18)}</strong></span>)}</div>
            </div>
          )}
          {ocrError && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2"><AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">{ocrError}</p></div>}

          {/* Head of Family */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Head of Family Details</h3>
            <div className="space-y-4">
              {[{ id: "headName", label: "Full Name", type: "text", prefill: mapFields.headName, required: true },
                { id: "headDob", label: "Date of Birth", type: "date", prefill: mapFields.headDob, required: true },
                { id: "headGender", label: "Gender", type: "radio", options: ["Male", "Female", "Transgender"], prefill: mapFields.headGender, required: true },
                { id: "headMobile", label: "Mobile Number", type: "text", prefill: "", required: true },
                { id: "headEmail", label: "Email ID", type: "text", prefill: "", required: false },
              ].filter(q => !(q.id === "headName" && mapFields.headName) && !(q.id === "headDob" && mapFields.headDob) && !(q.id === "headGender" && mapFields.headGender)).map(q => {
                const initialVal = q.prefill || answers[q.id] || "";
                return (
                  <div key={q.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      {q.label} {q.required && <span className="text-red-500">*</span>}{answers[q.id] && <CheckCircle2 size={11} className="text-green-500" />}
                    </label>
                    {q.type === "radio" ? (
                      <div className="flex flex-wrap gap-2">{q.options.map(opt => (
                        <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
                          <input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}
                        </label>
                      ))}</div>
                    ) : q.type === "date" ? (
                      <input type="date" value={toDateInputValue(initialVal)} onChange={e => setAnswer(q.id, toStoredValue(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                    ) : (
                      <input type="text" value={initialVal} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Category <span className="text-red-500">*</span></h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {CATEGORY_OPTIONS.map(cat => (
                <button key={cat.id} onClick={() => setAnswer("category", cat.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${answers.category === cat.id ? "border-[#1a3a5c] bg-blue-50" : "border-gray-100 bg-white hover:border-gray-300"}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${answers.category === cat.id ? "border-[#1a3a5c] bg-[#1a3a5c]" : "border-gray-300"}`}>
                      {answers.category === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Family Members */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1a3a5c]">Family Members</h3>
              <button onClick={addFamilyMember} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white transition-colors"><Plus size={12} /> Add Member</button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Add all family members to be included in the ration card. Head of Family is already included.</p>
            {familyMembers.length === 0 && <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-center"><p className="text-xs text-gray-400">No additional members added yet. Click "Add Member" to include family members.</p></div>}
            {familyMembers.map((member, idx) => (
              <div key={idx} className="p-4 mb-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-600">Member {idx + 1}</span><button onClick={() => removeFamilyMember(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="text-[10px] font-semibold text-gray-500">Full Name *</label><input type="text" value={member.name} onChange={e => updateFamilyMember(idx, "name", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" /></div>
                  <div><label className="text-[10px] font-semibold text-gray-500">Date of Birth *</label><input type="date" value={toDateInputValue(member.dob)} onChange={e => updateFamilyMember(idx, "dob", toStoredValue(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" /></div>
                  <div><label className="text-[10px] font-semibold text-gray-500">Gender *</label><select value={member.gender} onChange={e => updateFamilyMember(idx, "gender", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Transgender">Transgender</option></select></div>
                  <div><label className="text-[10px] font-semibold text-gray-500">Relation with Head *</label><select value={member.relation} onChange={e => updateFamilyMember(idx, "relation", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]"><option value="">Select</option><option value="Self">Self (Head)</option><option value="Spouse">Spouse</option><option value="Son">Son</option><option value="Daughter">Daughter</option><option value="Mother">Mother</option><option value="Father">Father</option><option value="Sister">Sister</option><option value="Brother">Brother</option><option value="Daughter-in-law">Daughter-in-law</option><option value="Grandson">Grandson</option><option value="Granddaughter">Granddaughter</option><option value="Other">Other Dependent</option></select></div>
                  <div className="sm:col-span-2"><label className="text-[10px] font-semibold text-gray-500">Aadhaar Number (optional)</label><input type="text" value={member.aadhaar} onChange={e => updateFamilyMember(idx, "aadhaar", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder="XXXX XXXX XXXX" /></div>
                </div>
              </div>
            ))}
          </div>

          {/* LPG Connection (optional) */}
          <details className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm open:shadow-md transition-shadow">
            <summary className="text-sm font-semibold text-gray-600 cursor-pointer">LPG Connection Details (optional)</summary>
            <div className="mt-4 space-y-4">
              <div><label className="text-xs font-semibold text-gray-700 mb-1 block">LPG Consumer Number</label><input type="text" value={answers.lpgConsumerNo || ""} onChange={e => setAnswer("lpgConsumerNo", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" /></div>
              <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Distributor Name</label><input type="text" value={answers.lpgDistributor || ""} onChange={e => setAnswer("lpgDistributor", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" /></div>
            </div>
          </details>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Address</h3>
            <div className="space-y-4">
              {[{ id: "address", label: "House No., Street, Locality", type: "text", prefill: mapFields.headAddress, required: true },
                { id: "city", label: "City / Town / Village", type: "text", prefill: mapFields.headCity, required: true },
                { id: "district", label: "District", type: "text", prefill: mapFields.headDistrict, required: true },
                { id: "state", label: "State", type: "text", prefill: mapFields.headState, required: true },
                { id: "pinCode", label: "PIN Code", type: "text", prefill: mapFields.headPinCode, required: true },
              ].filter(q => !(q.prefill && answers[q.id] === undefined)).map(q => {
                const initialVal = answers[q.id] !== undefined ? answers[q.id] : (q.prefill || "");
                return (
                  <div key={q.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      {q.label} {q.required && <span className="text-red-500">*</span>}{(initialVal || answers[q.id]) && <CheckCircle2 size={11} className="text-green-500" />}
                    </label>
                    <input type="text" value={initialVal} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">Generate Final Draft <ChevronRight size={14} /></button>
        </main><Footer /></div>
    );
  }

  // ═══════ PHASE 4: REVIEW ═══════
  const draft = getFullDraft();
  const readiness = getReadiness();

  const draftSections = [
    {
      title: "Head of Family",
      fields: [
        { label: "Name", id: "headName" }, { label: "Date of Birth", id: "headDob" }, { label: "Gender", id: "headGender" },
        { label: "Mobile", id: "headMobile" }, { label: "Email", id: "headEmail" },
      ],
    },
    {
      title: "Category",
      fields: [
        { label: "Ration Card Category", id: "category" },
      ],
    },
    {
      title: "Family Members",
      fields: [
        { label: "Members", id: "_familyList" },
      ],
    },
    {
      title: "LPG Connection",
      fields: [
        { label: "Consumer Number", id: "lpgConsumerNo" }, { label: "Distributor", id: "lpgDistributor" },
      ],
    },
    {
      title: "Address",
      fields: [
        { label: "Address", id: "address" }, { label: "City / Town", id: "city" }, { label: "District", id: "district" },
        { label: "State", id: "state" }, { label: "PIN Code", id: "pinCode" },
      ],
    },
    {
      title: "Declaration",
      fields: [
        { label: "Declaration", id: "_declaration", value: "I hereby declare that all information provided is true and correct. I confirm that all family members listed are eligible for inclusion in the ration card. I understand that providing false information may lead to cancellation of benefits." },
      ],
    },
  ];

  // Compute family list string for display
  const familyListStr = familyMembers.length > 0
    ? familyMembers.map((m, i) => `${i + 1}. ${m.name || "—"} (${m.relation || "—"}, ${m.gender || "—"})`).join("\n")
    : "No additional members";

  const categoryLabels = { phh: "PHH (Priority Household)", aay: "AAY (Antyodaya Anna Yojana)", nonPriority: "Non-Priority / Above Poverty Line" };

  return (
    <div className="min-h-screen flex flex-col print:block"><Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div><span className="text-sm font-bold text-[#1a3a5c]">Ration Card Draft</span><span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${readiness.pct >= 90 ? "bg-green-100 text-green-700" : readiness.pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{readiness.status} ({readiness.pct}%)</span></div>
          <div className="flex gap-2">
            <button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw size={11} /> Start Over</button>
            <button onClick={() => setPhase(PHASE_QUESTIONS)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><Edit3 size={11} /> Edit</button>
            <button onClick={copyFullDraft} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white"><ClipboardCopy size={11} /> Copy All</button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]"><Printer size={11} /> Print / PDF</button>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800"><strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference purposes only. Final submission must be completed through the official MeeSeva portal (meeseva.telangana.gov.in) or your nearest MeeSeva centre.</div>

        {draftSections.map(sec => {
          if (sec.title === "Category") {
            const catVal = categoryLabels[draft.category] || draft.category || "";
            if (!catVal) return null;
            return (
              <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0"><span className="text-[10px] text-gray-400 uppercase block">Ration Card Category</span><span className="text-sm font-medium text-gray-800">{catVal}</span></div>
                    <button onClick={() => copyField(catVal)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button>
                  </div>
                </div>
              </div>
            );
          }

          if (sec.title === "Family Members") {
            if (familyMembers.length === 0) return null;
            return (
              <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
                <div className="p-4 space-y-1.5">
                  {familyMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0"><span className="text-[10px] text-gray-400 uppercase block">Member {i + 1}</span><span className="text-sm font-medium text-gray-800">{m.name || "—"} ({m.relation || "—"}, {m.gender || "—"}) {m.dob && `| DOB: ${m.dob}`}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const hasAny = sec.fields.some(f => {
            if (f.id.startsWith("_")) return f.value;
            return draft[f.id];
          });
          if (!hasAny) return null;

          return (
            <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
              <div className="p-4 space-y-1.5">
                {sec.fields.map(f => {
                  const value = f.id.startsWith("_") ? f.value : draft[f.id] || "";
                  if (!value) return null;
                  const source = sources[f.id];
                  return (
                    <div key={f.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0"><span className="text-[10px] text-gray-400 uppercase block">{f.label}</span><span className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{value}</span></div>
                      <div className="flex items-center gap-1 ml-2">
                        {source && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{source}</span>}
                        {value && !f.id.startsWith("_declaration") && <button onClick={() => copyField(value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-600">Readiness</span><span className={`text-xs font-bold ${readiness.pct >= 90 ? "text-green-600" : "text-yellow-600"}`}>{readiness.filled}/{readiness.total} • {readiness.pct}%</span></div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${readiness.pct >= 90 ? "bg-green-500" : "bg-yellow-400"}`} style={{ width: `${readiness.pct}%` }} /></div>
          {readiness.pct < 90 && <button onClick={() => setPhase(PHASE_QUESTIONS)} className="mt-2 text-xs text-[#1a3a5c] underline">Complete missing fields →</button>}
        </div>

        <div className="text-center pt-2 print:hidden">
          <a href="https://meeseva.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540]"><ExternalLink size={14} /> Open Official MeeSeva Portal</a>
        </div>
      </main>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}
      <Footer /><style>{`@media print{header,footer,nav,.print\\:hidden,.no-print,.fixed.z-50{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

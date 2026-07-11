"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy, Edit3, ExternalLink, Loader2, Lock, Printer, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0, PHASE_EXTRACTING = 1, PHASE_CONFIRM = 2, PHASE_QUESTIONS = 3, PHASE_REVIEW = 4;

const UPLOAD_SLOTS = [
  { id: "hospitalRecord", label: "Hospital Birth Record / Discharge Summary", hint: "Original hospital record with child's birth details", required: true },
  { id: "parentAadhaar", label: "Mother's Aadhaar Card", hint: "For mother's identity and address verification", required: true },
  { id: "fatherAadhaar", label: "Father's Aadhaar Card", hint: "For father's identity verification", required: true },
  { id: "marriageCert", label: "Parents' Marriage Certificate (if available)", hint: "For verifying parents' relationship", required: false },
];

const QUESTION_GROUPS = [
  { title: "Child Details", id: "child", fields: [
    { id: "childName", label: "Child's Full Name", type: "text", required: true },
    { id: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { id: "timeOfBirth", label: "Time of Birth", type: "text", required: false },
    { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"], required: true },
    { id: "placeOfBirth", label: "Place of Birth (Hospital/Home)", type: "text", required: true },
    { id: "religion", label: "Religion", type: "text", required: false },
    { id: "nationality", label: "Nationality", type: "text", required: true },
  ]},
  { title: "Father's Details", id: "father", fields: [
    { id: "fatherName", label: "Father's Full Name", type: "text", required: true },
    { id: "fatherAge", label: "Father's Age at Birth of Child", type: "text", required: false },
    { id: "fatherEducation", label: "Father's Education", type: "select", options: ["Illiterate","Below Primary","Primary","Middle","Secondary","Higher Secondary","Graduate","Post Graduate","Professional"], required: false },
    { id: "fatherOccupation", label: "Father's Occupation", type: "text", required: false },
    { id: "fatherAadhaarNum", label: "Father's Aadhaar Number", type: "text", required: false },
  ]},
  { title: "Mother's Details", id: "mother", fields: [
    { id: "motherName", label: "Mother's Full Name", type: "text", required: true },
    { id: "motherAge", label: "Mother's Age at Birth of Child", type: "text", required: false },
    { id: "motherEducation", label: "Mother's Education", type: "select", options: ["Illiterate","Below Primary","Primary","Middle","Secondary","Higher Secondary","Graduate","Post Graduate","Professional"], required: false },
    { id: "motherOccupation", label: "Mother's Occupation", type: "text", required: false },
  ]},
  { title: "Address & Contact", id: "address", fields: [
    { id: "permanentAddress", label: "Permanent Address", type: "text", required: true },
    { id: "city", label: "City / Town / Village", type: "text", required: true },
    { id: "district", label: "District", type: "text", required: true },
    { id: "state", label: "State", type: "text", required: true },
    { id: "pinCode", label: "PIN Code", type: "text", required: true },
    { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
    { id: "emailId", label: "Email ID", type: "text", required: false },
  ]},
  { title: "Informant Details", id: "informant", fields: [
    { id: "informantName", label: "Informant Name", type: "text", required: true },
    { id: "informantRelation", label: "Relation with Child", type: "select", options: ["Father","Mother","Relative","Hospital Authority","Other"], required: true },
    { id: "informantAddress", label: "Informant Address", type: "text", required: false },
  ]},
];

export default function BirthCertificateDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
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
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("sv_draft");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.serviceId === "birth-certificate") {
          if (data.error) setOcrError(data.error);
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

  function resetDraft() { setPhase(PHASE_UPLOAD); setFiles({}); setExtractedFields({}); setSources({}); setConfidence({}); setAnswers({}); setOcrError(""); setOcrMethod(""); setProgressSteps([]); setEditingField(null); }
  function handleFile(slotId, e) { const file = e.target.files?.[0]; if (file) { setFiles(prev => ({ ...prev, [slotId]: file })); setOcrError(""); } }
  function removeFile(slotId) { setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; }); }
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
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
  function setAnswer(id, value) { setAnswers(prev => ({ ...prev, [id]: value })); }
  function getFullDraft() { return { ...extractedFields, ...answers, nationality: answers.nationality || extractedFields.nationality || "Indian" }; }

  function getReadiness() {
    const draft = getFullDraft();
    const required = ["childName","dateOfBirth","gender","placeOfBirth","fatherName","motherName","permanentAddress","pinCode","district","state","mobileNumber","informantName","informantRelation"];
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
      if (files.hospitalRecord) formData.append("hospitalRecord", files.hospitalRecord);
      if (files.parentAadhaar) formData.append("parentAadhaar", files.parentAadhaar);
      if (files.fatherAadhaar) formData.append("fatherAadhaar", files.fatherAadhaar);
      if (files.marriageCert) formData.append("marriageCert", files.marriageCert);
      const res = await fetch("/api/ocr/birth-certificate", { method: "POST", body: formData, signal: controller.signal });
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
    const lines = ["BIRTH CERTIFICATE APPLICATION DRAFT — SevaSetu Telangana","Submit on: https://crsorgi.gov.in","═".repeat(55),"","── CHILD DETAILS ──",`Name: ${d.childName||""}`,`DOB: ${d.dateOfBirth||""}`,`Time: ${d.timeOfBirth||""}`,`Gender: ${d.gender||""}`,`Place of Birth: ${d.placeOfBirth||""}`,`Religion: ${d.religion||""}`,`Nationality: ${d.nationality||"Indian"}`,"","── FATHER ──",`Name: ${d.fatherName||""}`,`Education: ${d.fatherEducation||""}`,`Occupation: ${d.fatherOccupation||""}`,"","── MOTHER ──",`Name: ${d.motherName||""}`,`Education: ${d.motherEducation||""}`,`Occupation: ${d.motherOccupation||""}`,"","── ADDRESS ──",`${d.permanentAddress||""}`,`${d.city||""}, ${d.district||""}, ${d.state||""} - ${d.pinCode||""}`,`Mobile: ${d.mobileNumber||""}`,`Email: ${d.emailId||""}`,"","── INFORMANT ──",`Name: ${d.informantName||""}`,`Relation: ${d.informantRelation||""}`,"","═".repeat(55),"Disclaimer: Draft for reference only. Submit officially at crsorgi.gov.in","Generated by SevaSetu AI"];
    navigator.clipboard.writeText(lines.join("\n")); showToast("Full draft copied!");
  }

  // ═══════ PHASE 0: UPLOAD ═══════
  if (phase === PHASE_UPLOAD) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
        <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1"><Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span><span className="text-gray-200">Birth Certificate</span></nav>
        <h1 className="text-2xl font-black">Birth Certificate Application Draft</h1>
        <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload documents. We extract details and ask only what is missing.</p>
      </div>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3"><Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" /><p className="text-xs text-green-800">Documents processed only for this draft. Not stored permanently.</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Documents</h2>
          {UPLOAD_SLOTS.map(slot => (
            <div key={slot.id} className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex-1"><span className="text-sm font-medium text-gray-700">{slot.label}</span>{slot.required && <span className="text-red-500 text-xs ml-1">*</span>}<p className="text-[10px] text-gray-400">{slot.hint}</p>{files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}</div>
              {files[slot.id] ? <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button> : <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg"><Upload size={12} /> Choose<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(slot.id, e)} /></label>}
            </div>
          ))}
        </div>
        <button onClick={handleExtract} disabled={processing || (!files.hospitalRecord && !files.parentAadhaar && !files.fatherAadhaar)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Extract Details & Generate Draft</button>
        <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c] underline">Skip — enter all details manually</button>
      </main><Footer />
    </div>
  );

  // ═══════ PHASE 1: EXTRACTING ═══════
  if (phase === PHASE_EXTRACTING) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-8 text-white text-center"><h1 className="text-xl font-black">Extracting Details...</h1></div>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center justify-center"><Loader2 size={40} className="animate-spin text-[#1a3a5c] mb-6" /><div className="space-y-2 w-full">{progressSteps.map((s, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={14} className="text-green-500" /><span>{s}</span></div>)}</div>
        <button onClick={() => { setProcessing(false); setOcrError("Cancelled."); setPhase(PHASE_QUESTIONS); }} className="mt-8 text-xs text-gray-400 hover:text-[#1a3a5c] underline">Cancel — enter manually</button>
      </main><Footer /></div>
  );

  // ═══════ PHASE 2: CONFIRM ═══════
  if (phase === PHASE_CONFIRM) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 2 of 4 — Verify</p><h2 className="text-lg font-black">Extracted Details</h2></div></div>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">{Object.entries(extractedFields).map(([key, val]) => { const conf = confidence[key] || 0; const lowConf = conf > 0 && conf < 0.7; return (<div key={key} className={`p-3 rounded-lg border ${lowConf ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-gray-600 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</span><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lowConf ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>{conf > 0 ? `${Math.round(conf * 100)}%` : "✓"}</span></div><input type={key === "dateOfBirth" ? "date" : "text"} value={key === "dateOfBirth" ? toDateInputValue(val) : (val || "")} onChange={e => setExtractedFields(prev => ({ ...prev, [key]: key === "dateOfBirth" ? toStoredValue(e.target.value) : e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />{lowConf && <p className="text-[10px] text-yellow-700 mt-1">⚠ Low confidence — please verify.</p>}</div>); })}</div>
        <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">Confirm & Fill Remaining <ChevronRight size={14} /></button>
      </main><Footer /></div>
  );

  // ═══════ PHASE 3: QUESTIONS ═══════
  if (phase === PHASE_QUESTIONS) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 3 of 4 — Complete Missing Info</p><h2 className="text-lg font-black">Fill Remaining Details</h2></div></div>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {Object.keys(extractedFields).length > 0 && <div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Already extracted ({Object.keys(extractedFields).length} fields)</p><div className="flex flex-wrap gap-1.5">{Object.entries(extractedFields).map(([k, v]) => <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{k.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(v).substring(0, 18)}</strong></span>)}</div></div>}
        {ocrError && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2"><AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">{ocrError}</p></div>}
        {QUESTION_GROUPS.map(group => {
          const hasAny = group.fields.some(f => !extractedFields[f.id]);
          if (!hasAny) return null;
          return (<div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3><div className="space-y-4">{group.fields.filter(f => !extractedFields[f.id]).map(q => (<div key={q.id}><label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">{q.label} {q.required && <span className="text-red-500">*</span>}{answers[q.id] && <CheckCircle2 size={11} className="text-green-500" />}</label>
            {q.type === "radio" ? <div className="flex flex-wrap gap-2">{q.options.map(opt => <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}><input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}</label>)}</div>
            : q.type === "select" ? <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]"><option value="">Select...</option>{q.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
            : q.type === "date" ? <input type="date" value={toDateInputValue(answers[q.id] || "")} onChange={e => setAnswer(q.id, toStoredValue(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
: <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />}
          </div>))}</div></div>);
        })}
        <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">Generate Final Draft <ChevronRight size={14} /></button>
      </main><Footer /></div>
  );

  // ═══════ PHASE 4: REVIEW ═══════
  const draft = getFullDraft(); const readiness = getReadiness();
  const draftSections = [
    { title: "Child Details", fields: [{ label: "Child Name", id: "childName" },{ label: "Date of Birth", id: "dateOfBirth" },{ label: "Time of Birth", id: "timeOfBirth" },{ label: "Gender", id: "gender" },{ label: "Place of Birth", id: "placeOfBirth" },{ label: "Religion", id: "religion" },{ label: "Nationality", id: "nationality" }] },
    { title: "Father's Details", fields: [{ label: "Name", id: "fatherName" },{ label: "Age at Birth", id: "fatherAge" },{ label: "Education", id: "fatherEducation" },{ label: "Occupation", id: "fatherOccupation" }] },
    { title: "Mother's Details", fields: [{ label: "Name", id: "motherName" },{ label: "Age at Birth", id: "motherAge" },{ label: "Education", id: "motherEducation" },{ label: "Occupation", id: "motherOccupation" }] },
    { title: "Address & Contact", fields: [{ label: "Permanent Address", id: "permanentAddress" },{ label: "City/Town", id: "city" },{ label: "District", id: "district" },{ label: "State", id: "state" },{ label: "PIN Code", id: "pinCode" },{ label: "Mobile", id: "mobileNumber" },{ label: "Email", id: "emailId" }] },
    { title: "Informant", fields: [{ label: "Name", id: "informantName" },{ label: "Relation", id: "informantRelation" },{ label: "Address", id: "informantAddress" }] },
  ];

  return (
    <div className="min-h-screen flex flex-col print:block"><Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10"><div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2"><div><span className="text-sm font-bold text-[#1a3a5c]">Birth Certificate Draft</span><span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${readiness.pct >= 90 ? "bg-green-100 text-green-700" : readiness.pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{readiness.status} ({readiness.pct}%)</span></div>
        <div className="flex gap-2"><button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw size={11} /> Start Over</button><button onClick={() => setPhase(PHASE_QUESTIONS)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><Edit3 size={11} /> Edit</button><button onClick={copyFullDraft} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white"><ClipboardCopy size={11} /> Copy All</button><button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]"><Printer size={11} /> Print / PDF</button></div></div></div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800"><strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference purposes only. Final submission must be completed through the official CRS portal (crsorgi.gov.in) or GHMC/Municipal office.</div>
        {draftSections.map(sec => (<div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div><div className="p-4 space-y-1.5">{sec.fields.map(f => { const value = draft[f.id] || ""; const source = sources[f.id]; if (!value) return null; return (<div key={f.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"><div className="flex-1 min-w-0"><span className="text-[10px] text-gray-400 uppercase block">{f.label}</span><span className="text-sm font-medium text-gray-800">{value}</span></div><div className="flex items-center gap-1 ml-2">{source && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{source}</span>}{value && <button onClick={() => copyField(value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button>}</div></div>); })}</div></div>))}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-600">Readiness</span><span className={`text-xs font-bold ${readiness.pct >= 90 ? "text-green-600" : "text-yellow-600"}`}>{readiness.filled}/{readiness.total} • {readiness.pct}%</span></div><div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${readiness.pct >= 90 ? "bg-green-500" : "bg-yellow-400"}`} style={{ width: `${readiness.pct}%` }} /></div>{readiness.pct < 90 && <button onClick={() => setPhase(PHASE_QUESTIONS)} className="mt-2 text-xs text-[#1a3a5c] underline">Complete missing fields →</button>}</div>
        <div className="text-center pt-2 print:hidden"><a href="https://crsorgi.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540]"><ExternalLink size={14} /> Open Official CRS Portal</a></div>
      </main>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}
      <Footer /><style>{`@media print{header,footer,nav,.print\\:hidden,.no-print,.fixed.z-50{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

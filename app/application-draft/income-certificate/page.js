"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy, Edit3, ExternalLink, Loader2, Lock, Printer, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0, PHASE_EXTRACTING = 1, PHASE_CONFIRM = 2, PHASE_QUESTIONS = 3, PHASE_REVIEW = 4;

const UPLOAD_SLOTS = [
  { id: "aadhaar", label: "Aadhaar Card", hint: "Identity and address verification — primary document", required: true },
  { id: "incomeProof", label: "Income Proof", hint: "Salary slip / Form 16 / IT Return / Self-declaration on stamp paper", required: true },
  { id: "rationCard", label: "Ration Card (White / Pink)", hint: "Mandatory for MeeSeva — proves economic status", required: true },
  { id: "photo", label: "Passport Size Photograph", hint: "Recent photograph of applicant", required: false },
  { id: "pan", label: "PAN Card (optional)", hint: "For income cross-verification", required: false },
];

const QUESTION_GROUPS = [
  { title: "Applicant Details", id: "applicant", fields: [
    { id: "applicantName", label: "Full Name (as on Aadhaar)", type: "text", required: true },
    { id: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Transgender"], required: true },
    { id: "fatherName", label: "Father's / Husband's Name", type: "text", required: true },
    { id: "aadhaarNumber", label: "Aadhaar Number", type: "text", required: true },
    { id: "panNumber", label: "PAN Number (if available)", type: "text", required: false },
    { id: "mobileNumber", label: "Mobile Number (linked to Aadhaar)", type: "text", required: true },
    { id: "emailId", label: "Email ID", type: "text", required: false },
    { id: "occupation", label: "Occupation", type: "select", options: ["Salaried (Government)","Salaried (Private)","Self-employed","Agriculture","Daily Wage Worker","Business","Unemployed","Homemaker","Student","Other"], required: true },
    { id: "caste", label: "Caste Category", type: "select", options: ["General (OC)","OBC","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST","EWS"], required: false },
  ]},
  { title: "Income Details", id: "income", fields: [
    { id: "annualIncome", label: "Annual Family Income (₹)", type: "text", required: true },
    { id: "incomeSource", label: "Source of Income", type: "select", options: ["Salary","Agriculture","Business","Daily Wages","Pension","Multiple Sources","Other"], required: true },
    { id: "financialYear", label: "Financial Year", type: "text", required: true },
    { id: "employerName", label: "Employer / Organisation Name (if salaried)", type: "text", required: false },
    { id: "rationCardNumber", label: "Ration Card Number", type: "text", required: true },
    { id: "familyMembers", label: "Number of Family Members", type: "text", required: false },
  ]},
  { title: "Address Details", id: "address", fields: [
    { id: "address", label: "Full Address", type: "text", required: true },
    { id: "city", label: "City / Town / Village / Mandal", type: "text", required: true },
    { id: "district", label: "District", type: "text", required: true },
    { id: "state", label: "State", type: "text", required: true },
    { id: "pinCode", label: "PIN Code", type: "text", required: true },
  ]},
  { title: "Purpose of Certificate", id: "purpose", fields: [
    { id: "purposeOfCertificate", label: "Purpose / Why is this certificate needed?", type: "select", options: ["Scholarship / Fee Reimbursement","Government Job Application","Bank Loan / Subsidy","Reservation Benefits","EWS Quota","Welfare Scheme","Legal / Court Proceedings","Other"], required: true },
    { id: "institutionName", label: "Institution / Organisation Name (if applicable)", type: "text", required: false },
  ]},
];

export default function IncomeCertificateDraftPage() {
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
  const [photoPreview, setPhotoPreview] = useState(null);

  function resetDraft() { setPhase(PHASE_UPLOAD); setFiles({}); setExtractedFields({}); setSources({}); setConfidence({}); setAnswers({}); setOcrError(""); setOcrMethod(""); setProgressSteps([]); setEditingField(null); setPhotoPreview(null); }
  function handleFile(slotId, e) { const file = e.target.files?.[0]; if (file) { setFiles(prev => ({ ...prev, [slotId]: file })); if (slotId === "photo") setPhotoPreview(URL.createObjectURL(file)); setOcrError(""); } }
  function removeFile(slotId) { setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; }); if (slotId === "photo") setPhotoPreview(null); }
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function setAnswer(id, value) { setAnswers(prev => ({ ...prev, [id]: value })); }
  function getFullDraft() { return { ...extractedFields, ...answers, state: answers.state || extractedFields.state || "Telangana" }; }

  function getReadiness() {
    const d = getFullDraft();
    const req = ["applicantName","dateOfBirth","gender","fatherName","aadhaarNumber","mobileNumber","occupation","annualIncome","incomeSource","financialYear","rationCardNumber","address","city","district","state","pinCode","purposeOfCertificate"];
    const filled = req.filter(f => d[f] && String(d[f]).trim());
    const pct = Math.round((filled.length / req.length) * 100);
    return { pct, status: pct >= 90 ? "Ready to generate" : pct >= 60 ? "Needs review" : "Missing information", filled: filled.length, total: req.length };
  }

  async function handleExtract() {
    setProcessing(true); setOcrError(""); setExtractedFields({}); setSources({}); setConfidence({}); setPhase(PHASE_EXTRACTING); setProgressSteps(["Reading uploaded documents..."]);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const formData = new FormData();
      if (files.aadhaar) formData.append("aadhaar", files.aadhaar);
      if (files.incomeProof) formData.append("incomeProof", files.incomeProof);
      if (files.rationCard) formData.append("rationCard", files.rationCard);
      if (files.pan) formData.append("pan", files.pan);
      const res = await fetch("/api/ocr/income-certificate", { method: "POST", body: formData, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setProgressSteps(data.progress || ["Processing complete"]); setOcrMethod(data.ocrMethod || "");
      if (data.success && Object.keys(data.extractedFields || {}).length > 0) {
        setExtractedFields(data.extractedFields); setSources(data.sources || {}); setConfidence(data.confidence || {}); setPhase(PHASE_CONFIRM);
      } else { setOcrError(data.error || "Could not extract details."); setPhase(PHASE_QUESTIONS); }
    } catch (err) { clearTimeout(timeoutId); setOcrError(err.name === "AbortError" ? "Extraction took too long." : "Extraction unavailable."); setPhase(PHASE_QUESTIONS); }
    finally { setProcessing(false); }
  }

  function copyField(v) { navigator.clipboard.writeText(v); showToast("Copied!"); }
  function copyFullDraft() {
    const d = getFullDraft();
    const lines = ["INCOME CERTIFICATE APPLICATION DRAFT — SevaSetu Telangana","Submit via: https://meeseva.telangana.gov.in","═".repeat(55),"","── APPLICANT ──",`Name: ${d.applicantName||""}`,`DOB: ${d.dateOfBirth||""}`,`Gender: ${d.gender||""}`,`Father/Husband: ${d.fatherName||""}`,`Aadhaar: ${d.aadhaarNumber||""}`,`PAN: ${d.panNumber||""}`,`Mobile: ${d.mobileNumber||""}`,`Occupation: ${d.occupation||""}`,`Caste: ${d.caste||""}`,"","── INCOME DETAILS ──",`Annual Income: ₹${d.annualIncome||""}`,`Income Source: ${d.incomeSource||""}`,`Financial Year: ${d.financialYear||""}`,`Employer: ${d.employerName||""}`,`Ration Card No: ${d.rationCardNumber||""}`,`Family Members: ${d.familyMembers||""}`,"","── ADDRESS ──",`${d.address||""}`,`${d.city||""}, ${d.district||""}, ${d.state||""} - ${d.pinCode||""}`,"","── PURPOSE ──",`Purpose: ${d.purposeOfCertificate||""}`,`Institution: ${d.institutionName||""}`,"","═".repeat(55),"Disclaimer: Draft for reference only. Submit at meeseva.telangana.gov.in","Generated by SevaSetu AI"];
    navigator.clipboard.writeText(lines.join("\n")); showToast("Copied!");
  }

  // PHASE 0: UPLOAD
  if (phase === PHASE_UPLOAD) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
        <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1"><Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span><span className="text-gray-200">Income Certificate</span></nav>
        <h1 className="text-2xl font-black">Income Certificate Application Draft</h1>
        <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload documents. We extract details and ask only what's missing.</p>
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
        <button onClick={handleExtract} disabled={processing || !files.aadhaar} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"><Sparkles size={16} /> Extract Details & Generate Draft</button>
        <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c] underline">Skip — enter all details manually</button>
      </main><Footer /></div>
  );

  // PHASE 1: EXTRACTING
  if (phase === PHASE_EXTRACTING) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-8 text-white text-center"><h1 className="text-xl font-black">Extracting Details...</h1></div>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center justify-center"><Loader2 size={40} className="animate-spin text-[#1a3a5c] mb-6" /><div className="space-y-2 w-full">{progressSteps.map((s, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={14} className="text-green-500" /><span>{s}</span></div>)}</div><button onClick={() => { setProcessing(false); setOcrError("Cancelled."); setPhase(PHASE_QUESTIONS); }} className="mt-8 text-xs text-gray-400 hover:text-[#1a3a5c] underline">Cancel — enter manually</button></main><Footer /></div>
  );

  // PHASE 2: CONFIRM
  if (phase === PHASE_CONFIRM) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 2 of 4 — Verify Extracted Data</p><h2 className="text-lg font-black">Details Extracted</h2><p className="text-gray-300 text-xs mt-0.5">OCR method: <span className="font-mono text-green-300">{ocrMethod}</span></p></div></div>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">{Object.entries(extractedFields).map(([key, val]) => { const conf = confidence[key] || 0; const low = conf > 0 && conf < 0.7; return (<div key={key} className={`p-3 rounded-lg border ${low ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-gray-600 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</span><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${low ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>{conf > 0 ? `${Math.round(conf * 100)}%` : "✓"}</span></div><input type="text" value={val || ""} onChange={e => setExtractedFields(prev => ({ ...prev, [key]: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />{low && <p className="text-[10px] text-yellow-700 mt-1">⚠ Low confidence — please verify.</p>}</div>); })}</div>
        <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">Confirm & Fill Remaining <ChevronRight size={14} /></button>
      </main><Footer /></div>
  );

  // PHASE 3: QUESTIONS
  if (phase === PHASE_QUESTIONS) return (
    <div className="min-h-screen flex flex-col"><Header /><div className="bg-[#1a3a5c] px-4 py-5 text-white"><div className="max-w-2xl mx-auto"><p className="text-xs text-gray-400 mb-1">Step 3 of 4 — Complete Missing Info</p><h2 className="text-lg font-black">Fill Remaining Details</h2></div></div>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {Object.keys(extractedFields).length > 0 && <div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-xs font-bold text-green-800 mb-1.5 flex items-center gap-1"><CheckCircle2 size={12} /> Already extracted ({Object.keys(extractedFields).length} fields)</p><div className="flex flex-wrap gap-1.5">{Object.entries(extractedFields).map(([k, v]) => <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{k.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(v).substring(0, 18)}</strong></span>)}</div></div>}
        {ocrError && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2"><AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">{ocrError}</p></div>}
        {QUESTION_GROUPS.map(group => {
          const hasAny = group.fields.some(f => !extractedFields[f.id]);
          if (!hasAny) return null;
          return (<div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3><div className="space-y-4">{group.fields.filter(f => !extractedFields[f.id]).map(q => (<div key={q.id}><label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">{q.label}{q.required && <span className="text-red-500">*</span>}{answers[q.id] && <CheckCircle2 size={11} className="text-green-500" />}</label>
            {q.type === "radio" ? <div className="flex flex-wrap gap-2">{q.options.map(opt => <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}><input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}</label>)}</div>
            : q.type === "select" ? <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]"><option value="">Select...</option>{q.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
            : q.type === "date" ? <input type="date" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
            : <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />}
          </div>))}</div></div>);
        })}
        <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">Generate Draft <ChevronRight size={14} /></button>
      </main><Footer /></div>
  );

  // PHASE 4: REVIEW
  const draft = getFullDraft(); const readiness = getReadiness();
  const draftSections = [
    { title: "Applicant Details", fields: [{ label: "Full Name", id: "applicantName" },{ label: "Date of Birth", id: "dateOfBirth" },{ label: "Gender", id: "gender" },{ label: "Father/Husband Name", id: "fatherName" },{ label: "Aadhaar Number", id: "aadhaarNumber" },{ label: "PAN Number", id: "panNumber" },{ label: "Mobile", id: "mobileNumber" },{ label: "Email", id: "emailId" },{ label: "Occupation", id: "occupation" },{ label: "Caste Category", id: "caste" }] },
    { title: "Income Details", fields: [{ label: "Annual Income (₹)", id: "annualIncome" },{ label: "Source of Income", id: "incomeSource" },{ label: "Financial Year", id: "financialYear" },{ label: "Employer Name", id: "employerName" },{ label: "Ration Card Number", id: "rationCardNumber" },{ label: "Family Members", id: "familyMembers" }] },
    { title: "Address", fields: [{ label: "Address", id: "address" },{ label: "City/Mandal", id: "city" },{ label: "District", id: "district" },{ label: "State", id: "state" },{ label: "PIN Code", id: "pinCode" }] },
    { title: "Purpose", fields: [{ label: "Purpose", id: "purposeOfCertificate" },{ label: "Institution", id: "institutionName" }] },
  ];
  return (
    <div className="min-h-screen flex flex-col print:block"><Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10"><div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2"><div><span className="text-sm font-bold text-[#1a3a5c]">Income Certificate Draft</span><span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${readiness.pct >= 90 ? "bg-green-100 text-green-700" : readiness.pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{readiness.status} ({readiness.pct}%)</span></div><div className="flex gap-2"><button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw size={11} /> Start Over</button><button onClick={() => setPhase(PHASE_QUESTIONS)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><Edit3 size={11} /> Edit</button><button onClick={copyFullDraft} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white"><ClipboardCopy size={11} /> Copy All</button><button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]"><Printer size={11} /> Print / PDF</button></div></div></div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800"><strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference only. Final submission must be completed through meeseva.telangana.gov.in or your nearest MeeSeva centre.</div>
        {photoPreview && <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"><img src={photoPreview} alt="Applicant photo" className="w-16 h-20 object-cover rounded border-2 border-gray-300" /><div><p className="text-xs font-bold text-gray-700">Applicant Photograph</p></div></div>}
        {draftSections.map(sec => (<div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div><div className="p-4 space-y-1.5">{sec.fields.map(f => { const value = draft[f.id] || ""; const src = sources[f.id]; if (!value) return null; return (<div key={f.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"><div className="flex-1 min-w-0"><span className="text-[10px] text-gray-400 uppercase block">{f.label}</span>{editingField === f.id ? <input type="text" autoFocus value={draft[f.id] || ""} onBlur={() => setEditingField(null)} onChange={e => { if (extractedFields[f.id] !== undefined) setExtractedFields(p => ({ ...p, [f.id]: e.target.value })); else setAnswers(p => ({ ...p, [f.id]: e.target.value })); }} className="w-full border border-blue-300 rounded px-2 py-1 text-sm outline-none" /> : <span className="text-sm font-medium text-gray-800">{value}</span>}</div><div className="flex items-center gap-1 ml-2">{src && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hidden sm:inline">Auto Filled</span>}{value && <><button onClick={() => setEditingField(f.id)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><Edit3 size={10} /></button><button onClick={() => copyField(value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button></>}</div></div>); })}</div></div>))}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-600">Readiness</span><span className={`text-xs font-bold ${readiness.pct >= 90 ? "text-green-600" : "text-yellow-600"}`}>{readiness.filled}/{readiness.total} • {readiness.pct}%</span></div><div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${readiness.pct >= 90 ? "bg-green-500" : "bg-yellow-400"}`} style={{ width: `${readiness.pct}%` }} /></div>{readiness.pct < 90 && <button onClick={() => setPhase(PHASE_QUESTIONS)} className="mt-2 text-xs text-[#1a3a5c] underline">Complete missing fields →</button>}</div>
        <div className="text-center pt-2 print:hidden"><a href="https://meeseva.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540]"><ExternalLink size={14} /> Open MeeSeva Portal</a></div>
      </main>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}
      <Footer /><style>{`@media print{header,footer,nav,.print\\:hidden{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

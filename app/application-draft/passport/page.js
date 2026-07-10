"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0;
const PHASE_CONFIRM = 1;
const PHASE_QUESTIONS = 2;
const PHASE_REVIEW = 3;

const MISSING_QUESTIONS = [
  { id: "applyingFor", label: "Applying for", type: "radio", options: ["Fresh Passport", "Re-issue of Passport"], required: true },
  { id: "applicationType", label: "Type of Application", type: "radio", options: ["Normal", "Tatkaal"], required: true },
  { id: "bookletType", label: "Booklet Type", type: "radio", options: ["36 Pages", "60 Pages"], required: true },
  { id: "placeOfBirth", label: "Place of Birth (City/Town)", type: "text", required: true },
  { id: "fatherName", label: "Father's Name", type: "text", required: true },
  { id: "motherName", label: "Mother's Name", type: "text", required: true },
  { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single/Unmarried", "Married", "Divorced", "Widow/Widower"], required: true },
  { id: "educationalQualification", label: "Educational Qualification", type: "select", options: ["Below Matriculate", "Matriculate", "Senior Secondary", "Graduate and Above"], required: true },
  { id: "employmentType", label: "Employment Type", type: "select", options: ["Student", "Private", "Government", "Self Employed", "Homemaker", "Not Employed", "Retired"], required: true },
  { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
  { id: "emailId", label: "Email Address", type: "text", required: true },
  { id: "emergencyContact", label: "Emergency Contact Name", type: "text", required: true },
  { id: "emergencyPhone", label: "Emergency Contact Phone", type: "text", required: true },
  { id: "heldPassportBefore", label: "Have you held a passport before?", type: "radio", options: ["Yes", "No"], required: true },
];

const LEGAL_QUESTIONS = [
  "Criminal proceedings pending against you",
  "Arrest warrant or summons issued",
  "Convicted by court in last 5 years",
  "Passport ever refused, impounded, or revoked",
  "Applied for political asylum in any country",
  "Deported or repatriated from any country",
];

export default function PassportDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [legalAnyYes, setLegalAnyYes] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [toast, setToast] = useState("");

  // ── Reset everything for a new draft ──
  function resetDraft() {
    setPhase(PHASE_UPLOAD);
    setFiles({});
    setExtractedData({});
    setConfidence({});
    setAnswers({});
    setLegalAnyYes(false);
    setOcrError("");
  }

  // ── File handlers ──
  function handleFile(slotId, e) {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [slotId]: file }));
      setOcrError("");
    }
  }
  function removeFile(slotId) {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
  }

  // ── Run OCR on uploaded Aadhaar ──
  async function handleExtract() {
    setProcessing(true);
    setOcrError("");
    setExtractedData({});
    setConfidence({});

    try {
      if (files.aadhaar) {
        const formData = new FormData();
        formData.append("file", files.aadhaar);
        formData.append("documentType", "aadhaar");

        const res = await fetch("/api/ocr/passport", { method: "POST", body: formData });
        const data = await res.json();

        if (data.success && Object.keys(data.extractedFields).length > 0) {
          setExtractedData(data.extractedFields);
          setConfidence(data.confidence || {});
          setPhase(PHASE_CONFIRM);
        } else {
          setOcrError(data.error || "Could not extract details from the uploaded document. Please upload a clearer image or enter details manually.");
          setPhase(PHASE_QUESTIONS); // Skip to manual entry
        }
      } else {
        // No Aadhaar uploaded — go straight to manual entry
        setPhase(PHASE_QUESTIONS);
      }
    } catch {
      setOcrError("OCR processing failed. Please enter details manually.");
      setPhase(PHASE_QUESTIONS);
    } finally {
      setProcessing(false);
    }
  }

  function confirmExtracted() {
    setPhase(PHASE_QUESTIONS);
  }

  function setAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function getFullDraft() {
    return {
      ...extractedData,
      ...answers,
      legalDeclaration: legalAnyYes ? "Yes — details required on official portal" : "No — none apply",
    };
  }

  function copyAll() {
    const draft = getFullDraft();
    const lines = [
      "PASSPORT APPLICATION DRAFT — SevaSetu Telangana",
      "This is a reference draft only. Submit on: https://www.passportindia.gov.in",
      "═".repeat(50),
      "",
      "── APPLICANT DETAILS ──",
      `Name: ${draft.fullName || draft.givenName || ""} ${draft.surname || ""}`.trim(),
      `Date of Birth: ${draft.dateOfBirth || draft.yearOfBirth || ""}`,
      `Gender: ${draft.gender || ""}`,
      `Place of Birth: ${draft.placeOfBirth || ""}`,
      `Marital Status: ${draft.maritalStatus || ""}`,
      `Education: ${draft.educationalQualification || ""}`,
      `Employment: ${draft.employmentType || ""}`,
      `Aadhaar: ${draft.aadhaarNumber || ""}`,
      "",
      "── FAMILY ──",
      `Father: ${draft.fatherName || ""}`,
      `Mother: ${draft.motherName || ""}`,
      "",
      "── ADDRESS ──",
      `${draft.address || ""}`,
      `PIN: ${draft.pinCode || ""}`,
      `Mobile: ${draft.mobileNumber || ""}`,
      `Email: ${draft.emailId || ""}`,
      "",
      "── PASSPORT TYPE ──",
      `Applying For: ${draft.applyingFor || ""}`,
      `Type: ${draft.applicationType || ""}`,
      `Booklet: ${draft.bookletType || ""}`,
      `Previous Passport: ${draft.heldPassportBefore || ""}`,
      "",
      "── EMERGENCY CONTACT ──",
      `Name: ${draft.emergencyContact || ""}`,
      `Phone: ${draft.emergencyPhone || ""}`,
      "",
      "── LEGAL DECLARATION ──",
      `${draft.legalDeclaration}`,
      "",
      "═".repeat(50),
      "Generated by SevaSetu AI • Not for official submission",
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Full draft copied!");
  }

  // ════════════════════════ PHASE 1: UPLOAD ════════════════════════
  if (phase === PHASE_UPLOAD) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
          <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span>
            <span className="text-gray-200">Passport</span>
          </nav>
          <h1 className="text-2xl font-black">Passport Application Draft</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload your documents. We will extract details and ask only what is missing.</p>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">Your documents are processed only to generate this draft and are not permanently stored. OCR runs locally via Tesseract.js.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Your Documents</h2>
            {[
              { id: "aadhaar", label: "Aadhaar Card (front or both sides)", required: true },
              { id: "photo", label: "Passport Photo", required: false },
            ].map(slot => (
              <div key={slot.id} className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{slot.label}</span>
                  {slot.required && <span className="text-[9px] text-red-500 font-bold ml-1">Required for OCR</span>}
                  {files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}
                </div>
                {files[slot.id] ? (
                  <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                ) : (
                  <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B]">
                    <Upload size={12} /> Choose file
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={e => handleFile(slot.id, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>

          {ocrError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={13} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{ocrError}</p>
            </div>
          )}

          <button onClick={handleExtract} disabled={processing} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
            {processing ? <><Loader2 size={16} className="animate-spin" /> Extracting details...</> : <><Sparkles size={16} /> Extract Details & Continue</>}
          </button>

          <button onClick={() => setPhase(PHASE_QUESTIONS)} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c]">
            Skip OCR — enter all details manually
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 2: CONFIRM EXTRACTED ════════════════════════
  if (phase === PHASE_CONFIRM) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-5 text-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-1">Step 2 — Verify Extracted Data</p>
            <h2 className="text-lg font-black">Please Confirm Extracted Details</h2>
            <p className="text-gray-300 text-xs mt-0.5">These were extracted from your uploaded Aadhaar. Edit if incorrect.</p>
          </div>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            {Object.entries(extractedData).map(([key, val]) => {
              const conf = confidence[key] || 0;
              const lowConf = conf > 0 && conf < 0.7;
              return (
                <div key={key} className={`p-3 rounded-lg border ${lowConf ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lowConf ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
                      {conf > 0 ? `${Math.round(conf * 100)}% confidence` : "Extracted"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={extractedData[key] || ""}
                    onChange={e => setExtractedData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]"
                  />
                  {lowConf && <p className="text-[10px] text-yellow-700 mt-1">⚠ Low confidence — please verify this field.</p>}
                </div>
              );
            })}
          </div>
          <button onClick={confirmExtracted} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            Confirm & Continue <ChevronRight size={14} />
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 3: MISSING QUESTIONS ════════════════════════
  if (phase === PHASE_QUESTIONS) {
    const alreadyFilled = Object.keys(extractedData);
    const missingQs = MISSING_QUESTIONS.filter(q => !alreadyFilled.includes(q.id) && !answers[q.id]);

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-5 text-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-1">Step 3 — Complete Missing Information</p>
            <h2 className="text-lg font-black">Fill Remaining Details</h2>
          </div>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
          {Object.keys(extractedData).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Extracted from your document:</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(extractedData).map(([k, v]) => (
                  <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{k}: <strong>{String(v).substring(0, 20)}</strong></span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            {missingQs.map(q => (
              <div key={q.id}>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">{q.label} {q.required && <span className="text-red-500">*</span>}</label>
                {q.type === "radio" ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
                        <input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}
                      </label>
                    ))}
                  </div>
                ) : q.type === "select" ? (
                  <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]">
                    <option value="">Select...</option>
                    {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />
                )}
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">Legal Declaration</h3>
            <p className="text-xs text-gray-500 mb-3">Do any of the following apply to you?</p>
            <ul className="space-y-1 bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
              {LEGAL_QUESTIONS.map((q, i) => <li key={i} className="text-xs text-gray-600">• {q}</li>)}
            </ul>
            <div className="flex gap-3">
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer ${!legalAnyYes ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-500"}`}>
                <input type="radio" className="hidden" checked={!legalAnyYes} onChange={() => setLegalAnyYes(false)} />No — None apply
              </label>
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer ${legalAnyYes ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-500"}`}>
                <input type="radio" className="hidden" checked={legalAnyYes} onChange={() => setLegalAnyYes(true)} />Yes — One or more apply
              </label>
            </div>
          </div>

          <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
            Generate Final Draft <ChevronRight size={14} />
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 4: REVIEW ════════════════════════
  const draft = getFullDraft();
  const sections = [
    { title: "Applicant Details", fields: [
      { label: "Name", value: draft.fullName || "" },
      { label: "Date of Birth", value: draft.dateOfBirth || draft.yearOfBirth || "" },
      { label: "Gender", value: draft.gender || "" },
      { label: "Place of Birth", value: draft.placeOfBirth || "" },
      { label: "Marital Status", value: draft.maritalStatus || "" },
      { label: "Education", value: draft.educationalQualification || "" },
      { label: "Employment", value: draft.employmentType || "" },
      { label: "Aadhaar", value: draft.aadhaarNumber || "" },
    ]},
    { title: "Family", fields: [{ label: "Father", value: draft.fatherName || "" }, { label: "Mother", value: draft.motherName || "" }] },
    { title: "Address", fields: [{ label: "Address", value: draft.address || "" }, { label: "PIN Code", value: draft.pinCode || "" }, { label: "Mobile", value: draft.mobileNumber || "" }, { label: "Email", value: draft.emailId || "" }] },
    { title: "Passport Type", fields: [{ label: "Applying For", value: draft.applyingFor || "" }, { label: "Type", value: draft.applicationType || "" }, { label: "Booklet", value: draft.bookletType || "" }, { label: "Previous Passport", value: draft.heldPassportBefore || "" }] },
    { title: "Emergency Contact", fields: [{ label: "Name", value: draft.emergencyContact || "" }, { label: "Phone", value: draft.emergencyPhone || "" }] },
    { title: "Legal", fields: [{ label: "Declaration", value: draft.legalDeclaration }] },
  ];

  return (
    <div className="min-h-screen flex flex-col print:block">
      <Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-[#1a3a5c]">Passport Draft — Review</span>
          <div className="flex gap-2">
            <button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw size={11} /> Start Over</button>
            <button onClick={copyAll} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white"><ClipboardCopy size={11} /> Copy All</button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]"><Download size={11} /> Print / PDF</button>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 print:border-black">
          <strong>Disclaimer:</strong> This is a SevaSetu application draft for reference only. Final submission must be done on the official Passport Seva portal.
        </div>
        {sections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
            <div className="p-4 space-y-2">
              {sec.fields.map(f => (
                <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">{f.label}</span>
                    <span className={`text-sm font-medium ${f.value ? "text-gray-800" : "text-red-400"}`}>{f.value || "Not provided"}</span>
                  </div>
                  {f.value && <button onClick={() => { navigator.clipboard.writeText(f.value); showToast("Copied!"); }} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={11} /></button>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center pt-2 print:hidden">
          <a href="https://www.passportindia.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3a5c] hover:text-[#C89A2B]">
            <ExternalLink size={14} /> Open Official Passport Seva Portal
          </a>
        </div>
      </main>
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}
      <Footer />
      <style>{`@media print{header,footer,nav,.print\\:hidden{display:none!important}}`}</style>
    </div>
  );
}

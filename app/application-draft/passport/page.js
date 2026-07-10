"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// ── Phases ──
const PHASE_UPLOAD = 0;
const PHASE_QUESTIONS = 1;
const PHASE_REVIEW = 2;

// ── Mock OCR results (simulates Aadhaar + PAN extraction) ──
function mockOcrExtract(uploadedDocs) {
  const result = {};
  const sources = {};

  if (uploadedDocs.aadhaar) {
    Object.assign(result, {
      givenName: "Rishika",
      surname: "Kamani",
      dateOfBirth: "08/08/2005",
      gender: "Female",
      houseStreet: "12-34, Example Colony, Kompally",
      city: "Hyderabad",
      district: "Medchal-Malkajgiri",
      state: "Telangana",
      pinCode: "500014",
      aadhaarNumber: "XXXX XXXX 1234",
      fatherName: "Ramesh Kamani",
      motherName: "Sunitha Kamani",
    });
    Object.keys(result).forEach(k => sources[k] = "Aadhaar");
  }

  if (uploadedDocs.pan) {
    result.panNumber = "ABCDE1234F";
    sources.panNumber = "PAN Card";
    if (!result.givenName) { result.givenName = "RISHIKA"; sources.givenName = "PAN Card"; }
  }

  return { extracted: result, sources };
}

// ── Missing questions config ──
const MISSING_QUESTIONS = [
  { id: "applyingFor", label: "Applying for", type: "radio", options: ["Fresh Passport", "Re-issue of Passport"], required: true },
  { id: "applicationType", label: "Type of Application", type: "radio", options: ["Normal", "Tatkaal"], required: true },
  { id: "bookletType", label: "Booklet Type", type: "radio", options: ["36 Pages", "60 Pages"], required: true },
  { id: "placeOfBirth", label: "Place of Birth (City/Town)", type: "text", required: true },
  { id: "policeStation", label: "Nearest Police Station", type: "text", required: true },
  { id: "educationalQualification", label: "Educational Qualification", type: "select", options: ["Below Matriculate", "Matriculate", "Senior Secondary", "Graduate and Above"], required: true },
  { id: "employmentType", label: "Employment Type", type: "select", options: ["Student", "Private", "Government", "Self Employed", "Homemaker", "Not Employed", "Retired"], required: true },
  { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single/Unmarried", "Married", "Divorced", "Widow/Widower"], required: true },
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
  "Returned to India on Emergency Certificate",
  "Deported or repatriated from any country",
];

export default function PassportDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const [extractedSources, setExtractedSources] = useState({});
  const [answers, setAnswers] = useState({});
  const [legalAnyYes, setLegalAnyYes] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState("");
  const fileRefs = useRef({});

  const DOC_SLOTS = [
    { id: "aadhaar", label: "Aadhaar Card", required: true },
    { id: "pan", label: "PAN Card", required: false },
    { id: "address", label: "Address Proof", required: false },
    { id: "photo", label: "Passport Photo", required: true },
  ];

  // ── Upload handlers ──
  function handleFile(slotId, e) {
    const file = e.target.files?.[0];
    if (file) setFiles(prev => ({ ...prev, [slotId]: file }));
  }
  function removeFile(slotId) {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
  }

  // ── Extract (mock OCR) ──
  async function handleExtract() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const { extracted, sources } = mockOcrExtract(files);
    setExtractedData(extracted);
    setExtractedSources(sources);
    setGenerating(false);
    setPhase(PHASE_QUESTIONS);
  }

  // ── Answers ──
  function setAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  // ── Full draft data ──
  function getFullDraft() {
    return { ...extractedData, ...answers, legalDeclaration: legalAnyYes ? "Yes — details required" : "No — none apply" };
  }

  // ── Completion score ──
  function getCompletion() {
    const draft = getFullDraft();
    const requiredKeys = ["givenName", "surname", "dateOfBirth", "gender", "houseStreet", "city", "state", "pinCode", "applyingFor", "applicationType", "bookletType", "placeOfBirth", "mobileNumber", "emailId", "emergencyContact", "emergencyPhone", "educationalQualification", "employmentType", "maritalStatus"];
    const filled = requiredKeys.filter(k => draft[k]).length;
    return Math.round((filled / requiredKeys.length) * 100);
  }

  // ── Copy ──
  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function copyField(val) { if (val) { navigator.clipboard.writeText(val); showToast("Copied!"); } }
  function copyAll() {
    const draft = getFullDraft();
    const lines = [
      "PASSPORT APPLICATION DRAFT — SevaSetu Telangana",
      "═══════════════════════════════════════════════",
      "This is a reference draft. Submit on: https://www.passportindia.gov.in",
      "",
      "── APPLICANT DETAILS ──",
      `Name: ${draft.givenName || ""} ${draft.surname || ""}`,
      `Date of Birth: ${draft.dateOfBirth || ""}`,
      `Gender: ${draft.gender || ""}`,
      `Place of Birth: ${draft.placeOfBirth || ""}`,
      `Marital Status: ${draft.maritalStatus || ""}`,
      `Education: ${draft.educationalQualification || ""}`,
      `Employment: ${draft.employmentType || ""}`,
      `Aadhaar: ${draft.aadhaarNumber || ""}`,
      `PAN: ${draft.panNumber || ""}`,
      "",
      "── FAMILY ──",
      `Father: ${draft.fatherName || ""}`,
      `Mother: ${draft.motherName || ""}`,
      "",
      "── ADDRESS ──",
      `${draft.houseStreet || ""}`,
      `${draft.city || ""}, ${draft.district || ""}, ${draft.state || ""} — ${draft.pinCode || ""}`,
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
      `Any applicable: ${draft.legalDeclaration}`,
      "",
      "═══════════════════════════════════════════════",
      "Generated by SevaSetu AI • Not for official submission",
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Full draft copied!");
  }

  // ─────────────────── PHASE 1: UPLOAD ───────────────────
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
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload your documents. We'll extract details and ask only what's missing.</p>
        </div>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          {/* Privacy */}
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">Files are used only to prepare your draft and are never stored. Demo OCR is used for this MVP — production will use secure OCR/DigiLocker with consent.</p>
          </div>

          {/* Upload cards */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Your Documents</h2>
            <div className="space-y-3">
              {DOC_SLOTS.map(slot => (
                <div key={slot.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-700">{slot.label}</span>
                      {slot.required && <span className="text-[9px] text-red-500 font-bold">Required</span>}
                    </div>
                    {files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}
                  </div>
                  {files[slot.id] ? (
                    <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                  ) : (
                    <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] transition-colors">
                      <Upload size={12} /> Choose file
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={e => handleFile(slot.id, e)} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Extract button */}
          <button
            onClick={handleExtract}
            disabled={generating || (!files.aadhaar && !files.pan)}
            className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            {generating ? <><Loader2 size={16} className="animate-spin" /> Extracting details...</> : <><Sparkles size={16} /> Extract Details & Continue</>}
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ─────────────────── PHASE 2: MISSING QUESTIONS ───────────────────
  if (phase === PHASE_QUESTIONS) {
    // Filter out questions whose answer is already extracted
    const missingQs = MISSING_QUESTIONS.filter(q => !extractedData[q.id]);

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-5 text-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-1">Step 2 of 3</p>
            <h2 className="text-lg font-black">Answer a Few Questions</h2>
            <p className="text-gray-300 text-xs mt-0.5">We extracted {Object.keys(extractedData).length} fields from your documents. Just fill what's missing below.</p>
          </div>
        </div>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
          {/* Extracted summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-bold text-green-800 mb-2 flex items-center gap-1.5"><CheckCircle2 size={13} /> Extracted from your documents:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(extractedData).map(([key, val]) => (
                <span key={key} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">{key.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(val).substring(0, 20)}</strong></span>
              ))}
            </div>
          </div>

          {/* Missing questions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1a3a5c] flex items-center gap-1.5"><FileText size={14} /> Please answer these:</h3>

            {missingQs.map(q => (
              <div key={q.id}>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  {q.label} {q.required && <span className="text-red-500">*</span>}
                </label>
                {q.type === "radio" ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
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

          {/* Legal declarations — grouped */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">Legal Declaration</h3>
            <p className="text-xs text-gray-500 mb-3">Do any of the following apply to you?</p>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
              <ul className="space-y-1">
                {LEGAL_QUESTIONS.map((q, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-300 mt-0.5">•</span>{q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3">
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-all ${!legalAnyYes ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"}`}>
                <input type="radio" className="hidden" checked={!legalAnyYes} onChange={() => setLegalAnyYes(false)} />
                No — None apply to me
              </label>
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-all ${legalAnyYes ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-500 hover:border-red-300"}`}>
                <input type="radio" className="hidden" checked={legalAnyYes} onChange={() => setLegalAnyYes(true)} />
                Yes — One or more apply
              </label>
            </div>
            {legalAnyYes && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                You must declare specific details on the official Passport Seva portal. Note this in your draft and prepare supporting documents.
              </p>
            )}
          </div>

          {/* Continue */}
          <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
            Generate Final Draft <ChevronRight size={15} />
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ─────────────────── PHASE 3: REVIEW & DOWNLOAD ───────────────────
  const draft = getFullDraft();
  const completion = getCompletion();

  const sections = [
    { title: "Applicant Details", fields: [
      { label: "Full Name", value: `${draft.givenName || ""} ${draft.surname || ""}`, source: extractedSources.givenName },
      { label: "Date of Birth", value: draft.dateOfBirth, source: extractedSources.dateOfBirth },
      { label: "Gender", value: draft.gender, source: extractedSources.gender },
      { label: "Place of Birth", value: draft.placeOfBirth, source: null },
      { label: "Marital Status", value: draft.maritalStatus, source: null },
      { label: "Education", value: draft.educationalQualification, source: null },
      { label: "Employment", value: draft.employmentType, source: null },
      { label: "Aadhaar", value: draft.aadhaarNumber, source: extractedSources.aadhaarNumber },
      { label: "PAN", value: draft.panNumber, source: extractedSources.panNumber },
    ]},
    { title: "Family Details", fields: [
      { label: "Father's Name", value: draft.fatherName, source: extractedSources.fatherName },
      { label: "Mother's Name", value: draft.motherName, source: extractedSources.motherName },
    ]},
    { title: "Address", fields: [
      { label: "Address", value: draft.houseStreet, source: extractedSources.houseStreet },
      { label: "City", value: draft.city, source: extractedSources.city },
      { label: "District", value: draft.district, source: extractedSources.district },
      { label: "State", value: draft.state, source: extractedSources.state },
      { label: "PIN Code", value: draft.pinCode, source: extractedSources.pinCode },
      { label: "Police Station", value: draft.policeStation, source: null },
      { label: "Mobile", value: draft.mobileNumber, source: null },
      { label: "Email", value: draft.emailId, source: null },
    ]},
    { title: "Passport Type", fields: [
      { label: "Applying For", value: draft.applyingFor, source: null },
      { label: "Type", value: draft.applicationType, source: null },
      { label: "Booklet", value: draft.bookletType, source: null },
      { label: "Previous Passport", value: draft.heldPassportBefore, source: null },
    ]},
    { title: "Emergency Contact", fields: [
      { label: "Name", value: draft.emergencyContact, source: null },
      { label: "Phone", value: draft.emergencyPhone, source: null },
    ]},
    { title: "Legal Declaration", fields: [
      { label: "Any applicable", value: draft.legalDeclaration, source: null },
    ]},
  ];

  return (
    <div className="min-h-screen flex flex-col print:block">
      <Header />

      {/* Score bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1a3a5c]">Draft Readiness: {completion}%</span>
            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${completion === 100 ? "bg-green-100 text-green-700" : completion >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
              {completion === 100 ? "Ready" : completion >= 70 ? "Needs Review" : "Missing Fields"}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={copyAll} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white transition-colors">
              <ClipboardCopy size={12} /> Copy All
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540] transition-colors">
              <Download size={12} /> Download PDF
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${completion === 100 ? "bg-green-500" : "bg-[#C89A2B]"}`} style={{ width: `${completion}%` }} />
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 print:border-black print:bg-white">
          <strong>Disclaimer:</strong> This is a SevaSetu application draft for reference only. Final submission must be done on the official Passport Seva portal.
        </div>

        {/* Sections */}
        {sections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
            <div className="p-4 space-y-2">
              {sec.fields.map(f => (
                <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 uppercase block">{f.label}</span>
                    <span className={`text-sm font-medium ${f.value ? "text-gray-800" : "text-red-400"}`}>{f.value || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {f.source && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold print:hidden">{f.source}</span>}
                    {!f.source && f.value && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold print:hidden">Your answer</span>}
                    {f.value && <button onClick={() => copyField(f.value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={11} /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Official portal */}
        <div className="text-center pt-2 print:hidden">
          <a href="https://www.passportindia.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3a5c] hover:text-[#C89A2B] transition-colors">
            <ExternalLink size={14} /> Open Official Passport Seva Portal
          </a>
          <p className="text-[10px] text-gray-400 mt-1">Use this draft to copy-paste details into the official form.</p>
        </div>
      </main>

      {/* Toast */}
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50"><Check size={12} className="inline mr-1" />{toast}</div>}

      <Footer />
      <style>{`@media print{header,footer,nav,.print\\:hidden{display:none!important}.print\\:border-black{border-color:#000}.print\\:bg-white{background:#fff}}`}</style>
    </div>
  );
}

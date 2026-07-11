"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy,
  Edit3, ExternalLink, Loader2, Lock, Printer,
  RefreshCw, Sparkles, Upload, X,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const PHASE_UPLOAD = 0;
const PHASE_EXTRACTING = 1;
const PHASE_CONFIRM = 2;
const PHASE_QUESTIONS = 3;
const PHASE_REVIEW = 4;

const APPLICATION_TYPES = [
  { id: "new", label: "New PAN Card", desc: "First-time PAN application (Form 49A)" },
  { id: "correction", label: "PAN Correction / Update", desc: "Change name, DOB, father's name, address, or other details on existing PAN" },
  { id: "lost", label: "Lost / Duplicate PAN", desc: "Re-issue of lost or damaged PAN card" },
];

const UPLOAD_SLOTS = [
  { id: "aadhaar", label: "Aadhaar Card", hint: "Mandatory — identity, DOB, and address proof", required: true },
  { id: "photo", label: "Passport-size Photograph", hint: "Mandatory — recent, white background", required: true },
  { id: "signature", label: "Signature Image", hint: "Mandatory — sign on white paper and scan or photograph", required: true },
  { id: "identityProof", label: "Identity Proof (Voter ID / Passport / DL)", hint: "Mandatory — any one of the listed documents", required: true },
  { id: "addressProof", label: "Address Proof (Utility Bill / Bank Statement)", hint: "Mandatory — recent utility bill or bank statement", required: true },
  { id: "dobProof", label: "Date of Birth Proof (Birth Cert / 10th Marksheet)", hint: "Mandatory — must show DOB clearly", required: true },
  { id: "existingPan", label: "Existing PAN Card (for correction/update/lost)", hint: "Optional — only if you have an existing PAN", required: false },
];

const QUESTION_GROUPS = [
  {
    title: "Application Type",
    id: "appType",
    fields: [
      { id: "applicationType", label: "What do you want to apply for?", type: "radio", options: ["New PAN Card", "PAN Correction / Update", "Lost / Duplicate PAN"], required: true },
      { id: "existingPanNumber", label: "Existing PAN Number (for correction/update/lost)", type: "text", required: false, showIf: { field: "applicationType", values: ["PAN Correction / Update", "Lost / Duplicate PAN"] } },
    ],
  },
  {
    title: "Personal Details",
    id: "personal",
    fields: [
      { id: "fullName", label: "Full Name (as on Aadhaar)", type: "text", required: true },
      { id: "firstName", label: "First Name", type: "text", required: true },
      { id: "middleName", label: "Middle Name", type: "text", required: false },
      { id: "lastName", label: "Last Name / Surname", type: "text", required: true },
      { id: "dateOfBirth", label: "Date of Birth (DD/MM/YYYY)", type: "text", required: true },
      { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Transgender"], required: true },
      { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Separated", "Divorced", "Widow/Widower"], required: false },
    ],
  },
  {
    title: "Parent Details",
    id: "parent",
    fields: [
      { id: "fatherName", label: "Father's Name", type: "text", required: true },
      { id: "motherName", label: "Mother's Name", type: "text", required: false },
    ],
  },
  {
    title: "Contact Details",
    id: "contact",
    fields: [
      { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
      { id: "emailId", label: "Email ID", type: "text", required: true },
    ],
  },
  {
    title: "Communication Address",
    id: "address",
    fields: [
      { id: "addressLine1", label: "Address Line 1 (House / Flat / Door No.)", type: "text", required: true },
      { id: "addressLine2", label: "Address Line 2 (Street / Locality / Area)", type: "text", required: false },
      { id: "cityTown", label: "City / Town / Village", type: "text", required: true },
      { id: "district", label: "District", type: "text", required: true },
      { id: "state", label: "State / Union Territory", type: "text", required: true },
      { id: "pinCode", label: "PIN Code", type: "text", required: true },
      { id: "country", label: "Country", type: "text", required: true },
    ],
  },
  {
    title: "Occupation & Income Details",
    id: "occupation",
    fields: [
      { id: "occupation", label: "Occupation Status", type: "select", options: ["Salaried", "Self-Employed Professional", "Self-Employed Business", "Student", "Retired", "Homemaker", "Unemployed", "Others"], required: true },
      { id: "annualIncome", label: "Annual Income Range", type: "select", options: ["Up to ₹ 2,50,000", "₹ 2,50,001 — ₹ 5,00,000", "₹ 5,00,001 — ₹ 10,00,000", "₹ 10,00,001 — ₹ 25,00,000", "₹ 25,00,000 and above"], required: true },
      { id: "sourceOfIncome", label: "Source of Income", type: "select", options: ["Salary / Pension", "Business / Profession", "Capital Gains", "House Property", "Other Sources"], required: false },
    ],
  },
  {
    title: "Office / Business Address",
    id: "officeAddress",
    fields: [
      { id: "officeName", label: "Employer / Business Name", type: "text", required: false },
      { id: "officeAddressLine", label: "Office Address", type: "text", required: false },
      { id: "officeCity", label: "Office City", type: "text", required: false },
      { id: "officeState", label: "Office State", type: "text", required: false },
      { id: "officePinCode", label: "Office PIN Code", type: "text", required: false },
    ],
  },
];

const DECLARATION_ITEMS = [
  "I hereby declare that the information provided in this application is true and correct to the best of my knowledge.",
  "I confirm that I am a citizen of India and eligible to hold a Permanent Account Number.",
  "I understand that furnishing false information may result in rejection of application and legal action under the Income Tax Act, 1961.",
  "I authorize the Income Tax Department to verify the information provided from any source including Aadhaar database.",
  "No application for PAN is pending or has been rejected previously under a different name or details.",
];

const OCCUPATION_MAP = {
  Salaried: "01",
  "Self-Employed Professional": "02",
  "Self-Employed Business": "03",
  Student: "04",
  Retired: "05",
  Homemaker: "06",
  Unemployed: "07",
  Others: "08",
};

const INCOME_MAP = {
  "Up to ₹ 2,50,000": "01",
  "₹ 2,50,001 — ₹ 5,00,000": "02",
  "₹ 5,00,001 — ₹ 10,00,000": "03",
  "₹ 10,00,001 — ₹ 25,00,000": "04",
  "₹ 25,00,000 and above": "05",
};

export default function PanCardDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedFields, setExtractedFields] = useState({});
  const [sources, setSources] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [declarationsAccepted, setDeclarationsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState([]);
  const [ocrError, setOcrError] = useState("");
  const [ocrMethod, setOcrMethod] = useState("");
  const [toast, setToast] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  function resetDraft() {
    setPhase(PHASE_UPLOAD);
    setFiles({});
    setExtractedFields({});
    setSources({});
    setConfidence({});
    setAnswers({});
    setDeclarationsAccepted(false);
    setOcrError("");
    setOcrMethod("");
    setProgressSteps([]);
    setPhotoPreview(null);
    setSignaturePreview(null);
    setEditingField(null);
  }

  function handleFile(slotId, e) {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [slotId]: file }));
      if (slotId === "photo") {
        setPhotoPreview(URL.createObjectURL(file));
      }
      if (slotId === "signature") {
        setSignaturePreview(URL.createObjectURL(file));
      }
      setOcrError("");
    }
  }

  function removeFile(slotId) {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    if (slotId === "photo") setPhotoPreview(null);
    if (slotId === "signature") setSignaturePreview(null);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  async function handleExtract() {
    setProcessing(true);
    setOcrError("");
    setExtractedFields({});
    setSources({});
    setConfidence({});
    setPhase(PHASE_EXTRACTING);
    setProgressSteps(["Reading uploaded documents..."]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const formData = new FormData();
      if (files.aadhaar) formData.append("aadhaar", files.aadhaar);
      if (files.identityProof) formData.append("identityProof", files.identityProof);
      if (files.addressProof) formData.append("addressProof", files.addressProof);
      if (files.dobProof) formData.append("dobProof", files.dobProof);
      if (files.existingPan) formData.append("existingPan", files.existingPan);

      const res = await fetch("/api/ocr/pan-card", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setProgressSteps(data.progress || ["Processing complete"]);
      setOcrMethod(data.ocrMethod || "unknown");

      if (data.success && data.extractedFields && Object.keys(data.extractedFields).length > 0) {
        setExtractedFields(data.extractedFields);
        setSources(data.sources || {});
        setConfidence(data.confidence || {});
        setPhase(PHASE_CONFIRM);
      } else {
        setOcrError(data.error || "Could not extract details. Please upload clearer images or enter manually.");
        setPhase(PHASE_QUESTIONS);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setOcrError("Document extraction took too long. Please retry or enter details manually.");
      } else {
        setOcrError("Automatic extraction is currently unavailable. Please enter the missing details manually.");
      }
      setPhase(PHASE_QUESTIONS);
    } finally {
      setProcessing(false);
    }
  }

  function confirmExtracted() { setPhase(PHASE_QUESTIONS); }

  function setAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function getFullDraft() {
    return { ...extractedFields, ...answers };
  }

  function getReadiness() {
    const draft = getFullDraft();
    const required = [
      "fullName", "firstName", "lastName", "fatherName", "dateOfBirth", "gender",
      "mobileNumber", "emailId", "applicationType",
      "addressLine1", "cityTown", "district", "state", "pinCode", "country",
      "occupation", "annualIncome",
    ];
    const filled = required.filter(f => draft[f] && draft[f].trim());
    const pct = Math.round((filled.length / required.length) * 100);
    let status = "Missing information";
    if (pct >= 90) status = "Ready to generate";
    else if (pct >= 60) status = "Needs review";
    return { pct, status, filled: filled.length, total: required.length };
  }

  function copyField(value) {
    navigator.clipboard.writeText(value);
    showToast("Copied!");
  }

  function copySection(sectionFields) {
    const draft = getFullDraft();
    const lines = sectionFields.map(f => `${f.label}: ${draft[f.id] || "Not provided"}`);
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Section copied!");
  }

  function copyFullDraft() {
    const draft = getFullDraft();
    const lines = [
      "PAN CARD APPLICATION DRAFT — SevaSetu",
      "For submission at: https://www.incometax.gov.in / https://protean-tinpan.com",
      "═".repeat(55),
      "",
      "── APPLICATION TYPE ──",
      `Type: ${draft.applicationType || ""}`,
      `Existing PAN Number: ${draft.existingPanNumber || "N/A (New Application)"}`,
      "",
      "── PERSONAL DETAILS ──",
      `Full Name: ${draft.fullName || ""}`,
      `First Name: ${draft.firstName || ""}`,
      `Middle Name: ${draft.middleName || ""}`,
      `Last Name: ${draft.lastName || ""}`,
      `Date of Birth: ${draft.dateOfBirth || ""}`,
      `Gender: ${draft.gender || ""}`,
      `Marital Status: ${draft.maritalStatus || ""}`,
      "",
      "── PARENT DETAILS ──",
      `Father's Name: ${draft.fatherName || ""}`,
      `Mother's Name: ${draft.motherName || ""}`,
      "",
      "── CONTACT DETAILS ──",
      `Mobile: ${draft.mobileNumber || ""}`,
      `Email: ${draft.emailId || ""}`,
      "",
      "── COMMUNICATION ADDRESS ──",
      `${draft.addressLine1 || ""}`,
      `${draft.addressLine2 || ""}`,
      `${draft.cityTown || ""}, ${draft.district || ""}`,
      `${draft.state || ""} — ${draft.pinCode || ""}`,
      `${draft.country || ""}`,
      "",
      "── OCCUPATION & INCOME ──",
      `Occupation: ${draft.occupation || ""}`,
      `Annual Income Range: ${draft.annualIncome || ""}`,
      `Source of Income: ${draft.sourceOfIncome || ""}`,
      "",
      "── OFFICE / BUSINESS ADDRESS ──",
      `Employer/Business: ${draft.officeName || ""}`,
      `Office Address: ${draft.officeAddressLine || ""}`,
      `Office City: ${draft.officeCity || ""}`,
      `Office State: ${draft.officeState || ""}`,
      `Office PIN: ${draft.officePinCode || ""}`,
      "",
      "── DECLARATIONS ──",
      declarationsAccepted ? "All declarations accepted." : "Declarations not confirmed.",
      "",
      "═".repeat(55),
      "Disclaimer: This is a draft generated by SevaSetu for reference purposes only.",
      "Final submission must be completed through the official Income Tax e-filing portal or Protean/UTIITSL.",
      "Generated by SevaSetu AI",
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Full draft copied!");
  }

  function shouldShowField(field) {
    if (!field.showIf) return true;
    const depValue = answers[field.showIf.field] || extractedFields[field.showIf.field];
    return field.showIf.values.includes(depValue);
  }

  // ════════════════════════ PHASE 0: UPLOAD ════════════════════════
  if (phase === PHASE_UPLOAD) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
          <nav className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href="/application-draft" className="hover:text-white">Draft Generator</Link><span>/</span>
            <span className="text-gray-200">PAN Card</span>
          </nav>
          <h1 className="text-2xl font-black">PAN Card Application Draft</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload your documents. We will extract details and ask only what is missing.</p>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">Your documents are processed only to prepare this draft and are not permanently stored.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Your Documents</h2>
            {UPLOAD_SLOTS.map(slot => (
              <div key={slot.id} className="flex items-center gap-3 p-3 mb-2 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{slot.label}</span>
                  <p className="text-[10px] text-gray-400">{slot.hint}</p>
                  {files[slot.id] && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 size={11} />{files[slot.id].name}</p>}
                </div>
                {files[slot.id] ? (
                  <button onClick={() => removeFile(slot.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                ) : (
                  <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] px-3 py-1.5 border border-[#1a3a5c] rounded-lg">
                    <Upload size={12} /> Choose
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf,.webp" className="hidden" onChange={e => handleFile(slot.id, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>

          <button onClick={handleExtract} disabled={processing || !files.aadhaar} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
            <Sparkles size={16} /> Extract Details & Generate Draft
          </button>
          {!files.aadhaar && <p className="text-xs text-gray-400 text-center">Upload at least Aadhaar Card to begin extraction.</p>}

          <button onClick={() => { setPhase(PHASE_QUESTIONS); }} className="w-full text-center text-xs text-gray-400 hover:text-[#1a3a5c] underline">
            Skip — enter all details manually
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 1: EXTRACTING ════════════════════════
  if (phase === PHASE_EXTRACTING) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-8 text-white text-center">
          <h1 className="text-xl font-black">Extracting Details...</h1>
          <p className="text-gray-300 text-sm mt-1">Processing your uploaded documents</p>
        </div>
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#1a3a5c] mb-6" />
          <div className="space-y-2 w-full">
            {progressSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={14} className="text-green-500" />
                <span>{step}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
          <button onClick={() => { setProcessing(false); setOcrError("Extraction cancelled. Enter details manually."); setPhase(PHASE_QUESTIONS); }}
            className="mt-8 text-xs text-gray-400 hover:text-[#1a3a5c] underline">
            Cancel — enter details manually
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 2: CONFIRM ════════════════════════
  if (phase === PHASE_CONFIRM) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-5 text-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-1">Step 2 of 4 — Verify Extracted Data</p>
            <h2 className="text-lg font-black">Details Extracted From Your Documents</h2>
            <p className="text-gray-300 text-xs mt-0.5">Review and edit if needed. OCR method: <span className="font-mono text-green-300">{ocrMethod}</span></p>
          </div>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
          {photoPreview && (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
              <img src={photoPreview} alt="Applicant photo" className="w-16 h-20 object-cover rounded border" />
              <div>
                <p className="text-xs font-bold text-gray-700">Applicant Photo</p>
                <p className="text-[10px] text-gray-400">Will be shown in your draft preview</p>
              </div>
            </div>
          )}

          {signaturePreview && (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
              <img src={signaturePreview} alt="Applicant signature" className="w-24 h-12 object-contain rounded border" />
              <div>
                <p className="text-xs font-bold text-gray-700">Applicant Signature</p>
                <p className="text-[10px] text-gray-400">Will be used in the application</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            {Object.entries(extractedFields).map(([key, val]) => {
              const conf = confidence[key] || 0;
              const source = sources[key] || "Document";
              const lowConf = conf > 0 && conf < 0.7;
              return (
                <div key={key} className={`p-3 rounded-lg border ${lowConf ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{source}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lowConf ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
                        {conf > 0 ? `${Math.round(conf * 100)}%` : "✓"}
                      </span>
                    </div>
                  </div>
                  <input type="text" value={val || ""} onChange={e => setExtractedFields(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                  {lowConf && <p className="text-[10px] text-yellow-700 mt-1">⚠ Low confidence — please verify.</p>}
                </div>
              );
            })}
          </div>

          <button onClick={confirmExtracted} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            Confirm & Fill Remaining <ChevronRight size={14} />
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 3: QUESTIONS ════════════════════════
  if (phase === PHASE_QUESTIONS) {
    const draft = getFullDraft();
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="bg-[#1a3a5c] px-4 py-5 text-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-1">Step 3 of 4 — Complete Missing Information</p>
            <h2 className="text-lg font-black">We Still Need a Few Details</h2>
            <p className="text-gray-300 text-xs mt-0.5">Fill in the fields below. Already-extracted fields are not shown here.</p>
          </div>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
          {Object.keys(extractedFields).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs font-bold text-green-800 mb-1.5 flex items-center gap-1"><CheckCircle2 size={12} /> Already extracted ({Object.keys(extractedFields).length} fields):</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(extractedFields).map(([k, v]) => (
                  <span key={k} className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full">
                    {k.replace(/([A-Z])/g, " $1").trim()}: <strong>{String(v).substring(0, 18)}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {ocrError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{ocrError}</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Application Type</h3>
            <div className="grid gap-2">
              {APPLICATION_TYPES.map(at => (
                <label key={at.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${answers.applicationType === at.label ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-700 border-gray-200 hover:border-[#1a3a5c]"}`}>
                  <input type="radio" className="hidden" checked={answers.applicationType === at.label} onChange={() => setAnswer("applicationType", at.label)} />
                  <div className="flex-1">
                    <span className="text-sm font-bold block">{at.label}</span>
                    <span className="text-[10px] opacity-70 block mt-0.5">{at.desc}</span>
                  </div>
                  <ChevronRight size={14} className={answers.applicationType === at.label ? "text-white" : "text-gray-300"} />
                </label>
              ))}
            </div>
          </div>

          {QUESTION_GROUPS.map(group => {
            const hasAnyToShow = group.fields.some(f => !extractedFields[f.id] && shouldShowField(f));
            if (!hasAnyToShow) return null;
            return (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3>
                <div className="space-y-4">
                  {group.fields.filter(f => !extractedFields[f.id] && shouldShowField(f)).map(q => {
                    const isAnswered = !!answers[q.id];
                    return (
                      <div key={q.id}>
                        <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                          {q.label} {q.required && <span className="text-red-500">*</span>}
                          {isAnswered && <CheckCircle2 size={11} className="text-green-500" />}
                        </label>
                        {q.type === "radio" ? (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map(opt => (
                              <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${answers[q.id] === opt ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
                                <input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />{opt}
                              </label>
                            ))}
                          </div>
                        ) : q.type === "select" ? (
                          <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]">
                            <option value="">Select...</option>
                            {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" placeholder={q.label} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">Applicant Declarations</h3>
            <ul className="space-y-1 bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
              {DECLARATION_ITEMS.map((item, i) => <li key={i} className="text-xs text-gray-600">• {item}</li>)}
            </ul>
            <div className="flex gap-2">
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-colors ${declarationsAccepted === true ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"}`}>
                <input type="radio" className="hidden" checked={declarationsAccepted === true} onChange={() => setDeclarationsAccepted(true)} />
                I accept all declarations
              </label>
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-colors ${declarationsAccepted === false ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-500 hover:border-red-300"}`}>
                <input type="radio" className="hidden" checked={declarationsAccepted === false} onChange={() => setDeclarationsAccepted(false)} />
                One or more do not apply
              </label>
            </div>
          </div>

          <button onClick={() => setPhase(PHASE_REVIEW)} className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
            Generate Final Draft Preview <ChevronRight size={14} />
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ════════════════════════ PHASE 4: REVIEW ════════════════════════
  const draft = getFullDraft();
  const readiness = getReadiness();

  const draftSections = [
    {
      title: "Application Type",
      fields: [
        { label: "Application Type", id: "applicationType" },
        { label: "Existing PAN Number", id: "existingPanNumber" },
      ],
    },
    {
      title: "Personal Details",
      fields: [
        { label: "Full Name", id: "fullName" },
        { label: "First Name", id: "firstName" },
        { label: "Middle Name", id: "middleName" },
        { label: "Last Name / Surname", id: "lastName" },
        { label: "Date of Birth", id: "dateOfBirth" },
        { label: "Gender", id: "gender" },
        { label: "Marital Status", id: "maritalStatus" },
      ],
    },
    {
      title: "Parent Details",
      fields: [
        { label: "Father's Name", id: "fatherName" },
        { label: "Mother's Name", id: "motherName" },
      ],
    },
    {
      title: "Contact Details",
      fields: [
        { label: "Mobile Number", id: "mobileNumber" },
        { label: "Email ID", id: "emailId" },
      ],
    },
    {
      title: "Communication Address",
      fields: [
        { label: "Address Line 1", id: "addressLine1" },
        { label: "Address Line 2", id: "addressLine2" },
        { label: "City / Town", id: "cityTown" },
        { label: "District", id: "district" },
        { label: "State / UT", id: "state" },
        { label: "PIN Code", id: "pinCode" },
        { label: "Country", id: "country" },
      ],
    },
    {
      title: "Occupation & Income",
      fields: [
        { label: "Occupation", id: "occupation" },
        { label: "Annual Income Range", id: "annualIncome" },
        { label: "Source of Income", id: "sourceOfIncome" },
      ],
    },
    {
      title: "Office / Business Address",
      fields: [
        { label: "Employer / Business Name", id: "officeName" },
        { label: "Office Address", id: "officeAddressLine" },
        { label: "Office City", id: "officeCity" },
        { label: "Office State", id: "officeState" },
        { label: "Office PIN Code", id: "officePinCode" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col print:block">
      <Header />
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-sm font-bold text-[#1a3a5c]">PAN Card Draft</span>
            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${readiness.pct >= 90 ? "bg-green-100 text-green-700" : readiness.pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
              {readiness.status} ({readiness.pct}%)
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDraft} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <RefreshCw size={11} /> Start Over
            </button>
            <button onClick={() => setPhase(PHASE_QUESTIONS)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Edit3 size={11} /> Edit
            </button>
            <button onClick={copyFullDraft} className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c] hover:text-white">
              <ClipboardCopy size={11} /> Copy All
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#0f2540]">
              <Printer size={11} /> Print / PDF
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference purposes only. Final submission must be completed through the official Income Tax e-filing portal or Protean/UTIITSL PAN centres.
        </div>

        {photoPreview && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <img src={photoPreview} alt="Applicant photo" className="w-20 h-24 object-cover rounded border-2 border-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-700">Application Photo</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Preview of uploaded photograph</p>
            </div>
          </div>
        )}

        {signaturePreview && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <img src={signaturePreview} alt="Applicant signature" className="w-28 h-12 object-contain rounded border border-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-700">Applicant Signature</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Will be affixed on the application form</p>
            </div>
          </div>
        )}

        {draftSections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2 flex items-center justify-between">
              <span>{sec.title}</span>
              <button onClick={() => copySection(sec.fields)} className="text-[10px] text-gray-300 hover:text-white flex items-center gap-1 print:hidden">
                <ClipboardCopy size={10} /> Copy Section
              </button>
            </div>
            <div className="p-4 space-y-1.5">
              {sec.fields.map(f => {
                const value = draft[f.id] || "";
                const source = sources[f.id];
                if (!value && !f.required) return null;
                return (
                  <div key={f.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase block">{f.label}</span>
                      {editingField === f.id ? (
                        <input type="text" autoFocus value={draft[f.id] || ""} onBlur={() => setEditingField(null)}
                          onChange={e => {
                            if (extractedFields[f.id] !== undefined) setExtractedFields(prev => ({ ...prev, [f.id]: e.target.value }));
                            else setAnswers(prev => ({ ...prev, [f.id]: e.target.value }));
                          }}
                          className="w-full border border-blue-300 rounded px-2 py-1 text-sm outline-none" />
                      ) : (
                        <span className={`text-sm font-medium ${value ? "text-gray-800" : "text-red-400 italic"}`}>
                          {value || "Not provided"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      {source && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hidden sm:inline">Auto Filled</span>}
                      {!source && value && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hidden sm:inline">Manual</span>}
                      <button onClick={() => setEditingField(f.id)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><Edit3 size={10} /></button>
                      {value && <button onClick={() => copyField(value)} className="p-1 text-gray-300 hover:text-[#1a3a5c] print:hidden"><ClipboardCopy size={10} /></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">Supporting Documents</div>
          <div className="p-4 space-y-2">
            {Object.keys(files).filter(k => files[k]).map(k => (
              <div key={k} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={11} className="text-green-500" />
                <span className="font-medium">{UPLOAD_SLOTS.find(s => s.id === k)?.label || k}:</span>
                <span className="text-gray-400">{files[k].name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">Applicant Declarations</div>
          <div className="p-4">
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Declaration Status</span>
                <span className={`text-sm font-medium ${declarationsAccepted ? "text-gray-800" : "text-red-400"}`}>
                  {declarationsAccepted ? "All declarations accepted" : "Declarations not confirmed"}
                </span>
              </div>
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Required</span>
            </div>
            {declarationsAccepted && (
              <ul className="mt-2 space-y-1">
                {DECLARATION_ITEMS.map((item, i) => (
                  <li key={i} className="text-[10px] text-green-700 flex items-center gap-1"><CheckCircle2 size={9} /> {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">Readiness Score</span>
            <span className={`text-xs font-bold ${readiness.pct >= 90 ? "text-green-600" : readiness.pct >= 60 ? "text-yellow-600" : "text-red-500"}`}>
              {readiness.filled}/{readiness.total} fields • {readiness.pct}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${readiness.pct >= 90 ? "bg-green-500" : readiness.pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${readiness.pct}%` }} />
          </div>
          {readiness.pct < 90 && (
            <button onClick={() => setPhase(PHASE_QUESTIONS)} className="mt-2 text-xs text-[#1a3a5c] underline hover:text-[#C89A2B]">
              Complete missing fields →
            </button>
          )}
        </div>

        <div className="text-center pt-2 print:hidden">
          <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540] transition-colors">
            <ExternalLink size={14} /> Open Income Tax e-Filing Portal
          </a>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50">
          <Check size={12} className="inline mr-1" />{toast}
        </div>
      )}
      <Footer />
      <style>{`@media print{header,footer,nav,.print\\:hidden,.no-print,.fixed.z-50{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

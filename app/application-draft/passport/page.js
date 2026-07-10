"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle, Check, CheckCircle2, ChevronRight, ClipboardCopy,
  Download, Edit3, ExternalLink, Loader2, Lock, Printer,
  RefreshCw, Sparkles, Upload, X,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { telanganaDistricts } from "../../../lib/location/telanganaDistricts";

const PHASE_UPLOAD = 0;
const PHASE_EXTRACTING = 1;
const PHASE_CONFIRM = 2;
const PHASE_QUESTIONS = 3;
const PHASE_REVIEW = 4;

// Questions grouped by section — only asked if not extracted
const QUESTION_GROUPS = [
  {
    title: "Passport Preferences",
    id: "passport-type",
    fields: [
      { id: "applyingFor", label: "Applying for", type: "radio", options: ["Fresh Passport", "Re-issue of Passport"], required: true },
      { id: "typeOfApplication", label: "Type of Application", type: "radio", options: ["Normal", "Tatkaal"], required: true },
      { id: "bookletType", label: "Booklet Type", type: "radio", options: ["36 Pages", "60 Pages"], required: true },
    ],
  },
  {
    title: "Personal Details",
    id: "personal",
    fields: [
      { id: "givenName", label: "Given Name (First + Middle)", type: "text", required: true },
      { id: "surname", label: "Surname / Family Name", type: "text", required: true },
      { id: "placeOfBirth", label: "Place of Birth (City/Town)", type: "text", required: true },
      { id: "placeOfBirthDistrict", label: "District of Birth", type: "text", required: true },
      { id: "placeOfBirthState", label: "State of Birth", type: "text", required: true },
      { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single/Unmarried", "Married", "Separated", "Divorced", "Widow/Widower"], required: true },
      { id: "citizenshipBy", label: "Citizenship by", type: "select", options: ["Birth", "Descent", "Registration/Naturalization"], required: true },
      { id: "employmentType", label: "Employment Type", type: "select", options: ["Student", "Private", "Government", "Self Employed", "Homemaker", "Not Employed", "Retired", "Others"], required: true },
      { id: "educationalQualification", label: "Educational Qualification", type: "select", options: ["Below Matriculate", "Matriculate", "Senior Secondary", "Graduate and Above", "Professional Degree"], required: true },
      { id: "nonEcrEligible", label: "Eligible for Non-ECR category?", type: "radio", options: ["Yes", "No"], required: true },
      { id: "distinguishingMark", label: "Visible Distinguishing Mark", type: "text", required: false },
    ],
  },
  {
    title: "Family Details",
    id: "family",
    fields: [
      { id: "fatherGivenName", label: "Father's Given Name", type: "text", required: true },
      { id: "fatherSurname", label: "Father's Surname", type: "text", required: true },
      { id: "motherGivenName", label: "Mother's Given Name", type: "text", required: true },
      { id: "motherSurname", label: "Mother's Surname", type: "text", required: true },
    ],
  },
  {
    title: "Address & Contact",
    id: "address",
    fields: [
      { id: "houseStreet", label: "House No. & Street", type: "text", required: true },
      { id: "city", label: "City/Town", type: "text", required: true },
      { id: "district", label: "District", type: "district-select", required: true },
      { id: "state", label: "State", type: "text", required: true },
      { id: "pinCode", label: "PIN Code", type: "text", required: true },
      { id: "policeStation", label: "Nearest Police Station", type: "text", required: true },
      { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
      { id: "emailId", label: "Email ID", type: "text", required: true },
      { id: "permanentSameAsPresent", label: "Permanent address same as present?", type: "radio", options: ["Yes", "No"], required: true },
    ],
  },
  {
    title: "Emergency Contact",
    id: "emergency",
    fields: [
      { id: "emergencyName", label: "Emergency Contact Name & Address", type: "text", required: true },
      { id: "emergencyMobile", label: "Emergency Contact Mobile", type: "text", required: true },
      { id: "emergencyEmail", label: "Emergency Contact Email", type: "text", required: false },
    ],
  },
  {
    title: "Previous Passport",
    id: "previous-passport",
    fields: [
      { id: "heldPassportBefore", label: "Have you ever held/applied for a passport?", type: "radio", options: ["Yes", "No"], required: true },
    ],
  },
];

const LEGAL_ITEMS = [
  "Criminal proceedings pending against you",
  "Arrest warrant or summons issued",
  "Convicted by court in last 5 years",
  "Passport ever refused, impounded, or revoked",
  "Applied for political asylum in any country",
  "Deported or repatriated from any country",
];

const PREV_PASSPORT_FIELDS = [
  { id: "oldPassportNumber", label: "Previous Passport Number", type: "text" },
  { id: "oldPassportDateOfIssue", label: "Date of Issue", type: "text" },
  { id: "oldPassportPlaceOfIssue", label: "Place of Issue", type: "text" },
  { id: "oldPassportFileNumber", label: "File Number", type: "text" },
];

export default function PassportDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedFields, setExtractedFields] = useState({});
  const [sources, setSources] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [legalNoneApply, setLegalNoneApply] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState([]);
  const [ocrError, setOcrError] = useState("");
  const [ocrMethod, setOcrMethod] = useState("");
  const [toast, setToast] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Reset for new user
  function resetDraft() {
    setPhase(PHASE_UPLOAD);
    setFiles({});
    setExtractedFields({});
    setSources({});
    setConfidence({});
    setAnswers({});
    setLegalNoneApply(null);
    setOcrError("");
    setOcrMethod("");
    setProgressSteps([]);
    setPhotoPreview(null);
    setEditingField(null);
  }

  function handleFile(slotId, e) {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [slotId]: file }));
      if (slotId === "photo") {
        setPhotoPreview(URL.createObjectURL(file));
      }
      setOcrError("");
    }
  }

  function removeFile(slotId) {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    if (slotId === "photo") setPhotoPreview(null);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  // Run OCR extraction with timeout protection
  async function handleExtract() {
    setProcessing(true);
    setOcrError("");
    setExtractedFields({});
    setSources({});
    setConfidence({});
    setPhase(PHASE_EXTRACTING);
    setProgressSteps(["Reading uploaded documents..."]);

    // AbortController with 25-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const formData = new FormData();
      if (files.aadhaar) formData.append("aadhaar", files.aadhaar);
      if (files.pan) formData.append("pan", files.pan);

      const res = await fetch("/api/ocr/passport", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

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

  function confirmExtracted() {
    setPhase(PHASE_QUESTIONS);
  }

  function setAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  // Get final merged draft
  function getFullDraft() {
    return { ...extractedFields, ...answers };
  }

  // Calculate readiness
  function getReadiness() {
    const draft = getFullDraft();
    const required = [
      "surname", "givenName", "dateOfBirth", "gender", "placeOfBirth",
      "maritalStatus", "employmentType", "educationalQualification",
      "houseStreet", "pinCode", "mobileNumber", "emailId",
      "fatherGivenName", "fatherSurname", "motherGivenName", "motherSurname",
      "emergencyName", "emergencyMobile",
      "applyingFor", "typeOfApplication", "bookletType", "heldPassportBefore",
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

  function copyFullDraft() {
    const draft = getFullDraft();
    const lines = [
      "PASSPORT APPLICATION DRAFT — SevaSetu Telangana",
      "Submit on: https://www.passportindia.gov.in",
      "═".repeat(50),
      "",
      "── PASSPORT TYPE ──",
      `Applying For: ${draft.applyingFor || "Not provided"}`,
      `Type: ${draft.typeOfApplication || "Not provided"}`,
      `Booklet: ${draft.bookletType || "Not provided"}`,
      "",
      "── APPLICANT DETAILS ──",
      `Given Name: ${draft.givenName || ""}`,
      `Surname: ${draft.surname || ""}`,
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
      `Father: ${draft.fatherGivenName || ""} ${draft.fatherSurname || ""}`.trim(),
      `Mother: ${draft.motherGivenName || ""} ${draft.motherSurname || ""}`.trim(),
      "",
      "── ADDRESS ──",
      `${draft.houseStreet || ""}`,
      `${draft.city || ""}, ${draft.district || ""}, ${draft.state || ""} - ${draft.pinCode || ""}`,
      `Mobile: ${draft.mobileNumber || ""}`,
      `Email: ${draft.emailId || ""}`,
      "",
      "── EMERGENCY CONTACT ──",
      `Name: ${draft.emergencyName || ""}`,
      `Mobile: ${draft.emergencyMobile || ""}`,
      "",
      "── PREVIOUS PASSPORT ──",
      `Held before: ${draft.heldPassportBefore || ""}`,
      draft.heldPassportBefore === "Yes" ? `Number: ${draft.oldPassportNumber || ""}` : "",
      "",
      "── LEGAL DECLARATION ──",
      legalNoneApply === true ? "None of the legal conditions apply." : legalNoneApply === false ? "One or more conditions apply — details on portal." : "Not confirmed",
      "",
      "═".repeat(50),
      "Disclaimer: Reference draft only. Not an official application.",
      "Generated by SevaSetu AI",
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Full draft copied!");
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
            <span className="text-gray-200">Passport</span>
          </nav>
          <h1 className="text-2xl font-black">Passport Application Draft</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">Upload your documents. We will extract details and ask only what is missing.</p>
        </div>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <Lock size={13} className="text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">Your documents are processed only to prepare this draft and are not permanently stored.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#1a3a5c] mb-4 flex items-center gap-2"><Upload size={15} /> Upload Your Documents</h2>
            {[
              { id: "aadhaar", label: "Aadhaar Card (front or both sides)", hint: "For name, DOB, gender, address extraction", required: true },
              { id: "pan", label: "PAN Card (optional)", hint: "For PAN number and name verification", required: false },
              { id: "photo", label: "Passport Photo", hint: "Used as application photo preview", required: false },
            ].map(slot => (
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
          {!files.aadhaar && <p className="text-xs text-gray-400 text-center">Upload at least Aadhaar to begin extraction.</p>}

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

  // ════════════════════════ PHASE 2: CONFIRM EXTRACTED ════════════════════════
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
              <img src={photoPreview} alt="Passport photo" className="w-16 h-20 object-cover rounded border" />
              <div>
                <p className="text-xs font-bold text-gray-700">Passport Photo</p>
                <p className="text-[10px] text-gray-400">Will be shown in your draft preview</p>
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
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Extracted from {source}</span>
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

  // ════════════════════════ PHASE 3: MISSING QUESTIONS ════════════════════════
  if (phase === PHASE_QUESTIONS) {
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
          {/* Show extracted summary */}
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

          {/* Name split confirmation if givenName/surname need user input */}
          {(extractedFields.givenName || extractedFields.surname) && !answers._nameConfirmed && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-800 mb-2">Please confirm the name split for your passport:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-0.5">Given Name</label>
                  <input type="text" value={extractedFields.givenName || ""} onChange={e => setExtractedFields(prev => ({ ...prev, givenName: e.target.value }))}
                    className="w-full border border-blue-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-0.5">Surname</label>
                  <input type="text" value={extractedFields.surname || ""} onChange={e => setExtractedFields(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full border border-blue-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              </div>
              <button onClick={() => setAnswer("_nameConfirmed", "yes")} className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 underline">
                ✓ Confirm name split
              </button>
            </div>
          )}

          {ocrError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{ocrError}</p>
            </div>
          )}

          {/* Question groups — show ALL fields, not just missing */}
          {QUESTION_GROUPS.map(group => {
            // Show group if it has at least one field not yet in extractedFields
            const hasAnyToShow = group.fields.some(f => !extractedFields[f.id]);
            if (!hasAnyToShow) return null;
            return (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3>
                <div className="space-y-4">
                  {group.fields.filter(f => !extractedFields[f.id]).map(q => {
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
                        ) : q.type === "district-select" ? (
                          <div>
                            <select value={answers[q.id] || extractedFields[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]">
                              <option value="">Select District...</option>
                              {telanganaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {extractedFields[q.id] && !answers[q.id] && (
                              <p className="text-[10px] text-green-600 mt-1">Auto-filled from Aadhaar: {extractedFields[q.id]}</p>
                            )}
                          </div>
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

          {/* Previous passport expansion */}
          {answers.heldPassportBefore === "Yes" && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Previous Passport Details</h3>
              <div className="space-y-3">
                {PREV_PASSPORT_FIELDS.map(f => (
                  <div key={f.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.label}</label>
                    <input type="text" value={answers[f.id] || ""} onChange={e => setAnswer(f.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Declaration */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">Legal Declaration</h3>
            <p className="text-xs text-gray-500 mb-3">Do any of the following apply to you?</p>
            <ul className="space-y-1 bg-gray-50 border border-gray-100 rounded-lg p-3 mb-3">
              {LEGAL_ITEMS.map((q, i) => <li key={i} className="text-xs text-gray-600">• {q}</li>)}
            </ul>
            <div className="flex gap-3">
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-colors ${legalNoneApply === true ? "bg-green-50 border-green-300 text-green-700" : "bg-white border-gray-200 text-gray-500 hover:border-green-300"}`}>
                <input type="radio" className="hidden" checked={legalNoneApply === true} onChange={() => setLegalNoneApply(true)} />
                None of these apply
              </label>
              <label className={`flex-1 text-center text-xs font-bold py-2.5 rounded-lg border cursor-pointer transition-colors ${legalNoneApply === false ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-gray-200 text-gray-500 hover:border-red-300"}`}>
                <input type="radio" className="hidden" checked={legalNoneApply === false} onChange={() => setLegalNoneApply(false)} />
                One or more apply
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

  // ════════════════════════ PHASE 4: FINAL REVIEW ════════════════════════
  const draft = getFullDraft();
  const readiness = getReadiness();

  const draftSections = [
    {
      title: "Passport Type",
      fields: [
        { label: "Applying For", id: "applyingFor" },
        { label: "Type of Application", id: "typeOfApplication" },
        { label: "Booklet Type", id: "bookletType" },
      ],
    },
    {
      title: "Applicant Details",
      fields: [
        { label: "Given Name", id: "givenName" },
        { label: "Surname", id: "surname" },
        { label: "Date of Birth", id: "dateOfBirth" },
        { label: "Gender", id: "gender" },
        { label: "Place of Birth", id: "placeOfBirth" },
        { label: "District of Birth", id: "placeOfBirthDistrict" },
        { label: "State of Birth", id: "placeOfBirthState" },
        { label: "Marital Status", id: "maritalStatus" },
        { label: "Citizenship By", id: "citizenshipBy" },
        { label: "Employment Type", id: "employmentType" },
        { label: "Educational Qualification", id: "educationalQualification" },
        { label: "Non-ECR Eligible", id: "nonEcrEligible" },
        { label: "Distinguishing Mark", id: "distinguishingMark" },
        { label: "PAN Number", id: "panNumber" },
        { label: "Aadhaar Number", id: "aadhaarNumber" },
      ],
    },
    {
      title: "Family Details",
      fields: [
        { label: "Father's Given Name", id: "fatherGivenName" },
        { label: "Father's Surname", id: "fatherSurname" },
        { label: "Mother's Given Name", id: "motherGivenName" },
        { label: "Mother's Surname", id: "motherSurname" },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "House No. & Street", id: "houseStreet" },
        { label: "City/Town", id: "city" },
        { label: "District", id: "district" },
        { label: "State", id: "state" },
        { label: "PIN Code", id: "pinCode" },
        { label: "Police Station", id: "policeStation" },
        { label: "Mobile Number", id: "mobileNumber" },
        { label: "Email ID", id: "emailId" },
        { label: "Permanent = Present?", id: "permanentSameAsPresent" },
      ],
    },
    {
      title: "Emergency Contact",
      fields: [
        { label: "Name & Address", id: "emergencyName" },
        { label: "Mobile", id: "emergencyMobile" },
        { label: "Email", id: "emergencyEmail" },
      ],
    },
    {
      title: "Previous Passport",
      fields: [
        { label: "Held Before?", id: "heldPassportBefore" },
        ...(draft.heldPassportBefore === "Yes" ? [
          { label: "Passport Number", id: "oldPassportNumber" },
          { label: "Date of Issue", id: "oldPassportDateOfIssue" },
          { label: "Place of Issue", id: "oldPassportPlaceOfIssue" },
        ] : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col print:block">
      <Header />
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 print:hidden sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-sm font-bold text-[#1a3a5c]">Passport Application Draft</span>
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
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This is a SevaSetu-generated application draft for reference only. It is not an official passport application and must be submitted separately through the Passport Seva portal.
        </div>

        {/* Photo preview */}
        {photoPreview && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <img src={photoPreview} alt="Passport photo" className="w-20 h-24 object-cover rounded border-2 border-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-700">Application Photo</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Preview of uploaded passport photo</p>
            </div>
          </div>
        )}

        {/* Draft sections */}
        {draftSections.map(sec => (
          <div key={sec.title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">{sec.title}</div>
            <div className="p-4 space-y-1.5">
              {sec.fields.map(f => {
                const value = draft[f.id] || "";
                const source = sources[f.id];
                if (!value && !f.required) return null; // hide empty optional
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
                      {source && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hidden sm:inline">{source}</span>}
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

        {/* Legal Declaration section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wide px-4 py-2">Self Declaration</div>
          <div className="p-4">
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Legal Conditions</span>
                <span className={`text-sm font-medium ${legalNoneApply !== null ? "text-gray-800" : "text-red-400"}`}>
                  {legalNoneApply === true ? "None of the listed conditions apply" : legalNoneApply === false ? "One or more conditions apply — details required on portal" : "Not confirmed"}
                </span>
              </div>
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Manual</span>
            </div>
          </div>
        </div>

        {/* Readiness */}
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

        {/* Official portal link */}
        <div className="text-center pt-2 print:hidden">
          <a href="https://www.passportindia.gov.in" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540] transition-colors">
            <ExternalLink size={14} /> Open Official Passport Seva Portal
          </a>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50">
          <Check size={12} className="inline mr-1" />{toast}
        </div>
      )}
      <Footer />
      <style>{`@media print{header,footer,nav,.print\\:hidden{display:none!important}.sticky{position:static!important}}`}</style>
    </div>
  );
}

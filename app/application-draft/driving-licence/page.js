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

// Upload slots for driving licence
const UPLOAD_SLOTS = [
  { id: "aadhaar", label: "Aadhaar Card (front or both sides)", hint: "For name, DOB, gender, address extraction", required: true },
  { id: "pan", label: "PAN Card (optional)", hint: "For PAN number and name verification", required: false },
  { id: "birthCert", label: "Birth Certificate / SSC Memo (Age Proof)", hint: "For DOB verification", required: false },
  { id: "existingDL", label: "Existing Licence (for Renewal / Additional Class)", hint: "For licence number and vehicle class extraction", required: false },
  { id: "medicalCert", label: "Medical Certificate (Form 1A)", hint: "For medical fitness details and blood group", required: false },
  { id: "photo", label: "Passport-size Photograph", hint: "Used as application photo preview", required: false },
];

// Questions grouped by section — only asked if not extracted
const QUESTION_GROUPS = [
  {
    title: "Application Type",
    id: "application-type",
    fields: [
      { id: "applicationType", label: "Application Type", type: "radio", options: ["Learner Licence (Fresh)", "Learner Licence (Additional Class)", "Permanent Licence (Fresh)", "Permanent Licence (Renewal)", "Duplicate Licence", "International Driving Permit"], required: true },
      { id: "rtoOffice", label: "RTO / Licensing Authority", type: "text", required: true },
    ],
  },
  {
    title: "Personal Details",
    id: "personal",
    fields: [
      { id: "fullName", label: "Full Name (as on Aadhaar)", type: "text", required: true },
      { id: "fatherHusbandName", label: "Father's / Husband's Name", type: "text", required: true },
      { id: "motherName", label: "Mother's Name", type: "text", required: false },
      { id: "dateOfBirth", label: "Date of Birth (DD/MM/YYYY)", type: "text", required: true },
      { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Transgender"], required: true },
      { id: "nationality", label: "Nationality", type: "text", required: true },
      { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], required: true },
      { id: "qualification", label: "Educational Qualification", type: "select", options: ["Illiterate", "Below 8th", "8th Pass", "10th Pass", "12th Pass", "Graduate", "Post Graduate", "Professional Degree", "Others"], required: true },
      { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
      { id: "emailId", label: "Email ID", type: "text", required: false },
      { id: "aadhaarNumber", label: "Aadhaar Number", type: "text", required: true },
      { id: "panNumber", label: "PAN Number (if available)", type: "text", required: false },
      { id: "identificationMark1", label: "Identification Mark 1", type: "text", required: false },
      { id: "identificationMark2", label: "Identification Mark 2", type: "text", required: false },
      { id: "organDonor", label: "Willing to be Organ Donor?", type: "radio", options: ["Yes", "No"], required: false },
    ],
  },
  {
    title: "Communication Address",
    id: "address",
    fields: [
      { id: "commHouseStreet", label: "House No. / Street / Locality", type: "text", required: true },
      { id: "commCity", label: "City / Town / Village", type: "text", required: true },
      { id: "commDistrict", label: "District", type: "district-select", required: true },
      { id: "commState", label: "State", type: "text", required: true },
      { id: "commPinCode", label: "PIN Code", type: "text", required: true },
      { id: "permanentSameAsComm", label: "Permanent address same as communication?", type: "radio", options: ["Yes", "No"], required: true },
    ],
  },
  {
    title: "Permanent Address (if different)",
    id: "perm-address",
    showIf: "permanentSameAsComm_No",
    fields: [
      { id: "permHouseStreet", label: "Permanent House No. / Street", type: "text", required: false },
      { id: "permCity", label: "Permanent City / Town", type: "text", required: false },
      { id: "permDistrict", label: "Permanent District", type: "text", required: false },
      { id: "permState", label: "Permanent State", type: "text", required: false },
      { id: "permPinCode", label: "Permanent PIN Code", type: "text", required: false },
    ],
  },
  {
    title: "Vehicle Class",
    id: "vehicle-class",
    fields: [
      { id: "vehicleClass", label: "Vehicle Class(es) Applied For", type: "multi-select", options: ["MC 50CC (Motorcycle ≤50cc)", "MCWOG (Motorcycle Without Gear)", "MCWG (Motorcycle With Gear)", "LMV-NT (Light Motor Vehicle Non-Transport / Car)", "LMV (Light Motor Vehicle)", "HMV (Heavy Motor Vehicle)", "HGMV (Heavy Goods Motor Vehicle)", "HPMV (Heavy Passenger Motor Vehicle)", "Trailer", "Others"], required: true },
    ],
  },
  {
    title: "Existing Licence Details",
    id: "existing-licence",
    fields: [
      { id: "hasExistingLicence", label: "Do you have an existing Driving Licence?", type: "radio", options: ["Yes", "No"], required: true },
    ],
  },
  {
    title: "Medical Details (Form 1A)",
    id: "medical",
    fields: [
      { id: "medicalCertificateAvailable", label: "Do you have a Medical Certificate (Form 1A)?", type: "radio", options: ["Yes", "No"], required: true },
      { id: "eyesightRight", label: "Right Eye Vision", type: "text", required: false },
      { id: "eyesightLeft", label: "Left Eye Vision", type: "text", required: false },
      { id: "wearsGlasses", label: "Do you wear corrective lenses?", type: "radio", options: ["Yes", "No"], required: false },
      { id: "colorBlind", label: "Color blindness?", type: "radio", options: ["Yes", "No"], required: false },
      { id: "physicalDisability", label: "Any physical disability?", type: "radio", options: ["Yes", "No"], required: false },
      { id: "height", label: "Height (cm)", type: "text", required: false },
      { id: "weight", label: "Weight (kg)", type: "text", required: false },
    ],
  },
  {
    title: "Emergency Contact",
    id: "emergency",
    fields: [
      { id: "emergencyContactName", label: "Emergency Contact Name", type: "text", required: true },
      { id: "emergencyContactRelation", label: "Relation", type: "text", required: false },
      { id: "emergencyContactMobile", label: "Emergency Contact Mobile", type: "text", required: true },
      { id: "emergencyContactAddress", label: "Emergency Contact Address", type: "text", required: false },
    ],
  },
];

const EXISTING_LICENCE_FIELDS = [
  { id: "existingLicenceNumber", label: "Existing Licence Number", type: "text" },
  { id: "existingLicenceDateOfIssue", label: "Date of Issue", type: "text" },
  { id: "existingLicenceDateOfExpiry", label: "Date of Expiry", type: "text" },
  { id: "existingLicenceIssuingAuthority", label: "Issuing RTO", type: "text" },
  { id: "existingLicenceVehicleClasses", label: "Vehicle Classes on Existing Licence", type: "text" },
  { id: "learnerLicenceNumber", label: "Learner Licence Number (for DL application)", type: "text" },
  { id: "learnerLicenceDateOfIssue", label: "Learner Licence Date of Issue", type: "text" },
  { id: "learnerLicenceValidTill", label: "Learner Licence Valid Till", type: "text" },
];

const MEDICAL_CERT_FIELDS = [
  { id: "medicalCertificateDate", label: "Medical Certificate Date", type: "text" },
  { id: "medicalCertificateDoctor", label: "Doctor Name / Registration No.", type: "text" },
  { id: "medicalCertificateHospital", label: "Hospital / Clinic Name", type: "text" },
  { id: "physicalDisabilityDetails", label: "Disability Details (if any)", type: "text" },
];

const DECLARATION_ITEMS = [
  "No pending criminal/civil cases related to motor vehicles",
  "Not previously disqualified from holding a licence",
  "Licence not suspended / revoked / cancelled",
  "Licence application not previously refused",
  "Not suffering from epilepsy or sudden attacks of unconsciousness",
  "Mentally fit and not suffering from any mental disorder",
  "Physically fit to drive the class of vehicle applied for",
];

export default function DrivingLicenceDraftPage() {
  const [phase, setPhase] = useState(PHASE_UPLOAD);
  const [files, setFiles] = useState({});
  const [extractedFields, setExtractedFields] = useState({});
  const [sources, setSources] = useState({});
  const [confidence, setConfidence] = useState({});
  const [answers, setAnswers] = useState({});
  const [selectedVehicleClasses, setSelectedVehicleClasses] = useState([]);
  const [declarationsAccepted, setDeclarationsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState([]);
  const [ocrError, setOcrError] = useState("");
  const [ocrMethod, setOcrMethod] = useState("");
  const [toast, setToast] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  function resetDraft() {
    setPhase(PHASE_UPLOAD);
    setFiles({});
    setExtractedFields({});
    setSources({});
    setConfidence({});
    setAnswers({});
    setSelectedVehicleClasses([]);
    setDeclarationsAccepted(false);
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
      if (files.pan) formData.append("pan", files.pan);
      if (files.existingDL) formData.append("existingDL", files.existingDL);
      if (files.birthCert) formData.append("birthCert", files.birthCert);
      if (files.medicalCert) formData.append("medicalCert", files.medicalCert);

      const res = await fetch("/api/ocr/driving-licence", {
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

  function toggleVehicleClass(cls) {
    setSelectedVehicleClasses(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  }

  function getFullDraft() {
    const draft = { ...extractedFields, ...answers };
    if (selectedVehicleClasses.length > 0) {
      draft.vehicleClass = selectedVehicleClasses.join(", ");
    }
    return draft;
  }

  function getReadiness() {
    const draft = getFullDraft();
    const required = [
      "fullName", "fatherHusbandName", "dateOfBirth", "gender",
      "bloodGroup", "qualification", "mobileNumber", "aadhaarNumber",
      "commHouseStreet", "commPinCode", "commDistrict", "commState",
      "applicationType", "rtoOffice", "vehicleClass",
      "emergencyContactName", "emergencyContactMobile",
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
      "DRIVING LICENCE APPLICATION DRAFT — SevaSetu Telangana",
      "Submit on: https://sarathi.parivahan.gov.in",
      "═".repeat(55),
      "",
      "── APPLICATION TYPE ──",
      `Type: ${draft.applicationType || "Not provided"}`,
      `RTO Office: ${draft.rtoOffice || "Not provided"}`,
      "",
      "── PERSONAL DETAILS ──",
      `Full Name: ${draft.fullName || ""}`,
      `Father/Husband Name: ${draft.fatherHusbandName || ""}`,
      `Mother Name: ${draft.motherName || ""}`,
      `Date of Birth: ${draft.dateOfBirth || ""}`,
      `Gender: ${draft.gender || ""}`,
      `Blood Group: ${draft.bloodGroup || ""}`,
      `Qualification: ${draft.qualification || ""}`,
      `Mobile: ${draft.mobileNumber || ""}`,
      `Email: ${draft.emailId || ""}`,
      `Aadhaar: ${draft.aadhaarNumber || ""}`,
      `PAN: ${draft.panNumber || ""}`,
      `Nationality: ${draft.nationality || "Indian"}`,
      "",
      "── COMMUNICATION ADDRESS ──",
      `${draft.commHouseStreet || ""}`,
      `${draft.commCity || ""}, ${draft.commDistrict || ""}, ${draft.commState || ""} - ${draft.commPinCode || ""}`,
      "",
      "── VEHICLE CLASS ──",
      `Applied For: ${draft.vehicleClass || "Not selected"}`,
      "",
      "── EXISTING LICENCE ──",
      `Has Existing Licence: ${draft.hasExistingLicence || "No"}`,
      draft.hasExistingLicence === "Yes" ? `Licence Number: ${draft.existingLicenceNumber || ""}` : "",
      draft.hasExistingLicence === "Yes" ? `Valid Till: ${draft.existingLicenceDateOfExpiry || ""}` : "",
      "",
      "── MEDICAL DETAILS ──",
      `Medical Certificate: ${draft.medicalCertificateAvailable || ""}`,
      `Blood Group: ${draft.bloodGroup || ""}`,
      `Wears Glasses: ${draft.wearsGlasses || ""}`,
      "",
      "── EMERGENCY CONTACT ──",
      `Name: ${draft.emergencyContactName || ""}`,
      `Relation: ${draft.emergencyContactRelation || ""}`,
      `Mobile: ${draft.emergencyContactMobile || ""}`,
      "",
      "── DECLARATIONS ──",
      declarationsAccepted ? "All declarations accepted." : "Declarations not confirmed.",
      "",
      "═".repeat(55),
      "Disclaimer: This is a draft generated by SevaSetu for reference purposes only.",
      "Final submission must be completed through the official Telangana Transport Department portal.",
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
            <span className="text-gray-200">Driving Licence</span>
          </nav>
          <h1 className="text-2xl font-black">Driving Licence Application Draft</h1>
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
              <img src={photoPreview} alt="Applicant photo" className="w-16 h-20 object-cover rounded border" />
              <div>
                <p className="text-xs font-bold text-gray-700">Applicant Photo</p>
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

          {ocrError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{ocrError}</p>
            </div>
          )}

          {/* Question groups */}
          {QUESTION_GROUPS.map(group => {
            // Handle conditional sections
            if (group.showIf) {
              const [fieldId, requiredValue] = group.showIf.split("_");
              const currentValue = draft[fieldId] || answers[fieldId] || extractedFields[fieldId];
              if (currentValue !== requiredValue) return null;
            }
            const hasAnyToShow = group.fields.some(f => !extractedFields[f.id]);
            if (!hasAnyToShow) return null;
            return (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">{group.title}</h3>
                <div className="space-y-4">
                  {group.fields.filter(f => !extractedFields[f.id]).map(q => {
                    const isAnswered = !!answers[q.id] || (q.type === "multi-select" && selectedVehicleClasses.length > 0 && q.id === "vehicleClass");
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
                              <p className="text-[10px] text-green-600 mt-1">Auto-filled from document: {extractedFields[q.id]}</p>
                            )}
                          </div>
                        ) : q.type === "multi-select" ? (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map(opt => (
                              <label key={opt} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${selectedVehicleClasses.includes(opt) ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a5c]"}`}>
                                <input type="checkbox" className="hidden" checked={selectedVehicleClasses.includes(opt)} onChange={() => toggleVehicleClass(opt)} />{opt}
                              </label>
                            ))}
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

          {/* Existing Licence expansion */}
          {(answers.hasExistingLicence === "Yes" || extractedFields.hasExistingLicence === "Yes") && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Existing Licence Details</h3>
              <div className="space-y-3">
                {EXISTING_LICENCE_FIELDS.map(f => (
                  <div key={f.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.label}</label>
                    {extractedFields[f.id] ? (
                      <div className="flex items-center gap-2">
                        <input type="text" value={extractedFields[f.id] || ""} onChange={e => setExtractedFields(prev => ({ ...prev, [f.id]: e.target.value }))}
                          className="flex-1 border border-green-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c] bg-green-50" />
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Auto Filled</span>
                      </div>
                    ) : (
                      <input type="text" value={answers[f.id] || ""} onChange={e => setAnswer(f.id, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Certificate expansion */}
          {(answers.medicalCertificateAvailable === "Yes") && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Medical Certificate Details</h3>
              <div className="space-y-3">
                {MEDICAL_CERT_FIELDS.map(f => (
                  <div key={f.id}>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">{f.label}</label>
                    <input type="text" value={answers[f.id] || ""} onChange={e => setAnswer(f.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declarations */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">Applicant Declarations (Form 1)</h3>
            <p className="text-xs text-gray-500 mb-3">I hereby declare that:</p>
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

  // ════════════════════════ PHASE 4: FINAL REVIEW ════════════════════════
  const draft = getFullDraft();
  const readiness = getReadiness();

  const draftSections = [
    {
      title: "Application Type",
      fields: [
        { label: "Application Type", id: "applicationType" },
        { label: "RTO / Licensing Authority", id: "rtoOffice" },
      ],
    },
    {
      title: "Personal Details",
      fields: [
        { label: "Full Name", id: "fullName" },
        { label: "Father/Husband Name", id: "fatherHusbandName" },
        { label: "Mother's Name", id: "motherName" },
        { label: "Date of Birth", id: "dateOfBirth" },
        { label: "Age", id: "age" },
        { label: "Gender", id: "gender" },
        { label: "Nationality", id: "nationality" },
        { label: "Blood Group", id: "bloodGroup" },
        { label: "Qualification", id: "qualification" },
        { label: "Mobile Number", id: "mobileNumber" },
        { label: "Email ID", id: "emailId" },
        { label: "Aadhaar Number", id: "aadhaarNumber" },
        { label: "PAN Number", id: "panNumber" },
        { label: "Identification Mark 1", id: "identificationMark1" },
        { label: "Identification Mark 2", id: "identificationMark2" },
        { label: "Organ Donor", id: "organDonor" },
      ],
    },
    {
      title: "Communication Address",
      fields: [
        { label: "House No. / Street", id: "commHouseStreet" },
        { label: "City / Town", id: "commCity" },
        { label: "District", id: "commDistrict" },
        { label: "State", id: "commState" },
        { label: "PIN Code", id: "commPinCode" },
        { label: "Permanent Same as Communication?", id: "permanentSameAsComm" },
      ],
    },
    ...(draft.permanentSameAsComm === "No" ? [{
      title: "Permanent Address",
      fields: [
        { label: "House No. / Street", id: "permHouseStreet" },
        { label: "City / Town", id: "permCity" },
        { label: "District", id: "permDistrict" },
        { label: "State", id: "permState" },
        { label: "PIN Code", id: "permPinCode" },
      ],
    }] : []),
    {
      title: "Vehicle Class",
      fields: [
        { label: "Vehicle Class(es) Applied For", id: "vehicleClass" },
      ],
    },
    {
      title: "Existing Licence",
      fields: [
        { label: "Has Existing Licence?", id: "hasExistingLicence" },
        ...(draft.hasExistingLicence === "Yes" ? [
          { label: "Licence Number", id: "existingLicenceNumber" },
          { label: "Date of Issue", id: "existingLicenceDateOfIssue" },
          { label: "Date of Expiry", id: "existingLicenceDateOfExpiry" },
          { label: "Issuing RTO", id: "existingLicenceIssuingAuthority" },
          { label: "Vehicle Classes", id: "existingLicenceVehicleClasses" },
          { label: "Learner Licence Number", id: "learnerLicenceNumber" },
          { label: "LL Date of Issue", id: "learnerLicenceDateOfIssue" },
          { label: "LL Valid Till", id: "learnerLicenceValidTill" },
        ] : []),
      ],
    },
    {
      title: "Medical Details",
      fields: [
        { label: "Medical Certificate Available?", id: "medicalCertificateAvailable" },
        { label: "Certificate Date", id: "medicalCertificateDate" },
        { label: "Doctor / Reg. No.", id: "medicalCertificateDoctor" },
        { label: "Hospital / Clinic", id: "medicalCertificateHospital" },
        { label: "Right Eye Vision", id: "eyesightRight" },
        { label: "Left Eye Vision", id: "eyesightLeft" },
        { label: "Wears Glasses?", id: "wearsGlasses" },
        { label: "Color Blindness?", id: "colorBlind" },
        { label: "Physical Disability?", id: "physicalDisability" },
        { label: "Height (cm)", id: "height" },
        { label: "Weight (kg)", id: "weight" },
      ],
    },
    {
      title: "Emergency Contact",
      fields: [
        { label: "Name", id: "emergencyContactName" },
        { label: "Relation", id: "emergencyContactRelation" },
        { label: "Mobile", id: "emergencyContactMobile" },
        { label: "Address", id: "emergencyContactAddress" },
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
            <span className="text-sm font-bold text-[#1a3a5c]">Driving Licence Draft</span>
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
          <strong>Disclaimer:</strong> This is a draft generated by SevaSetu for reference purposes only. Final submission must be completed through the official Telangana Transport Department portal (Sarathi Parivahan).
        </div>

        {/* Photo preview */}
        {photoPreview && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <img src={photoPreview} alt="Applicant photo" className="w-20 h-24 object-cover rounded border-2 border-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-700">Application Photo</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Preview of uploaded photograph</p>
            </div>
          </div>
        )}

        {/* Draft sections */}
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

        {/* Declarations section */}
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
          <a href="https://sarathi.parivahan.gov.in" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0f2540] transition-colors">
            <ExternalLink size={14} /> Open Official Sarathi Parivahan Portal
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

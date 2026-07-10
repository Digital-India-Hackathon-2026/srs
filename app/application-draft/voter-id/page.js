"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle, Check, CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardCopy, Download, FileText, Info, User,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useLanguage } from "../../../context/LanguageContext";

// ── Form type selection ───────────────────────────────────────────────────────
const FORM_TYPES = [
  { id: "form6", label: { en: "Form 6 — New Voter Registration (Domestic)", te: "ఫారం 6 — కొత్త ఓటర్ రిజిస్ట్రేషన్ (దేశీయ)", hi: "फॉर्म 6 — नया वोटर पंजीकरण (घरेलू)" } },
  { id: "form6a", label: { en: "Form 6A — Overseas Elector", te: "ఫారం 6A — విదేశీ ఓటర్", hi: "फॉर्म 6A — विदेशी मतदाता" } },
];

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = {
  form6: [
    { id: "personal", title: { en: "Personal Details", te: "వ్యక్తిగత వివరాలు", hi: "व्यक्तिगत विवरण" } },
    { id: "address", title: { en: "Address Details", te: "చిరునామా వివరాలు", hi: "पते का विवरण" } },
    { id: "constituency", title: { en: "Constituency", te: "నియోజకవర్గం", hi: "निर्वाचन क्षेत्र" } },
    { id: "documents", title: { en: "Document Checklist", te: "పత్రాల జాబితా", hi: "दस्तावेज सूची" } },
    { id: "declaration", title: { en: "Declaration", te: "ప్రకటన", hi: "घोषणा" } },
  ],
  form6a: [
    { id: "personal", title: { en: "Personal Details", te: "వ్యక్తిగత వివరాలు", hi: "व्यक्तिगत विवरण" } },
    { id: "indiaAddress", title: { en: "Address in India", te: "భారతదేశంలో చిరునామా", hi: "भारत में पता" } },
    { id: "passport", title: { en: "Passport Details", te: "పాస్‌పోర్ట్ వివరాలు", hi: "पासपोर्ट विवरण" } },
    { id: "visa", title: { en: "Visa Details", te: "వీసా వివరాలు", hi: "वीज़ा विवरण" } },
    { id: "abroad", title: { en: "Address Abroad", te: "విదేశీ చిరునామా", hi: "विदेश का पता" } },
    { id: "documents", title: { en: "Document Checklist", te: "పత్రాల జాబితా", hi: "दस्तावेज सूची" } },
    { id: "declaration", title: { en: "Declaration", te: "ప్రకటన", hi: "घोषणा" } },
  ],
};

const LABELS = {
  en: { pageTitle: "Voter ID Draft Generator", subtitle: "Prepare your Form 6/6A application before applying on the official ECI portal", selectForm: "Select Form Type", next: "Next", prev: "Previous", generate: "Generate Draft", preview: "Draft Preview", download: "Download PDF", copy: "Copy to Clipboard", edit: "Edit", disclaimer: "This is a preparation tool only. It does NOT submit your application. To officially register, visit voters.eci.gov.in", free: "Registration is completely FREE", required: "Required", step: "Step", of: "of", complete: "Complete", copied: "Copied!", declarationText: "I hereby declare that all information given in this application is true. I am a citizen of India. I have not applied for inclusion of my name in any other constituency.", confirm: "I confirm the above declaration" },
  te: { pageTitle: "ఓటర్ ID డ్రాఫ్ట్ జనరేటర్", subtitle: "అధికారిక ECI పోర్టల్‌లో అప్లై చేయడానికి ముందు మీ ఫారం 6/6A దరఖాస్తును సిద్ధం చేయండి", selectForm: "ఫారం రకం ఎంచుకోండి", next: "తదుపరి", prev: "మునుపటి", generate: "డ్రాఫ్ట్ రూపొందించండి", preview: "డ్రాఫ్ట్ ప్రివ్యూ", download: "PDF డౌన్‌లోడ్", copy: "కాపీ చేయండి", edit: "సవరించండి", disclaimer: "ఇది సిద్ధం చేసే సాధనం మాత్రమే. ఇది మీ దరఖాస్తును సమర్పించదు. అధికారికంగా రిజిస్టర్ చేయడానికి voters.eci.gov.in సందర్శించండి", free: "రిజిస్ట్రేషన్ పూర్తిగా ఉచితం", required: "తప్పనిసరి", step: "స్టెప్", of: "లో", complete: "పూర్తయింది", copied: "కాపీ చేయబడింది!", declarationText: "నేను ఈ దరఖాస్తులో ఇచ్చిన సమాచారం మొత్తం నిజమని ప్రకటిస్తున్నాను. నేను భారత పౌరుడిని. నేను మరే ఇతర నియోజకవర్గంలో నా పేరు చేర్పు కోసం దరఖాస్తు చేయలేదు.", confirm: "పై ప్రకటనను నేను ధృవీకరిస్తున్నాను" },
  hi: { pageTitle: "वोटर ID ड्राफ्ट जनरेटर", subtitle: "आधिकारिक ECI पोर्टल पर आवेदन करने से पहले अपना फॉर्म 6/6A तैयार करें", selectForm: "फॉर्म प्रकार चुनें", next: "अगला", prev: "पिछला", generate: "ड्राफ्ट बनाएँ", preview: "ड्राफ्ट प्रीव्यू", download: "PDF डाउनलोड", copy: "कॉपी करें", edit: "संपादित करें", disclaimer: "यह केवल तैयारी का साधन है। यह आपका आवेदन जमा नहीं करता। आधिकारिक पंजीकरण के लिए voters.eci.gov.in पर जाएँ", free: "पंजीकरण पूरी तरह मुफ्त है", required: "आवश्यक", step: "चरण", of: "में से", complete: "पूर्ण", copied: "कॉपी किया!", declarationText: "मैं घोषणा करता/करती हूँ कि इस आवेदन में दी गई सभी जानकारी सत्य है। मैं भारत का नागरिक हूँ। मैंने किसी अन्य निर्वाचन क्षेत्र में अपना नाम शामिल करने के लिए आवेदन नहीं किया है।", confirm: "मैं उपरोक्त घोषणा की पुष्टि करता/करती हूँ" },
};

// ── Field definitions ─────────────────────────────────────────────────────────
const FIELDS = {
  personal: [
    { id: "firstName", label: { en: "First Name", te: "మొదటి పేరు", hi: "पहला नाम" }, required: true },
    { id: "lastName", label: { en: "Last Name", te: "ఇంటి పేరు", hi: "उपनाम" }, required: true },
    { id: "relativeName", label: { en: "Father/Mother/Husband Name", te: "తండ్రి/తల్లి/భర్త పేరు", hi: "पिता/माता/पति का नाम" }, required: true },
    { id: "relation", label: { en: "Relation", te: "సంబంధం", hi: "संबंध" }, type: "select", options: ["Father", "Mother", "Husband"], required: true },
    { id: "dob", label: { en: "Date of Birth", te: "పుట్టిన తేదీ", hi: "जन्म तिथि" }, type: "date", required: true },
    { id: "gender", label: { en: "Gender", te: "లింగం", hi: "लिंग" }, type: "select", options: ["Male", "Female", "Other"], required: true },
    { id: "mobile", label: { en: "Mobile Number", te: "మొబైల్ నంబర్", hi: "मोबाइल नंबर" }, required: true },
    { id: "email", label: { en: "Email ID", te: "ఈమెయిల్", hi: "ईमेल" }, required: false },
  ],
  address: [
    { id: "houseNo", label: { en: "House No.", te: "ఇంటి నం.", hi: "मकान नं." }, required: true },
    { id: "street", label: { en: "Street / Area / Locality", te: "వీధి / ప్రాంతం", hi: "गली / क्षेत्र" }, required: true },
    { id: "town", label: { en: "Town / Village", te: "పట్టణం / గ్రామం", hi: "शहर / गाँव" }, required: true },
    { id: "postOffice", label: { en: "Post Office", te: "పోస్ట్ ఆఫీస్", hi: "डाकघर" }, required: true },
    { id: "district", label: { en: "District", te: "జిల్లా", hi: "जिला" }, required: true },
    { id: "state", label: { en: "State", te: "రాష్ట్రం", hi: "राज्य" }, required: true },
    { id: "pinCode", label: { en: "PIN Code", te: "పిన్ కోడ్", hi: "पिन कोड" }, required: true },
  ],
  indiaAddress: [
    { id: "indiaHouseNo", label: { en: "House No.", te: "ఇంటి నం.", hi: "मकान नं." }, required: true },
    { id: "indiaStreet", label: { en: "Street / Area / Locality", te: "వీధి / ప్రాంతం", hi: "गली / क्षेत्र" }, required: true },
    { id: "indiaTown", label: { en: "Town / Village", te: "పట్టణం / గ్రామం", hi: "शहर / गाँव" }, required: true },
    { id: "indiaPostOffice", label: { en: "Post Office", te: "పోస్ట్ ఆఫీస్", hi: "डाकघर" }, required: true },
    { id: "indiaDistrict", label: { en: "District", te: "జిల్లా", hi: "जिला" }, required: true },
    { id: "indiaPinCode", label: { en: "PIN Code", te: "పిన్ కోడ్", hi: "पिन कोड" }, required: true },
  ],
  constituency: [
    { id: "constituencyState", label: { en: "State", te: "రాష్ట్రం", hi: "राज्य" }, required: true },
    { id: "constituencyDistrict", label: { en: "District", te: "జిల్లా", hi: "जिला" }, required: true },
    { id: "constituencyName", label: { en: "Assembly Constituency", te: "అసెంబ్లీ నియోజకవర్గం", hi: "विधानसभा क्षेत्र" }, required: true },
  ],
  passport: [
    { id: "passportNo", label: { en: "Passport Number", te: "పాస్‌పోర్ట్ నంబర్", hi: "पासपोर्ट नंबर" }, required: true },
    { id: "passportPlace", label: { en: "Place of Issue", te: "జారీ స్థలం", hi: "जारी करने का स्थान" }, required: true },
    { id: "passportIssue", label: { en: "Date of Issue", te: "జారీ తేదీ", hi: "जारी करने की तिथि" }, type: "date", required: true },
    { id: "passportExpiry", label: { en: "Date of Expiry", te: "ముగింపు తేదీ", hi: "समाप्ति तिथि" }, type: "date", required: true },
  ],
  visa: [
    { id: "visaNo", label: { en: "Visa Number", te: "వీసా నంబర్", hi: "वीज़ा नंबर" }, required: false },
    { id: "visaIssue", label: { en: "Date of Issue", te: "జారీ తేదీ", hi: "जारी तिथि" }, type: "date", required: false },
    { id: "visaExpiry", label: { en: "Date of Expiry", te: "ముగింపు తేదీ", hi: "समाप्ति तिथि" }, type: "date", required: false },
    { id: "visaType", label: { en: "Type of Visa", te: "వీసా రకం", hi: "वीज़ा प्रकार" }, required: false },
    { id: "visaAuthority", label: { en: "Issuing Authority", te: "జారీ అధికారం", hi: "जारीकर्ता प्राधिकरण" }, required: false },
  ],
  abroad: [
    { id: "abroadHouseNo", label: { en: "House No.", te: "ఇంటి నం.", hi: "मकान नं." }, required: true },
    { id: "abroadStreet", label: { en: "Street / Area", te: "వీధి / ప్రాంతం", hi: "गली / क्षेत्र" }, required: true },
    { id: "abroadTown", label: { en: "Town / City", te: "పట్టణం", hi: "शहर" }, required: true },
    { id: "abroadState", label: { en: "State / Province", te: "రాష్ట్రం / ప్రాంతం", hi: "राज्य / प्रांत" }, required: true },
    { id: "abroadCountry", label: { en: "Country", te: "దేశం", hi: "देश" }, required: true },
    { id: "abroadZip", label: { en: "Zip Code", te: "జిప్ కోడ్", hi: "ज़िप कोड" }, required: true },
    { id: "reasonAbsence", label: { en: "Reason for Absence", te: "దూరంగా ఉండటానికి కారణం", hi: "अनुपस्थिति का कारण" }, type: "select", options: ["Education", "Employment", "Other"], required: true },
    { id: "absenceDate", label: { en: "Date of leaving India", te: "భారతదేశం విడిచిన తేదీ", hi: "भारत छोड़ने की तिथि" }, type: "date", required: true },
  ],
};

// ── Document checklists ───────────────────────────────────────────────────────
const DOCS_FORM6 = [
  { en: "Age Proof: Birth Certificate / Class 10 Certificate / Aadhaar / Passport", te: "వయసు రుజువు: జనన ధృవీకరణ పత్రం / 10వ తరగతి సర్టిఫికేట్ / ఆధార్ / పాస్‌పోర్ట్", hi: "आयु प्रमाण: जन्म प्रमाणपत्र / 10वीं कक्षा प्रमाणपत्र / आधार / पासपोर्ट" },
  { en: "Address Proof: Aadhaar / Utility Bill / Rent Agreement / Bank Passbook", te: "చిరునామా రుజువు: ఆధార్ / యుటిలిటీ బిల్లు / రెంట్ అగ్రిమెంట్ / బ్యాంక్ పాస్‌బుక్", hi: "पते का प्रमाण: आधार / यूटिलिटी बिल / रेंट एग्रीमेंट / बैंक पासबुक" },
  { en: "Passport-size Photograph (recent, white background)", te: "పాస్‌పోర్ట్ సైజ్ ఫోటో (ఇటీవలి, తెలుపు నేపథ్యం)", hi: "पासपोर्ट साइज फोटो (हाल की, सफ़ेद बैकग्राउंड)" },
];
const DOCS_FORM6A = [
  { en: "Recent Passport-size Photograph (3.5cm x 3.5cm)", te: "ఇటీవలి పాస్‌పోర్ట్ సైజ్ ఫోటో (3.5cm x 3.5cm)", hi: "हाल की पासपोर्ट साइज फोटो (3.5cm x 3.5cm)" },
  { en: "Valid Passport pages (self-attested copy)", te: "చెల్లుబాటు అయ్యే పాస్‌పోర్ట్ పేజీలు (సెల్ఫ్-అటెస్టెడ్ కాపీ)", hi: "वैध पासपोर्ट पेज (स्व-सत्यापित प्रति)" },
  { en: "Current valid Visa pages", te: "ప్రస్తుత చెల్లుబాటు అయ్యే వీసా పేజీలు", hi: "वर्तमान वैध वीज़ा पेज" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function VoterIdDraftPage() {
  const { language } = useLanguage();
  const L = LABELS[language] || LABELS.en;

  const [formType, setFormType] = useState(null); // "form6" | "form6a"
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [docChecks, setDocChecks] = useState({});
  const [declared, setDeclared] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState("");

  const steps = formType ? STEPS[formType] : [];
  const currentStepDef = steps[currentStep];

  const getLabel = (obj) => (typeof obj === "object" ? (obj[language] || obj.en) : obj);

  const updateField = (id, value) => setFormData(prev => ({ ...prev, [id]: value }));

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else setShowPreview(true);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const copyToClipboard = () => {
    const text = Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    setToast(L.copied);
    setTimeout(() => setToast(""), 2000);
  };

  // ── Render field ────────────────────────────────────────────────────────────
  const renderField = (field) => {
    const label = getLabel(field.label);
    const value = formData[field.id] || "";

    if (field.type === "select") {
      return (
        <div key={field.id} className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {field.required && <span className="text-red-500">*</span>}</label>
          <select value={value} onChange={e => updateField(field.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a3a5c] focus:ring-1 focus:ring-[#1a3a5c]/20">
            <option value="">--</option>
            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }
    if (field.type === "date") {
      return (
        <div key={field.id} className="mb-3">
          <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {field.required && <span className="text-red-500">*</span>}</label>
          <input type="date" value={value} onChange={e => updateField(field.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a3a5c]" />
        </div>
      );
    }
    return (
      <div key={field.id} className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {field.required && <span className="text-red-500">*</span>}</label>
        <input type="text" value={value} onChange={e => updateField(field.id, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a3a5c]" placeholder={label} />
      </div>
    );
  };

  // ── Render current step content ─────────────────────────────────────────────
  const renderStepContent = () => {
    if (!currentStepDef) return null;
    const stepId = currentStepDef.id;

    // Document checklist step
    if (stepId === "documents") {
      const docs = formType === "form6" ? DOCS_FORM6 : DOCS_FORM6A;
      return (
        <div className="space-y-3">
          {docs.map((doc, i) => (
            <label key={i} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={!!docChecks[i]} onChange={() => setDocChecks(p => ({ ...p, [i]: !p[i] }))} className="mt-0.5 accent-[#1a3a5c]" />
              <span className="text-sm text-gray-700">{doc[language] || doc.en}</span>
            </label>
          ))}
        </div>
      );
    }

    // Declaration step
    if (stepId === "declaration") {
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {L.declarationText}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={declared} onChange={() => setDeclared(!declared)} className="accent-[#1a3a5c]" />
            <span className="text-sm font-medium text-[#1a3a5c]">{L.confirm}</span>
          </label>
        </div>
      );
    }

    // Regular form fields
    const fields = FIELDS[stepId];
    if (!fields) return <p className="text-gray-400 text-sm">No fields defined for this step.</p>;
    return <div className="grid gap-0">{fields.map(renderField)}</div>;
  };

  // ── Preview ─────────────────────────────────────────────────────────────────
  if (showPreview) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          <h1 className="text-xl font-black text-[#1a3a5c] mb-2">{L.preview}</h1>
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 mb-6">
            {Object.entries(formData).filter(([,v]) => v).map(([key, val]) => {
              const allFields = Object.values(FIELDS).flat();
              const field = allFields.find(f => f.id === key);
              const label = field ? getLabel(field.label) : key;
              return (
                <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-semibold text-gray-500">{label}</span>
                  <span className="text-sm text-gray-800">{val}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowPreview(false)} className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              <ChevronLeft size={14} /> {L.edit}
            </button>
            <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1a3a5c] text-white rounded-lg hover:bg-[#0f2540]">
              <ClipboardCopy size={14} /> {L.copy}
            </button>
          </div>
          {toast && <p className="mt-3 text-sm text-green-600 font-medium">{toast}</p>}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">{L.disclaimer}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page header */}
      <div className="bg-[#1a3a5c] px-4 py-6 text-white">
        <div className="max-w-3xl mx-auto">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-white">Home</Link> <span>/</span>
            <Link href="/services" className="hover:text-white">Services</Link> <span>/</span>
            <span className="text-gray-200">{L.pageTitle}</span>
          </nav>
          <h1 className="text-xl font-black flex items-center gap-2"><FileText size={20} /> {L.pageTitle}</h1>
          <p className="text-gray-300 text-sm mt-1">{L.subtitle}</p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Disclaimer */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-800">{L.free}. {L.disclaimer}</p>
        </div>

        {/* Form type selection */}
        {!formType && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#1a3a5c] mb-3">{L.selectForm}</h2>
            {FORM_TYPES.map(ft => (
              <button key={ft.id} onClick={() => setFormType(ft.id)} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#1a3a5c] hover:shadow-sm transition-all flex items-center gap-3">
                <User size={20} className="text-[#1a3a5c]" />
                <span className="font-semibold text-sm text-[#1a3a5c]">{getLabel(ft.label)}</span>
                <ChevronRight size={14} className="ml-auto text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {/* Step wizard */}
        {formType && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {steps.map((s, i) => (
                <div key={s.id} className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? "bg-[#1a3a5c]" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-1">{L.step} {currentStep + 1} {L.of} {steps.length}</p>
            <h2 className="text-lg font-bold text-[#1a3a5c] mb-4">{getLabel(currentStepDef.title)}</h2>

            {/* Step content */}
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft size={14} /> {L.prev}
              </button>
              <button onClick={handleNext} disabled={currentStepDef.id === "declaration" && !declared} className="flex items-center gap-1 px-4 py-2 text-sm bg-[#1a3a5c] text-white rounded-lg hover:bg-[#0f2540] disabled:opacity-30">
                {currentStep === steps.length - 1 ? L.generate : L.next} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

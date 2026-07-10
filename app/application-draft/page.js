"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SERVICE_DOCUMENTS, getAvailableServices, getServiceDocuments } from "../../lib/constants/serviceDocuments";

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ApplicationDraftPage() {
  const [selectedService, setSelectedService] = useState("");
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showOptional, setShowOptional] = useState(false);
  const fileInputRefs = useRef({});

  const services = getAvailableServices();
  const serviceConfig = getServiceDocuments(selectedService);

  // Reset everything when service changes
  useEffect(() => {
    setFiles({});
    setUploading({});
    setFileErrors({});
    setDraft(null);
    setShowOptional(false);
    // Clear all file input refs
    Object.values(fileInputRefs.current).forEach(ref => {
      if (ref) ref.value = "";
    });
  }, [selectedService]);

  function handleFileSelect(slotId, e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileErrors(prev => ({ ...prev, [slotId]: "Invalid format. Use PDF, PNG, or JPG." }));
      return;
    }
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors(prev => ({ ...prev, [slotId]: "File too large. Maximum 5MB allowed." }));
      return;
    }

    // Clear error and simulate upload
    setFileErrors(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    setUploading(prev => ({ ...prev, [slotId]: true }));
    setTimeout(() => {
      setFiles(prev => ({ ...prev, [slotId]: file }));
      setUploading(prev => ({ ...prev, [slotId]: false }));
    }, 600);
  }

  function removeFile(slotId) {
    setFiles(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    setFileErrors(prev => { const n = { ...prev }; delete n[slotId]; return n; });
    if (fileInputRefs.current[slotId]) fileInputRefs.current[slotId].value = "";
  }

  function handleGenerate() {
    if (!selectedService || !serviceConfig) return;

    // Check required documents
    const missing = serviceConfig.required.filter(doc => !files[doc.id]);
    if (missing.length > 0) {
      const missingErrors = {};
      missing.forEach(doc => { missingErrors[doc.id] = "Required document not uploaded"; });
      setFileErrors(prev => ({ ...prev, ...missingErrors }));
      return;
    }

    // If service has a dedicated draft route, redirect
    if (serviceConfig.draftRoute) {
      window.location.href = serviceConfig.draftRoute;
      return;
    }

    // Generic draft generation for services without dedicated pages
    setGenerating(true);
    setTimeout(() => {
      const uploadedDocs = Object.keys(files).map(id => {
        const allDocs = [...serviceConfig.required, ...(serviceConfig.optional || [])];
        const doc = allDocs.find(d => d.id === id);
        return doc ? doc.label : id;
      });
      setDraft({
        service: serviceConfig.name,
        message: `Documents received for ${serviceConfig.name}. OCR extraction and draft generation ready.`,
        fields: [
          { label: "Service", value: serviceConfig.name },
          { label: "Documents Uploaded", value: uploadedDocs.join(", ") },
          { label: "Total Files", value: String(Object.keys(files).length) },
          { label: "Official Portal", value: serviceConfig.officialPortal },
          { label: "Status", value: "Ready for processing" },
        ],
      });
      setGenerating(false);
    }, 1500);
  }

  // Compute upload stats
  const requiredDocs = serviceConfig?.required || [];
  const optionalDocs = serviceConfig?.optional || [];
  const requiredUploaded = requiredDocs.filter(d => files[d.id]).length;
  const totalUploaded = Object.keys(files).length;
  const allRequiredDone = requiredDocs.length > 0 && requiredUploaded === requiredDocs.length;

  // Render a single document upload slot
  function renderDocSlot(doc, isRequired) {
    const hasFile = !!files[doc.id];
    const isUploading = !!uploading[doc.id];
    const error = fileErrors[doc.id];

    return (
      <div key={doc.id} className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${error ? "border-red-300 bg-red-50" : hasFile ? "border-green-200 bg-green-50" : "border-gray-100 hover:border-gray-300"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-700">{doc.label}</span>
            {isRequired && <span className="text-[10px] text-red-500 font-bold">*</span>}
            {doc.ocrEnabled && <span className="text-[9px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">OCR</span>}
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">{doc.hint}</p>
          {hasFile && (
            <p className="text-xs text-green-600 mt-0.5 truncate flex items-center gap-1">
              <CheckCircle2 size={11} /> {files[doc.id].name}
              <span className="text-[9px] text-gray-400 ml-1">({(files[doc.id].size / 1024).toFixed(0)} KB)</span>
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
              <AlertCircle size={11} /> {error}
            </p>
          )}
        </div>

        {isUploading ? (
          <Loader2 size={16} className="text-[#1a3a5c] animate-spin flex-shrink-0" />
        ) : hasFile ? (
          <button onClick={() => removeFile(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Remove">
            <X size={14} />
          </button>
        ) : (
          <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] transition-colors flex-shrink-0 px-3 py-1.5 border border-[#1a3a5c] rounded-lg hover:border-[#C89A2B]">
            <Upload size={12} />
            Choose
            <input
              ref={el => { fileInputRefs.current[doc.id] = el; }}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={e => handleFileSelect(doc.id, e)}
            />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page header */}
      <div className="bg-[#1a3a5c] px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-200">Application Draft</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <Sparkles size={12} className="text-[#C89A2B]" />
            AI-Powered • Beta
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">AI Application Draft Generator</h1>
          <p className="text-gray-300 text-sm mt-2 max-w-lg mx-auto">
            Select a service, upload the required documents, and let SevaSetu prepare your application draft.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ── Left: Form ── */}
          <div className="space-y-6">

            {/* Service selector */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                1. Select Government Service
              </label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] transition-all"
              >
                <option value="">Choose a government service...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.hasFullDraft ? "✦" : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                {selectedService && serviceConfig
                  ? <>Documents required for <strong>{serviceConfig.name}</strong> will appear below.</>
                  : "Select a service to see its specific document requirements."
                }
              </p>
              {selectedService && serviceConfig?.draftRoute && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                  <CheckCircle2 size={11} />
                  Full AI Draft Generator available — upload docs below or <Link href={serviceConfig.draftRoute} className="underline font-semibold hover:text-green-900">go directly →</Link>
                </div>
              )}
            </div>

            {/* Dynamic document uploads — only shown when service is selected */}
            {selectedService && serviceConfig ? (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500">
                    2. Upload Required Documents
                  </label>
                  <span className="text-xs font-semibold text-[#1a3a5c]">
                    {requiredUploaded}/{requiredDocs.length} required
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Accepted: PDF, PNG, JPG, JPEG (max 5MB each)</p>

                {/* Required documents */}
                <div className="space-y-2.5">
                  {requiredDocs.map(doc => renderDocSlot(doc, true))}
                </div>

                {/* Progress bar */}
                {requiredDocs.length > 0 && (
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${allRequiredDone ? "bg-green-500" : "bg-[#1a3a5c]"}`}
                        style={{ width: `${(requiredUploaded / requiredDocs.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {allRequiredDone ? "✓ All required documents uploaded" : `${requiredDocs.length - requiredUploaded} required document(s) remaining`}
                    </p>
                  </div>
                )}

                {/* Optional documents toggle */}
                {optionalDocs.length > 0 && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => setShowOptional(!showOptional)}
                      className="text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] flex items-center gap-1 transition-colors"
                    >
                      <ChevronRight size={12} className={`transition-transform ${showOptional ? "rotate-90" : ""}`} />
                      Optional Documents ({optionalDocs.length})
                    </button>
                    {showOptional && (
                      <div className="space-y-2.5 mt-3">
                        {optionalDocs.map(doc => renderDocSlot(doc, false))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
                <Upload size={28} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">Select a service above to see document requirements</p>
                <p className="text-xs text-gray-300 mt-1">Each service has its own specific documents</p>
              </div>
            )}

            {/* Generate button */}
            {selectedService && serviceConfig && (
              <button
                onClick={handleGenerate}
                disabled={generating || !allRequiredDone}
                className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {generating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing Documents...
                  </>
                ) : serviceConfig.draftRoute ? (
                  <>
                    <Sparkles size={16} />
                    Continue to Full Draft Generator →
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Application Draft
                  </>
                )}
              </button>
            )}
          </div>

          {/* ── Right: Preview & Info ── */}
          <div className="space-y-4">
            {/* Draft Preview */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm min-h-[280px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-[#1a3a5c]" />
                <h3 className="text-sm font-bold text-[#1a3a5c]">Draft Preview</h3>
              </div>

              {!draft ? (
                <div className="flex-1 flex items-center justify-center text-center px-4">
                  <div>
                    <FileText size={28} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">
                      {selectedService ? "Upload required documents and click Generate." : "Select a service to begin."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">{draft.message}</p>
                  </div>
                  {draft.fields.map((f, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-500">{f.label}</span>
                      <span className="text-xs font-semibold text-[#1a3a5c] text-right max-w-[180px] truncate">{f.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service info card */}
            {selectedService && serviceConfig && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-1">{serviceConfig.name}</p>
                <p className="text-[11px] text-blue-700">
                  Official Portal: <a href={serviceConfig.officialPortal} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{serviceConfig.officialPortal.replace("https://", "")}</a>
                </p>
                <p className="text-[10px] text-blue-600 mt-1.5">
                  Required: {requiredDocs.length} documents • Optional: {optionalDocs.length} documents
                </p>
              </div>
            )}

            {/* Privacy notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-2.5">
              <Lock size={14} className="text-[#2E8B57] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">Privacy Notice</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your uploaded files are used only for generating this draft and are never permanently stored. All processing happens securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

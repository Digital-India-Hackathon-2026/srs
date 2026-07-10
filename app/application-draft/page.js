"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SERVICES = [
  { id: "passport", name: "Passport (Fresh / Reissue)" },
  { id: "learner-licence", name: "Learner Driving Licence" },
];

const DOCUMENT_SLOTS = [
  { id: "aadhaar", label: "Aadhaar Card", required: true },
  { id: "pan", label: "PAN Card", required: false },
  { id: "photo", label: "Passport Photo", required: true },
  { id: "address-proof", label: "Address Proof", required: true },
  { id: "other", label: "Other Document", required: false },
];

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ApplicationDraftPage() {
  const [selectedService, setSelectedService] = useState("");
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const fileInputRefs = useRef({});

  function handleFileSelect(slotId, e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be under 5MB.");
      return;
    }

    // Simulate upload progress
    setUploading((prev) => ({ ...prev, [slotId]: true }));
    setTimeout(() => {
      setFiles((prev) => ({ ...prev, [slotId]: file }));
      setUploading((prev) => ({ ...prev, [slotId]: false }));
    }, 800);
  }

  function removeFile(slotId) {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    if (fileInputRefs.current[slotId]) {
      fileInputRefs.current[slotId].value = "";
    }
  }

  function handleGenerate() {
    if (!selectedService) {
      alert("Please select a service first.");
      return;
    }
    const requiredSlots = DOCUMENT_SLOTS.filter((s) => s.required);
    const missing = requiredSlots.filter((s) => !files[s.id]);
    if (missing.length > 0) {
      alert(`Please upload: ${missing.map((s) => s.label).join(", ")}`);
      return;
    }

    // Placeholder — will trigger OCR in future
    setGenerating(true);
    setTimeout(() => {
      setDraft({
        service: selectedService,
        message: "OCR and draft generation will be implemented in the next phase. Your documents have been received and validated successfully.",
        fields: [
          { label: "Service Selected", value: SERVICES.find((s) => s.id === selectedService)?.name },
          { label: "Documents Uploaded", value: Object.keys(files).length },
          { label: "Status", value: "Ready for OCR processing" },
        ],
      });
      setGenerating(false);
    }, 2000);
  }

  const uploadedCount = Object.keys(files).length;

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
            Upload your documents and let SevaSetu prepare a copy-ready government application draft.
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
                1. Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-[#1a3a5c] transition-all"
              >
                <option value="">Choose a government service...</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1.5">More services will be added soon.</p>
            </div>

            {/* Document uploads */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                2. Upload Documents
              </label>
              <p className="text-xs text-gray-400 mb-4">Accepted: PDF, PNG, JPG (max 5MB each)</p>

              <div className="space-y-3">
                {DOCUMENT_SLOTS.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-700">{slot.label}</span>
                        {slot.required && <span className="text-[10px] text-red-500 font-bold">*</span>}
                      </div>
                      {files[slot.id] && (
                        <p className="text-xs text-green-600 mt-0.5 truncate flex items-center gap-1">
                          <CheckCircle2 size={11} /> {files[slot.id].name}
                        </p>
                      )}
                    </div>

                    {uploading[slot.id] ? (
                      <Loader2 size={16} className="text-[#1a3a5c] animate-spin flex-shrink-0" />
                    ) : files[slot.id] ? (
                      <button
                        onClick={() => removeFile(slot.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    ) : (
                      <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] hover:text-[#C89A2B] transition-colors flex-shrink-0">
                        <Upload size={13} />
                        Upload
                        <input
                          ref={(el) => { fileInputRefs.current[slot.id] = el; }}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleFileSelect(slot.id, e)}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {uploadedCount > 0 && (
                <p className="text-xs text-gray-500 mt-3">
                  {uploadedCount} of {DOCUMENT_SLOTS.length} documents uploaded
                </p>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !selectedService}
              className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Application Draft
                </>
              )}
            </button>
          </div>

          {/* ── Right: Draft Preview ── */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm min-h-[300px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-[#1a3a5c]" />
                <h3 className="text-sm font-bold text-[#1a3a5c]">Draft Preview</h3>
              </div>

              {!draft ? (
                <div className="flex-1 flex items-center justify-center text-center px-4">
                  <div>
                    <FileText size={32} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">
                      Your generated application draft will appear here.
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Select a service, upload documents, and click Generate.
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
                      <span className="text-xs font-semibold text-[#1a3a5c]">{f.value}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 pt-2">
                    Full OCR-powered draft generation coming in the next release.
                  </p>
                </div>
              )}
            </div>

            {/* Privacy notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-2.5">
              <Lock size={14} className="text-[#2E8B57] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">Privacy Notice</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your uploaded files are used only for generating this draft and are never permanently stored. All processing happens locally.
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

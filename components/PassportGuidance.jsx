"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Info,
  MapPin,
  Shield,
  Timer,
  User,
} from "lucide-react";

const SITUATIONS = [
  {
    id: "college-student",
    icon: <GraduationCap size={16} className="text-[#1a3a5c]" />,
    title: "I'm a college student living away from home",
    guidance: [
      "If applying from a hostel or college address, additional address verification documents may be required depending on Passport Seva rules.",
      "Carry your original college ID card.",
      "Carry a bonafide certificate if your institution provides one.",
      "Carry original educational documents if they are being used as proof.",
      "If your Passport Seva Kendra requests additional supporting documents, follow their instructions.",
    ],
    important: "In certain cases, depending on the applicant's circumstances or verification requirements, additional supporting documents such as bonafide certificates, hostel proof, or other documents may be requested.",
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "class10-dob",
    icon: <BookOpen size={16} className="text-[#1a3a5c]" />,
    title: "Using Class 10 Certificate as Date of Birth Proof",
    guidance: [
      "Carry the original SSC/Class 10 certificate or marks memo.",
      "Ensure it is in good condition and clearly readable.",
      "Verify that the date of birth on it matches all other identity documents (Aadhaar, PAN, etc.).",
      "If any mismatch exists between documents, get it corrected before applying to avoid delays.",
    ],
    important: "Name and DOB must be consistent across all submitted documents. Any discrepancy may result in additional verification or rejection.",
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "name-mismatch",
    icon: <User size={16} className="text-[#1a3a5c]" />,
    title: "Name Mismatch Across Documents",
    guidance: [
      "If Aadhaar, PAN, SSC certificate, or other documents have different names or spellings, the passport application may be delayed or additional clarification may be required.",
      "Common mismatches: initials vs full name, middle name present/absent, spelling differences.",
      "Get documents corrected before applying if possible — Aadhaar name update takes 7–10 days.",
      "If correction is not possible before applying, carry all documents and be prepared to explain the difference at PSK.",
    ],
    important: "Passport Seva officials may ask for an affidavit or gazette notification if name discrepancies are significant. Minor differences (like initials) are usually handled at PSK discretion.",
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "address-mismatch",
    icon: <MapPin size={16} className="text-[#1a3a5c]" />,
    title: "Current and Permanent Address are Different",
    guidance: [
      "If your current (present) address and permanent address are different, keep appropriate address proof for both ready.",
      "Police verification is generally conducted at the address provided in the application form.",
      "Ensure you are reachable at the address you provide — if police visit and you are not available, verification may fail.",
      "For rented accommodation: carry rent agreement, landlord details, and Aadhaar with current address.",
    ],
    important: "Update your Aadhaar address to your current residential address before applying. This is the single most important step to avoid police verification issues.",
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "appointment-tips",
    icon: <Timer size={16} className="text-[#1a3a5c]" />,
    title: "Appointment Day — What to Expect",
    guidance: [
      "Reach the PSK/POPSK at least 30 minutes before your scheduled appointment time.",
      "Carry all original documents along with self-attested photocopies.",
      "Carry the printed appointment confirmation slip and application receipt with ARN number.",
      "Expect 4 counters: Document Verification → Biometrics → Photo Capture → Final Verification.",
      "Total time at PSK is typically 1–3 hours depending on queue and documentation.",
      "Do not carry restricted items (electronics, large bags) — security check is done at entrance.",
    ],
    important: "If you arrive late beyond a reasonable window, you may be asked to reschedule. Morning slots generally have shorter wait times.",
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "police-verification",
    icon: <Shield size={16} className="text-[#1a3a5c]" />,
    title: "Preparing for Police Verification",
    guidance: [
      "Keep original Aadhaar, application receipt, and address proof documents accessible at your home.",
      "Ensure the address in your application exactly matches your Aadhaar and utility bills.",
      "Inform family members that a police officer may visit for verification.",
      "Stay reachable on your registered mobile number during the verification period (2–4 weeks after PSK visit).",
      "Cooperate fully with the verification officer — provide clear answers.",
      "If you live in a rented property, keep your rent agreement and landlord's contact ready.",
    ],
    important: "Police verification is a standard government process. Do not make any payment to the verifying officer — report any such request to the Passport Seva grievance portal.",
    source: "https://www.passportindia.gov.in",
  },
];

function GuidanceCard({ situation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a3a5c]/30 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0">{situation.icon}</div>
        <span className="flex-1 text-sm font-semibold text-[#1a3a5c]">{situation.title}</span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {/* Guidance points */}
          <div className="space-y-2">
            {situation.guidance.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a5c] flex-shrink-0 mt-2" />
                <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          {/* Important note */}
          <div className="bg-[#fff8e8] border border-[#f0d68a] rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={13} className="text-[#C89A2B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#7a5a00] leading-relaxed">
              <strong>Important:</strong> {situation.important}
            </p>
          </div>

          {/* Source */}
          {situation.source && (
            <p className="text-[10px] text-gray-400">
              Official source: <a href={situation.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{situation.source}</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PassportGuidanceSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-[#C89A2B]">
      <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
        <Info size={13} /> Important Situations & Practical Guidance
      </div>
      <div className="p-4 space-y-3">
        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 mb-4">
          <Info size={12} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800 leading-relaxed">
            These are practical guidance notes intended to help applicants prepare better. Depending on individual circumstances and Passport Seva verification, additional documents or procedures may be required. Always follow instructions given by Passport Seva officials.
          </p>
        </div>

        {/* Situation cards */}
        {SITUATIONS.map((s) => (
          <GuidanceCard key={s.id} situation={s} />
        ))}
      </div>
    </div>
  );
}

"use client";

export const QUICK_CHIPS = [
  { label: "Passport",              id: "passport" },
  { label: "Aadhaar",               id: "aadhaar" },
  { label: "Income Certificate",    id: "income-certificate" },
  { label: "Caste Certificate",     id: "caste-certificate" },
  { label: "Driving Licence",       id: "driving-licence" },
  { label: "PAN Card",              id: "pan" },
  { label: "Voter ID",              id: "voter-id" },
  { label: "Ration Card",           id: "ration-card" },
  { label: "Birth Certificate",     id: "birth-certificate" },
  { label: "Residence Certificate", id: "residence-certificate" },
  { label: "MeeSeva",               id: "meeseva" },
];

/** Per-service smart suggestion chips shown after user selects a service */
export const SERVICE_SUGGESTIONS = {
  passport: [
    { label: "📑 Required Documents", question: "What documents are required for a fresh passport?" },
    { label: "💰 Fees",               question: "What is the fee for passport?" },
    { label: "⏳ Processing Time",    question: "How many days does it take to get a passport?" },
    { label: "⚡ Tatkaal Process",    question: "How to apply for Tatkaal passport?" },
    { label: "🚔 Police Verification",question: "How does police verification work for passport?" },
    { label: "📍 Track Application",  question: "How to track my passport application status?" },
    { label: "🔄 Reschedule Appt.",   question: "How many times can I reschedule my passport appointment?" },
    { label: "🔒 Lost Passport",      question: "What to do if I lost my passport?" },
  ],
  aadhaar: [
    { label: "📱 Mobile Update",      question: "How to update mobile number in Aadhaar?" },
    { label: "🏠 Address Update",     question: "How to update address in Aadhaar?" },
    { label: "✍️ Name Correction",    question: "How to correct name in Aadhaar?" },
    { label: "📅 DOB Correction",     question: "How to correct date of birth in Aadhaar?" },
    { label: "🔬 Biometric Update",   question: "What is biometric update in Aadhaar?" },
    { label: "📥 Download e-Aadhaar", question: "How to download e-Aadhaar?" },
    { label: "💳 PVC Card",           question: "How to get PVC Aadhaar card?" },
    { label: "🔑 Forgot Number",      question: "What if I forgot my Aadhaar number?" },
  ],
  "income-certificate": [
    { label: "👤 Eligibility",        question: "Who can apply for income certificate in Telangana?" },
    { label: "📑 Required Documents", question: "What documents are needed for income certificate?" },
    { label: "⏳ Processing Time",    question: "How many days does income certificate take?" },
    { label: "🔄 Renewal",            question: "How to renew income certificate?" },
    { label: "💰 Fee",                question: "How much does income certificate cost?" },
    { label: "🌐 Apply Online",       question: "Can I apply for income certificate online?" },
    { label: "❓ No Income Proof",    question: "What if I have no salary certificate or income proof?" },
  ],
  "caste-certificate": [
    { label: "👤 Eligibility",        question: "Who can apply for caste certificate in Telangana?" },
    { label: "📑 Required Documents", question: "What documents are needed for caste certificate?" },
    { label: "⏳ Processing Time",    question: "How long does caste certificate take in Telangana?" },
    { label: "💰 Fee",                question: "What is the fee for caste certificate?" },
    { label: "⚠️ Common Mistakes",   question: "What mistakes should I avoid for caste certificate?" },
    { label: "❓ No Parent Cert",     question: "What if I don't have my parent's caste certificate?" },
  ],
  "driving-licence": [
    { label: "📋 Learner Licence",    question: "What is learner licence and how to get it?" },
    { label: "🚗 Permanent Licence",  question: "How to apply for driving licence?" },
    { label: "🔄 Renewal",            question: "How to renew driving licence?" },
    { label: "📑 Documents",          question: "What documents are needed for driving licence?" },
    { label: "💰 Fees",               question: "How much does driving licence cost?" },
    { label: "🔒 Lost DL",            question: "How to get duplicate driving licence?" },
    { label: "🌍 International",      question: "How to get international driving permit?" },
  ],
  pan: [
    { label: "⚡ Instant Free PAN",   question: "How to get instant PAN card free?" },
    { label: "📑 Documents",          question: "What documents are needed for PAN card?" },
    { label: "💰 Fee",                question: "How much does PAN card cost?" },
    { label: "🔗 Link with Aadhaar",  question: "How to link PAN with Aadhaar?" },
    { label: "🔒 Lost PAN",           question: "What if I lost my PAN card?" },
    { label: "✍️ Name Correction",    question: "How to correct wrong name on PAN?" },
    { label: "⚠️ Two PANs",          question: "Can I have two PAN numbers?" },
  ],
  "voter-id": [
    { label: "📑 Documents",          question: "What documents are needed for Voter ID?" },
    { label: "💰 Fee",                question: "What is the fee for Voter ID?" },
    { label: "⏳ Processing Time",    question: "How long does Voter ID take?" },
    { label: "📥 Download e-EPIC",    question: "How to download Voter ID online?" },
    { label: "🏠 Transfer Address",   question: "How to transfer Voter ID to new address?" },
    { label: "🔒 Lost Card",          question: "How to get duplicate Voter ID?" },
    { label: "✍️ Correction",         question: "How to correct name on Voter ID?" },
  ],
  "ration-card": [
    { label: "👤 Eligibility",        question: "Who is eligible for ration card in Telangana?" },
    { label: "📑 Documents",          question: "What documents are needed for ration card?" },
    { label: "⏳ Processing Time",    question: "How long does ration card take?" },
    { label: "➕ Add Member",         question: "How to add new member to ration card?" },
    { label: "💰 Fee",                question: "What is the fee for ration card?" },
    { label: "🔒 Lost Card",          question: "What if I lost my ration card?" },
  ],
  "birth-certificate": [
    { label: "📑 Documents",          question: "What documents are needed for birth certificate?" },
    { label: "⏳ Processing Time",    question: "How long does birth certificate take?" },
    { label: "🏛️ Where to Apply",    question: "Where do I apply for birth certificate in Telangana?" },
    { label: "⏱️ Late Registration",  question: "What if birth was not registered within 21 days?" },
    { label: "✍️ Name Correction",    question: "How to correct name on birth certificate?" },
  ],
  "residence-certificate": [
    { label: "📑 Documents",          question: "What documents are needed for residence certificate?" },
    { label: "👤 Eligibility",        question: "What is the eligibility for residence certificate?" },
    { label: "⏳ Processing Time",    question: "How long does residence certificate take?" },
    { label: "💰 Fee",                question: "What is the fee for residence certificate?" },
    { label: "🌐 Apply Online",       question: "Can I apply for residence certificate online?" },
  ],
  meeseva: [
    { label: "📋 Services List",      question: "What services are available at MeeSeva?" },
    { label: "☎ Helpline",            question: "What is the MeeSeva helpline number?" },
    { label: "📍 Find Centre",        question: "How to find nearest MeeSeva centre?" },
    { label: "💰 Fees",               question: "What are the fees at MeeSeva centres?" },
    { label: "⏳ Timings",            question: "What are MeeSeva centre working hours?" },
  ],
};

/** Example questions shown in empty chat state by service */
export const EXAMPLE_QUESTIONS = {
  passport: [
    "How many times can I reschedule my passport appointment?",
    "What if I miss my passport appointment?",
    "What documents are needed for fresh passport?",
    "What is Tatkaal passport and how to apply?",
    "How does police verification work?",
    "My passport shows HOLD status — what to do?",
  ],
  aadhaar: [
    "How to update mobile number in Aadhaar?",
    "How to update address in Aadhaar?",
    "What if my Aadhaar mobile number is not linked?",
    "How to download e-Aadhaar?",
    "What is biometric update in Aadhaar?",
  ],
  "income-certificate": [
    "What documents are needed for income certificate?",
    "Where should I apply for income certificate in Telangana?",
    "How long does income certificate take?",
    "What if my income certificate application is rejected?",
  ],
  "caste-certificate": [
    "What documents do I need for caste certificate?",
    "How long does caste certificate take in Telangana?",
    "What if I don't have my parent's caste certificate?",
    "What mistakes should I avoid for caste certificate?",
  ],
  "residence-certificate": [
    "What is a residence certificate and where to get it?",
    "What address proof is accepted for residence certificate?",
    "How long does residence certificate take?",
  ],
  "birth-certificate": [
    "Where to apply for birth certificate in Telangana?",
    "What if birth was not registered within 21 days?",
    "What documents are needed for birth certificate?",
  ],
  "driving-licence": [
    "How to apply for driving licence in Telangana?",
    "What is a Learner Licence and how to get it?",
    "What documents are needed for driving licence?",
    "What if my learner licence expired?",
  ],
  pan: [
    "How to get instant free PAN card?",
    "What documents are needed for PAN card?",
    "How to link PAN with Aadhaar?",
    "What if I lost my PAN card?",
  ],
  "voter-id": [
    "How to apply for Voter ID?",
    "How to download Voter ID online?",
    "What documents are needed for Voter ID?",
    "How to transfer Voter ID after moving?",
  ],
  "ration-card": [
    "Who is eligible for ration card in Telangana?",
    "How to add a new member to ration card?",
    "What if I cannot collect food due to biometric failure?",
  ],
  meeseva: [
    "What services are available at MeeSeva?",
    "What is the MeeSeva helpline number?",
    "How to find nearest MeeSeva centre?",
  ],
};

export default function QuickChips({ selectedService, onSelectService }) {
  return (
    <div className="flex gap-1.5 px-3 py-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
      {QUICK_CHIPS.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onSelectService(chip.id === selectedService ? "" : chip.id)}
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap flex-shrink-0 ${
            selectedService === chip.id
              ? "bg-[#163A63] text-white border-[#163A63]"
              : "bg-white text-[#163A63] border-[#163A63]/30 hover:border-[#163A63] hover:bg-[#f0f4f9]"
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

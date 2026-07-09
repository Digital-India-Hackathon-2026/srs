"use client";

export const QUICK_CHIPS = [
  { label: "Passport",             id: "passport" },
  { label: "Income Certificate",   id: "income-certificate" },
  { label: "Caste Certificate",    id: "caste-certificate" },
  { label: "Residence Certificate",id: "residence-certificate" },
  { label: "Birth Certificate",    id: "birth-certificate" },
  { label: "Driving Licence",      id: "driving-licence" },
  { label: "Aadhaar Update",       id: "aadhaar-update" },
  { label: "MeeSeva",              id: "meeseva" },
];

export const EXAMPLE_QUESTIONS = {
  passport: [
    "How many times can I reschedule my passport appointment?",
    "What if I miss my passport appointment?",
    "I've rescheduled multiple times and cannot attend the final date",
    "What if my address proof is rejected at PSK?",
    "What documents are needed for fresh passport?",
    "What is Tatkaal passport and how to apply?",
    "What is the difference between PSK, POPSK and RPO?",
    "My passport shows HOLD status. What should I do?",
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
  ],
  "aadhaar-update": [
    "How to update address in Aadhaar?",
    "What documents are needed to update Aadhaar?",
    "How long does Aadhaar update take?",
  ],
  meeseva: [
    "What services are available at MeeSeva?",
    "What is the MeeSeva helpline number?",
    "How to find nearest MeeSeva centre?",
  ],
};

export default function QuickChips({ selectedService, onSelectService }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-gray-100">
      {QUICK_CHIPS.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onSelectService(chip.id)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
            selectedService === chip.id
              ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
              : "bg-white text-[#1a3a5c] border-[#1a3a5c]/30 hover:border-[#1a3a5c] hover:bg-[#f0f4f9]"
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

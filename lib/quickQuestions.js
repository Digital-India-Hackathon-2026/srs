/**
 * Service-aware Quick Questions for AI Help Desk
 * Each service has its own relevant questions.
 * Questions change when user selects a different service.
 */

export const QUICK_QUESTIONS = {
  passport: [
    { text: "What documents are required for Passport?", intent: "documents" },
    { text: "How much does a Passport cost?", intent: "fees" },
    { text: "What is the processing time?", intent: "processing_time" },
    { text: "How do I reschedule my appointment?", intent: "appointment_reschedule" },
    { text: "What if I miss my appointment?", intent: "appointment_reschedule" },
    { text: "What is police verification?", intent: "general" },
    { text: "What should I carry to PSK?", intent: "documents" },
    { text: "Common reasons for rejection?", intent: "rejection" },
  ],
  "income-certificate": [
    { text: "Why is Income Certificate required?", intent: "purpose" },
    { text: "Who is eligible?", intent: "eligibility" },
    { text: "Which documents are required?", intent: "documents" },
    { text: "How long does it take?", intent: "processing_time" },
    { text: "What is the application fee?", intent: "fees" },
    { text: "Where do I apply?", intent: "portal" },
    { text: "Common rejection reasons?", intent: "rejection" },
  ],
  "caste-certificate": [
    { text: "Who is eligible for Caste Certificate?", intent: "eligibility" },
    { text: "Documents required?", intent: "documents" },
    { text: "How long does it take?", intent: "processing_time" },
    { text: "Is parent's certificate mandatory?", intent: "documents" },
    { text: "Reservation benefits?", intent: "purpose" },
    { text: "Common mistakes to avoid?", intent: "rejection" },
  ],
  "residence-certificate": [
    { text: "What is a Residence Certificate?", intent: "purpose" },
    { text: "Which documents are needed?", intent: "documents" },
    { text: "How long does it take?", intent: "processing_time" },
    { text: "Accepted address proofs?", intent: "documents" },
    { text: "Where to apply?", intent: "portal" },
    { text: "Common mistakes?", intent: "rejection" },
  ],
  "birth-certificate": [
    { text: "How to register a birth?", intent: "steps" },
    { text: "Documents required?", intent: "documents" },
    { text: "Is it free?", intent: "fees" },
    { text: "What if registration is delayed?", intent: "edge_case" },
    { text: "Where to apply in Telangana?", intent: "portal" },
    { text: "How to get duplicate certificate?", intent: "lost_document" },
  ],
  "aadhaar-update": [
    { text: "How do I update my Aadhaar?", intent: "steps" },
    { text: "Can I update mobile number online?", intent: "general" },
    { text: "What documents are required?", intent: "documents" },
    { text: "How much is the update fee?", intent: "fees" },
    { text: "How long does the update take?", intent: "processing_time" },
    { text: "Can I update address online?", intent: "address_change" },
    { text: "What if biometrics fail?", intent: "rejection" },
  ],
  "driving-licence": [
    { text: "What is the minimum age?", intent: "eligibility" },
    { text: "How do I apply?", intent: "steps" },
    { text: "What documents are required?", intent: "documents" },
    { text: "What is learner licence process?", intent: "general" },
    { text: "What is the driving test procedure?", intent: "steps" },
    { text: "How much is the fee?", intent: "fees" },
    { text: "Common mistakes to avoid?", intent: "rejection" },
  ],
  "voter-id": [
    { text: "How to register as a voter?", intent: "steps" },
    { text: "What is the minimum age?", intent: "eligibility" },
    { text: "Documents required?", intent: "documents" },
    { text: "Is it free?", intent: "fees" },
    { text: "How to correct details?", intent: "name_change" },
    { text: "How to change address?", intent: "address_change" },
  ],
  "ration-card": [
    { text: "How do I apply?", intent: "steps" },
    { text: "Required documents?", intent: "documents" },
    { text: "Income limit for BPL?", intent: "eligibility" },
    { text: "How to add family member?", intent: "general" },
    { text: "How to change address?", intent: "address_change" },
    { text: "How to get duplicate card?", intent: "lost_document" },
  ],
  "pan-card": [
    { text: "How to apply for PAN?", intent: "steps" },
    { text: "Documents required?", intent: "documents" },
    { text: "How much does it cost?", intent: "fees" },
    { text: "How to get instant e-PAN?", intent: "steps" },
    { text: "How to correct name on PAN?", intent: "name_change" },
    { text: "How to link PAN with Aadhaar?", intent: "general" },
  ],
  "meeseva-services": [
    { text: "What services are available?", intent: "purpose" },
    { text: "What is the helpline number?", intent: "portal" },
    { text: "Where is nearest centre?", intent: "portal" },
    { text: "What documents to carry?", intent: "documents" },
    { text: "Working hours?", intent: "general" },
  ],
  "death-certificate": [
    { text: "How to register a death?", intent: "steps" },
    { text: "Documents required?", intent: "documents" },
    { text: "Is it free within 21 days?", intent: "fees" },
    { text: "Where to apply?", intent: "portal" },
    { text: "Processing time?", intent: "processing_time" },
  ],
  "telangana-schemes": [
    { text: "What schemes are available?", intent: "purpose" },
    { text: "How to check eligibility?", intent: "eligibility" },
    { text: "Where to apply?", intent: "portal" },
    { text: "Documents required?", intent: "documents" },
  ],
};

// Fallback questions when no service is selected
export const DEFAULT_QUESTIONS = [
  { text: "What services are available?", intent: "general" },
  { text: "How do I apply for Passport?", intent: "steps" },
  { text: "Where is nearest MeeSeva?", intent: "portal" },
  { text: "What documents for Income Certificate?", intent: "documents" },
  { text: "Check driving licence eligibility", intent: "eligibility" },
];

/**
 * Get quick questions for a service.
 * Falls back to default if service not found.
 */
export function getQuickQuestions(serviceId) {
  return QUICK_QUESTIONS[serviceId] || DEFAULT_QUESTIONS;
}

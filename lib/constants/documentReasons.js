/**
 * Document Reason Explanations — "Why is this document needed?"
 * ─────────────────────────────────────────────────────────────────────────────
 * Keyed by a normalized document label pattern (lowercase match).
 * Used in tooltips on service pages and draft generator upload slots.
 * Fallback: "This document is required as part of the official government application process."
 */

export const DOCUMENT_REASONS = {
  // Identity & Basic Documents
  "aadhaar": "Used to verify the applicant's identity, date of birth, address, and other personal details as per UIDAI records.",
  "pan": "Used to verify the applicant's Permanent Account Number and cross-check financial identity.",
  "passport": "Used as proof of citizenship, identity, and travel history.",
  "voter id": "Used as proof of identity and address registered with the Election Commission.",
  "driving licence": "Used to verify driving eligibility, existing licence details, and identity.",

  // Age & DOB Proof
  "birth certificate": "Used as primary proof of date of birth and place of birth.",
  "ssc": "Used as proof of date of birth and educational qualification.",
  "marksheet": "Used as proof of date of birth and educational qualification.",
  "age proof": "Required to verify the applicant meets the minimum age requirement for this service.",

  // Address Proof
  "address proof": "Used to verify the applicant's current residential address.",
  "residence proof": "Used to verify that the applicant has been residing at the address for the required period.",
  "utility bill": "Used as proof of residential address (electricity/water/telephone bill not older than 3 months).",
  "rent agreement": "Used to verify the applicant's residential address in rented accommodation.",
  "ration card": "Used to verify residential address and economic status of the applicant's family.",
  "bank statement": "Used to verify residential address or financial information as applicable.",
  "property tax": "Used to verify property ownership and residential address.",

  // Photographs
  "photograph": "Required for identification on official records and the issued certificate or document.",
  "photo": "Required for identification on official records and the issued certificate or document.",
  "passport size": "Required for identification on official records and the issued certificate or document.",

  // Income Related
  "income proof": "Used to determine the applicant's annual income and eligibility for income-based schemes.",
  "salary slip": "Used to verify monthly income and employment status.",
  "form 16": "Used as proof of income for salaried individuals filed with the Income Tax Department.",
  "it return": "Used as proof of income as declared to the Income Tax Department.",
  "employer certificate": "Used to verify employment status and income from the employer.",

  // Caste/Community
  "caste certificate": "Used to verify the applicant's caste/community category for certificate issuance.",
  "community proof": "Used to establish the applicant's membership in a specific caste or community.",
  "transfer certificate": "Used to verify school/community details including caste as recorded in educational records.",
  "study certificate": "Used to verify that caste/community was recorded in educational institution records.",

  // Marriage
  "marriage certificate": "Used to verify the marital relationship between applicant and spouse.",

  // Birth/Death Records
  "hospital birth record": "Used as primary evidence of the birth event, including date, time, place, and parents' names.",
  "discharge summary": "Used as medical evidence of the birth event from the hospital.",
  "hospital death record": "Used as primary evidence of the death event, including date, time, place, and cause of death.",
  "death record": "Used as medical evidence of the death event from the hospital or attending physician.",
  "medical certificate of cause of death": "Used to officially document the cause of death as certified by a registered medical practitioner.",

  // Driving Licence Specific
  "learner's licence": "Required to apply for a permanent driving licence — applicant must hold LL for at least 30 days.",
  "learner licence": "Required to apply for a permanent driving licence — applicant must hold LL for at least 30 days.",
  "medical certificate": "Required to certify the applicant's physical and mental fitness to drive a motor vehicle.",
  "form 1": "Self-declaration of physical fitness as required under the Motor Vehicles Act.",
  "form 1a": "Medical certificate from a registered practitioner — mandatory for applicants aged 40 years and above.",
  "rc book": "Used to verify vehicle registration details including owner name, chassis number, and engine number.",
  "registration certificate": "Used to verify vehicle registration details including owner name, chassis number, and engine number.",
  "insurance": "Used to verify that the vehicle has valid third-party insurance as required by law.",
  "puc": "Used to verify that the vehicle meets the Pollution Under Control standards.",
  "training certificate": "Issued by a recognized driving school certifying that the applicant has completed driving training.",

  // Aadhaar Update
  "supporting document": "Used to provide evidence for the specific correction or update being requested in Aadhaar.",
  "identity proof": "Used to verify the applicant's identity for the purpose of updating Aadhaar records.",

  // Cremation/Burial
  "cremation certificate": "Used as evidence that the cremation or burial was performed for the deceased.",
  "burial certificate": "Used as evidence that the cremation or burial was performed for the deceased.",

  // Affidavit
  "affidavit": "A notarized sworn statement required when applying beyond the stipulated time limit for registration.",

  // Relationship Proof
  "relationship proof": "Used to verify the relationship between the applicant and the deceased for death certificate applications.",
};

const FALLBACK_REASON = "This document is required as part of the official government application process.";

/**
 * Get the reason/explanation for a document by its label.
 * Performs a case-insensitive partial match.
 * @param {string} documentLabel
 * @returns {string} explanation
 */
export function getDocumentReason(documentLabel) {
  if (!documentLabel) return FALLBACK_REASON;
  const label = documentLabel.toLowerCase();
  for (const [key, reason] of Object.entries(DOCUMENT_REASONS)) {
    if (label.includes(key)) return reason;
  }
  return FALLBACK_REASON;
}

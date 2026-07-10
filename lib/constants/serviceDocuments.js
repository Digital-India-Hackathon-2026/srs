/**
 * Service Document Requirements Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized config that defines which documents are required/optional
 * for each government service. The Draft Generator UI renders upload fields
 * dynamically based on the selected service.
 *
 * Each document entry:
 *   - id: unique identifier (used as form field key)
 *   - label: display name
 *   - hint: help text shown below the label
 *   - ocrEnabled: whether OCR extraction should be attempted
 *   - ocrType: document type hint for the OCR engine ("aadhaar"|"pan"|"generic"|"photo")
 */

export const SERVICE_DOCUMENTS = {
  passport: {
    name: "Passport (Fresh / Reissue)",
    officialPortal: "https://www.passportindia.gov.in",
    draftRoute: "/application-draft/passport",
    required: [
      { id: "aadhaar", label: "Aadhaar Card", hint: "Front or both sides for name, DOB, gender, address", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "photo", label: "Passport Size Photograph", hint: "White background, recent photograph", ocrEnabled: false, ocrType: "photo" },
      { id: "addressProof", label: "Address Proof", hint: "Aadhaar / Utility Bill / Bank Statement / Rent Agreement", ocrEnabled: true, ocrType: "generic" },
    ],
    optional: [
      { id: "pan", label: "PAN Card", hint: "For PAN number and name verification", ocrEnabled: true, ocrType: "pan" },
      { id: "birthCert", label: "Birth Certificate", hint: "For DOB verification if Aadhaar has only year", ocrEnabled: true, ocrType: "generic" },
      { id: "marriageCert", label: "Marriage Certificate", hint: "If married, for spouse details", ocrEnabled: true, ocrType: "generic" },
      { id: "educationCert", label: "Educational Certificate (10th/12th)", hint: "For DOB and name verification", ocrEnabled: true, ocrType: "generic" },
      { id: "oldPassport", label: "Old Passport (for reissue)", hint: "First and last page of existing passport", ocrEnabled: true, ocrType: "generic" },
    ],
  },

  "driving-licence": {
    name: "Driving Licence (Learner / Permanent)",
    officialPortal: "https://sarathi.parivahan.gov.in",
    draftRoute: "/application-draft/driving-licence",
    required: [
      { id: "aadhaar", label: "Aadhaar Card", hint: "For name, DOB, gender, address extraction", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "addressProof", label: "Address Proof", hint: "Aadhaar / Utility Bill / Passport", ocrEnabled: true, ocrType: "generic" },
      { id: "ageProof", label: "Age Proof (Birth Certificate / SSC Memo)", hint: "For DOB verification", ocrEnabled: true, ocrType: "generic" },
      { id: "photo", label: "Passport Size Photograph", hint: "Recent colour photograph", ocrEnabled: false, ocrType: "photo" },
      { id: "medicalCert", label: "Medical Certificate (Form 1A)", hint: "From registered medical practitioner", ocrEnabled: true, ocrType: "generic" },
    ],
    optional: [
      { id: "learnerLicence", label: "Learner's Licence (if applicable)", hint: "Required for permanent DL application", ocrEnabled: true, ocrType: "generic" },
      { id: "existingDL", label: "Existing Driving Licence (for renewal)", hint: "Front and back of current DL", ocrEnabled: true, ocrType: "generic" },
      { id: "pan", label: "PAN Card", hint: "For identity verification", ocrEnabled: true, ocrType: "pan" },
      { id: "trainingCert", label: "Vehicle Training Certificate", hint: "From recognized driving school", ocrEnabled: false, ocrType: "generic" },
    ],
  },

  "income-certificate": {
    name: "Income Certificate",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      { id: "aadhaar", label: "Aadhaar Card", hint: "For identity and address verification", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "incomeProof", label: "Income Proof", hint: "Salary slip / Form 16 / IT Return / Self-declaration", ocrEnabled: true, ocrType: "generic" },
      { id: "addressProof", label: "Address Proof", hint: "Aadhaar / Ration Card / Utility Bill", ocrEnabled: true, ocrType: "generic" },
      { id: "photo", label: "Passport Size Photograph", hint: "Recent photograph", ocrEnabled: false, ocrType: "photo" },
    ],
    optional: [
      { id: "rationCard", label: "Ration Card", hint: "White / Pink ration card as income indicator", ocrEnabled: true, ocrType: "generic" },
      { id: "pan", label: "PAN Card", hint: "For identity verification", ocrEnabled: true, ocrType: "pan" },
      { id: "bankStatement", label: "Bank Account Statement", hint: "Last 6 months statement", ocrEnabled: false, ocrType: "generic" },
    ],
  },

  "caste-certificate": {
    name: "Caste Certificate",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      { id: "aadhaar", label: "Aadhaar Card", hint: "For identity verification", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "communityProof", label: "Community Proof", hint: "Parents' caste certificate / community proof document", ocrEnabled: true, ocrType: "generic" },
      { id: "addressProof", label: "Address Proof", hint: "Aadhaar / Ration Card / Utility Bill", ocrEnabled: true, ocrType: "generic" },
      { id: "schoolCert", label: "School Certificate (TC / Study Certificate)", hint: "With caste mentioned", ocrEnabled: true, ocrType: "generic" },
      { id: "photo", label: "Passport Size Photograph", hint: "Recent photograph", ocrEnabled: false, ocrType: "photo" },
    ],
    optional: [
      { id: "parentCaste", label: "Father's / Mother's Caste Certificate", hint: "If available for faster processing", ocrEnabled: true, ocrType: "generic" },
      { id: "rationCard", label: "Ration Card", hint: "With family details", ocrEnabled: true, ocrType: "generic" },
    ],
  },

  "residence-certificate": {
    name: "Residence Certificate",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      { id: "aadhaar", label: "Aadhaar Card", hint: "For identity and address verification", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "residenceProof", label: "Residence Proof", hint: "Rent agreement / Utility Bill / Property Tax Receipt", ocrEnabled: true, ocrType: "generic" },
      { id: "photo", label: "Passport Size Photograph", hint: "Recent photograph", ocrEnabled: false, ocrType: "photo" },
    ],
    optional: [
      { id: "rationCard", label: "Ration Card", hint: "Shows residence address", ocrEnabled: true, ocrType: "generic" },
      { id: "voterID", label: "Voter ID Card", hint: "Address verification", ocrEnabled: true, ocrType: "generic" },
      { id: "bankStatement", label: "Bank Statement", hint: "With address", ocrEnabled: false, ocrType: "generic" },
    ],
  },

  "birth-certificate": {
    name: "Birth Certificate",
    officialPortal: "https://crsorgi.gov.in",
    draftRoute: null,
    required: [
      { id: "hospitalRecord", label: "Hospital Birth Record / Discharge Summary", hint: "From hospital where child was born", ocrEnabled: true, ocrType: "generic" },
      { id: "parentAadhaar", label: "Parent's Aadhaar Card (Father or Mother)", hint: "For parent identity verification", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "marriageCert", label: "Marriage Certificate (if applicable)", hint: "Parents' marriage certificate", ocrEnabled: true, ocrType: "generic" },
    ],
    optional: [
      { id: "parentAadhaar2", label: "Other Parent's Aadhaar", hint: "Both parents for complete details", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "affidavit", label: "Affidavit (for delayed registration)", hint: "If applying after 1 year", ocrEnabled: false, ocrType: "generic" },
    ],
  },

  "death-certificate": {
    name: "Death Certificate",
    officialPortal: "https://crsorgi.gov.in",
    draftRoute: null,
    required: [
      { id: "hospitalRecord", label: "Hospital Death Record / Death Summary", hint: "From hospital or attending physician", ocrEnabled: true, ocrType: "generic" },
      { id: "applicantAadhaar", label: "Applicant's Aadhaar Card", hint: "Person applying for the certificate", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "identityProof", label: "Deceased's Identity Proof", hint: "Aadhaar / Voter ID / Passport of deceased", ocrEnabled: true, ocrType: "generic" },
    ],
    optional: [
      { id: "cremationCert", label: "Cremation / Burial Certificate", hint: "From cremation ground or burial ground", ocrEnabled: false, ocrType: "generic" },
      { id: "affidavit", label: "Affidavit (for delayed registration)", hint: "If applying after 1 year", ocrEnabled: false, ocrType: "generic" },
    ],
  },

  "aadhaar-update": {
    name: "Aadhaar Update / Correction",
    officialPortal: "https://ssup.uidai.gov.in",
    draftRoute: null,
    required: [
      { id: "existingAadhaar", label: "Existing Aadhaar Card", hint: "Current Aadhaar with details to be updated", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "addressProof", label: "Address Proof (new address)", hint: "Utility Bill / Bank Statement / Passport / Rent Agreement", ocrEnabled: true, ocrType: "generic" },
      { id: "identityProof", label: "Identity Proof", hint: "PAN / Passport / Voter ID", ocrEnabled: true, ocrType: "generic" },
      { id: "supportingDoc", label: "Supporting Document for Change", hint: "Marriage cert (name change) / Gazette (DOB change) etc.", ocrEnabled: true, ocrType: "generic" },
    ],
    optional: [
      { id: "photo", label: "Recent Photograph", hint: "For biometric update", ocrEnabled: false, ocrType: "photo" },
      { id: "pan", label: "PAN Card", hint: "For identity cross-verification", ocrEnabled: true, ocrType: "pan" },
    ],
  },
};

/**
 * Get document config for a given service ID.
 * @param {string} serviceId
 * @returns {{ name, officialPortal, draftRoute, required, optional }|null}
 */
export function getServiceDocuments(serviceId) {
  return SERVICE_DOCUMENTS[serviceId] || null;
}

/**
 * Get all available service IDs and names.
 * @returns {Array<{ id: string, name: string }>}
 */
export function getAvailableServices() {
  return Object.entries(SERVICE_DOCUMENTS).map(([id, config]) => ({
    id,
    name: config.name,
    hasFullDraft: !!config.draftRoute,
  }));
}

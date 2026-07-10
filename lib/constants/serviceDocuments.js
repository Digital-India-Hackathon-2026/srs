/**
 * Service Document Requirements Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized config defining which documents are required/optional per service.
 * The Draft Generator renders upload fields dynamically from this config.
 *
 * Sources:
 *   - Passport: passportindia.gov.in (Passport Seva)
 *   - Driving Licence: sarathi.parivahan.gov.in (Motor Vehicles Act, 1988)
 *   - Certificates: meeseva.telangana.gov.in (Telangana MeeSeva)
 *   - Birth/Death: crsorgi.gov.in (CRS)
 *   - Aadhaar: ssup.uidai.gov.in (UIDAI)
 *
 * Each document entry:
 *   - id: unique form field key
 *   - label: display name
 *   - hint: help text
 *   - ocrEnabled: whether OCR extraction should be attempted
 *   - ocrType: prompt type for Vision AI ("aadhaar"|"pan"|"dl"|"rc"|"generic"|"photo")
 *   - ocrFields: array of fields this document can yield (for mapping)
 */

export const SERVICE_DOCUMENTS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PASSPORT — Source: passportindia.gov.in
  // ═══════════════════════════════════════════════════════════════════════════
  passport: {
    name: "Passport (Fresh / Reissue)",
    officialPortal: "https://www.passportindia.gov.in",
    draftRoute: "/application-draft/passport",
    required: [
      {
        id: "aadhaar", label: "Aadhaar Card", hint: "Front or both sides — name, DOB, gender, address",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "city", "district", "state", "pinCode", "fatherName"],
      },
      {
        id: "photo", label: "Passport Size Photograph", hint: "White background, 3.5cm × 4.5cm, recent",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
    ],
    optional: [
      {
        id: "pan", label: "PAN Card", hint: "For PAN number and name verification",
        ocrEnabled: true, ocrType: "pan",
        ocrFields: ["fullName", "fatherName", "dateOfBirth", "panNumber"],
      },
      {
        id: "birthCert", label: "Birth Certificate / 10th Marksheet", hint: "For DOB verification if Aadhaar shows only year",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "dateOfBirth", "fatherName"],
      },
      {
        id: "addressProof", label: "Address Proof (if different from Aadhaar)", hint: "Utility Bill / Bank Statement / Rent Agreement",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["address", "city", "state", "pinCode"],
      },
      {
        id: "marriageCert", label: "Marriage Certificate (if married)", hint: "For spouse name and marriage date",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["spouseName", "marriageDate"],
      },
      {
        id: "oldPassport", label: "Old Passport (for reissue only)", hint: "First and last page of existing passport",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["passportNumber", "dateOfIssue", "dateOfExpiry", "placeOfIssue"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRIVING LICENCE — Source: sarathi.parivahan.gov.in, Motor Vehicles Act 1988
  // Forms: Form 2 (LL), Form 4 (DL), Form 9 (Renewal), Form 1/1A (Medical)
  // ═══════════════════════════════════════════════════════════════════════════
  "driving-licence": {
    name: "Driving Licence (Learner / Permanent / Renewal)",
    officialPortal: "https://sarathi.parivahan.gov.in",
    draftRoute: "/application-draft/driving-licence",
    required: [
      {
        id: "aadhaar", label: "Aadhaar Card (Identity & Address Proof)",
        hint: "Serves as both identity proof and address proof per Sarathi portal",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "houseNumber", "street", "locality", "city", "district", "state", "pinCode", "fatherName"],
      },
      {
        id: "ageProof", label: "Age Proof",
        hint: "Birth Certificate / SSC Marksheet / Passport — must show DOB clearly",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "dateOfBirth", "fatherName"],
      },
      {
        id: "photo", label: "Passport Size Photograph",
        hint: "Recent colour photo, white background, 3.5cm × 4.5cm",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
      {
        id: "medicalSelfDeclaration", label: "Medical Self-Declaration (Form 1)",
        hint: "Self-declaration of physical fitness — required for applicants below 40 years",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
    ],
    optional: [
      {
        id: "medicalCert", label: "Medical Certificate (Form 1A)",
        hint: "From registered medical practitioner — mandatory if age ≥ 40 years",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["bloodGroup", "eyesightLeft", "eyesightRight", "doctorName", "certificateDate"],
      },
      {
        id: "learnerLicence", label: "Learner's Licence",
        hint: "Required for permanent DL — must have held LL for at least 30 days",
        ocrEnabled: true, ocrType: "dl",
        ocrFields: ["licenceNumber", "dateOfIssue", "dateOfExpiry", "fullName", "vehicleClasses"],
      },
      {
        id: "existingDL", label: "Existing Driving Licence (for Renewal / Duplicate)",
        hint: "Front and back of current DL",
        ocrEnabled: true, ocrType: "dl",
        ocrFields: ["licenceNumber", "fullName", "dateOfBirth", "dateOfIssue", "dateOfExpiry", "issuingAuthority", "vehicleClasses", "bloodGroup", "address"],
      },
      {
        id: "addressProof", label: "Address Proof (if different from Aadhaar)",
        hint: "Utility Bill / Passport / Bank Passbook / Rent Agreement",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["address", "city", "state", "pinCode"],
      },
      {
        id: "rcBook", label: "RC Book / Registration Certificate (if applicable)",
        hint: "Vehicle registration proof — for licence class verification",
        ocrEnabled: true, ocrType: "rc",
        ocrFields: ["registrationNumber", "chassisNumber", "engineNumber", "ownerName", "vehicleClass", "registrationDate", "fuelType", "manufacturer", "model"],
      },
      {
        id: "insurance", label: "Vehicle Insurance Certificate (if applicable)",
        hint: "Valid insurance — required for certain DL services",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["policyNumber", "vehicleNumber", "validFrom", "validTo", "insurer"],
      },
      {
        id: "puc", label: "Pollution Under Control (PUC) Certificate",
        hint: "Valid PUC — may be required for vehicle-related services",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["vehicleNumber", "validUpTo", "certificateNumber"],
      },
      {
        id: "trainingCert", label: "Driving School Training Certificate",
        hint: "From government-recognized driving school (if applicable)",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INCOME CERTIFICATE — Source: meeseva.telangana.gov.in
  // ═══════════════════════════════════════════════════════════════════════════
  "income-certificate": {
    name: "Income Certificate",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      {
        id: "aadhaar", label: "Aadhaar Card",
        hint: "Identity and address verification",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "city", "district", "state", "pinCode"],
      },
      {
        id: "incomeProof", label: "Income Proof Document",
        hint: "Salary slip / Form 16 / IT Return / Self-declaration on stamp paper",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "incomeAmount", "financialYear", "employerName"],
      },
      {
        id: "rationCard", label: "Ration Card (White / Pink)",
        hint: "Serves as proof of economic status — mandatory in Telangana MeeSeva",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "cardNumber", "address", "familyMembers"],
      },
      {
        id: "photo", label: "Passport Size Photograph",
        hint: "Recent photograph",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
    ],
    optional: [
      {
        id: "pan", label: "PAN Card",
        hint: "For cross-verification of income details",
        ocrEnabled: true, ocrType: "pan",
        ocrFields: ["fullName", "panNumber", "dateOfBirth"],
      },
      {
        id: "bankStatement", label: "Bank Account Statement (6 months)",
        hint: "For income verification where salary slip unavailable",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
      {
        id: "employerCert", label: "Employer Certificate / Pay Slip",
        hint: "Latest pay slip with salary breakdown",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "employerName", "grossSalary", "designation"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CASTE CERTIFICATE — Source: meeseva.telangana.gov.in
  // ═══════════════════════════════════════════════════════════════════════════
  "caste-certificate": {
    name: "Caste Certificate (OBC / SC / ST)",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      {
        id: "aadhaar", label: "Aadhaar Card",
        hint: "For identity and address verification",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "district", "state", "pinCode"],
      },
      {
        id: "parentCaste", label: "Father's / Mother's Caste Certificate",
        hint: "Issued by Tahsildar or equivalent authority — primary proof",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "caste", "subCaste", "certificateNumber", "issuingAuthority"],
      },
      {
        id: "schoolCert", label: "School Transfer Certificate / Study Certificate",
        hint: "Must mention caste/community — from last attended institution",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "fatherName", "caste", "schoolName"],
      },
      {
        id: "rationCard", label: "Ration Card",
        hint: "White/Pink card showing family details and address",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "cardNumber", "address"],
      },
      {
        id: "photo", label: "Passport Size Photograph",
        hint: "Recent photograph",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
    ],
    optional: [
      {
        id: "addressProof", label: "Additional Address Proof",
        hint: "Voter ID / Utility Bill (if Aadhaar address differs)",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["address", "city", "pinCode"],
      },
      {
        id: "birthCert", label: "Birth Certificate",
        hint: "For DOB verification",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "dateOfBirth", "fatherName", "motherName"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESIDENCE CERTIFICATE — Source: meeseva.telangana.gov.in
  // ═══════════════════════════════════════════════════════════════════════════
  "residence-certificate": {
    name: "Residence / Domicile Certificate",
    officialPortal: "https://meeseva.telangana.gov.in",
    draftRoute: null,
    required: [
      {
        id: "aadhaar", label: "Aadhaar Card",
        hint: "Primary identity and residence proof",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "city", "district", "state", "pinCode"],
      },
      {
        id: "residenceProof", label: "Residence Proof (minimum 7 years)",
        hint: "Property Tax Receipt / Electricity Bill / Rent Agreement / House Registration",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "address", "city", "pinCode"],
      },
      {
        id: "rationCard", label: "Ration Card",
        hint: "Shows continuous residence at the address",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "address", "cardNumber"],
      },
      {
        id: "photo", label: "Passport Size Photograph",
        hint: "Recent photograph",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
    ],
    optional: [
      {
        id: "voterID", label: "Voter ID Card",
        hint: "Address and residence verification",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "voterIdNumber", "address"],
      },
      {
        id: "schoolCert", label: "School Study Certificate",
        hint: "Proof of studying in the state",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "schoolName", "yearsStudied"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BIRTH CERTIFICATE — Source: crsorgi.gov.in (Census of India, Registration of Births & Deaths Act)
  // ═══════════════════════════════════════════════════════════════════════════
  "birth-certificate": {
    name: "Birth Certificate",
    officialPortal: "https://crsorgi.gov.in",
    draftRoute: null,
    required: [
      {
        id: "hospitalRecord", label: "Hospital Birth Record / Discharge Summary",
        hint: "Original hospital record with child's birth details",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["childName", "dateOfBirth", "timeOfBirth", "gender", "placeOfBirth", "hospitalName", "motherName", "fatherName"],
      },
      {
        id: "parentAadhaar", label: "Mother's Aadhaar Card",
        hint: "For parent identity and address verification",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "aadhaarNumber", "address", "district", "state", "pinCode"],
      },
      {
        id: "fatherAadhaar", label: "Father's Aadhaar Card",
        hint: "For parent identity verification",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "aadhaarNumber", "address"],
      },
    ],
    optional: [
      {
        id: "marriageCert", label: "Parents' Marriage Certificate",
        hint: "For verifying parents' relationship",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["husbandName", "wifeName", "marriageDate"],
      },
      {
        id: "affidavit", label: "Affidavit (for delayed registration)",
        hint: "Required if applying after 21 days of birth (notarized)",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEATH CERTIFICATE — Source: crsorgi.gov.in
  // ═══════════════════════════════════════════════════════════════════════════
  "death-certificate": {
    name: "Death Certificate",
    officialPortal: "https://crsorgi.gov.in",
    draftRoute: null,
    required: [
      {
        id: "hospitalRecord", label: "Hospital Death Record / Medical Certificate of Cause of Death",
        hint: "From hospital or attending physician",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["deceasedName", "dateOfDeath", "placeOfDeath", "causeOfDeath", "hospitalName"],
      },
      {
        id: "applicantAadhaar", label: "Applicant's Aadhaar Card",
        hint: "Person applying for the certificate (informant)",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "aadhaarNumber", "address", "district", "state"],
      },
      {
        id: "deceasedId", label: "Deceased's Identity Proof",
        hint: "Aadhaar / Voter ID / Passport of the deceased person",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "dateOfBirth", "address", "documentNumber"],
      },
    ],
    optional: [
      {
        id: "cremationCert", label: "Cremation / Burial Certificate",
        hint: "From cremation ground, burial ground, or religious authority",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
      {
        id: "affidavit", label: "Affidavit (for delayed registration)",
        hint: "Required if applying after 21 days of death (notarized on stamp paper)",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
      {
        id: "familyRelation", label: "Proof of Relationship to Deceased",
        hint: "Ration Card / Family ID showing relation",
        ocrEnabled: false, ocrType: "generic", ocrFields: [],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AADHAAR UPDATE — Source: ssup.uidai.gov.in (UIDAI Self-Service Update Portal)
  // ═══════════════════════════════════════════════════════════════════════════
  "aadhaar-update": {
    name: "Aadhaar Update / Correction",
    officialPortal: "https://ssup.uidai.gov.in",
    draftRoute: null,
    required: [
      {
        id: "existingAadhaar", label: "Existing Aadhaar Card",
        hint: "Current Aadhaar — to verify existing details before update",
        ocrEnabled: true, ocrType: "aadhaar",
        ocrFields: ["fullName", "dateOfBirth", "gender", "aadhaarNumber", "address", "city", "district", "state", "pinCode"],
      },
      {
        id: "supportingDoc", label: "Supporting Document for Update",
        hint: "Depends on what is being updated — see UIDAI valid documents list",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "address", "dateOfBirth"],
      },
    ],
    optional: [
      {
        id: "addressProof", label: "New Address Proof",
        hint: "Passport / Bank Statement / Utility Bill / Rent Agreement / Voter ID",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "address", "city", "state", "pinCode"],
      },
      {
        id: "identityProof", label: "Identity Proof (POI)",
        hint: "PAN / Passport / Voter ID — for name or DOB correction",
        ocrEnabled: true, ocrType: "generic",
        ocrFields: ["fullName", "documentNumber", "dateOfBirth"],
      },
      {
        id: "photo", label: "Recent Photograph",
        hint: "For biometric/photo update at Aadhaar centre",
        ocrEnabled: false, ocrType: "photo", ocrFields: [],
      },
    ],
  },

  "voter-id": {
    name: "Voter ID (Form 6 / Form 6A)",
    officialPortal: "https://voterportal.eci.gov.in",
    draftRoute: "/application-draft/voter-id",
    required: [
      { id: "aadhaarCard", label: "Aadhaar Card", hint: "For identity and age verification", ocrEnabled: true, ocrType: "aadhaar" },
      { id: "ageProof", label: "Age Proof", hint: "Birth Certificate / Class 10 Certificate / Passport", ocrEnabled: true, ocrType: "generic" },
      { id: "addressProof", label: "Address Proof", hint: "Aadhaar / Utility Bill / Rent Agreement / Bank Passbook", ocrEnabled: true, ocrType: "generic" },
      { id: "photo", label: "Passport-size Photograph", hint: "Recent photo, white background, 3.5cm x 3.5cm", ocrEnabled: false, ocrType: "photo" },
    ],
    optional: [
      { id: "passport", label: "Passport (for Form 6A)", hint: "Required for overseas elector registration", ocrEnabled: true, ocrType: "generic" },
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
 * @returns {Array<{ id: string, name: string, hasFullDraft: boolean }>}
 */
export function getAvailableServices() {
  return Object.entries(SERVICE_DOCUMENTS).map(([id, config]) => ({
    id,
    name: config.name,
    hasFullDraft: !!config.draftRoute,
  }));
}

/**
 * Get OCR-enabled documents for a service.
 * @param {string} serviceId
 * @returns {Array<{ id, label, ocrType, ocrFields }>}
 */
export function getOcrDocuments(serviceId) {
  const config = SERVICE_DOCUMENTS[serviceId];
  if (!config) return [];
  const allDocs = [...config.required, ...(config.optional || [])];
  return allDocs
    .filter(d => d.ocrEnabled)
    .map(d => ({ id: d.id, label: d.label, ocrType: d.ocrType, ocrFields: d.ocrFields || [] }));
}

import { passportKnowledge } from "./passportKnowledge";

// ─────────────────────────────────────────────────────────────────
// INTENT DETECTION
// Returns one of: purpose | documents | steps | eligibility |
//   fees | time | mistakes | full | office | general
// ─────────────────────────────────────────────────────────────────
export function detectIntent(message) {
  const m = message.toLowerCase();

  // Full guide — check first (most specific)
  if (/(tell me everything|full guide|complete info|all details|explain everything|everything about|full details)/i.test(m))
    return "full";

  // Mistakes / problems — check BEFORE eligibility to avoid "can go wrong" being caught by "can.*apply"
  if (/(what can go wrong|can go wrong|mistake|common error|avoid|common problem|why (is it|was it) (rejected|denied)|rejection reason|why reject|why was.*reject|problem|issue|fail|denied|what went wrong)/i.test(m))
    return "mistakes";
  if (/\breject\b/.test(m))
    return "mistakes";

  // Purpose / use
  if (/(what is (the )?use|why (do|should|would) (i|we) need|purpose of|what for|used for|why is it (needed|required|important)|what does .* certif|what is income cert|what is caste cert|what is residence cert|what is birth cert|what is ration|what is voter|what is driving|what is aadhaar)/i.test(m))
    return "purpose";

  // Documents
  if (/(what documents|which documents|documents (required|needed|to carry|to bring)|docs (required|needed)|what (to bring|to carry|do i need)|list of documents|papers (required|needed))/i.test(m))
    return "documents";

  // Steps / process
  if (/(how (to apply|to get|can i apply|do i apply)|application process|steps (to|for)|process (for|to)|procedure|how (should|do) i proceed|apply for|where (to apply|do i apply|can i apply)|how to obtain)/i.test(m))
    return "steps";

  // Eligibility
  if (/(am i eligible|who (is eligible|can apply)|eligibilit|criteria|qualification|who qualifies)/i.test(m))
    return "eligibility";

  // Fees
  if (/(fee|charge|cost|how much|price|payment|pay|free)/i.test(m))
    return "fees";

  // Time
  if (/(how (long|many days|much time)|days|weeks|processing time|when will|how soon|timeline|duration)/i.test(m))
    return "time";

  // Office / where
  if (/(where (is|are|to find|can i find)|nearest office|meeseva centre|which office|location|address of office)/i.test(m))
    return "office";

  return "general";
}

// ─────────────────────────────────────────────────────────────────
// SERVICE DETECTION
// ─────────────────────────────────────────────────────────────────
export function detectService(message) {
  const m = message.toLowerCase();
  if (/passport|psk|popsk|rpo|tatkaal|police verif|reschedule/.test(m)) return "passport";
  if (/income cert|income certificate|aay praman/.test(m)) return "income-certificate";
  if (/caste cert|community cert|\bsc cert\b|\bst cert\b|\bobc cert\b|\bbc cert\b/.test(m)) return "caste-certificate";
  if (/residence cert|domicile|nivaas/.test(m)) return "residence-certificate";
  if (/birth cert|janma|\bborn\b/.test(m)) return "birth-certificate";
  if (/aadhaar|aadhar|\buid\b|uidai/.test(m)) return "aadhaar-update";
  if (/driving|licence|license|\bdl\b|sarathi/.test(m)) return "driving-licence";
  if (/voter|epic|election card|voting/.test(m)) return "voter-id";
  if (/ration|pds|food card/.test(m)) return "ration-card";
  if (/meeseva|mee seva/.test(m)) return "meeseva";
  return "general";
}

// ─────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE — each service has intent-specific fields
// ─────────────────────────────────────────────────────────────────
export const knowledgeBase = {
  passport: passportKnowledge,

  "income-certificate": {
    id: "income-certificate",
    name: "Income Certificate",
    issuingAuthority: "Revenue Department, Government of Telangana",
    officialLink: "https://meeseva.telangana.gov.in/",
    whereToApply: "MeeSeva centre (any mandal) or meeseva.telangana.gov.in online portal",
    lastVerified: "2026-07-01",

    purpose: `An Income Certificate is an official document issued by the Revenue Department of Telangana that proves the annual income of an individual or their family.`,

    whereUsed: [
      "Applying for merit-cum-means or income-based scholarships",
      "Fee reimbursement from Telangana government (BC/SC/ST/EWS students)",
      "Government welfare and pension schemes where income eligibility is checked",
      "Reservation/category benefits (OBC/EWS) that require income proof",
      "Hostel admission under government quota",
      "Education loans or fee concessions from banks or institutions",
      "Ration card applications or BPL category verification",
      "Medical assistance or health scheme benefits",
      "College admission as a supporting document",
      "EWS certificate — income certificate is a prerequisite",
    ],

    eligibility: [
      "Must be a resident of Telangana",
      "Must have a valid Aadhaar card",
      "Must be able to provide proof of income (salary slip, employer letter, or self-declaration)",
    ],

    documentsRequired: [
      "Application form (available at MeeSeva or online)",
      "Aadhaar card of applicant (and family members if joint income is declared)",
      "Address proof — Electricity bill / Voter ID / Ration Card (not older than 1 year)",
      "Income proof — Salary certificate / Employer letter / Bank passbook entries",
      "Ration Card (if available)",
      "Recent passport-size photograph",
      "Mobile number linked to Aadhaar (required for OTP-based processes)",
    ],

    optionalDocuments: [
      "Property tax receipt (for self-employed or agricultural income)",
      "Agricultural land passbook (for farmers)",
    ],

    applicationSteps: [
      "Step 1 — Prepare documents: Collect originals and self-attested photocopies of all required documents",
      "Step 2 — Visit MeeSeva: Go to your nearest MeeSeva centre OR apply online at meeseva.telangana.gov.in",
      "Step 3 — Select service: Choose Revenue Department → Income Certificate",
      "Step 4 — Fill application: Enter applicant name, address, annual income, family details",
      "Step 5 — Upload documents: Upload scanned copies of all supporting documents",
      "Step 6 — Pay fee: Pay the service fee of approximately ₹35",
      "Step 7 — Note ARN: Save your Application Reference Number for tracking",
      "Step 8 — Tahsildar verification: Your details are verified by the local Tahsildar",
      "Step 9 — Collect certificate: Download from portal or collect from MeeSeva within 7–15 working days",
    ],

    fees: "Approximately ₹35 service charge at MeeSeva. No additional charges.",

    processingTime: "7 to 15 working days after submission, subject to Tahsildar verification.",

    validity: "Usually valid for 6 months to 1 year depending on the purpose. Some schemes may require a fresh certificate each year.",

    commonMistakes: [
      "Providing incorrect or mismatched income figures across different documents",
      "Aadhaar address not matching the address in the application",
      "Missing or unclear passport-size photograph",
      "Uploading blurry or illegible scans of documents",
      "Not linking Aadhaar to mobile number before applying online",
      "Using unofficial agents or websites — always apply directly at MeeSeva",
    ],

    rejectionReasons: [
      "Income declared in application does not match supporting documents",
      "Address proof is outdated (older than 1 year)",
      "Incomplete application — missing mandatory fields",
      "Documents not properly self-attested",
    ],

    whatCanGoWrong: [
      "Document mismatch causes delay or rejection",
      "Tahsildar may initiate field enquiry for large income claims — this can take extra time",
      "If mobile is not linked to Aadhaar, online verification fails",
    ],
  },

  "caste-certificate": {
    id: "caste-certificate",
    name: "Caste Certificate",
    issuingAuthority: "Revenue Department, Government of Telangana",
    officialLink: "https://meeseva.telangana.gov.in/",
    whereToApply: "MeeSeva centre or Tahsildar office",
    lastVerified: "2026-07-01",

    purpose: `A Caste Certificate is an official document issued by the Revenue Department of Telangana that certifies a person's caste or community (SC, ST, BC, or OBC) as per the Telangana government schedule.`,

    whereUsed: [
      "Availing reservations in government jobs (SC/ST/BC/OBC quota)",
      "College admissions under reserved quota",
      "Government scholarships for SC/ST/BC students",
      "Fee reimbursement scheme for reserved category students",
      "Hostel admission under SC/ST welfare schemes",
      "Election purposes (reserved constituency candidature)",
      "UPSC/TSPSC/other government exam category declarations",
      "Welfare scheme benefits targeting specific communities",
    ],

    eligibility: [
      "Must belong to a recognised SC, ST, BC, or OBC community as per the Telangana government schedule",
      "Must be a permanent resident of Telangana",
      "Must have documentary proof of community (ancestral documents preferred)",
    ],

    documentsRequired: [
      "Application form",
      "Aadhaar card of applicant",
      "Address proof (Electricity bill / Voter ID / Ration Card)",
      "School Transfer Certificate (TC) or SSC/Matriculation Certificate",
      "Ration Card",
      "Parent's or ancestor's caste certificate (if available — strongly recommended)",
      "Community/caste proof documents",
      "Passport-size photograph",
    ],

    optionalDocuments: [
      "Grandfather's caste certificate (useful for SC/ST claims)",
      "Village elder affidavit (in rural areas if other proof unavailable)",
    ],

    applicationSteps: [
      "Step 1 — Gather documents including parent's caste certificate if available",
      "Step 2 — Visit MeeSeva centre or the Tahsildar office of your mandal",
      "Step 3 — Select Revenue Department → Caste Certificate",
      "Step 4 — Fill personal, family, and community details accurately",
      "Step 5 — Upload all required documents (scanned copies)",
      "Step 6 — Pay service fee of approximately ₹35–₹45",
      "Step 7 — Tahsildar conducts field verification of your community claim",
      "Step 8 — Certificate issued within 15–30 working days after verification",
    ],

    fees: "Approximately ₹35 to ₹45 at MeeSeva.",
    processingTime: "15 to 30 working days. Field verification by Tahsildar is required.",
    validity: "Permanent in most cases. However, some institutions may ask for a certificate issued within the last 1–2 years.",

    commonMistakes: [
      "Not providing the parent's or ancestor's caste certificate — this is the most common reason for rejection",
      "Name mismatch between Aadhaar, application form, and school certificate",
      "Applying for the wrong caste category",
      "Missing school Transfer Certificate or SSC certificate",
    ],

    rejectionReasons: [
      "Insufficient ancestral documentary proof for community claim",
      "Name/DOB mismatch across documents",
      "Incorrect community category selected in application",
    ],

    whatCanGoWrong: [
      "Field verification delay if applicant is not reachable at address",
      "Community claim disputed by Tahsildar if documents are weak",
    ],
  },

  "residence-certificate": {
    id: "residence-certificate",
    name: "Residence Certificate",
    issuingAuthority: "Revenue Department, Government of Telangana",
    officialLink: "https://meeseva.telangana.gov.in/",
    whereToApply: "MeeSeva centre or Tahsildar office",
    lastVerified: "2026-07-01",

    purpose: `A Residence Certificate (also called Domicile Certificate) is an official document issued by the Revenue Department of Telangana that confirms a person is a permanent resident of a specific location in Telangana.`,

    whereUsed: [
      "Educational admissions that require Telangana domicile proof",
      "Government job applications where local candidate status applies",
      "Availing state government welfare schemes reserved for Telangana residents",
      "Hostel admissions under state government schemes",
      "Bank account opening or loan applications (as address proof)",
      "Ration card or other welfare registrations requiring domicile proof",
    ],

    eligibility: [
      "Must be actually residing in Telangana",
      "Must have a valid address proof in Telangana",
      "Aadhaar card with current Telangana address is the strongest proof",
    ],

    documentsRequired: [
      "Application form",
      "Aadhaar card (with Telangana address)",
      "Address proof — Electricity bill / Water bill / Telephone bill (not older than 1 year)",
      "Voter ID Card",
      "Ration Card (if available)",
      "Property tax receipt (if property owner)",
      "Passport-size photograph",
    ],

    optionalDocuments: [
      "Rent agreement (if residing in rented accommodation — notarised preferred)",
      "Employer letter (if employee quarters)",
    ],

    applicationSteps: [
      "Step 1 — Prepare originals and self-attested photocopies of address documents",
      "Step 2 — Visit MeeSeva centre or Tahsildar office of your mandal",
      "Step 3 — Select Revenue Dept → Residence / Domicile Certificate",
      "Step 4 — Fill in personal and address details accurately",
      "Step 5 — Upload required documents",
      "Step 6 — Pay fee of approximately ₹35",
      "Step 7 — Tahsildar verifies through records or field visit",
      "Step 8 — Certificate issued within 7–10 working days",
    ],

    fees: "Approximately ₹35 at MeeSeva.",
    processingTime: "7 to 10 working days.",
    validity: "Usually 6 months to 1 year. Some institutions may ask for a fresh one.",

    commonMistakes: [
      "Address on Aadhaar does not match the address in the application",
      "Using utility bills older than 1 year",
      "Not providing tenancy proof when applying from a rented address",
      "Incomplete form fields",
    ],

    rejectionReasons: [
      "Address mismatch between documents and application",
      "Utility bill too old (older than 1 year not accepted)",
      "No valid tenancy or property proof for rented residence",
    ],

    whatCanGoWrong: [
      "Tahsildar field visit — if you are not reachable at the address, verification may fail",
      "Address mismatch causes outright rejection",
    ],
  },

  "birth-certificate": {
    id: "birth-certificate",
    name: "Birth Certificate",
    issuingAuthority: "Municipal Administration (GHMC / Municipality / Gram Panchayat), Telangana",
    officialLink: "https://www.ghmc.gov.in",
    whereToApply: "GHMC / Municipal Office / Gram Panchayat / MeeSeva",
    lastVerified: "2026-07-01",

    purpose: `A Birth Certificate is an official government record of a child's birth issued by the municipal authority or gram panchayat where the birth occurred. It is the foundational identity document for Indian citizens.`,

    whereUsed: [
      "School admission — mandatory in most schools",
      "Aadhaar card enrollment for children",
      "Passport application — proof of date and place of birth",
      "Voter ID registration",
      "Marriage registration as age proof",
      "Property inheritance and legal purposes",
      "Insurance, pension, and other financial benefits",
      "Proof of citizenship and identity",
    ],

    eligibility: [
      "Birth must have occurred in Telangana",
      "Parent or legal guardian can apply",
      "Registration is free within 21 days of birth",
      "Late fee applies after 21 days",
      "Delayed registration after 1 year requires a Judicial Magistrate order",
    ],

    documentsRequired: [
      "Hospital discharge summary or Birth Intimation Form from hospital",
      "Aadhaar cards of both parents",
      "Parents' marriage certificate",
      "Address proof of parents",
      "Application form (from GHMC/Municipality/MeeSeva)",
    ],

    optionalDocuments: [
      "Ration card of parents",
      "Hospital birth record (if private hospital not registered with municipality)",
    ],

    applicationSteps: [
      "Step 1 — Get the birth record / discharge summary from the hospital before leaving",
      "Step 2 — Contact GHMC / Municipal Office / Gram Panchayat with jurisdiction over the birth location",
      "Step 3 — Obtain and fill the birth registration form",
      "Step 4 — Submit hospital birth record and parents' documents",
      "Step 5 — Pay the applicable fee (free within 21 days of birth)",
      "Step 6 — Collect the acknowledgement slip with reference number",
      "Step 7 — Collect birth certificate within 3–7 working days",
    ],

    fees: "Free if registered within 21 days of birth. Late registration fees apply after 21 days. Delayed registration (after 1 year) requires court order and additional fees.",
    processingTime: "3 to 7 working days if birth is already registered. Up to 30 days for delayed registration.",
    validity: "Permanent — birth certificates do not expire.",

    commonMistakes: [
      "Delaying registration beyond 21 days of birth — this creates complications",
      "Not collecting the hospital birth record / birth intimation before discharge",
      "Name or DOB mismatch in parents' documents",
      "Approaching unofficial agents instead of going to GHMC/municipal office directly",
      "Not verifying that the hospital submitted the birth notification to the municipality",
    ],

    rejectionReasons: [
      "Missing hospital birth record",
      "Parents' documents have name or date discrepancy",
      "Hospital did not register/notify the birth to the local body",
    ],

    whatCanGoWrong: [
      "If registration is delayed beyond 1 year, a court order is mandatory",
      "If the hospital did not file the birth notification, a fresh procedure is needed",
      "Name spelling errors at registration are difficult to correct later",
    ],
  },

  "aadhaar-update": {
    id: "aadhaar-update",
    name: "Aadhaar Update",
    issuingAuthority: "UIDAI (Unique Identification Authority of India)",
    officialLink: "https://myaadhaar.uidai.gov.in",
    whereToApply: "myaadhaar.uidai.gov.in (online) or nearest Aadhaar Seva Kendra",
    lastVerified: "2026-07-01",

    purpose: `Aadhaar Update allows an Aadhaar card holder to correct or update their demographic information (name, address, date of birth, gender, mobile number, email) or biometric data (fingerprints, iris, photo) through official UIDAI channels.`,

    whereUsed: [
      "Correcting name spelling after marriage or official name change",
      "Updating address after relocation",
      "Correcting date of birth discrepancy",
      "Updating mobile number for OTP-based services",
      "Updating photo for better facial recognition",
      "Biometric update for elderly or those with worn fingerprints",
    ],

    eligibility: [
      "Must hold a valid Aadhaar number",
      "For online address update: mobile number must be linked to Aadhaar for OTP",
      "For other updates: must visit Aadhaar Seva Kendra with original supporting documents",
    ],

    documentsRequired: [
      "Aadhaar card (existing)",
      "For address update: Electricity bill / Bank passbook / Voter ID / Ration Card (recent)",
      "For name update: Marriage certificate / Gazette notification / Court order",
      "For DOB update: Birth certificate / School leaving certificate / Matriculation certificate",
    ],

    applicationSteps: [
      "Step 1 — For address update (online): Visit myaadhaar.uidai.gov.in → Update Address → Enter OTP → Upload address proof",
      "Step 2 — For other updates: Visit nearest Aadhaar Seva Kendra",
      "Step 3 — Submit biometrics and original supporting documents",
      "Step 4 — Pay fee of ₹50 (for centre-based updates)",
      "Step 5 — Collect Update Request Number (URN)",
      "Step 6 — Track update status at uidai.gov.in using URN",
    ],

    fees: "₹50 for demographic updates at Aadhaar Seva Kendra. Online address update (SSUP) is free.",
    processingTime: "7 to 10 working days after request submission.",
    validity: "Permanent — Aadhaar does not expire.",

    commonMistakes: [
      "Using unofficial websites claiming to update Aadhaar — only use uidai.gov.in or myaadhaar.uidai.gov.in",
      "Uploading documents that don't match the update being requested",
      "Name in supporting document not matching the name to be updated",
      "Visiting Aadhaar Seva Kendra without appointment (book slot online first)",
    ],

    rejectionReasons: [
      "Document mismatch — name/DOB in document doesn't match the requested update",
      "Invalid or expired address proof",
      "Biometric mismatch at Aadhaar Seva Kendra",
    ],

    whatCanGoWrong: [
      "Mobile not linked to Aadhaar prevents any online update",
      "Update request may be put on hold for manual review if documents are unclear",
    ],
  },

  "driving-licence": {
    id: "driving-licence",
    name: "Driving Licence",
    issuingAuthority: "Transport Department, Government of Telangana / RTO",
    officialLink: "https://sarathi.parivahan.gov.in",
    whereToApply: "sarathi.parivahan.gov.in (online) or nearest RTO",
    lastVerified: "2026-07-01",

    purpose: `A Driving Licence (DL) is an official document issued by the Transport Department authorising a person to operate a motor vehicle on public roads in India. It is also widely accepted as a photo ID and age/address proof.`,

    whereUsed: ["Legal authorisation to drive a motor vehicle", "Photo identity proof", "Address proof", "Age proof for various purposes"],

    eligibility: ["Age 18+ for cars and motorcycles with gears", "Age 16+ for gearless two-wheelers up to 50cc (with parent consent)", "Valid address and identity proof required", "Must pass Learner Licence (LL) test before applying for permanent DL"],

    documentsRequired: ["Aadhaar card (age and address proof)", "Passport-size photographs (white background)", "Application Form 4 (available on Sarathi portal)", "Medical certificate Form 1A (for commercial vehicle licence)", "Existing Learner Licence (when applying for permanent DL)"],

    applicationSteps: [
      "Step 1 — Apply for Learner Licence (LL) at sarathi.parivahan.gov.in",
      "Step 2 — Pay LL fee (approx. ₹200) and book LL test slot at RTO",
      "Step 3 — Pass the computer-based LL test at RTO",
      "Step 4 — Wait minimum 30 days after getting LL",
      "Step 5 — Apply for Permanent Driving Licence on Sarathi portal",
      "Step 6 — Book driving test slot at RTO",
      "Step 7 — Visit RTO with LL, originals, and vehicle for driving test",
      "Step 8 — Pass driving test — DL dispatched to registered address",
    ],

    fees: "Learner Licence: approx. ₹200. Driving Licence: approx. ₹200. Fees vary by vehicle class.",
    processingTime: "15 to 30 days after passing driving test.",
    validity: "20 years or until age 50 (whichever is earlier). Renewed every 5 years after age 50.",

    commonMistakes: ["Applying for permanent DL before completing 30 days of LL", "Not carrying original documents on driving test day", "Selecting wrong vehicle class during application", "Not practising — failing the driving test causes delay"],
    rejectionReasons: ["Failing the driving test", "Document mismatch between LL and DL application", "Medically unfit (for commercial licence)"],
    whatCanGoWrong: ["Failing the driving test requires rebooking and re-fee", "Biometric mismatch can delay processing"],
  },

  "voter-id": {
    id: "voter-id",
    name: "Voter ID (EPIC)",
    issuingAuthority: "Election Commission of India",
    officialLink: "https://voterportal.eci.gov.in",
    whereToApply: "voterportal.eci.gov.in or Electoral Registration Officer (ERO) office",
    lastVerified: "2026-07-01",

    purpose: `A Voter ID card (EPIC — Electoral Photo Identity Card) is issued by the Election Commission of India. It serves as official proof of voter registration and is widely used as a photo identity document.`,

    whereUsed: ["Casting vote in elections", "Photo identity proof for various government and private purposes", "Address proof", "KYC (Know Your Customer) for banks and financial institutions"],

    eligibility: ["Indian citizen", "Age 18 or above on the qualifying date", "Ordinary resident of the constituency where registering"],

    documentsRequired: ["Age proof (Aadhaar / Birth certificate / School certificate)", "Address proof (Aadhaar / Electricity bill)", "Passport-size photograph", "Form 6 (for new registration — available on voterportal.eci.gov.in)"],

    applicationSteps: [
      "Step 1 — Visit voterportal.eci.gov.in or voters.eci.gov.in",
      "Step 2 — Fill Form 6 for new voter registration",
      "Step 3 — Upload required documents",
      "Step 4 — Submit and note the reference number",
      "Step 5 — BLO (Booth Level Officer) may visit for address verification",
      "Step 6 — Voter ID dispatched by post or collect from ERO office",
    ],

    fees: "Free — no fee for voter registration.",
    processingTime: "15 to 30 days.",
    validity: "Permanent. Update required when moving constituency (use Form 8A).",

    commonMistakes: ["Applying in wrong constituency", "Not updating address when moving to new area (use Form 8A)", "Not linking Aadhaar with Voter ID — now mandatory for verification"],
    rejectionReasons: ["Duplicate voter entry detected", "BLO unable to verify address", "Invalid age proof"],
    whatCanGoWrong: ["BLO address verification failure delays card", "Duplicate entry raises objection"],
  },

  "ration-card": {
    id: "ration-card",
    name: "Ration Card",
    issuingAuthority: "Civil Supplies Department, Government of Telangana",
    officialLink: "https://tgfood.gov.in",
    whereToApply: "Civil Supplies office or MeeSeva centre",
    lastVerified: "2026-07-01",

    purpose: `A Ration Card is an official document issued by the Civil Supplies Department of Telangana that entitles a household to purchase subsidised food grains and other commodities through the Public Distribution System (PDS).`,

    whereUsed: ["Purchasing subsidised rice, wheat, sugar from PDS/fair price shops", "Proof of residence and family details", "Income certificate applications (BPL category)", "Government welfare scheme enrolment", "Address and identity proof for many government services"],

    eligibility: ["Resident of Telangana", "Household must not hold a ration card in any other state", "Income criteria apply for different card categories (APL/BPL/AAY)"],

    documentsRequired: ["Application form", "Aadhaar cards of all family members to be enrolled", "Address proof (Electricity bill / Rent agreement)", "Existing ration card surrender proof (if switching from another state)", "Income certificate (for BPL category)", "Passport-size photographs of family members"],

    applicationSteps: [
      "Step 1 — Visit Civil Supplies office or MeeSeva centre",
      "Step 2 — Submit application form with all family member Aadhaar details",
      "Step 3 — Field verification is conducted by a Civil Supplies officer",
      "Step 4 — Card issued after approval — usually in 30–45 days",
    ],

    fees: "Nominal fee at MeeSeva — approximately ₹10 to ₹35.",
    processingTime: "30 to 45 days.",
    validity: "Permanent, but must be updated when family composition changes (birth, death, marriage).",

    commonMistakes: ["Not enrolling all family members at the time of application", "Not surrendering existing ration card from another state", "Applying in wrong income category"],
    rejectionReasons: ["Duplicate card detected in another state", "Address mismatch", "Income/category mismatch"],
    whatCanGoWrong: ["Field verification failure causes rejection", "Aadhaar seeding errors prevent card activation"],
  },

  meeseva: {
    id: "meeseva",
    name: "MeeSeva Services",
    issuingAuthority: "Government of Telangana",
    officialLink: "https://meeseva.telangana.gov.in/",
    whereToApply: "Any MeeSeva centre or meeseva.telangana.gov.in",
    lastVerified: "2026-07-01",

    purpose: `MeeSeva (meaning "At Your Service") is the Government of Telangana's official citizen service delivery platform. It provides over 600 government services through a network of more than 3500 MeeSeva centres across Telangana.`,

    whereUsed: ["Applying for Revenue Department certificates (Income, Caste, Residence)", "Property registration and encumbrance certificates", "Birth and death certificates", "Land record copies (pahani/adangal)", "Utility bill payments", "Pension and welfare scheme applications", "Driving licence and vehicle-related services"],

    eligibility: ["Any citizen of Telangana can use MeeSeva services", "Carry originals + photocopies of relevant documents", "Some services require Aadhaar-linked mobile for OTP"],

    applicationSteps: [
      "Step 1 — Visit nearest MeeSeva centre or go to meeseva.telangana.gov.in",
      "Step 2 — Tell the operator which service you need",
      "Step 3 — Submit your documents and fill the form",
      "Step 4 — Pay the service fee at the counter",
      "Step 5 — Collect acknowledgement receipt with Application Reference Number",
      "Step 6 — Track status using the reference number online or at centre",
      "Step 7 — Collect certificate/document when ready",
    ],

    fees: "Varies by service. Typically ₹10 to ₹50 per service.",
    processingTime: "Varies by service. Certificates: 3 to 30 working days depending on type.",

    commonMistakes: ["Not carrying original documents — photocopies alone not accepted", "Visiting on government holidays when centres may be closed", "Not collecting the acknowledgement receipt"],
    whatCanGoWrong: ["Online portal may have technical downtime", "Centre-specific delays if understaffed"],
  },
};

// ─────────────────────────────────────────────────────────────────
// BUILD FOCUSED CONTEXT — only sends the intent-relevant fields
// ─────────────────────────────────────────────────────────────────
export function buildKnowledgeContext(serviceKey, userMessage) {
  const intent = detectIntent(userMessage);
  const kb = knowledgeBase[serviceKey];

  if (!kb) return `Intent: ${intent}\nNo verified knowledge available for this service.`;

  // Passport uses its own detailed scenario-based builder
  if (serviceKey === "passport") {
    return buildPassportContext(userMessage, kb, intent);
  }

  const meta = `SERVICE: ${kb.name}\nOFFICIAL PORTAL: ${kb.officialLink}\nLAST VERIFIED: ${kb.lastVerified}\nISSUING AUTHORITY: ${kb.issuingAuthority || ""}\nWHERE TO APPLY: ${kb.whereToApply || ""}`;

  switch (intent) {
    case "purpose":
      return `${meta}

INTENT: User wants to know the PURPOSE and USE of this certificate.
DO NOT include documents or steps unless specifically asked.

PURPOSE: ${kb.purpose || ""}

WHERE THIS CERTIFICATE IS USED:
${(kb.whereUsed || []).map((u, i) => `${i + 1}. ${u}`).join("\n")}

NOTE: Final requirements may vary by scheme or institution.`;

    case "documents":
      return `${meta}

INTENT: User wants the DOCUMENTS REQUIRED list only.

MANDATORY DOCUMENTS:
${(kb.documentsRequired || kb.documents || []).map((d, i) => `${i + 1}. ${d}`).join("\n")}

${(kb.optionalDocuments?.length) ? `OPTIONAL / SUPPORTING DOCUMENTS:\n${kb.optionalDocuments.map((d, i) => `${i + 1}. ${d}`).join("\n")}` : ""}`;

    case "steps":
      return `${meta}

INTENT: User wants the APPLICATION PROCESS / STEPS.

APPLICATION STEPS:
${(kb.applicationSteps || kb.steps || []).map((s, i) => `${s}`).join("\n")}

FEES: ${kb.fees || ""}
WHERE TO APPLY: ${kb.whereToApply || ""}`;

    case "eligibility":
      return `${meta}

INTENT: User wants to know ELIGIBILITY CRITERIA.

ELIGIBILITY:
${(kb.eligibility || []).map((e, i) => `${i + 1}. ${e}`).join("\n")}`;

    case "fees":
      return `${meta}

INTENT: User wants to know the FEE / COST.

FEES: ${kb.fees || "No specific fee information available."}`;

    case "time":
      return `${meta}

INTENT: User wants to know the PROCESSING TIME.

PROCESSING TIME: ${kb.processingTime || "Not specified."}
VALIDITY: ${kb.validity || ""}`;

    case "mistakes":
      return `${meta}

INTENT: User wants to know COMMON MISTAKES or WHAT CAN GO WRONG.

COMMON MISTAKES TO AVOID:
${(kb.commonMistakes || []).map((m, i) => `${i + 1}. ${m}`).join("\n")}

REJECTION REASONS:
${(kb.rejectionReasons || []).map((r, i) => `${i + 1}. ${r}`).join("\n")}

WHAT CAN GO WRONG:
${(kb.whatCanGoWrong || []).map((w, i) => `${i + 1}. ${w}`).join("\n")}`;

    case "office":
      return `${meta}

INTENT: User wants to know WHERE TO APPLY / OFFICE LOCATION.

WHERE TO APPLY: ${kb.whereToApply || ""}
OFFICIAL PORTAL: ${kb.officialLink}`;

    case "full":
      return `${meta}

INTENT: User wants a COMPLETE GUIDE for this service.

PURPOSE: ${kb.purpose || ""}

WHERE USED:
${(kb.whereUsed || []).map((u, i) => `${i + 1}. ${u}`).join("\n")}

ELIGIBILITY:
${(kb.eligibility || []).map((e, i) => `${i + 1}. ${e}`).join("\n")}

MANDATORY DOCUMENTS:
${(kb.documentsRequired || kb.documents || []).map((d, i) => `${i + 1}. ${d}`).join("\n")}

${(kb.optionalDocuments?.length) ? `OPTIONAL DOCUMENTS:\n${kb.optionalDocuments.map((d, i) => `${i + 1}. ${d}`).join("\n")}` : ""}

APPLICATION STEPS:
${(kb.applicationSteps || kb.steps || []).map((s) => `${s}`).join("\n")}

FEES: ${kb.fees || ""}
PROCESSING TIME: ${kb.processingTime || ""}
VALIDITY: ${kb.validity || ""}

COMMON MISTAKES:
${(kb.commonMistakes || []).map((m, i) => `${i + 1}. ${m}`).join("\n")}

REJECTION REASONS:
${(kb.rejectionReasons || []).map((r, i) => `${i + 1}. ${r}`).join("\n")}`;

    default:
      // general — send purpose + light overview, let AI decide what's relevant
      return `${meta}

INTENT: General question. Answer only what is relevant to the question.

PURPOSE: ${kb.purpose || ""}
ELIGIBILITY SUMMARY: ${(kb.eligibility || []).join("; ")}
FEES: ${kb.fees || ""}
PROCESSING TIME: ${kb.processingTime || ""}
WHERE TO APPLY: ${kb.whereToApply || ""}`;
  }
}

// ─────────────────────────────────────────────────────────────────
// PASSPORT — scenario-aware context builder (unchanged logic, now intent-aware)
// ─────────────────────────────────────────────────────────────────
function buildPassportContext(userMessage, kb, intent) {
  const msg = userMessage.toLowerCase();
  const meta = `SERVICE: ${kb.name}\nOFFICIAL PORTAL: ${kb.officialLink}\nHELPLINE: ${kb.helpline}\nLAST VERIFIED: ${kb.lastVerified}`;

  // Scenario detection always takes priority for passport
  let scenario = "";
  if (/reschedul|cannot attend|can't attend|multiple time|final date|attend again/.test(msg)) {
    scenario = kb.scenarios.cannotAttendFinalDate.answer + "\n\n" + kb.scenarios.appointmentReschedule.answer;
  } else if (/miss|missed|absent/.test(msg)) {
    scenario = kb.scenarios.missedAppointment.answer;
  } else if (/address proof|address rejected/.test(msg)) {
    scenario = kb.scenarios.addressProofRejected.answer;
  } else if (/police verif|police check|verif.*fail/.test(msg)) {
    scenario = kb.scenarios.policeVerification.answer;
  } else if (/\bhold\b|on hold|stuck/.test(msg)) {
    scenario = kb.scenarios.holdStatus.answer;
  } else if (/tatkaal|urgent|emergency/.test(msg)) {
    scenario = kb.scenarios.tatkaal.answer;
  } else if (/reject|denied|refused/.test(msg)) {
    scenario = kb.scenarios.rejectedApplication.answer;
  } else if (/track|file number|status|arn/.test(msg)) {
    scenario = kb.scenarios.fileNumberTracking.answer;
  } else if (/psk|popsk|rpo|difference|which office/.test(msg)) {
    scenario = kb.scenarios.pskVsPopskVsRpo.answer;
  } else if (/name change|dob|date of birth|correction/.test(msg)) {
    scenario = kb.scenarios.nameDobChange.answer;
  } else if (/missing doc|forgot|left at home/.test(msg)) {
    scenario = kb.scenarios.missingDocumentAtPSK.answer;
  } else if (/minor|child|below 18|kid/.test(msg)) {
    scenario = JSON.stringify(kb.types.minor, null, 2);
  } else if (/renew|reissue|expir/.test(msg)) {
    scenario = JSON.stringify(kb.types.renewal, null, 2);
  }

  if (scenario) {
    return `${meta}\n\nRELEVANT SCENARIO:\n${scenario}`;
  }

  // Intent-based passport response
  switch (intent) {
    case "documents":
      return `${meta}\n\nINTENT: Documents only.\n\nFRESH PASSPORT DOCUMENTS:\n${kb.types.fresh.documents.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nRENEWAL DOCUMENTS:\n${kb.types.renewal.documents.map((d, i) => `${i + 1}. ${d}`).join("\n")}`;
    case "fees":
      return `${meta}\n\nINTENT: Fees only.\n\nFEES: ${kb.types.fresh.fees}`;
    case "time":
      return `${meta}\n\nINTENT: Time only.\n\nPROCESSING TIME: ${kb.types.fresh.processingTime}`;
    case "steps":
      return `${meta}\n\nINTENT: Steps only.\n\nFRESH PASSPORT STEPS:\n${kb.types.fresh.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    case "mistakes":
      return `${meta}\n\nINTENT: Mistakes only.\n\nCOMMON MISTAKES:\n${kb.scenarios.commonMistakes.map((m, i) => `${i + 1}. ${m}`).join("\n")}`;
    default:
      return `${meta}\n\nOVERVIEW: ${kb.overview}\n\nFRESH PASSPORT DOCS: ${kb.types.fresh.documents.join("; ")}\nFEES: ${kb.types.fresh.fees}\nPROCESSING TIME: ${kb.types.fresh.processingTime}\nCOMMON MISTAKES: ${kb.scenarios.commonMistakes.join("; ")}`;
  }
}

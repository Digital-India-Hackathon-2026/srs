/**
 * parseAadhaarFields.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Production parser for Aadhaar card data.
 *
 * Two input modes:
 *   1. Structured JSON (from Vision AI) — fields already extracted, just validate
 *   2. Raw text (from Tesseract) — apply regex extraction as fallback
 *
 * Returns ONLY fields actually found — never fabricates data.
 */

/**
 * Parse structured JSON fields from Vision AI extraction.
 * Validates and normalizes the fields.
 * @param {object} jsonFields - Direct JSON output from Vision AI
 * @returns {{ success: boolean, fields: object, confidence: object }}
 */
export function parseAadhaarStructured(jsonFields) {
  if (!jsonFields || typeof jsonFields !== "object") {
    return { success: false, fields: {}, confidence: {} };
  }

  const fields = {};
  const confidence = {};

  // Full Name
  if (jsonFields.fullName && jsonFields.fullName.trim().length >= 2) {
    fields.fullName = jsonFields.fullName.trim();
    confidence.fullName = 0.92;
  }

  // Date of Birth (validate format)
  if (jsonFields.dateOfBirth && /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(jsonFields.dateOfBirth.trim())) {
    fields.dateOfBirth = jsonFields.dateOfBirth.trim().replace(/-/g, "/");
    confidence.dateOfBirth = 0.93;
  }

  // Year of Birth (if no full DOB)
  if (!fields.dateOfBirth && jsonFields.yearOfBirth && /^\d{4}$/.test(jsonFields.yearOfBirth.trim())) {
    fields.yearOfBirth = jsonFields.yearOfBirth.trim();
    confidence.yearOfBirth = 0.88;
  }

  // Gender
  if (jsonFields.gender && /^(Male|Female|Transgender)$/i.test(jsonFields.gender.trim())) {
    fields.gender = jsonFields.gender.trim().charAt(0).toUpperCase() + jsonFields.gender.trim().slice(1).toLowerCase();
    confidence.gender = 0.95;
  }

  // Aadhaar Number (12 digits) — mask for display
  if (jsonFields.aadhaarNumber) {
    const raw = jsonFields.aadhaarNumber.replace(/\s/g, "");
    if (/^\d{12}$/.test(raw)) {
      fields.aadhaarNumber = `XXXX XXXX ${raw.slice(-4)}`;
      fields._aadhaarFull = raw; // internal use only, never displayed
      confidence.aadhaarNumber = 0.96;
    }
  }

  // Complete Address
  if (jsonFields.address && jsonFields.address.trim().length > 5) {
    fields.address = jsonFields.address.trim();
    confidence.address = 0.85;
  }

  // Address components
  if (jsonFields.houseNumber && jsonFields.houseNumber.trim()) {
    fields.houseNumber = jsonFields.houseNumber.trim();
    confidence.houseNumber = 0.82;
  }
  if (jsonFields.street && jsonFields.street.trim()) {
    fields.street = jsonFields.street.trim();
    confidence.street = 0.80;
  }
  if (jsonFields.locality && jsonFields.locality.trim()) {
    fields.locality = jsonFields.locality.trim();
    confidence.locality = 0.80;
  }
  if (jsonFields.city && jsonFields.city.trim()) {
    fields.city = jsonFields.city.trim();
    confidence.city = 0.85;
  }
  if (jsonFields.district && jsonFields.district.trim()) {
    fields.district = jsonFields.district.trim();
    confidence.district = 0.85;
  }
  if (jsonFields.state && jsonFields.state.trim()) {
    fields.state = jsonFields.state.trim();
    confidence.state = 0.88;
  }
  if (jsonFields.pinCode && /^\d{6}$/.test(jsonFields.pinCode.trim())) {
    fields.pinCode = jsonFields.pinCode.trim();
    confidence.pinCode = 0.92;
  }

  // Father/Husband Name (from S/O, D/O, W/O)
  if (jsonFields.fatherName && jsonFields.fatherName.trim().length >= 2) {
    fields.fatherName = jsonFields.fatherName.trim();
    confidence.fatherName = 0.82;
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}

/**
 * Parse raw OCR text from Tesseract (fallback when Vision AI unavailable).
 * Uses regex heuristics to extract fields.
 * @param {string} rawText - Raw OCR text
 * @returns {{ success: boolean, fields: object, confidence: object }}
 */
export function parseAadhaarFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fields = {};
  const confidence = {};

  // ── Aadhaar Number (12 digits, possibly spaced XXXX XXXX XXXX) ──
  const aadhaarMatch = text.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
  if (aadhaarMatch) {
    const num = aadhaarMatch[1].replace(/\s/g, "");
    if (num.length === 12) {
      fields.aadhaarNumber = `XXXX XXXX ${num.slice(-4)}`;
      fields._aadhaarFull = num;
      confidence.aadhaarNumber = 0.90;
    }
  }

  // ── Date of Birth (DD/MM/YYYY or DD-MM-YYYY) ──
  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.85;
  }

  // ── Year of Birth ──
  if (!fields.dateOfBirth) {
    const yobMatch = text.match(/(?:Year of Birth|YoB|DOB|Birth)\s*[:\-]?\s*(\d{4})/i);
    if (yobMatch) {
      fields.yearOfBirth = yobMatch[1];
      confidence.yearOfBirth = 0.80;
    }
  }

  // ── Gender ──
  const genderMatch = text.match(/\b(Male|Female|MALE|FEMALE|Transgender)\b/i);
  if (genderMatch) {
    fields.gender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase();
    confidence.gender = 0.88;
  }

  // ── PIN Code (6 digits, valid Indian prefix) ──
  const pinMatches = text.match(/\b(\d{6})\b/g);
  if (pinMatches) {
    const validPins = pinMatches.filter(p => /^[1-9]\d{5}$/.test(p));
    if (validPins.length > 0) {
      fields.pinCode = validPins[validPins.length - 1];
      confidence.pinCode = 0.82;
    }
  }

  // ── Name extraction ──
  const namePatterns = [
    /(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fullName = match[1].trim();
      confidence.fullName = 0.75;
      break;
    }
  }
  // Heuristic: capitalized name-like line
  if (!fields.fullName) {
    for (const line of lines) {
      if (/^\d|government|india|aadhaar|uid|dob|male|female|address|help|enrol|unique|authority/i.test(line)) continue;
      if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line) && line.length < 40 && line.length > 4) {
        fields.fullName = line;
        confidence.fullName = 0.60;
        break;
      }
    }
  }

  // ── Father/Husband Name from S/O, D/O, W/O ──
  const relMatch = text.match(/(?:S\/O|D\/O|W\/O|C\/O)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
  if (relMatch) {
    const relName = relMatch[1].trim().split("\n")[0].trim();
    if (relName.length >= 3 && !/\d/.test(relName)) {
      fields.fatherName = relName;
      confidence.fatherName = 0.65;
    }
  }

  // ── Address extraction (multi-line) ──
  const addressStart = text.search(/(?:S\/O|D\/O|W\/O|C\/O|Address|पता)\s*[:\-]?\s*/i);
  if (addressStart !== -1) {
    const afterAddress = text.substring(addressStart);
    const addressEnd = afterAddress.search(/\b\d{6}\b/);
    if (addressEnd > 10) {
      let addr = afterAddress.substring(0, addressEnd + 6).trim();
      addr = addr.replace(/^(?:S\/O|D\/O|W\/O|C\/O|Address|पता)\s*[:\-]?\s*/i, "").trim();
      if (fields.fatherName && addr.startsWith(fields.fatherName)) {
        addr = addr.substring(fields.fatherName.length).replace(/^[\s,]+/, "");
      }
      if (addr.length > 10) {
        fields.address = addr;
        confidence.address = 0.65;
      }
    }
  }

  // ── State detection from address ──
  if (fields.address) {
    const statePatterns = [
      { pattern: /telangana/i, value: "Telangana" },
      { pattern: /andhra\s*pradesh/i, value: "Andhra Pradesh" },
      { pattern: /karnataka/i, value: "Karnataka" },
      { pattern: /maharashtra/i, value: "Maharashtra" },
      { pattern: /tamil\s*nadu/i, value: "Tamil Nadu" },
      { pattern: /kerala/i, value: "Kerala" },
      { pattern: /uttar\s*pradesh/i, value: "Uttar Pradesh" },
      { pattern: /delhi/i, value: "Delhi" },
      { pattern: /rajasthan/i, value: "Rajasthan" },
      { pattern: /gujarat/i, value: "Gujarat" },
    ];
    for (const { pattern, value } of statePatterns) {
      if (pattern.test(fields.address) || pattern.test(text)) {
        fields.state = value;
        confidence.state = 0.7;
        break;
      }
    }
  }

  // ── District detection ──
  if (fields.address) {
    const addrLower = fields.address.toLowerCase();
    const districts = [
      "Hyderabad", "Medchal-Malkajgiri", "Rangareddy", "Sangareddy",
      "Nizamabad", "Karimnagar", "Warangal", "Khammam", "Nalgonda",
      "Mahabubnagar", "Adilabad", "Hanumakonda", "Medak", "Siddipet",
      "Suryapet", "Mancherial", "Kamareddy", "Wanaparthy", "Nagarkurnool",
    ];
    for (const d of districts) {
      if (addrLower.includes(d.toLowerCase())) {
        fields.district = d;
        confidence.district = 0.65;
        break;
      }
    }
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}

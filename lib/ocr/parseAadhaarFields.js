/**
 * parseAadhaarFields(rawText)
 * Parses raw OCR text from an Aadhaar card and extracts structured fields.
 * Returns ONLY fields actually found — never fabricates data.
 */

export function parseAadhaarFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fields = {};
  const confidence = {};

  // ── Extract Aadhaar number (12 digits, possibly spaced as XXXX XXXX XXXX) ──
  const aadhaarMatch = text.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
  if (aadhaarMatch) {
    const num = aadhaarMatch[1].replace(/\s/g, "");
    if (num.length === 12) {
      fields.aadhaarLast4 = num.slice(-4);
      fields.aadhaarNumber = `XXXX XXXX ${num.slice(-4)}`;
      confidence.aadhaarLast4 = 0.95;
    }
  }

  // ── Extract Date of Birth (DD/MM/YYYY or DD-MM-YYYY) ──
  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.9;
  }

  // ── Extract Year of Birth ──
  if (!fields.dateOfBirth) {
    const yobMatch = text.match(/(?:Year of Birth|YoB|DOB)\s*[:\-]?\s*(\d{4})/i);
    if (yobMatch) {
      fields.yearOfBirth = yobMatch[1];
      confidence.yearOfBirth = 0.85;
    }
  }

  // ── Extract Gender ──
  const genderMatch = text.match(/\b(Male|Female|MALE|FEMALE|Transgender)\b/i);
  if (genderMatch) {
    fields.gender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase();
    confidence.gender = 0.92;
  }

  // ── Extract PIN Code (6 digits, typically at end of address) ──
  const pinMatches = text.match(/\b(\d{6})\b/g);
  if (pinMatches) {
    // Take the last 6-digit number that starts with valid Indian PIN prefixes
    const validPins = pinMatches.filter(p => /^[1-9]\d{5}$/.test(p));
    if (validPins.length > 0) {
      fields.pinCode = validPins[validPins.length - 1];
      confidence.pinCode = 0.88;
    }
  }

  // ── Extract Name (heuristic: line after "Government of India" or before DOB/gender) ──
  const namePatterns = [
    /(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fullName = match[1].trim();
      confidence.fullName = 0.8;
      break;
    }
  }

  // If no name from pattern, try heuristic: find capitalized name-like line
  if (!fields.fullName) {
    for (const line of lines) {
      // Skip lines that are clearly not names
      if (/^\d|government|india|aadhaar|uid|dob|male|female|address|help|enrol/i.test(line)) continue;
      if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line) && line.length < 40) {
        fields.fullName = line;
        confidence.fullName = 0.65;
        break;
      }
    }
  }

  // ── Extract Father/Husband Name from S/O, D/O, W/O ──
  const relMatch = text.match(/(?:S\/O|D\/O|W\/O|C\/O)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
  if (relMatch) {
    const relName = relMatch[1].trim().split("\n")[0].trim();
    if (relName.length >= 3 && !/\d/.test(relName)) {
      fields.fatherName = relName;
      confidence.fatherName = 0.7;
    }
  }

  // ── Extract Address (multi-line, typically after S/O, D/O, W/O or "Address:") ──
  const addressStart = text.search(/(?:S\/O|D\/O|W\/O|C\/O|Address|पता)\s*[:\-]?\s*/i);
  if (addressStart !== -1) {
    const afterAddress = text.substring(addressStart);
    // Take text until PIN code or end
    const addressEnd = afterAddress.search(/\b\d{6}\b/);
    if (addressEnd > 10) {
      let addr = afterAddress.substring(0, addressEnd + 6).trim();
      // Clean up prefix
      addr = addr.replace(/^(?:S\/O|D\/O|W\/O|C\/O|Address|पता)\s*[:\-]?\s*/i, "").trim();
      // Remove father name from beginning of address if present
      if (fields.fatherName && addr.startsWith(fields.fatherName)) {
        addr = addr.substring(fields.fatherName.length).replace(/^[\s,]+/, "");
      }
      if (addr.length > 10) {
        fields.address = addr;
        confidence.address = 0.7;
      }
    }
  }

  const success = Object.keys(fields).length > 0;

  return { success, fields, confidence };
}

/**
 * mapPassportFields.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps extracted OCR fields from Aadhaar/PAN into the Passport form schema.
 * Handles both structured (Vision AI) and raw-text-parsed fields.
 * Returns mapped fields with source labels and confidence.
 * Never fabricates data — only maps what was actually extracted.
 */

/**
 * @param {object} aadhaarFields - Fields from parseAadhaarStructured or parseAadhaarFields
 * @param {object} panFields - Fields from parsePanFields
 * @returns {{ fields: object, sources: object, confidence: object }}
 */
export function mapPassportFields(aadhaarFields = {}, panFields = {}) {
  const fields = {};
  const sources = {};
  const confidence = {};

  function setField(fieldId, value, source, conf) {
    if (value && typeof value === "string" && value.trim()) {
      fields[fieldId] = value.trim();
      sources[fieldId] = source;
      confidence[fieldId] = conf || 0.8;
    }
  }

  // ── Name mapping ──
  const fullName = aadhaarFields.fullName || panFields.fullName || "";
  if (fullName) {
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    if (nameParts.length >= 2) {
      setField("surname", nameParts[nameParts.length - 1], aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.85);
      setField("givenName", nameParts.slice(0, -1).join(" "), aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.85);
    } else if (nameParts.length === 1) {
      setField("givenName", fullName, aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.7);
    }
  }

  // ── Date of Birth ──
  const dob = aadhaarFields.dateOfBirth || panFields.dateOfBirth || "";
  if (dob) {
    setField("dateOfBirth", dob, aadhaarFields.dateOfBirth ? "Aadhaar" : "PAN", 0.92);
  } else if (aadhaarFields.yearOfBirth) {
    setField("dateOfBirth", aadhaarFields.yearOfBirth, "Aadhaar", 0.7);
  }

  // ── Gender ──
  if (aadhaarFields.gender) {
    setField("gender", aadhaarFields.gender, "Aadhaar", 0.95);
  }

  // ── Address — prefer structured components, fall back to full address ──
  if (aadhaarFields.houseNumber || aadhaarFields.street || aadhaarFields.locality) {
    // Build address from components
    const addrParts = [
      aadhaarFields.houseNumber,
      aadhaarFields.street,
      aadhaarFields.locality,
    ].filter(Boolean).join(", ");
    if (addrParts.length > 3) {
      setField("houseStreet", addrParts, "Aadhaar", 0.85);
    }
  } else if (aadhaarFields.address) {
    setField("houseStreet", aadhaarFields.address, "Aadhaar", 0.7);
  }

  // ── City ──
  if (aadhaarFields.city) {
    setField("city", aadhaarFields.city, "Aadhaar", 0.85);
  }

  // ── District ──
  if (aadhaarFields.district) {
    setField("district", aadhaarFields.district, "Aadhaar", 0.85);
  }

  // ── State ──
  if (aadhaarFields.state) {
    setField("state", aadhaarFields.state, "Aadhaar", 0.88);
  } else if (aadhaarFields.pinCode && /^5\d{5}$/.test(aadhaarFields.pinCode)) {
    // Telangana/AP PIN range
    setField("state", "Telangana", "Aadhaar (PIN)", 0.7);
  }

  // ── PIN Code ──
  if (aadhaarFields.pinCode) {
    setField("pinCode", aadhaarFields.pinCode, "Aadhaar", 0.92);
  }

  // ── Aadhaar Number (masked) ──
  if (aadhaarFields.aadhaarNumber) {
    setField("aadhaarNumber", aadhaarFields.aadhaarNumber, "Aadhaar", 0.96);
  }

  // ── PAN Number ──
  if (panFields.panNumber) {
    setField("panNumber", panFields.panNumber, "PAN", 0.95);
  }

  // ── Father's Name ──
  // Priority: PAN (usually has explicit "Father's Name"), then Aadhaar S/O
  const fatherName = panFields.fatherName || aadhaarFields.fatherName || "";
  if (fatherName) {
    const source = panFields.fatherName ? "PAN" : "Aadhaar";
    const parts = fatherName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      setField("fatherGivenName", parts.slice(0, -1).join(" "), source, 0.78);
      setField("fatherSurname", parts[parts.length - 1], source, 0.78);
    } else {
      setField("fatherGivenName", fatherName, source, 0.7);
    }
  }

  return { fields, sources, confidence };
}

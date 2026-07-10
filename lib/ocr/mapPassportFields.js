/**
 * mapPassportFields.js
 * Maps extracted OCR fields from Aadhaar/PAN into the Passport form schema field IDs.
 * Returns mapped fields with source labels and confidence.
 */

/**
 * @param {object} aadhaarFields - Fields from parseAadhaarFields
 * @param {object} panFields - Fields from parsePanFields
 * @returns {{ fields: object, sources: object, confidence: object }}
 */
export function mapPassportFields(aadhaarFields = {}, panFields = {}) {
  const fields = {};
  const sources = {};
  const confidence = {};

  // Helper to set field from best source
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
    const nameParts = fullName.split(/\s+/);
    if (nameParts.length >= 2) {
      setField("surname", nameParts[nameParts.length - 1], aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.8);
      setField("givenName", nameParts.slice(0, -1).join(" "), aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.8);
    } else {
      setField("givenName", fullName, aadhaarFields.fullName ? "Aadhaar" : "PAN", 0.7);
    }
  }

  // ── Date of Birth ──
  const dob = aadhaarFields.dateOfBirth || panFields.dateOfBirth || aadhaarFields.yearOfBirth || "";
  if (dob) {
    setField("dateOfBirth", dob, aadhaarFields.dateOfBirth ? "Aadhaar" : "PAN", 0.9);
  }

  // ── Gender ──
  if (aadhaarFields.gender) {
    setField("gender", aadhaarFields.gender, "Aadhaar", 0.92);
  }

  // ── Address ──
  if (aadhaarFields.address) {
    setField("houseStreet", aadhaarFields.address, "Aadhaar", 0.7);
  }

  // ── PIN Code ──
  if (aadhaarFields.pinCode) {
    setField("pinCode", aadhaarFields.pinCode, "Aadhaar", 0.88);
  }

  // ── Aadhaar Number ──
  if (aadhaarFields.aadhaarNumber) {
    setField("aadhaarNumber", aadhaarFields.aadhaarNumber, "Aadhaar", 0.95);
  }

  // ── PAN Number ──
  if (panFields.panNumber) {
    setField("panNumber", panFields.panNumber, "PAN", 0.95);
  }

  // ── Father's Name from PAN ──
  if (panFields.fatherName) {
    const parts = panFields.fatherName.split(/\s+/);
    if (parts.length >= 2) {
      setField("fatherGivenName", parts.slice(0, -1).join(" "), "PAN", 0.75);
      setField("fatherSurname", parts[parts.length - 1], "PAN", 0.75);
    } else {
      setField("fatherGivenName", panFields.fatherName, "PAN", 0.7);
    }
  }

  // ── Father's name from Aadhaar S/O D/O field ──
  if (!fields.fatherGivenName && aadhaarFields.fatherName) {
    const parts = aadhaarFields.fatherName.split(/\s+/);
    if (parts.length >= 2) {
      setField("fatherGivenName", parts.slice(0, -1).join(" "), "Aadhaar", 0.7);
      setField("fatherSurname", parts[parts.length - 1], "Aadhaar", 0.7);
    } else {
      setField("fatherGivenName", aadhaarFields.fatherName, "Aadhaar", 0.65);
    }
  }

  return { fields, sources, confidence };
}

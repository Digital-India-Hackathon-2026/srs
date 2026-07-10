/**
 * extractFields(rawText, documentType)
 * ─────────────────────────────────────────────────────────────────────────────
 * OCR Layer 2: Takes raw OCR text and extracts structured fields from it.
 *
 * Future implementation will use:
 *   - Regex patterns for Indian document formats
 *   - NLP-based field extraction
 *   - LLM-powered structured extraction (GPT-4o)
 *
 * Input:  Raw text string + document type hint
 * Output: { success, fields: { key: value }, confidence }
 *
 * Currently returns mock extracted fields.
 */

// Regex patterns for future implementation (Indian document formats)
const PATTERNS = {
  aadhaarNumber: /\d{4}\s?\d{4}\s?\d{4}/,
  panNumber: /[A-Z]{5}\d{4}[A-Z]/,
  pinCode: /\d{6}/,
  mobileNumber: /[6-9]\d{9}/,
  dateOfBirth: /\d{2}[\/\-]\d{2}[\/\-]\d{4}/,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  name: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+/m,
};

/**
 * @param {string} rawText — text output from OCR
 * @param {string} documentType — "aadhaar" | "pan" | "address-proof" | "photo" | "other"
 * @returns {Promise<{
 *   success: boolean,
 *   fields: Record<string, string>,
 *   confidence: number,
 *   documentType: string
 * }>}
 */
export async function extractFields(rawText, documentType) {
  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 300));

  // ── Mock field extraction based on document type ────────────────────────────
  const mockExtractions = {
    aadhaar: {
      success: true,
      fields: {
        full_name: "John Doe",
        date_of_birth: "15/03/1995",
        aadhaar_number: "123456789012",
        address: "1-2-3, Example Street, Hyderabad, Telangana 500001",
        gender: "Male",
        pin_code: "500001",
        state: "Telangana",
        district: "Hyderabad",
      },
      confidence: 0.88,
      documentType: "aadhaar",
    },
    pan: {
      success: true,
      fields: {
        full_name: "JOHN DOE",
        pan_number: "ABCDE1234F",
        date_of_birth: "15/03/1995",
        father_name: "JAMES DOE",
      },
      confidence: 0.90,
      documentType: "pan",
    },
    "address-proof": {
      success: true,
      fields: {
        full_name: "John Doe",
        address: "1-2-3, Example Street, Hyderabad, Telangana 500001",
        pin_code: "500001",
        city: "Hyderabad",
        state: "Telangana",
      },
      confidence: 0.82,
      documentType: "address-proof",
    },
    photo: {
      success: true,
      fields: {
        has_photo: "true",
        photo_valid: "true",
      },
      confidence: 1.0,
      documentType: "photo",
    },
  };

  return mockExtractions[documentType] || {
    success: false,
    fields: {},
    confidence: 0,
    documentType: documentType || "unknown",
  };
}

/**
 * Merge fields extracted from multiple documents into one unified object.
 * Later documents override earlier ones for the same field (higher priority).
 *
 * @param {Array<{ fields: Record<string, string>, documentType: string }>} extractions
 * @returns {Record<string, string>}
 */
export function mergeExtractedFields(extractions) {
  const merged = {};

  // Priority order: aadhaar > pan > address-proof > other
  const priority = ["other", "address-proof", "pan", "aadhaar"];

  const sorted = [...extractions].sort(
    (a, b) => priority.indexOf(a.documentType) - priority.indexOf(b.documentType)
  );

  for (const extraction of sorted) {
    if (extraction.fields) {
      Object.assign(merged, extraction.fields);
    }
  }

  return merged;
}

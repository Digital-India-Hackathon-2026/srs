/**
 * DEPRECATED — This file no longer returns mock data.
 * Real OCR is now handled by /api/ocr/passport route using Tesseract.js.
 * This file is kept only as a fallback interface if the API is unreachable.
 */

export async function extractPassportFields() {
  // Returns empty — never fabricate user data
  return {
    extracted: {},
    sources: {},
    error: "No document processed. Upload a document to extract details.",
  };
}

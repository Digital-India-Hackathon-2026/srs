/**
 * extractText(file)
 * ─────────────────────────────────────────────────────────────────────────────
 * OCR Layer 1: Takes an uploaded file and extracts raw text from it.
 *
 * Future implementation will use:
 *   - Tesseract.js (client-side OCR) or
 *   - Google Vision API or
 *   - Azure Document Intelligence or
 *   - OpenAI Vision (GPT-4o with image input)
 *
 * Input:  File object (PDF, PNG, JPG)
 * Output: { success, text, confidence, documentType, metadata }
 *
 * Currently returns mock data.
 */

/**
 * @param {File|Buffer} file — uploaded document
 * @param {object} [options]
 * @param {string} [options.language="eng"] — OCR language hint
 * @param {string} [options.documentType] — "aadhaar" | "pan" | "photo" | "address-proof" | "other"
 * @returns {Promise<{
 *   success: boolean,
 *   text: string,
 *   confidence: number,
 *   documentType: string,
 *   metadata: object
 * }>}
 */
export async function extractText(file, options = {}) {
  const { language = "eng", documentType = "unknown" } = options;

  // ── Mock implementation ────────────────────────────────────────────────────
  // Replace this with real OCR engine when ready.

  // Simulate async processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock extracted text based on document type
  const mockResults = {
    aadhaar: {
      success: true,
      text: "GOVERNMENT OF INDIA\nJohn Doe\nDOB: 15/03/1995\n1234 5678 9012\nAddress: 1-2-3, Example Street, Hyderabad, Telangana 500001",
      confidence: 0.92,
      documentType: "aadhaar",
      metadata: { pages: 1, format: "image", language },
    },
    pan: {
      success: true,
      text: "INCOME TAX DEPARTMENT\nJOHN DOE\nABCDE1234F\nDOB: 15/03/1995\nFather's Name: JAMES DOE",
      confidence: 0.89,
      documentType: "pan",
      metadata: { pages: 1, format: "image", language },
    },
    "address-proof": {
      success: true,
      text: "Electricity Bill\nConsumer: John Doe\nAddress: 1-2-3, Example Street, Hyderabad, Telangana 500001\nAccount No: 12345678",
      confidence: 0.85,
      documentType: "address-proof",
      metadata: { pages: 1, format: "image", language },
    },
    photo: {
      success: true,
      text: "",
      confidence: 1.0,
      documentType: "photo",
      metadata: { pages: 1, format: "image", isPhoto: true, language },
    },
    unknown: {
      success: true,
      text: "Document text extraction placeholder. Real OCR will process the uploaded file.",
      confidence: 0.5,
      documentType: "unknown",
      metadata: { pages: 1, format: "unknown", language },
    },
  };

  return mockResults[documentType] || mockResults.unknown;
}

/**
 * Check if a file type is supported for OCR.
 * @param {string} mimeType
 * @returns {boolean}
 */
export function isSupportedFileType(mimeType) {
  const supported = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];
  return supported.includes(mimeType);
}

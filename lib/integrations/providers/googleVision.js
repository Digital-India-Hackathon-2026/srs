/**
 * Google Cloud Vision OCR Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * When ready:
 *   1. Set GOOGLE_VISION_API_KEY in .env.local
 *   2. npm install @google-cloud/vision
 *   3. Implement extractText() below
 *   4. Update status in lib/integrations/index.js to "ready"
 */

export async function extractText(fileBuffer, options = {}) {
  throw new Error("Google Vision OCR not implemented yet. Set GOOGLE_VISION_API_KEY and implement this provider.");
}

export async function extractDocumentFields(fileBuffer, documentType) {
  throw new Error("Google Vision Document AI not implemented yet.");
}

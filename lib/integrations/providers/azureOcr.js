/**
 * Azure Document Intelligence Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * When ready:
 *   1. Set AZURE_DOCUMENT_ENDPOINT and AZURE_DOCUMENT_KEY in .env.local
 *   2. npm install @azure/ai-form-recognizer
 *   3. Implement functions below
 *   4. Update status in lib/integrations/index.js to "ready"
 */

export async function extractText(fileBuffer, options = {}) {
  throw new Error("Azure OCR not implemented yet. Configure AZURE_DOCUMENT_ENDPOINT.");
}

export async function recognizeIdDocument(fileBuffer) {
  throw new Error("Azure ID Document Recognition not implemented yet.");
}

export async function extractFormFields(fileBuffer, modelId) {
  throw new Error("Azure Form Recognition not implemented yet.");
}

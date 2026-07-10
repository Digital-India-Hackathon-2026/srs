/**
 * Gemini Vision Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * When ready:
 *   1. GEMINI_API_KEY must be set (already used for chat fallback)
 *   2. Use Gemini 1.5 Pro/Flash with image input
 *   3. Send structured extraction prompt
 *   4. Update status in lib/integrations/index.js to "ready"
 */

export async function extractFieldsFromImage(imageBase64, documentType) {
  throw new Error("Gemini Vision extraction not implemented yet. Requires GEMINI_API_KEY.");
}

export async function analyzeDocument(imageBase64) {
  throw new Error("Gemini Vision document analysis not implemented yet.");
}

/**
 * OpenAI Vision Provider (GPT-4o)
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * When ready:
 *   1. OPENAI_API_KEY must be set (already used for chat)
 *   2. Send image as base64 to GPT-4o with structured extraction prompt
 *   3. Parse JSON response into field map
 *   4. Update status in lib/integrations/index.js to "ready"
 */

export async function extractFieldsFromImage(imageBase64, documentType, formSchema) {
  throw new Error("OpenAI Vision extraction not implemented yet. Requires OPENAI_API_KEY.");
}

export async function validateDocument(imageBase64, expectedType) {
  throw new Error("OpenAI Vision document validation not implemented yet.");
}

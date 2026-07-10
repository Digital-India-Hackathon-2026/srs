/**
 * DigiLocker Integration Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * When ready:
 *   1. Register as DigiLocker partner at partners.digitallocker.gov.in
 *   2. Set DIGILOCKER_CLIENT_ID and DIGILOCKER_CLIENT_SECRET in .env.local
 *   3. Implement OAuth 2.0 flow
 *   4. Update status in lib/integrations/index.js to "ready"
 *
 * Capabilities:
 *   - Fetch user documents (Aadhaar, PAN, DL, Marksheets)
 *   - Verify document authenticity
 *   - Pull pre-filled data for application forms
 */

export async function initiateAuth(redirectUri) {
  throw new Error("DigiLocker auth not implemented yet. Register as partner first.");
}

export async function handleCallback(authCode) {
  throw new Error("DigiLocker callback not implemented yet.");
}

export async function fetchDocument(accessToken, documentType) {
  throw new Error("DigiLocker document fetch not implemented yet.");
}

export async function listIssuedDocuments(accessToken) {
  throw new Error("DigiLocker document listing not implemented yet.");
}

export async function verifyDocument(accessToken, documentUri) {
  throw new Error("DigiLocker verification not implemented yet.");
}

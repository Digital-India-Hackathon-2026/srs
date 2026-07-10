/**
 * Government SSO / Login Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * Supports:
 *   - Parichay (NIC SSO for government services)
 *   - MeeSeva Auth (Telangana-specific)
 *   - Aadhaar eKYC-based authentication
 *
 * When ready:
 *   1. Register with Parichay / MeeSeva as service provider
 *   2. Set GOV_SSO_CLIENT_ID and GOV_SSO_CLIENT_SECRET
 *   3. Implement OAuth 2.0 / SAML flow
 *   4. Update status in lib/integrations/index.js to "ready"
 */

export async function initiateLogin(provider, redirectUri) {
  throw new Error(`Government SSO (${provider}) not implemented yet.`);
}

export async function handleCallback(provider, authCode) {
  throw new Error(`Government SSO callback (${provider}) not implemented yet.`);
}

export async function getUserProfile(accessToken) {
  throw new Error("Government SSO profile fetch not implemented yet.");
}

export async function verifyAadhaarEkyc(aadhaarNumber, otp) {
  throw new Error("Aadhaar eKYC verification not implemented yet.");
}

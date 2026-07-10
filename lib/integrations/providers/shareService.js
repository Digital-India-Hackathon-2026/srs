/**
 * Share Service Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * Allows users to share their draft via various channels.
 *
 * Features planned:
 *   - WhatsApp share (Web Share API or deep link)
 *   - Email share (mailto: with pre-filled body)
 *   - Copy shareable link (encrypted short URL)
 *   - QR code generation for draft link
 *
 * When ready:
 *   1. Implement share functions below
 *   2. For link sharing: set up a short URL service or use encryption
 *   3. Update status in lib/integrations/index.js to "ready"
 */

export async function shareViaWhatsApp(draftText) {
  throw new Error("WhatsApp share not implemented yet.");
}

export async function shareViaEmail(draftText, recipientEmail) {
  throw new Error("Email share not implemented yet.");
}

export async function generateShareableLink(draftData) {
  throw new Error("Shareable link generation not implemented yet.");
}

export async function generateQrCode(url) {
  throw new Error("QR code generation not implemented yet.");
}

export function canUseWebShareApi() {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export async function shareViaNativeApi(title, text, url) {
  if (!canUseWebShareApi()) {
    throw new Error("Web Share API not available on this device.");
  }
  throw new Error("Native share not implemented yet.");
}

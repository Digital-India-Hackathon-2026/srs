/**
 * PDF Generator Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * Generates downloadable PDF from application draft.
 *
 * Options:
 *   - jsPDF (client-side, lightweight)
 *   - react-pdf/renderer (React components to PDF)
 *   - Puppeteer (server-side, full HTML rendering)
 *
 * Features planned:
 *   - Government-format layout (A4)
 *   - QR code with verification link
 *   - Watermark: "DRAFT — Not for official submission"
 *   - Header with SevaSetu branding
 *   - Footer with generation timestamp
 *
 * When ready:
 *   1. npm install jspdf (or react-pdf or puppeteer)
 *   2. Implement generatePdf() below
 *   3. Update status in lib/integrations/index.js to "ready"
 */

export async function generatePdf(draft, options = {}) {
  throw new Error("PDF generation not implemented yet. Install jspdf or react-pdf.");
}

export async function generatePdfFromHtml(htmlContent, options = {}) {
  throw new Error("HTML-to-PDF not implemented yet.");
}

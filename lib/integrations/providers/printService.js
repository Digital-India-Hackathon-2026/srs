/**
 * Print Service Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT IMPLEMENTED — extension point only.
 *
 * Handles browser-based printing with proper A4 layout.
 *
 * Features planned:
 *   - Formatted A4 print layout
 *   - Government form styling (borders, headers, fields)
 *   - Print-friendly CSS (no buttons, no navigation)
 *   - Page break handling for multi-page forms
 *
 * When ready:
 *   1. Create a print-specific CSS stylesheet
 *   2. Implement openPrintDialog() below
 *   3. Update status in lib/integrations/index.js to "ready"
 */

export function openPrintDialog(draftHtmlElement) {
  throw new Error("Print service not implemented yet.");
}

export function generatePrintableHtml(draft, formSchema) {
  throw new Error("Printable HTML generation not implemented yet.");
}

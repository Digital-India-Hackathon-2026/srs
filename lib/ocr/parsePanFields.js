/**
 * parsePanFields(rawText)
 * Parses raw OCR text from a PAN card and extracts structured fields.
 * Returns ONLY fields actually found — never fabricates data.
 */

export function parsePanFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fields = {};
  const confidence = {};

  // ── Extract PAN number (AAAAA9999A format) ──
  const panMatch = text.match(/\b([A-Z]{5}\d{4}[A-Z])\b/);
  if (panMatch) {
    fields.panNumber = panMatch[1];
    confidence.panNumber = 0.95;
  }

  // ── Extract Date of Birth ──
  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.88;
  }

  // ── Extract Name ──
  // PAN cards typically have name on lines after "Name" or between specific markers
  const namePatterns = [
    /(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fullName = match[1].trim();
      confidence.fullName = 0.8;
      break;
    }
  }

  // Heuristic: find capitalized name-like lines
  if (!fields.fullName) {
    for (const line of lines) {
      if (/^\d|income|tax|govt|india|permanent|account|number|pan|dob|date|father/i.test(line)) continue;
      if (/^[A-Z][A-Z\s]{4,40}$/.test(line) && line.split(/\s+/).length <= 4) {
        fields.fullName = line.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
        confidence.fullName = 0.6;
        break;
      }
    }
  }

  // ── Extract Father's Name ──
  const fatherMatch = text.match(/(?:Father'?s?\s*Name|पिता\s*का\s*नाम)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
  if (fatherMatch) {
    fields.fatherName = fatherMatch[1].trim();
    confidence.fatherName = 0.75;
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}

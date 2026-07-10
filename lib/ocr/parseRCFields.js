/**
 * parseRCFields.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Parses raw OCR text from a Vehicle Registration Certificate (RC Book/Card).
 * Extracts registration number, chassis, engine, owner, vehicle class, etc.
 * Returns ONLY fields actually found — never fabricates data.
 */

export function parseRCFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const fields = {};
  const confidence = {};

  // ── Registration Number (format: TS09EA1234 or TS 09 EA 1234) ──
  const regMatch = text.match(/\b([A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4})\b/);
  if (regMatch) {
    fields.registrationNumber = regMatch[1].replace(/\s/g, "");
    confidence.registrationNumber = 0.9;
  }

  // ── Chassis Number (17-character alphanumeric, typically uppercase) ──
  const chassisPatterns = [
    /(?:Chassis|Chasis|Ch\.?\s*No)\s*[:\-]?\s*([A-Z0-9]{17})/i,
    /\b([A-Z0-9]{17})\b/,
  ];
  for (const pattern of chassisPatterns) {
    const match = text.match(pattern);
    if (match && /[A-Z]/.test(match[1]) && /\d/.test(match[1]) && match[1].length === 17) {
      fields.chassisNumber = match[1];
      confidence.chassisNumber = 0.85;
      break;
    }
  }

  // ── Engine Number ──
  const engineMatch = text.match(/(?:Engine|Eng\.?\s*No)\s*[:\-]?\s*([A-Z0-9]{5,20})/i);
  if (engineMatch) {
    fields.engineNumber = engineMatch[1];
    confidence.engineNumber = 0.82;
  }

  // ── Owner Name ──
  const ownerMatch = text.match(/(?:Owner|Registered\s*Owner|Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
  if (ownerMatch && ownerMatch[1].trim().length >= 3) {
    fields.ownerName = ownerMatch[1].trim();
    confidence.ownerName = 0.78;
  }

  // ── Vehicle Class ──
  const classMatch = text.match(/(?:Class|Type|Category|COV)\s*[:\-]?\s*([A-Za-z\s\/\-\(\)]{3,40})/i);
  if (classMatch) {
    fields.vehicleClass = classMatch[1].trim();
    confidence.vehicleClass = 0.75;
  }
  // Also try standard abbreviations
  const classAbbr = text.match(/\b(LMV|MCWG|MCWOG|HMV|HGMV|HPMV|LMV-NT|MC\s*50CC|3W-NT)\b/gi);
  if (classAbbr && !fields.vehicleClass) {
    fields.vehicleClass = [...new Set(classAbbr.map(c => c.toUpperCase()))].join(", ");
    confidence.vehicleClass = 0.8;
  }

  // ── Registration Date ──
  const regDateMatch = text.match(/(?:Reg(?:istration)?\.?\s*Date|Date\s*of\s*Reg)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (regDateMatch) {
    fields.registrationDate = regDateMatch[1].replace(/-/g, "/");
    confidence.registrationDate = 0.82;
  }

  // ── Fuel Type ──
  const fuelMatch = text.match(/(?:Fuel|Fuel\s*Type)\s*[:\-]?\s*(Petrol|Diesel|CNG|LPG|Electric|EV|Hybrid)/i);
  if (fuelMatch) {
    fields.fuelType = fuelMatch[1].charAt(0).toUpperCase() + fuelMatch[1].slice(1).toLowerCase();
    confidence.fuelType = 0.85;
  }

  // ── Manufacturer / Make ──
  const makeMatch = text.match(/(?:Make|Maker|Manufacturer|Mfr)\s*[:\-]?\s*([A-Za-z\s]{2,30})/i);
  if (makeMatch) {
    fields.manufacturer = makeMatch[1].trim();
    confidence.manufacturer = 0.75;
  }

  // ── Model ──
  const modelMatch = text.match(/(?:Model|Vehicle\s*Model)\s*[:\-]?\s*([A-Za-z0-9\s\-]{2,30})/i);
  if (modelMatch) {
    fields.model = modelMatch[1].trim();
    confidence.model = 0.7;
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}

import { readFileSync } from "fs";
import { join } from "path";

/**
 * SevaSetu Knowledge Retriever
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads knowledge JSON files lazily (only the requested service)
 * and extracts only the section relevant to the detected intent.
 *
 * Architecture note:
 *   - Knowledge files live in /lib/knowledge/*.json
 *   - Each file follows the standard SevaSetu schema
 *   - Add new services by dropping a new JSON file — no code change needed.
 *   - The SECTION_MAP connects intent names to JSON section keys.
 */

// ─── Map intent → JSON section key(s) ────────────────────────────────────────
const SECTION_MAP = {
  purpose:                ["purpose", "whereUsed"],
  eligibility:            ["eligibility"],
  documents:              ["documents"],
  fees:                   ["fees"],
  processing_time:        ["processingTime", "validity"],
  steps:                  ["steps"],
  appointment:            ["appointment"],
  appointment_reschedule: ["appointment"],
  tracking:               ["tracking"],
  renewal:                ["renewal"],
  lost_document:          ["lostDocument"],
  name_change:            ["nameChange"],
  address_change:         ["addressChange"],
  rejection:              ["edgeCases"],
  office:                 ["office"],
  portal:                 ["officialPortal"],
  faq:                    ["faqs"],
  edge_case:              ["edgeCases"],
  full_guide:             null, // null = return everything
  general:                ["purpose", "steps"],
};

// ─── Lazy knowledge cache (per-request in server components, session in client)
const _cache = new Map();

/**
 * Load a knowledge file for a service using fs.readFileSync (server-safe).
 * Uses a simple in-memory cache so we don't re-read the file on every request.
 *
 * @param {string} serviceId
 * @returns {object|null}
 */
function loadKnowledge(serviceId) {
  if (_cache.has(serviceId)) return _cache.get(serviceId);

  try {
    const filePath = join(process.cwd(), "lib", "knowledge", `${serviceId}.json`);
    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    _cache.set(serviceId, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Retrieve ONLY the relevant section for a given service + intent.
 * Synchronous — uses fs.readFileSync internally.
 *
 * @param {string} serviceId
 * @param {string} intent
 * @returns {{
 *   found: boolean,
 *   serviceId: string,
 *   intent: string,
 *   sectionKeys: string[],
 *   data: object|null,
 *   officialPortal: string,
 *   lastVerified: string,
 *   source: string
 * }}
 */
export function retrieveKnowledge(serviceId, intent) {
  const knowledge = loadKnowledge(serviceId);

  const base = {
    serviceId,
    intent,
    officialPortal: knowledge?.officialPortal ?? "",
    lastVerified:   knowledge?.lastVerified   ?? "",
    source:         knowledge ? `${serviceId}.json` : "not_found",
  };

  if (!knowledge) {
    return { ...base, found: false, sectionKeys: [], data: null };
  }

  const sectionKeys = SECTION_MAP[intent] ?? ["purpose", "steps"];

  // full_guide → return all sections
  if (intent === "full_guide" || sectionKeys === null) {
    return {
      ...base,
      found: true,
      sectionKeys: Object.keys(knowledge.sections),
      data: knowledge.sections,
    };
  }

  // Extract only requested sections
  const extracted = {};
  for (const key of sectionKeys) {
    if (key === "officialPortal") {
      extracted[key] = knowledge.officialPortal;
    } else if (knowledge.sections?.[key] !== undefined) {
      extracted[key] = knowledge.sections[key];
    }
  }

  const found = Object.keys(extracted).length > 0;

  return {
    ...base,
    found,
    sectionKeys,
    data: found ? extracted : null,
  };
}

/**
 * Format retrieved data into a readable text block for the prompt builder.
 * Handles strings, arrays, and nested objects cleanly.
 *
 * @param {object} retrievalResult  — output of retrieveKnowledge()
 * @returns {string}
 */
export function formatRetrievedContext(retrievalResult) {
  const { serviceId, intent, data, officialPortal, lastVerified, found } = retrievalResult;

  if (!found || !data) {
    return `No verified knowledge found for service="${serviceId}" intent="${intent}". Knowledge file may not be populated yet.`;
  }

  const lines = [];

  for (const [key, value] of Object.entries(data)) {
    const label = key.replace(/([A-Z])/g, " $1").toUpperCase().trim();
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${label}:`);
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          lines.push(`  ${i + 1}. ${item.situation ?? item.question ?? JSON.stringify(item)}`);
          if (item.guidance) lines.push(`     → ${item.guidance}`);
          if (item.note)     lines.push(`     Note: ${item.note}`);
        } else {
          lines.push(`  ${i + 1}. ${item}`);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      lines.push(`${label}:`);
      for (const [subKey, subVal] of Object.entries(value)) {
        lines.push(`  ${subKey}: ${subVal}`);
      }
    } else if (value) {
      lines.push(`${label}: ${value}`);
    }
  }

  if (officialPortal) lines.push(`OFFICIAL PORTAL: ${officialPortal}`);
  if (lastVerified)  lines.push(`LAST VERIFIED: ${lastVerified}`);

  return lines.join("\n");
}

/**
 * Clear the in-memory cache (useful in tests or hot-reload scenarios).
 */
export function clearCache() {
  _cache.clear();
}

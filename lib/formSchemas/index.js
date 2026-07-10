/**
 * Service Schema Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamic lookup for form schemas.
 * Add new services here — no other code changes needed.
 *
 * Usage:
 *   import { getSchema, getAvailableServices } from "@/lib/formSchemas";
 *   const schema = getSchema("passport");
 */

import { passportSchema } from "./passport";
import { learnerLicenceSchema } from "./learnerLicence";

// ── Registry — add new schemas here ──────────────────────────────────────────
const SCHEMA_REGISTRY = {
  passport: passportSchema,
  "learner-licence": learnerLicenceSchema,
  // Future:
  // "income-certificate": incomeCertificateSchema,
  // "birth-certificate": birthCertificateSchema,
  // "aadhaar": aadhaarSchema,
  // "caste-certificate": casteCertificateSchema,
  // "residence-certificate": residenceCertificateSchema,
  // "driving-licence": drivingLicenceSchema,
  // "voter-id": voterIdSchema,
  // "pan": panSchema,
};

/**
 * Get the form schema for a service by ID.
 * @param {string} serviceId — e.g. "passport", "learner-licence"
 * @returns {object|null} — schema or null if not found
 */
export function getSchema(serviceId) {
  return SCHEMA_REGISTRY[serviceId] || null;
}

/**
 * Get all available services that have form schemas.
 * @returns {Array<{ id: string, name: string, officialPortal: string }>}
 */
export function getAvailableServices() {
  return Object.entries(SCHEMA_REGISTRY).map(([id, schema]) => ({
    id,
    name: schema.serviceName,
    officialPortal: schema.officialPortal,
  }));
}

/**
 * Check if a service has a registered schema.
 * @param {string} serviceId
 * @returns {boolean}
 */
export function hasSchema(serviceId) {
  return serviceId in SCHEMA_REGISTRY;
}

/**
 * SevaSetu Integration Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Central extension point for all future integrations.
 * Each integration is registered here with its status and config.
 *
 * To enable an integration:
 *   1. Set the required env variable
 *   2. Implement the provider in lib/integrations/providers/
 *   3. Update status to "ready"
 *
 * No core code changes needed to add new integrations.
 */

export const INTEGRATIONS = {
  // ── OCR Providers ──────────────────────────────────────────────────────────
  ocr: {
    googleVision: {
      id: "google-vision",
      name: "Google Cloud Vision",
      status: "planned", // planned | configured | ready | active
      envKey: "GOOGLE_VISION_API_KEY",
      provider: null, // → lib/integrations/providers/googleVision.js
      capabilities: ["text-extraction", "document-ai", "handwriting", "multilingual"],
      docs: "https://cloud.google.com/vision/docs",
    },
    azureOcr: {
      id: "azure-ocr",
      name: "Azure Document Intelligence",
      status: "planned",
      envKey: "AZURE_DOCUMENT_ENDPOINT",
      provider: null, // → lib/integrations/providers/azureOcr.js
      capabilities: ["text-extraction", "form-recognition", "table-extraction", "id-documents"],
      docs: "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/",
    },
    openaiVision: {
      id: "openai-vision",
      name: "OpenAI Vision (GPT-4o)",
      status: "planned",
      envKey: "OPENAI_API_KEY",
      provider: null, // → lib/integrations/providers/openaiVision.js
      capabilities: ["text-extraction", "field-extraction", "context-understanding", "multilingual"],
      docs: "https://platform.openai.com/docs/guides/vision",
    },
    geminiVision: {
      id: "gemini-vision",
      name: "Gemini Vision",
      status: "planned",
      envKey: "GEMINI_API_KEY",
      provider: null, // → lib/integrations/providers/geminiVision.js
      capabilities: ["text-extraction", "document-understanding", "multilingual"],
      docs: "https://ai.google.dev/gemini-api/docs/vision",
    },
  },

  // ── Government Identity ────────────────────────────────────────────────────
  identity: {
    digiLocker: {
      id: "digilocker",
      name: "DigiLocker",
      status: "planned",
      envKey: "DIGILOCKER_CLIENT_ID",
      provider: null, // → lib/integrations/providers/digiLocker.js
      capabilities: ["document-fetch", "aadhaar-verify", "pan-verify", "driving-licence-fetch", "issued-documents"],
      authFlow: "OAuth 2.0",
      docs: "https://partners.digitallocker.gov.in/",
    },
    governmentLogin: {
      id: "gov-login",
      name: "Government SSO (Parichay / MeeSeva Auth)",
      status: "planned",
      envKey: "GOV_SSO_CLIENT_ID",
      provider: null, // → lib/integrations/providers/govLogin.js
      capabilities: ["sso-authentication", "aadhaar-ekyc", "mobile-otp-verify"],
      authFlow: "OAuth 2.0 / SAML",
      docs: "https://parichay.nic.in/",
    },
  },

  // ── Document Management ────────────────────────────────────────────────────
  documents: {
    documentVault: {
      id: "document-vault",
      name: "SevaSetu Document Vault",
      status: "planned",
      envKey: null, // local storage initially, then cloud
      provider: null, // → lib/integrations/providers/documentVault.js
      capabilities: ["secure-storage", "encryption-at-rest", "auto-delete", "document-tagging", "expiry-tracking"],
      storage: "local-first", // local-first | s3 | azure-blob | gcs
    },
  },

  // ── Export & Share ─────────────────────────────────────────────────────────
  export: {
    pdfDownload: {
      id: "pdf-download",
      name: "Download as PDF",
      status: "planned",
      envKey: null,
      provider: null, // → lib/integrations/providers/pdfGenerator.js
      capabilities: ["draft-to-pdf", "government-format", "qr-code", "watermark"],
      library: "react-pdf / puppeteer / jspdf",
    },
    print: {
      id: "print",
      name: "Print Application",
      status: "planned",
      envKey: null,
      provider: null, // → lib/integrations/providers/printService.js
      capabilities: ["browser-print", "formatted-layout", "a4-sizing"],
    },
    share: {
      id: "share",
      name: "Share Application Draft",
      status: "planned",
      envKey: null,
      provider: null, // → lib/integrations/providers/shareService.js
      capabilities: ["whatsapp-share", "email-share", "link-share", "qr-share"],
    },
  },
};

/**
 * Check if an integration is available (env key configured).
 * @param {string} category — "ocr" | "identity" | "documents" | "export"
 * @param {string} integrationId — e.g. "googleVision", "digiLocker"
 * @returns {boolean}
 */
export function isAvailable(category, integrationId) {
  const integration = INTEGRATIONS[category]?.[integrationId];
  if (!integration) return false;
  if (!integration.envKey) return integration.status === "ready";
  return !!process.env[integration.envKey];
}

/**
 * Get all integrations with their current status.
 * @returns {Array<{ id, name, category, status, available }>}
 */
export function listIntegrations() {
  const result = [];
  for (const [category, providers] of Object.entries(INTEGRATIONS)) {
    for (const [key, config] of Object.entries(providers)) {
      result.push({
        id: config.id,
        name: config.name,
        category,
        status: config.status,
        available: isAvailable(category, key),
      });
    }
  }
  return result;
}

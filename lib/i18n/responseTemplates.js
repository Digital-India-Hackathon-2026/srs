/**
 * Basic response templates for when no LLM is available.
 * Maps intent → template with placeholders filled from knowledge base.
 * This allows Telugu/Hindi responses even without OpenAI/Gemini.
 */

const TEMPLATES = {
  steps: {
    te: (data, portal) => `📝 దరఖాస్తు ప్రక్రియ:\n\n${formatSteps(data)}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `📝 आवेदन प्रक्रिया:\n\n${formatSteps(data)}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  documents: {
    te: (data, portal) => `📑 అవసరమైన పత్రాలు:\n\n${formatDocs(data)}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `📑 आवश्यक दस्तावेज:\n\n${formatDocs(data)}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  fees: {
    te: (data, portal) => `💰 ఫీజు వివరాలు:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `💰 शुल्क विवरण:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  processing_time: {
    te: (data, portal) => `⏳ ప్రాసెసింగ్ సమయం:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `⏳ प्रोसेसिंग समय:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  eligibility: {
    te: (data, portal) => `👤 అర్హత:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `👤 पात्रता:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  purpose: {
    te: (data, portal) => `📄 సేవ వివరాలు:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `📄 सेवा विवरण:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  address_change: {
    te: (data, portal) => `🏠 అడ్రస్ అప్డేట్ ప్రక్రియ:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `🏠 पता अपडेट प्रक्रिया:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
  portal: {
    te: (data, portal) => `🔗 అధికారిక పోర్టల్: ${portal || data}`,
    hi: (data, portal) => `🔗 आधिकारिक पोर्टल: ${portal || data}`,
  },
  tracking: {
    te: (data, portal) => `📍 అప్లికేషన్ స్టేటస్ ట్రాక్ చేయడం:\n\n${data}\n\n🔗 అధికారిక పోర్టల్: ${portal || ""}`,
    hi: (data, portal) => `📍 आवेदन स्टेटस ट्रैक करना:\n\n${data}\n\n🔗 आधिकारिक पोर्टल: ${portal || ""}`,
  },
};

function formatSteps(data) {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) {
    return data.map((s, i) => {
      const clean = typeof s === "string" ? s.replace(/^Step \d+\s*[—–-]\s*/i, "") : s;
      return `${i + 1}. ${clean}`;
    }).join("\n");
  }
  return String(data);
}

function formatDocs(data) {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) {
    return data.map((d, i) => `${i + 1}. ${typeof d === "string" ? d : ""}`).join("\n");
  }
  return String(data);
}

/**
 * Wrap an English local answer with a translated header/footer.
 * This is used when no LLM is available to provide full translation.
 *
 * @param {string} englishAnswer — the local fallback English answer
 * @param {string} intent — detected intent
 * @param {string} lang — "te" | "hi" | "en"
 * @param {string} portal — official portal URL
 * @returns {string} — answer with localized headers (content stays English for accuracy)
 */
export function wrapWithLocalizedHeaders(englishAnswer, intent, lang, portal) {
  if (lang === "en") return englishAnswer;

  const template = TEMPLATES[intent];
  if (template && template[lang]) {
    return template[lang](englishAnswer, portal);
  }

  // Generic wrapper for intents without specific templates
  const header = lang === "te"
    ? "ℹ️ సమాచారం (అధికారిక మూలం నుండి):\n\n"
    : "ℹ️ जानकारी (आधिकारिक स्रोत से):\n\n";

  const footer = portal
    ? (lang === "te" ? `\n\n🔗 అధికారిక పోర్టల్: ${portal}` : `\n\n🔗 आधिकारिक पोर्टल: ${portal}`)
    : "";

  return `${header}${englishAnswer}${footer}`;
}

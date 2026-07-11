/**
 * SevaSetu Multilingual Language Detection
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects the language of the user's input message.
 * Supports: English, Telugu (native + romanized), Hindi (native + romanized)
 */

const TELUGU_ROMAN_WORDS = [
  "ela", "cheyali", "cheppandi", "cheppava", "kavali", "ekkada", "enti", "emiti",
  "marchali", "marchedi", "marchali", "cheyandi", "cheyyali", "cheyadam",
  "documents enti", "apply cheyadam", "update cheyali", "entha", "enni",
  "rojulu", "kharcchu", "fee entha", "arham", "eligibility enti",
  "certificate ela", "card ela", "padutundi", "vastundi", "enduku",
];

const HINDI_ROMAN_WORDS = [
  "kaise", "kare", "karna", "batao", "chahiye", "kahan", "kya", "kitna",
  "kitne", "din", "lagta", "documents kya", "apply kaise", "fees kitni",
  "fee kitni", "zaruri", "kab", "milega", "milta", "hota", "karna hai",
  "chahie", "process kya", "kaun", "sakta", "hai kya",
];

/**
 * Detect the language of a user message.
 * Priority:
 *   1. Telugu Unicode script
 *   2. Hindi/Devanagari Unicode script
 *   3. Romanized Telugu keywords
 *   4. Romanized Hindi keywords
 *   5. Selected/previous language fallback
 *   6. English default
 *
 * @param {string} text — user's message
 * @param {string|null} selectedLanguage — manually selected lang (from UI toggle)
 * @param {string|null} previousLanguage — language of last message in conversation
 * @returns {string} — "en" | "te" | "hi"
 */
export function detectLanguage(text, selectedLanguage = null, previousLanguage = null) {
  if (!text || !text.trim()) return selectedLanguage || previousLanguage || "en";

  // 1. Telugu Unicode (U+0C00 to U+0C7F)
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";

  // 2. Hindi/Devanagari Unicode (U+0900 to U+097F)
  if (/[\u0900-\u097F]/.test(text)) return "hi";

  // 3. Romanized Telugu keywords
  const lower = text.toLowerCase();
  const teScore = TELUGU_ROMAN_WORDS.filter(w => lower.includes(w)).length;
  const hiScore = HINDI_ROMAN_WORDS.filter(w => lower.includes(w)).length;

  if (teScore > 0 && teScore >= hiScore) return "te";
  if (hiScore > 0 && hiScore > teScore) return "hi";

  // 4. Fallbacks
  if (selectedLanguage) return selectedLanguage;
  if (previousLanguage) return previousLanguage;

  return "en";
}

/**
 * UI Translations for the chatbot interface.
 */
export const UI_TRANSLATIONS = {
  en: {
    placeholder: "Ask anything about Telangana services",
    listening: "Listening...",
    send: "Send",
    speak: "Listen",
    pause: "Pause",
    stop: "Stop",
    typing: "SevaSetu AI is typing...",
    error: "Something went wrong. Please try again.",
    noVoice: "A matching voice is not available on this device.",
    voiceNotSupported: "Voice input is not supported in this browser.",
    newChat: "New Chat",
  },
  te: {
    placeholder: "తెలంగాణ సేవల గురించి ఏదైనా అడగండి",
    listening: "వింటున్నాను...",
    send: "పంపండి",
    speak: "వినండి",
    pause: "ఆపండి",
    stop: "ఆపండి",
    typing: "సేవాసేతు AI సమాధానం సిద్ధం చేస్తోంది...",
    error: "ఏదో సమస్య ఏర్పడింది. మళ్లీ ప్రయత్నించండి.",
    noVoice: "ఈ పరికరంలో తెలుగు వాయిస్ అందుబాటులో లేదు.",
    voiceNotSupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు.",
    newChat: "కొత్త చాట్",
  },
  hi: {
    placeholder: "तेलंगाना सेवाओं के बारे में कुछ भी पूछें",
    listening: "सुन रहा हूँ...",
    send: "भेजें",
    speak: "सुनें",
    pause: "रोकें",
    stop: "रोकें",
    typing: "सेवासेतु AI उत्तर तैयार कर रहा है...",
    error: "कुछ गलत हुआ। कृपया दोबारा प्रयास करें।",
    noVoice: "इस डिवाइस पर हिंदी आवाज उपलब्ध नहीं है।",
    voiceNotSupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।",
    newChat: "नई चैट",
  },
};

/**
 * Localized suggestions per service per language.
 */
export const LOCALIZED_SUGGESTIONS = {
  aadhaar: {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఎంత ఫీజు?", "ఎన్ని రోజులు పడుతుంది?", "మొబైల్ నంబర్ లింక్ లేకపోతే?", "స్టేటస్ ఎలా చెక్ చేయాలి?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस कितनी है?", "कितने दिन लगते हैं?", "मोबाइल नंबर लिंक नहीं है तो?", "स्टेटस कैसे चेक करें?"],
  },
  passport: {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఫీజు ఎంత?", "ఎన్ని రోజులు?", "అపాయింట్‌మెంట్ ఎలా బుక్ చేయాలి?", "పోలీస్ వెరిఫికేషన్ ఎలా?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस कितनी है?", "कितने दिन लगेंगे?", "अपॉइंटमेंट कैसे बुक करें?", "पुलिस वेरिफिकेशन कैसे होगा?"],
  },
  "income-certificate": {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఎంత ఫీజు?", "ఎన్ని రోజులు పడుతుంది?", "ఆన్‌లైన్‌లో అప్లై చేయవచ్చా?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस कितनी है?", "कितने दिन लगते हैं?", "ऑनलाइन अप्लाई कर सकते हैं?"],
  },
  "driving-licence": {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఫీజు ఎంత?", "ఎన్ని రోజులు?", "లెర్నర్ లైసెన్స్ ఎలా?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस कितनी है?", "कितने दिन?", "लर्नर लाइसेंस कैसे?"],
  },
  pan: {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఫీజు ఎంత?", "ఆధార్‌తో లింక్ ఎలా?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस कितनी है?", "आधार से लिंक कैसे करें?"],
  },
  "voter-id": {
    te: ["ఏ డాక్యుమెంట్స్ కావాలి?", "ఫీజు ఉందా?", "ఎన్ని రోజులు?", "ఆన్‌లైన్‌లో డౌన్‌లోడ్ చేయవచ్చా?"],
    hi: ["कौन से दस्तावेज चाहिए?", "फीस है क्या?", "कितने दिन?", "ऑनलाइन डाउनलोड कर सकते हैं?"],
  },
};

/**
 * Localized error/fallback messages.
 */
export const FALLBACK_MESSAGES = {
  en: "I'm sorry, I couldn't find specific information about that in my knowledge base. Please rephrase your question or let me know which Telangana government service (Passport, Aadhaar, Driving Licence, etc.) you need help with.",
  te: "క్షమించండి, నా నాలెడ్జ్ బేస్‌లో దీని గురించి నిర్దిష్ట సమాచారం కనుగొనలేకపోయాను. దయచేసి మీ ప్రశ్నను మరో విధంగా అడగండి లేదా మీకు ఏ తెలంగాణ ప్రభుత్వ సేవ (పాస్‌పోర్ట్, ఆధార్, డ్రైవింగ్ లైసెన్స్, మొదలైనవి) అవసరమో తెలియజేయండి.",
  hi: "क्षमा करें, मुझे अपने नॉलेज बेस में इसके बारे में विशिष्ट जानकारी नहीं मिल सकी। कृपया अपना प्रश्न दोबारा पूछें या बताएं कि आपको किस तेलंगाना सरकारी सेवा (पासपोर्ट, आधार, ड्राइविंग लाइसेंस, आदि) में मदद चाहिए।",
};

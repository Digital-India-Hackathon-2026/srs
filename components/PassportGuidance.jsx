"use client";

import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Info,
  MapPin,
  Shield,
  Timer,
  User,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const SITUATIONS = [
  {
    id: "college-student",
    icon: <GraduationCap size={16} className="text-[#1a3a5c]" />,
    title: { en: "I'm a college student living away from home", te: "నేను ఇంటికి దూరంగా చదువుతున్న విద్యార్థిని", hi: "मैं घर से दूर रहकर पढ़ रहा/रही हूँ" },
    guidance: {
      en: ["If applying from a hostel or college address, additional address verification documents may be required.", "Carry your original college ID card.", "Carry a bonafide certificate if your institution provides one.", "If your Aadhaar has a different address, update it before applying."],
      te: ["హాస్టల్ లేదా కాలేజీ అడ్రస్ నుండి అప్లై చేస్తే, అదనపు అడ్రస్ వెరిఫికేషన్ పత్రాలు అవసరం కావచ్చు.", "మీ అసలు కాలేజీ ID కార్డు తీసుకెళ్ళండి.", "మీ సంస్థ బోనాఫైడ్ సర్టిఫికేట్ ఇస్తే తీసుకెళ్ళండి.", "మీ ఆధార్‌లో వేరే అడ్రస్ ఉంటే, అప్లై చేయడానికి ముందు అప్డేట్ చేయండి."],
      hi: ["होस्टल या कॉलेज एड्रेस से अप्लाई करने पर अतिरिक्त एड्रेस वेरिफिकेशन दस्तावेज माँगे जा सकते हैं।", "अपना ओरिजिनल कॉलेज ID कार्ड साथ रखें।", "अगर आपका संस्थान बोनाफाइड सर्टिफिकेट देता है तो उसे ले जाएँ।", "अगर आधार में अलग एड्रेस है तो अप्लाई करने से पहले अपडेट करें।"],
    },
    important: { en: "Additional documents like bonafide certificates or hostel proof may be requested depending on circumstances.", te: "పరిస్థితులను బట్టి బోనాఫైడ్ సర్టిఫికేట్లు లేదా హాస్టల్ రుజువు వంటి అదనపు పత్రాలు అడగవచ్చు.", hi: "परिस्थिति के अनुसार बोनाफाइड सर्टिफिकेट या होस्टल प्रूफ जैसे अतिरिक्त दस्तावेज माँगे जा सकते हैं।" },
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "class10-dob",
    icon: <BookOpen size={16} className="text-[#1a3a5c]" />,
    title: { en: "Using Class 10 Certificate as Date of Birth Proof", te: "పుట్టిన తేదీ రుజువుగా 10వ తరగతి సర్టిఫికేట్ వాడటం", hi: "जन्म तिथि प्रमाण के रूप में कक्षा 10 प्रमाणपत्र का उपयोग" },
    guidance: {
      en: ["Carry the original SSC/Class 10 certificate or marks memo.", "Ensure it is in good condition and clearly readable.", "Verify that the DOB matches all other identity documents (Aadhaar, PAN, etc.).", "If any mismatch exists, get it corrected before applying."],
      te: ["అసలు SSC/10వ తరగతి సర్టిఫికేట్ లేదా మార్కుల మెమో తీసుకెళ్ళండి.", "అది మంచి స్థితిలో, స్పష్టంగా చదవగలిగేలా ఉండాలి.", "పుట్టిన తేదీ ఇతర పత్రాలతో (ఆధార్, పాన్) సరిపోతుందో చెక్ చేయండి.", "ఏదైనా తేడా ఉంటే, అప్లై చేయడానికి ముందు సరిచేయండి."],
      hi: ["ओरिजिनल SSC/कक्षा 10 प्रमाणपत्र या मार्क्स मेमो ले जाएँ।", "सुनिश्चित करें कि यह अच्छी स्थिति में और स्पष्ट रूप से पढ़ने योग्य हो।", "जन्म तिथि अन्य दस्तावेजों (आधार, पैन) से मेल खाती है या नहीं जाँचें।", "कोई भी विसंगति हो तो अप्लाई करने से पहले ठीक करें।"],
    },
    important: { en: "Name and DOB must be consistent across all documents. Discrepancy may cause delays.", te: "అన్ని పత్రాల్లో పేరు మరియు పుట్టిన తేదీ ఒకే విధంగా ఉండాలి. తేడా ఉంటే ఆలస్యం అవుతుంది.", hi: "सभी दस्तावेजों में नाम और जन्म तिथि समान होनी चाहिए। विसंगति से देरी हो सकती है।" },
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "name-mismatch",
    icon: <User size={16} className="text-[#1a3a5c]" />,
    title: { en: "Name Mismatch Across Documents", te: "పత్రాలలో పేరు తేడాలు", hi: "दस्तावेजों में नाम का मेल न खाना" },
    guidance: {
      en: ["If Aadhaar, PAN, SSC have different names, the application may be delayed.", "Common mismatches: initials vs full name, middle name present/absent.", "Get documents corrected before applying — Aadhaar name update takes 7–10 days.", "If correction is not possible, carry all documents and explain at PSK."],
      te: ["ఆధార్, పాన్, SSC లో వేరే పేర్లు ఉంటే, దరఖాస్తు ఆలస్యం కావచ్చు.", "సాధారణ తేడాలు: ఇనిషియల్స్ vs పూర్తి పేరు, మధ్య పేరు ఉన్నది/లేనిది.", "అప్లై చేయడానికి ముందు పత్రాలు సరిచేయండి — ఆధార్ పేరు అప్డేట్ 7–10 రోజులు పడుతుంది.", "సరిచేయడం సాధ్యం కాకపోతే, అన్ని పత్రాలు తీసుకెళ్ళి PSK లో వివరించండి."],
      hi: ["अगर आधार, पैन, SSC में अलग-अलग नाम हैं तो आवेदन में देरी हो सकती है।", "आम विसंगतियाँ: इनिशियल्स vs पूरा नाम, मिडल नेम का होना/न होना।", "अप्लाई करने से पहले दस्तावेज ठीक करें — आधार नाम अपडेट में 7–10 दिन लगते हैं।", "सुधार संभव न हो तो सभी दस्तावेज ले जाएँ और PSK पर समझाएँ।"],
    },
    important: { en: "Passport Seva may ask for affidavit or gazette notification for significant name discrepancies.", te: "గణనీయమైన పేరు తేడాలకు Passport Seva అఫిడవిట్ లేదా గెజెట్ నోటిఫికేషన్ అడగవచ్చు.", hi: "महत्वपूर्ण नाम विसंगतियों के लिए Passport Seva शपथपत्र या गजट अधिसूचना माँग सकता है।" },
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "address-mismatch",
    icon: <MapPin size={16} className="text-[#1a3a5c]" />,
    title: { en: "Current and Permanent Address are Different", te: "ప్రస్తుత మరియు శాశ్వత అడ్రస్ వేరుగా ఉన్నాయి", hi: "वर्तमान और स्थायी पता अलग-अलग हैं" },
    guidance: {
      en: ["Keep address proof for both addresses ready.", "Police verification is conducted at the application address.", "Ensure you are reachable at the address — if police visit and you are unavailable, verification may fail.", "For rented accommodation: carry rent agreement, landlord details, and Aadhaar with current address."],
      te: ["రెండు అడ్రస్‌లకు రుజువు పత్రాలు సిద్ధంగా ఉంచుకోండి.", "పోలీస్ వెరిఫికేషన్ దరఖాస్తు అడ్రస్‌లో జరుగుతుంది.", "మీరు ఆ అడ్రస్‌లో అందుబాటులో ఉండాలి — పోలీసులు వచ్చినప్పుడు మీరు లేకపోతే వెరిఫికేషన్ ఫెయిల్ అవుతుంది.", "అద్దె ఇంటిలో ఉంటే: రెంట్ అగ్రిమెంట్, ల్యాండ్‌లార్డ్ వివరాలు, ప్రస్తుత అడ్రస్‌తో ఆధార్ తీసుకెళ్ళండి."],
      hi: ["दोनों पतों के लिए एड्रेस प्रूफ तैयार रखें।", "पुलिस वेरिफिकेशन आवेदन वाले पते पर होता है।", "सुनिश्चित करें कि आप उस पते पर उपलब्ध हों — अगर पुलिस आए और आप न मिलें तो वेरिफिकेशन फेल हो सकता है।", "किराए के मकान में हों तो: रेंट एग्रीमेंट, मकान मालिक विवरण, और वर्तमान पते वाला आधार ले जाएँ।"],
    },
    important: { en: "Update your Aadhaar to your current address before applying — this is the most important step.", te: "అప్లై చేయడానికి ముందు మీ ఆధార్‌ను ప్రస్తుత అడ్రస్‌కు అప్డేట్ చేయండి — ఇది అత్యంత ముఖ్యమైన అడుగు.", hi: "अप्लाई करने से पहले अपना आधार वर्तमान पते पर अपडेट करें — यह सबसे महत्वपूर्ण कदम है।" },
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "appointment-tips",
    icon: <Timer size={16} className="text-[#1a3a5c]" />,
    title: { en: "Appointment Day — What to Expect", te: "అపాయింట్‌మెంట్ రోజు — ఏం ఆశించాలి", hi: "अपॉइंटमेंट का दिन — क्या अपेक्षा करें" },
    guidance: {
      en: ["Reach PSK/POPSK at least 30 minutes before appointment.", "Carry all original documents with self-attested photocopies.", "Carry printed appointment slip and application receipt with ARN.", "Expect 4 counters: Document Verification → Biometrics → Photo → Final Verification.", "Total time: 1–3 hours."],
      te: ["అపాయింట్‌మెంట్‌కు కనీసం 30 నిమిషాలు ముందు PSK/POPSK చేరుకోండి.", "అన్ని అసలు పత్రాలతో సెల్ఫ్-అటెస్టెడ్ ఫోటోకాపీలు తీసుకెళ్ళండి.", "ప్రింట్ చేసిన అపాయింట్‌మెంట్ స్లిప్ మరియు ARN తో అప్లికేషన్ రసీదు తీసుకెళ్ళండి.", "4 కౌంటర్లు ఉంటాయి: డాక్యుమెంట్ వెరిఫికేషన్ → బయోమెట్రిక్స్ → ఫోటో → ఫైనల్ వెరిఫికేషన్.", "మొత్తం సమయం: 1–3 గంటలు."],
      hi: ["अपॉइंटमेंट से कम से कम 30 मिनट पहले PSK/POPSK पहुँचें।", "सभी ओरिजिनल दस्तावेज और सेल्फ-अटेस्टेड फोटोकॉपी ले जाएँ।", "प्रिंट किया हुआ अपॉइंटमेंट स्लिप और ARN के साथ रसीद ले जाएँ।", "4 काउंटर होंगे: दस्तावेज सत्यापन → बायोमेट्रिक्स → फोटो → अंतिम सत्यापन।", "कुल समय: 1–3 घंटे।"],
    },
    important: { en: "If you arrive late, you may be asked to reschedule. Morning slots have shorter wait times.", te: "ఆలస్యంగా వస్తే, రీషెడ్యూల్ చేయమని అడగవచ్చు. ఉదయం స్లాట్లలో వేచి ఉండే సమయం తక్కువ.", hi: "देर से पहुँचने पर रिशेड्यूल करना पड़ सकता है। सुबह के स्लॉट में कम प्रतीक्षा होती है।" },
    source: "https://www.passportindia.gov.in",
  },
  {
    id: "police-verification",
    icon: <Shield size={16} className="text-[#1a3a5c]" />,
    title: { en: "Preparing for Police Verification", te: "పోలీస్ వెరిఫికేషన్‌కు సిద్ధం", hi: "पुलिस वेरिफिकेशन की तैयारी" },
    guidance: {
      en: ["Keep Aadhaar, application receipt, and address proof at home.", "Ensure application address matches Aadhaar and utility bills.", "Inform family that police may visit.", "Stay reachable on registered mobile (2–4 weeks after PSK visit).", "If rented: keep rent agreement and landlord contact ready."],
      te: ["ఆధార్, అప్లికేషన్ రసీదు, అడ్రస్ ప్రూఫ్ ఇంట్లో ఉంచుకోండి.", "అప్లికేషన్ అడ్రస్ ఆధార్ మరియు యుటిలిటీ బిల్లులతో సరిపోతుందో చెక్ చేయండి.", "పోలీసులు వచ్చే అవకాశం ఉందని కుటుంబానికి తెలియజేయండి.", "రిజిస్టర్డ్ మొబైల్‌లో అందుబాటులో ఉండండి (PSK విజిట్ తర్వాత 2–4 వారాలు).", "అద్దెలో ఉంటే: రెంట్ అగ్రిమెంట్ మరియు ల్యాండ్‌లార్డ్ కాంటాక్ట్ సిద్ధంగా ఉంచండి."],
      hi: ["आधार, आवेदन रसीद, और एड्रेस प्रूफ घर पर रखें।", "आवेदन पता आधार और यूटिलिटी बिल से मेल खाना चाहिए।", "परिवार को बताएँ कि पुलिस आ सकती है।", "रजिस्टर्ड मोबाइल पर उपलब्ध रहें (PSK विजिट के 2–4 हफ्ते बाद)।", "किराए पर हों तो: रेंट एग्रीमेंट और मकान मालिक का संपर्क तैयार रखें।"],
    },
    important: { en: "Do not make any payment to the verifying officer. Report any such request to Passport Seva grievance portal.", te: "వెరిఫికేషన్ అధికారికి ఎటువంటి చెల్లింపు చేయవద్దు. అలాంటి అభ్యర్థన ఉంటే Passport Seva గ్రీవెన్స్ పోర్టల్‌కు రిపోర్ట్ చేయండి.", hi: "वेरिफिकेशन अधिकारी को कोई भुगतान न करें। ऐसी कोई माँग हो तो Passport Seva शिकायत पोर्टल पर रिपोर्ट करें।" },
    source: "https://www.passportindia.gov.in",
  },
];

function GuidanceCard({ situation }) {
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage();

  const title = typeof situation.title === "object" ? (situation.title[language] || situation.title.en) : situation.title;
  const guidance = typeof situation.guidance === "object" && !Array.isArray(situation.guidance) ? (situation.guidance[language] || situation.guidance.en) : situation.guidance;
  const important = typeof situation.important === "object" ? (situation.important[language] || situation.important.en) : situation.important;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a3a5c]/30 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0">{situation.icon}</div>
        <span className="flex-1 text-sm font-semibold text-[#1a3a5c]">{title}</span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {/* Guidance points */}
          <div className="space-y-2">
            {guidance.map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a5c] flex-shrink-0 mt-2" />
                <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          {/* Important note */}
          <div className="bg-[#fff8e8] border border-[#f0d68a] rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={13} className="text-[#C89A2B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#7a5a00] leading-relaxed">
              <strong>{language === "te" ? "ముఖ్యం:" : language === "hi" ? "महत्वपूर्ण:" : "Important:"}</strong> {important}
            </p>
          </div>

          {/* Source */}
          {situation.source && (
            <p className="text-[10px] text-gray-400">
              {language === "te" ? "అధికారిక మూలం:" : language === "hi" ? "आधिकारिक स्रोत:" : "Official source:"} <a href={situation.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{situation.source}</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PassportGuidanceSection() {
  const { language } = useLanguage();

  const headers = {
    en: { title: "Important Situations & Practical Guidance", disclaimer: "These are practical guidance notes intended to help applicants prepare better. Depending on individual circumstances and Passport Seva verification, additional documents or procedures may be required. Always follow instructions given by Passport Seva officials." },
    te: { title: "ముఖ్యమైన పరిస్థితులు & ఆచరణాత్మక మార్గదర్శకం", disclaimer: "ఇవి దరఖాస్తుదారులకు మెరుగ్గా సిద్ధం కావడంలో సహాయపడటానికి ఉద్దేశించిన ఆచరణాత్మక మార్గదర్శక గమనికలు. వ్యక్తిగత పరిస్థితులు మరియు Passport Seva ధృవీకరణపై ఆధారపడి, అదనపు పత్రాలు అవసరం కావచ్చు." },
    hi: { title: "महत्वपूर्ण परिस्थितियाँ और व्यावहारिक मार्गदर्शन", disclaimer: "ये आवेदकों को बेहतर तैयारी में मदद करने के लिए व्यावहारिक मार्गदर्शन नोट हैं। व्यक्तिगत परिस्थितियों और Passport Seva सत्यापन के आधार पर अतिरिक्त दस्तावेज आवश्यक हो सकते हैं।" },
  };
  const h = headers[language] || headers.en;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-[#C89A2B]">
      <div className="bg-[#1a3a5c] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2">
        <Info size={13} /> {h.title}
      </div>
      <div className="p-4 space-y-3">
        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 mb-4">
          <Info size={12} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800 leading-relaxed">
            {h.disclaimer}
          </p>
        </div>

        {/* Situation cards */}
        {SITUATIONS.map((s) => (
          <GuidanceCard key={s.id} situation={s} />
        ))}
      </div>
    </div>
  );
}

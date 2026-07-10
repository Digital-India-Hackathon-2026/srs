/**
 * Complete multilingual service data for SevaSetu.
 * Every field: { en, te, hi }
 * Use getServiceField(serviceId, field, lang) to render.
 * Use loc(obj, lang) for any multilingual object.
 */

const DATA = {
  passport: {
    name: { en: "Passport", te: "పాస్‌పోర్ట్", hi: "पासपोर्ट" },
    department: { en: "Ministry of External Affairs / Passport Seva", te: "విదేశాంగ మంత్రిత్వ శాఖ / పాస్‌పోర్ట్ సేవ", hi: "विदेश मंत्रालय / पासपोर्ट सेवा" },
    category: { en: "Identity & Travel", te: "గుర్తింపు & ప్రయాణం", hi: "पहचान और यात्रा" },
    shortDesc: { en: "Apply for fresh passport, renewal, Tatkaal, corrections and police verification support.", te: "కొత్త పాస్‌పోర్ట్, రిన్యూవల్, తత్కాల్, సవరణలు మరియు పోలీస్ వెరిఫికేషన్ సహాయం కోసం దరఖాస్తు చేయండి.", hi: "नया पासपोर्ट, नवीनीकरण, तत्काल, सुधार और पुलिस सत्यापन सहायता के लिए आवेदन करें।" },
    overview: { en: "A passport is an official travel document issued by the Government of India certifying identity and nationality for international travel.", te: "పాస్‌పోర్ట్ అనేది అంతర్జాతీయ ప్రయాణం కోసం గుర్తింపు మరియు జాతీయతను ధృవీకరించే భారత ప్రభుత్వం జారీ చేసిన అధికారిక ప్రయాణ పత్రం.", hi: "पासपोर्ट भारत सरकार द्वारा जारी एक आधिकारिक यात्रा दस्तावेज़ है जो अंतरराष्ट्रीय यात्रा के लिए पहचान और राष्ट्रीयता प्रमाणित करता है।" },
    whereToApply: { en: "Passport Seva Portal / PSK / POPSK", te: "పాస్‌పోర్ట్ సేవా పోర్టల్ / PSK / POPSK", hi: "पासपोर्ट सेवा पोर्टल / PSK / POPSK" },
    processingTime: { en: "30–45 days (Normal) / 7–14 days (Tatkaal)", te: "30–45 రోజులు (సాధారణ) / 7–14 రోజులు (తత్కాల్)", hi: "30–45 दिन (सामान्य) / 7–14 दिन (तत्काल)" },
    fees: { en: "Normal 36 pages: ₹1500. Tatkaal: ₹3500. Minor: ₹1000.", te: "సాధారణ 36 పేజీలు: ₹1500. తత్కాల్: ₹3500. మైనర్: ₹1000.", hi: "सामान्य 36 पृष्ठ: ₹1500. तत्काल: ₹3500. नाबालिग: ₹1000." },
    documents: { en: ["Proof of Date of Birth", "Proof of Address (Aadhaar/Voter ID)", "Proof of Identity", "Passport-size photographs", "Old passport (for reissue)"], te: ["జన్మ తేదీ రుజువు", "చిరునామా రుజువు (ఆధార్/వోటర్ ID)", "గుర్తింపు రుజువు", "పాస్‌పోర్ట్ సైజ్ ఫోటోలు", "పాత పాస్‌పోర్ట్ (రీయిష్యూ కోసం)"], hi: ["जन्मतिथि प्रमाण", "पते का प्रमाण (आधार/वोटर ID)", "पहचान प्रमाण", "पासपोर्ट साइज फोटो", "पुराना पासपोर्ट (पुनर्जारी के लिए)"] },
    eligibility: { en: ["Any Indian citizen can apply", "No age restriction", "Minors require parental consent"], te: ["ఏ భారతీయ పౌరుడు అయినా దరఖాస్తు చేయవచ్చు", "వయస్సు పరిమితి లేదు", "మైనర్లకు తల్లిదండ్రుల అనుమతి అవసరం"], hi: ["कोई भी भारतीय नागरिक आवेदन कर सकता है", "कोई आयु सीमा नहीं", "नाबालिगों को माता-पिता की सहमति आवश्यक"] },
    steps: { en: ["Register on passportindia.gov.in", "Fill application form", "Upload documents and pay fee", "Book appointment at PSK/POPSK", "Visit PSK on appointment date", "Police verification", "Passport dispatched via Speed Post"], te: ["passportindia.gov.in లో నమోదు చేయండి", "దరఖాస్తు ఫారం నింపండి", "పత్రాలు అప్‌లోడ్ చేసి ఫీజు చెల్లించండి", "PSK/POPSK లో అపాయింట్‌మెంట్ బుక్ చేయండి", "అపాయింట్‌మెంట్ తేదీన PSK సందర్శించండి", "పోలీస్ వెరిఫికేషన్", "స్పీడ్ పోస్ట్ ద్వారా పాస్‌పోర్ట్ డిస్పాచ్"], hi: ["passportindia.gov.in पर पंजीकरण करें", "आवेदन फॉर्म भरें", "दस्तावेज़ अपलोड करें और शुल्क भरें", "PSK/POPSK पर अपॉइंटमेंट बुक करें", "अपॉइंटमेंट तिथि पर PSK जाएँ", "पुलिस सत्यापन", "स्पीड पोस्ट से पासपोर्ट भेजा जाता है"] },
    mistakes: { en: ["Document name mismatch", "Address proof older than 3 months", "Not carrying originals to PSK", "Booking wrong PSK"], te: ["పత్రాల్లో పేరు అసమానత", "3 నెలలకంటే పాత చిరునామా రుజువు", "PSK కి ఒరిజినల్స్ తీసుకెళ్ళకపోవడం", "తప్పు PSK బుక్ చేయడం"], hi: ["दस्तावेज़ में नाम बेमेल", "3 महीने से पुराना पता प्रमाण", "PSK पर मूल दस्तावेज़ न ले जाना", "गलत PSK बुक करना"] },
  },
  "income-certificate": {
    name: { en: "Income Certificate", te: "ఆదాయ ధృవీకరణ పత్రం", hi: "आय प्रमाण पत्र" },
    department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ శాఖ, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Certifies annual income for scholarships, schemes and reservations.", te: "స్కాలర్‌షిప్‌లు, పథకాలు మరియు రిజర్వేషన్ల కోసం వార్షిక ఆదాయాన్ని ధృవీకరిస్తుంది.", hi: "छात्रवृत्ति, योजनाओं और आरक्षण के लिए वार्षिक आय प्रमाणित करता है।" },
    overview: { en: "An Income Certificate certifies the annual income of a family or individual for government benefits.", te: "ఆదాయ ధృవీకరణ పత్రం ప్రభుత్వ ప్రయోజనాల కోసం కుటుంబం లేదా వ్యక్తి యొక్క వార్షిక ఆదాయాన్ని ధృవీకరిస్తుంది.", hi: "आय प्रमाण पत्र सरकारी लाभों के लिए परिवार या व्यक्ति की वार्षिक आय प्रमाणित करता है।" },
    whereToApply: { en: "MeeSeva centre or online portal", te: "మీసేవ కేంద్రం లేదా ఆన్‌లైన్ పోర్టల్", hi: "मीसेवा केंद्र या ऑनलाइन पोर्टल" },
    processingTime: { en: "7–15 working days", te: "7–15 పని దినాలు", hi: "7–15 कार्य दिवस" },
    fees: { en: "Approximately ₹35 at MeeSeva", te: "మీసేవలో సుమారు ₹35", hi: "मीसेवा पर लगभग ₹35" },
    documents: { en: ["Application form", "Aadhaar card", "Address proof", "Income proof or salary certificate", "Passport-size photo", "Mobile linked to Aadhaar"], te: ["దరఖాస్తు ఫారం", "ఆధార్ కార్డు", "చిరునామా రుజువు", "ఆదాయ రుజువు లేదా జీతం సర్టిఫికేట్", "పాస్‌పోర్ట్ సైజ్ ఫోటో", "ఆధార్‌కు లింక్ చేసిన మొబైల్"], hi: ["आवेदन फॉर्म", "आधार कार्ड", "पते का प्रमाण", "आय प्रमाण या वेतन प्रमाणपत्र", "पासपोर्ट साइज फोटो", "आधार से लिंक मोबाइल"] },
    eligibility: { en: ["Resident of Telangana", "Valid Aadhaar card", "Verifiable income documentation"], te: ["తెలంగాణ నివాసి", "చెల్లుబాటు అయ్యే ఆధార్ కార్డు", "ధృవీకరించగల ఆదాయ డాక్యుమెంటేషన్"], hi: ["तेलंगाना निवासी", "वैध आधार कार्ड", "सत्यापन योग्य आय दस्तावेज़"] },
    steps: { en: ["Visit MeeSeva or online portal", "Select Revenue → Income Certificate", "Fill details and upload documents", "Pay ₹35 fee", "Tahsildar verification", "Certificate issued in 7–15 days"], te: ["మీసేవ లేదా ఆన్‌లైన్ పోర్టల్ సందర్శించండి", "Revenue → Income Certificate ఎంచుకోండి", "వివరాలు నింపి పత్రాలు అప్‌లోడ్ చేయండి", "₹35 ఫీజు చెల్లించండి", "తహసీల్దార్ వెరిఫికేషన్", "7–15 రోజుల్లో సర్టిఫికేట్ జారీ"], hi: ["मीसेवा या ऑनलाइन पोर्टल पर जाएँ", "Revenue → Income Certificate चुनें", "विवरण भरें और दस्तावेज़ अपलोड करें", "₹35 शुल्क भरें", "तहसीलदार सत्यापन", "7–15 दिनों में प्रमाणपत्र जारी"] },
    mistakes: { en: ["Income mismatch", "Aadhaar address not matching", "Missing photograph", "Using unofficial agents"], te: ["ఆదాయ అసమానత", "ఆధార్ చిరునామా సరిపోలకపోవడం", "ఫోటో మిస్ అవడం", "అనధికార ఏజెంట్లను ఉపయోగించడం"], hi: ["आय बेमेल", "आधार पता मेल न खाना", "फोटो गायब", "अनाधिकारिक एजेंट का उपयोग"] },
  },
  "caste-certificate": {
    name: { en: "Caste Certificate", te: "కుల ధృవీకరణ పత్రం", hi: "जाति प्रमाण पत्र" },
    department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ శాఖ, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Certifies SC/ST/BC/OBC community for reservation benefits.", te: "రిజర్వేషన్ ప్రయోజనాల కోసం SC/ST/BC/OBC సమాజాన్ని ధృవీకరిస్తుంది.", hi: "आरक्षण लाभ के लिए SC/ST/BC/OBC समुदाय प्रमाणित करता है।" },
    overview: { en: "A Caste Certificate certifies a person's caste/community as per the Telangana government schedule for availing reservations.", te: "కుల ధృవీకరణ పత్రం రిజర్వేషన్లు పొందడానికి తెలంగాణ ప్రభుత్వ షెడ్యూల్ ప్రకారం వ్యక్తి యొక్క కులం/సమాజాన్ని ధృవీకరిస్తుంది.", hi: "जाति प्रमाण पत्र आरक्षण प्राप्त करने के लिए तेलंगाना सरकार अनुसूची के अनुसार व्यक्ति की जाति/समुदाय प्रमाणित करता है।" },
    whereToApply: { en: "MeeSeva centre or Tahsildar office", te: "మీసేవ కేంద్రం లేదా తహసీల్దార్ కార్యాలయం", hi: "मीसेवा केंद्र या तहसीलदार कार्यालय" },
    processingTime: { en: "15–30 working days", te: "15–30 పని దినాలు", hi: "15–30 कार्य दिवस" },
    fees: { en: "Approximately ₹35–₹45 at MeeSeva", te: "మీసేవలో సుమారు ₹35–₹45", hi: "मीसेवा पर लगभग ₹35–₹45" },
    documents: { en: ["Application form", "Aadhaar card", "Address proof", "School TC or SSC certificate", "Parent's caste certificate", "Ration Card", "Passport-size photo"], te: ["దరఖాస్తు ఫారం", "ఆధార్ కార్డు", "చిరునామా రుజువు", "స్కూల్ TC లేదా SSC సర్టిఫికేట్", "తల్లిదండ్రుల కుల ధృవీకరణ పత్రం", "రేషన్ కార్డు", "పాస్‌పోర్ట్ సైజ్ ఫోటో"], hi: ["आवेदन फॉर्म", "आधार कार्ड", "पते का प्रमाण", "स्कूल TC या SSC प्रमाणपत्र", "माता-पिता का जाति प्रमाणपत्र", "राशन कार्ड", "पासपोर्ट साइज फोटो"] },
    eligibility: { en: ["Belong to recognized SC/ST/BC/OBC community", "Resident of Telangana", "Documentary proof of community"], te: ["గుర్తింపు పొందిన SC/ST/BC/OBC సమాజానికి చెందినవారు", "తెలంగాణ నివాసి", "సమాజ డాక్యుమెంటరీ రుజువు"], hi: ["मान्यता प्राप्त SC/ST/BC/OBC समुदाय से संबंधित", "तेलंगाना निवासी", "समुदाय का दस्तावेजी प्रमाण"] },
    steps: { en: ["Visit MeeSeva or Tahsildar office", "Select Revenue → Caste Certificate", "Fill community details", "Upload documents", "Pay ₹35–₹45", "Tahsildar field verification", "Certificate in 15–30 days"], te: ["మీసేవ లేదా తహసీల్దార్ కార్యాలయం సందర్శించండి", "Revenue → Caste Certificate ఎంచుకోండి", "సమాజ వివరాలు నింపండి", "పత్రాలు అప్‌లోడ్ చేయండి", "₹35–₹45 చెల్లించండి", "తహసీల్దార్ ఫీల్డ్ వెరిఫికేషన్", "15–30 రోజుల్లో సర్టిఫికేట్"], hi: ["मीसेवा या तहसीलदार कार्यालय जाएँ", "Revenue → Caste Certificate चुनें", "समुदाय विवरण भरें", "दस्तावेज़ अपलोड करें", "₹35–₹45 भरें", "तहसीलदार फील्ड सत्यापन", "15–30 दिनों में प्रमाणपत्र"] },
    mistakes: { en: ["Not providing parent's caste certificate", "Name mismatch", "Wrong caste category", "Missing school records"], te: ["తల్లిదండ్రుల కుల సర్టిఫికేట్ అందించకపోవడం", "పేరు అసమానత", "తప్పు కుల వర్గం", "పాఠశాల రికార్డులు లేకపోవడం"], hi: ["माता-पिता का जाति प्रमाणपत्र न देना", "नाम बेमेल", "गलत जाति श्रेणी", "स्कूल रिकॉर्ड गायब"] },
  },
  "residence-certificate": {
    name: { en: "Residence Certificate", te: "నివాస ధృవీకరణ పత్రం", hi: "निवास प्रमाण पत्र" },
    department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ శాఖ, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Confirms permanent residence in Telangana for admissions and employment.", te: "అడ్మిషన్లు మరియు ఉద్యోగం కోసం తెలంగాణలో శాశ్వత నివాసాన్ని ధృవీకరిస్తుంది.", hi: "प्रवेश और रोजगार के लिए तेलंगाना में स्थायी निवास की पुष्टि करता है।" },
    overview: { en: "A Residence Certificate confirms permanent residency in Telangana for educational admissions, government jobs and welfare schemes.", te: "నివాస ధృవీకరణ పత్రం విద్యా ప్రవేశాలు, ప్రభుత్వ ఉద్యోగాలు మరియు సంక్షేమ పథకాల కోసం తెలంగాణలో శాశ్వత నివాసాన్ని ధృవీకరిస్తుంది.", hi: "निवास प्रमाण पत्र शैक्षिक प्रवेश, सरकारी नौकरियों और कल्याण योजनाओं के लिए तेलंगाना में स्थायी निवास की पुष्टि करता है।" },
    whereToApply: { en: "MeeSeva centre or Tahsildar office", te: "మీసేవ కేంద్రం లేదా తహసీల్దార్ కార్యాలయం", hi: "मीसेवा केंद्र या तहसीलदार कार्यालय" },
    processingTime: { en: "7–10 working days", te: "7–10 పని దినాలు", hi: "7–10 कार्य दिवस" },
    fees: { en: "Approximately ₹35", te: "సుమారు ₹35", hi: "लगभग ₹35" },
    documents: { en: ["Application form", "Aadhaar card", "Address proof (utility bill within 1 year)", "Voter ID", "Ration Card", "Passport-size photo"], te: ["దరఖాస్తు ఫారం", "ఆధార్ కార్డు", "చిరునామా రుజువు (1 సంవత్సరంలోపు యుటిలిటీ బిల్లు)", "వోటర్ ID", "రేషన్ కార్డు", "పాస్‌పోర్ట్ సైజ్ ఫోటో"], hi: ["आवेदन फॉर्म", "आधार कार्ड", "पते का प्रमाण (1 वर्ष के भीतर यूटिलिटी बिल)", "वोटर ID", "राशन कार्ड", "पासपोर्ट साइज फोटो"] },
    eligibility: { en: ["Residing in Telangana", "Valid Aadhaar with current address", "Address proof available"], te: ["తెలంగాణలో నివసిస్తున్నారు", "ప్రస్తుత చిరునామాతో చెల్లుబాటు అయ్యే ఆధార్", "చిరునామా రుజువు అందుబాటులో ఉంది"], hi: ["तेलंगाना में निवास", "वर्तमान पते के साथ वैध आधार", "पते का प्रमाण उपलब्ध"] },
    steps: { en: ["Visit MeeSeva or Tahsildar office", "Select Revenue → Residence Certificate", "Fill address details", "Upload documents", "Pay ₹35", "Tahsildar verifies", "Certificate in 7–10 days"], te: ["మీసేవ లేదా తహసీల్దార్ కార్యాలయం సందర్శించండి", "Revenue → Residence Certificate ఎంచుకోండి", "చిరునామా వివరాలు నింపండి", "పత్రాలు అప్‌లోడ్ చేయండి", "₹35 చెల్లించండి", "తహసీల్దార్ ధృవీకరిస్తారు", "7–10 రోజుల్లో సర్టిఫికేట్"], hi: ["मीसेवा या तहसीलदार कार्यालय जाएँ", "Revenue → Residence Certificate चुनें", "पते का विवरण भरें", "दस्तावेज़ अपलोड करें", "₹35 भरें", "तहसीलदार सत्यापित करता है", "7–10 दिनों में प्रमाणपत्र"] },
    mistakes: { en: ["Aadhaar address mismatch", "Utility bill older than 1 year", "No tenancy proof for rented address", "Incomplete form"], te: ["ఆధార్ చిరునామా అసమానత", "1 సంవత్సరం కంటే పాత యుటిలిటీ బిల్లు", "అద్దె చిరునామాకు అద్దె రుజువు లేదు", "అసంపూర్ణ ఫారం"], hi: ["आधार पता बेमेल", "1 वर्ष से पुराना यूटिलिटी बिल", "किराये के पते के लिए किराया प्रमाण नहीं", "अधूरा फॉर्म"] },
  },
  "birth-certificate": {
    name: { en: "Birth Certificate", te: "జనన ధృవీకరణ పత్రం", hi: "जन्म प्रमाण पत्र" },
    department: { en: "Municipal Administration / GHMC / Gram Panchayat", te: "పురపాలక పరిపాలన / GHMC / గ్రామ పంచాయతీ", hi: "नगर प्रशासन / GHMC / ग्राम पंचायत" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Primary identity document recording birth, required for school admission, Aadhaar and passport.", te: "జననాన్ని నమోదు చేసే ప్రాథమిక గుర్తింపు పత్రం, పాఠశాల ప్రవేశం, ఆధార్ మరియు పాస్‌పోర్ట్‌కు అవసరం.", hi: "जन्म दर्ज करने वाला प्राथमिक पहचान दस्तावेज़, स्कूल प्रवेश, आधार और पासपोर्ट के लिए आवश्यक।" },
    overview: { en: "A Birth Certificate is the official government record of a child's birth issued by the local municipal authority.", te: "జనన ధృవీకరణ పత్రం అనేది స్థానిక మున్సిపల్ అథారిటీ జారీ చేసిన శిశువు జననానికి సంబంధించిన అధికారిక ప్రభుత్వ రికార్డు.", hi: "जन्म प्रमाण पत्र स्थानीय नगरपालिका प्राधिकरण द्वारा जारी बच्चे के जन्म का आधिकारिक सरकारी रिकॉर्ड है।" },
    whereToApply: { en: "GHMC / Municipality / Gram Panchayat / MeeSeva", te: "GHMC / మున్సిపాలిటీ / గ్రామ పంచాయతీ / మీసేవ", hi: "GHMC / नगरपालिका / ग्राम पंचायत / मीसेवा" },
    processingTime: { en: "3–7 working days", te: "3–7 పని దినాలు", hi: "3–7 कार्य दिवस" },
    fees: { en: "Free within 21 days. Late fee applies after.", te: "21 రోజులలో ఉచితం. తర్వాత ఆలస్య రుసుము వర్తిస్తుంది.", hi: "21 दिनों में मुफ्त। बाद में विलंब शुल्क लागू।" },
    documents: { en: ["Hospital birth record", "Parents' Aadhaar cards", "Parents' marriage certificate", "Address proof", "Application form"], te: ["ఆసుపత్రి జనన రికార్డు", "తల్లిదండ్రుల ఆధార్ కార్డులు", "తల్లిదండ్రుల వివాహ ధృవీకరణ పత్రం", "చిరునామా రుజువు", "దరఖాస్తు ఫారం"], hi: ["अस्पताल जन्म अभिलेख", "माता-पिता के आधार कार्ड", "माता-पिता का विवाह प्रमाण पत्र", "पते का प्रमाण", "आवेदन फॉर्म"] },
    eligibility: { en: ["Birth occurred in Telangana", "Parent or guardian can apply", "Free within 21 days of birth"], te: ["తెలంగాణలో జన్మ జరిగి ఉండాలి", "తల్లిదండ్రులు లేదా సంరక్షకులు దరఖాస్తు చేయవచ్చు", "జన్మించిన 21 రోజులలో ఉచితం"], hi: ["जन्म तेलंगाना में हुआ हो", "माता-पिता या अभिभावक आवेदन कर सकते हैं", "जन्म के 21 दिनों में मुफ्त"] },
    steps: { en: ["Get hospital birth record", "Visit GHMC/Municipality/Gram Panchayat", "Fill registration form", "Submit documents", "Pay fee (free within 21 days)", "Collect certificate in 3–7 days"], te: ["ఆసుపత్రి జనన రికార్డు పొందండి", "GHMC/మున్సిపాలిటీ/గ్రామ పంచాయతీ సందర్శించండి", "రిజిస్ట్రేషన్ ఫారం నింపండి", "పత్రాలు సమర్పించండి", "ఫీజు చెల్లించండి (21 రోజులలో ఉచితం)", "3–7 రోజుల్లో సర్టిఫికేట్ సేకరించండి"], hi: ["अस्पताल जन्म रिकॉर्ड लें", "GHMC/नगरपालिका/ग्राम पंचायत जाएँ", "पंजीकरण फॉर्म भरें", "दस्तावेज़ जमा करें", "शुल्क भरें (21 दिनों में मुफ्त)", "3–7 दिनों में प्रमाणपत्र लें"] },
    mistakes: { en: ["Delaying beyond 21 days", "Not collecting hospital birth record", "Name mismatch in parents' docs", "Approaching agents"], te: ["21 రోజులకు మించి ఆలస్యం చేయడం", "ఆసుపత్రి జనన రికార్డు సేకరించకపోవడం", "తల్లిదండ్రుల పత్రాల్లో పేరు అసమానత", "ఏజెంట్లను సంప్రదించడం"], hi: ["21 दिनों से अधिक विलंब", "अस्पताल जन्म रिकॉर्ड न लेना", "माता-पिता के दस्तावेज़ों में नाम बेमेल", "एजेंटों से संपर्क करना"] },
  },
  "death-certificate": {
    name: { en: "Death Certificate", te: "మరణ ధృవీకరణ పత్రం", hi: "मृत्यु प्रमाण पत्र" },
    department: { en: "Municipal Administration / GHMC", te: "పురపాలక పరిపాలన / GHMC", hi: "नगर प्रशासन / GHMC" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Official record of death for legal, property and insurance purposes.", te: "న్యాయ, ఆస్తి మరియు బీమా ప్రయోజనాల కోసం మరణం యొక్క అధికారిక రికార్డు.", hi: "कानूनी, संपत्ति और बीमा उद्देश्यों के लिए मृत्यु का आधिकारिक रिकॉर्ड।" },
    overview: { en: "A Death Certificate is issued by the municipal authority to officially record a person's death.", te: "మరణ ధృవీకరణ పత్రం వ్యక్తి మరణాన్ని అధికారికంగా నమోదు చేయడానికి మున్సిపల్ అథారిటీ జారీ చేస్తుంది.", hi: "मृत्यु प्रमाण पत्र किसी व्यक्ति की मृत्यु को आधिकारिक रूप से दर्ज करने के लिए नगरपालिका प्राधिकरण द्वारा जारी किया जाता है।" },
    whereToApply: { en: "GHMC / Municipality / Gram Panchayat / MeeSeva", te: "GHMC / మున్సిపాలిటీ / గ్రామ పంచాయతీ / మీసేవ", hi: "GHMC / नगरपालिका / ग्राम पंचायत / मीसेवा" },
    processingTime: { en: "3–7 working days", te: "3–7 పని దినాలు", hi: "3–7 कार्य दिवस" },
    fees: { en: "Free within 21 days. Late fee applies after.", te: "21 రోజులలో ఉచితం. తర్వాత ఆలస్య రుసుము.", hi: "21 दिनों में मुफ्त। बाद में विलंब शुल्क।" },
    documents: { en: ["Hospital death certificate", "Deceased's Aadhaar", "Applicant's Aadhaar", "Address proof", "Application form"], te: ["ఆసుపత్రి మరణ ధృవీకరణ పత్రం", "మృతుని ఆధార్", "దరఖాస్తుదారు ఆధార్", "చిరునామా రుజువు", "దరఖాస్తు ఫారం"], hi: ["अस्पताल मृत्यु प्रमाणपत्र", "मृतक का आधार", "आवेदक का आधार", "पते का प्रमाण", "आवेदन फॉर्म"] },
    eligibility: { en: ["Death occurred in Telangana", "Family member can apply", "Register within 21 days"], te: ["తెలంగాణలో మరణం సంభవించింది", "కుటుంబ సభ్యులు దరఖాస్తు చేయవచ్చు", "21 రోజులలో నమోదు చేయండి"], hi: ["मृत्यु तेलंगाना में हुई हो", "परिवार का सदस्य आवेदन कर सकता है", "21 दिनों में पंजीकरण करें"] },
    steps: { en: ["Obtain hospital death certificate", "Visit GHMC/Municipality", "Fill registration form", "Submit documents", "Collect certificate in 3–7 days"], te: ["ఆసుపత్రి మరణ ధృవీకరణ పత్రం పొందండి", "GHMC/మున్సిపాలిటీ సందర్శించండి", "రిజిస్ట్రేషన్ ఫారం నింపండి", "పత్రాలు సమర్పించండి", "3–7 రోజుల్లో సర్టిఫికేట్ సేకరించండి"], hi: ["अस्पताल मृत्यु प्रमाणपत्र प्राप्त करें", "GHMC/नगरपालिका जाएँ", "पंजीकरण फॉर्म भरें", "दस्तावेज़ जमा करें", "3–7 दिनों में प्रमाणपत्र लें"] },
    mistakes: { en: ["Delaying registration", "Not obtaining hospital certificate", "Incorrect deceased details"], te: ["నమోదు ఆలస్యం", "ఆసుపత్రి సర్టిఫికేట్ పొందకపోవడం", "తప్పు మృతుని వివరాలు"], hi: ["पंजीकरण में देरी", "अस्पताल प्रमाणपत्र न लेना", "गलत मृतक विवरण"] },
  },
  "ration-card": {
    name: { en: "Ration Card", te: "రేషన్ కార్డు", hi: "राशन कार्ड" },
    department: { en: "Civil Supplies Department, Telangana", te: "సివిల్ సప్లైస్ శాఖ, తెలంగాణ", hi: "नागरिक आपूर्ति विभाग, तेलंगाना" },
    category: { en: "Scheme", te: "పథకం", hi: "योजना" },
    shortDesc: { en: "Access to subsidised food grains under PDS.", te: "PDS కింద సబ్సిడీ ఆహార ధాన్యాలకు ప్రాప్తి.", hi: "PDS के तहत सब्सिडी वाले खाद्यान्न तक पहुँच।" },
    overview: { en: "A Ration Card entitles a household to purchase subsidised food grains from Fair Price Shops.", te: "రేషన్ కార్డు ఫెయిర్ ప్రైస్ షాపుల నుండి సబ్సిడీ ఆహార ధాన్యాలు కొనుగోలు చేయడానికి కుటుంబానికి అర్హత కల్పిస్తుంది.", hi: "राशन कार्ड परिवार को उचित मूल्य की दुकानों से सब्सिडी वाले अनाज खरीदने का अधिकार देता है।" },
    whereToApply: { en: "Civil Supplies office / MeeSeva", te: "సివిల్ సప్లైస్ కార్యాలయం / మీసేవ", hi: "नागरिक आपूर्ति कार्यालय / मीसेवा" },
    processingTime: { en: "30–45 days", te: "30–45 రోజులు", hi: "30–45 दिन" },
    fees: { en: "₹10–₹35 at MeeSeva", te: "మీసేవలో ₹10–₹35", hi: "मीसेवा पर ₹10–₹35" },
    documents: { en: ["Application form", "Aadhaar cards of all family members", "Address proof", "Income certificate (for BPL)", "Photos of all members"], te: ["దరఖాస్తు ఫారం", "అన్ని కుటుంబ సభ్యుల ఆధార్ కార్డులు", "చిరునామా రుజువు", "ఆదాయ ధృవీకరణ పత్రం (BPL కోసం)", "అన్ని సభ్యుల ఫోటోలు"], hi: ["आवेदन फॉर्म", "सभी परिवार के सदस्यों के आधार कार्ड", "पते का प्रमाण", "आय प्रमाणपत्र (BPL के लिए)", "सभी सदस्यों की फोटो"] },
    eligibility: { en: ["Resident of Telangana", "No ration card in another state", "Income criteria for category"], te: ["తెలంగాణ నివాసి", "మరొక రాష్ట్రంలో రేషన్ కార్డు లేదు", "వర్గానికి ఆదాయ ప్రమాణాలు"], hi: ["तेलंगाना निवासी", "अन्य राज्य में राशन कार्ड नहीं", "श्रेणी के लिए आय मानदंड"] },
    steps: { en: ["Visit Civil Supplies office or MeeSeva", "Submit application with family Aadhaar", "Field verification", "Card issued in 30–45 days"], te: ["సివిల్ సప్లైస్ కార్యాలయం లేదా మీసేవ సందర్శించండి", "కుటుంబ ఆధార్‌తో దరఖాస్తు సమర్పించండి", "ఫీల్డ్ వెరిఫికేషన్", "30–45 రోజుల్లో కార్డు జారీ"], hi: ["नागरिक आपूर्ति कार्यालय या मीसेवा जाएँ", "परिवार आधार के साथ आवेदन जमा करें", "फील्ड सत्यापन", "30–45 दिनों में कार्ड जारी"] },
    mistakes: { en: ["Not enrolling all family members", "Duplicate card in another state", "Wrong income category"], te: ["అన్ని కుటుంబ సభ్యులను నమోదు చేయకపోవడం", "మరొక రాష్ట్రంలో డూప్లికేట్ కార్డు", "తప్పు ఆదాయ వర్గం"], hi: ["सभी परिवार सदस्यों को दर्ज न करना", "अन्य राज्य में डुप्लिकेट कार्ड", "गलत आय श्रेणी"] },
  },
  "aadhaar-update": {
    name: { en: "Aadhaar Update", te: "ఆధార్ అప్‌డేట్", hi: "आधार अपडेट" },
    department: { en: "UIDAI", te: "UIDAI", hi: "UIDAI" },
    category: { en: "Identity", te: "గుర్తింపు", hi: "पहचान" },
    shortDesc: { en: "Update name, address, DOB, mobile or biometrics in Aadhaar.", te: "ఆధార్‌లో పేరు, చిరునామా, DOB, మొబైల్ లేదా బయోమెట్రిక్స్ అప్‌డేట్ చేయండి.", hi: "आधार में नाम, पता, DOB, मोबाइल या बायोमेट्रिक्स अपडेट करें।" },
    overview: { en: "Aadhaar Update allows holders to correct or update demographic and biometric data through UIDAI channels.", te: "ఆధార్ అప్‌డేట్ UIDAI ఛానెల్స్ ద్వారా డెమోగ్రాఫిక్ మరియు బయోమెట్రిక్ డేటాను సరిదిద్దడానికి లేదా అప్‌డేట్ చేయడానికి హోల్డర్లకు అనుమతిస్తుంది.", hi: "आधार अपडेट UIDAI चैनलों के माध्यम से जनसांख्यिकीय और बायोमेट्रिक डेटा सुधारने या अपडेट करने की अनुमति देता है।" },
    whereToApply: { en: "myaadhaar.uidai.gov.in / Aadhaar Seva Kendra", te: "myaadhaar.uidai.gov.in / ఆధార్ సేవా కేంద్రం", hi: "myaadhaar.uidai.gov.in / आधार सेवा केंद्र" },
    processingTime: { en: "7–10 working days", te: "7–10 పని దినాలు", hi: "7–10 कार्य दिवस" },
    fees: { en: "Online address: Free. Centre: ₹50. Biometric: ₹100.", te: "ఆన్‌లైన్ చిరునామా: ఉచితం. కేంద్రం: ₹50. బయోమెట్రిక్: ₹100.", hi: "ऑनलाइन पता: मुफ्त। केंद्र: ₹50. बायोमेट्रिक: ₹100." },
    documents: { en: ["Existing Aadhaar card", "Supporting document for update", "Mobile linked to Aadhaar (for online)"], te: ["ప్రస్తుత ఆధార్ కార్డు", "అప్‌డేట్ కోసం సహాయక పత్రం", "ఆధార్‌కు లింక్ చేసిన మొబైల్ (ఆన్‌లైన్ కోసం)"], hi: ["मौजूदा आधार कार्ड", "अपडेट के लिए सहायक दस्तावेज़", "आधार से लिंक मोबाइल (ऑनलाइन के लिए)"] },
    eligibility: { en: ["Must hold valid Aadhaar", "Mobile linked for online updates", "Visit centre for biometric updates"], te: ["చెల్లుబాటు అయ్యే ఆధార్ ఉండాలి", "ఆన్‌లైన్ అప్‌డేట్‌ల కోసం మొబైల్ లింక్ చేయబడి ఉండాలి", "బయోమెట్రిక్ అప్‌డేట్ల కోసం కేంద్రాన్ని సందర్శించండి"], hi: ["वैध आधार होना चाहिए", "ऑनलाइन अपडेट के लिए मोबाइल लिंक", "बायोमेट्रिक अपडेट के लिए केंद्र जाएँ"] },
    steps: { en: ["Visit myaadhaar.uidai.gov.in or Aadhaar Seva Kendra", "Select update type", "Upload document", "Pay fee if applicable", "Track using URN"], te: ["myaadhaar.uidai.gov.in లేదా ఆధార్ సేవా కేంద్రం సందర్శించండి", "అప్‌డేట్ రకం ఎంచుకోండి", "పత్రం అప్‌లోడ్ చేయండి", "వర్తించే ఫీజు చెల్లించండి", "URN ఉపయోగించి ట్రాక్ చేయండి"], hi: ["myaadhaar.uidai.gov.in या आधार सेवा केंद्र जाएँ", "अपडेट प्रकार चुनें", "दस्तावेज़ अपलोड करें", "लागू शुल्क भरें", "URN से ट्रैक करें"] },
    mistakes: { en: ["Using unofficial websites", "Document mismatch", "Not booking appointment"], te: ["అనధికారిక వెబ్‌సైట్లు ఉపయోగించడం", "పత్రం అసమానత", "అపాయింట్‌మెంట్ బుక్ చేయకపోవడం"], hi: ["अनाधिकारिक वेबसाइट का उपयोग", "दस्तावेज़ बेमेल", "अपॉइंटमेंट बुक न करना"] },
  },
  "driving-licence": {
    name: { en: "Driving Licence", te: "డ్రైవింగ్ లైసెన్స్", hi: "ड्राइविंग लाइसेंस" },
    department: { en: "Transport Department, Telangana", te: "రవాణా శాఖ, తెలంగాణ", hi: "परिवहन विभाग, तेलंगाना" },
    category: { en: "Transport", te: "రవాణా", hi: "परिवहन" },
    shortDesc: { en: "Apply for Learner Licence, permanent DL, renewal or duplicate.", te: "లర్నర్ లైసెన్స్, శాశ్వత DL, రిన్యూవల్ లేదా డూప్లికేట్ కోసం దరఖాస్తు చేయండి.", hi: "लर्नर लाइसेंस, स्थायी DL, नवीनीकरण या डुप्लिकेट के लिए आवेदन करें।" },
    overview: { en: "A Driving Licence authorises a person to drive motor vehicles on public roads in India.", te: "డ్రైవింగ్ లైసెన్స్ భారతదేశంలో పబ్లిక్ రోడ్లపై మోటార్ వాహనాలు నడపడానికి వ్యక్తికి అధికారం ఇస్తుంది.", hi: "ड्राइविंग लाइसेंस भारत में सार्वजनिक सड़कों पर मोटर वाहन चलाने के लिए व्यक्ति को अधिकृत करता है।" },
    whereToApply: { en: "sarathi.parivahan.gov.in / RTO", te: "sarathi.parivahan.gov.in / RTO", hi: "sarathi.parivahan.gov.in / RTO" },
    processingTime: { en: "15–30 days after passing test", te: "పరీక్ష ఉత్తీర్ణత తర్వాత 15–30 రోజులు", hi: "परीक्षा उत्तीर्ण होने के बाद 15–30 दिन" },
    fees: { en: "LL: ₹200. DL: ₹200. Renewal: ₹200.", te: "LL: ₹200. DL: ₹200. రిన్యూవల్: ₹200.", hi: "LL: ₹200. DL: ₹200. नवीनीकरण: ₹200." },
    documents: { en: ["Aadhaar card", "Photographs", "Form 4", "Learner Licence (for DL)", "Medical certificate (commercial)"], te: ["ఆధార్ కార్డు", "ఫోటోలు", "ఫారం 4", "లర్నర్ లైసెన్స్ (DL కోసం)", "వైద్య ధృవీకరణ పత్రం (వాణిజ్య)"], hi: ["आधार कार्ड", "फोटो", "फॉर्म 4", "लर्नर लाइसेंस (DL के लिए)", "चिकित्सा प्रमाणपत्र (वाणिज्यिक)"] },
    eligibility: { en: ["18+ for cars/motorcycles", "16+ for gearless 50cc", "Must pass LL test first"], te: ["కార్లు/మోటార్‌సైకిళ్ల కోసం 18+", "గేర్‌లెస్ 50cc కోసం 16+", "ముందుగా LL పరీక్షలో ఉత్తీర్ణం కావాలి"], hi: ["कार/मोटरसाइकिल के लिए 18+", "गियरलेस 50cc के लिए 16+", "पहले LL परीक्षा पास करनी होगी"] },
    steps: { en: ["Apply for LL on Sarathi portal", "Pass LL test at RTO", "Wait 30 days", "Apply for permanent DL", "Pass driving test", "DL dispatched in 15–30 days"], te: ["సారథి పోర్టల్‌లో LL కోసం దరఖాస్తు చేయండి", "RTO లో LL పరీక్షలో ఉత్తీర్ణం అవండి", "30 రోజులు వేచి ఉండండి", "శాశ్వత DL కోసం దరఖాస్తు చేయండి", "డ్రైవింగ్ టెస్ట్‌లో ఉత్తీర్ణం అవండి", "15–30 రోజుల్లో DL డిస్పాచ్"], hi: ["सारथी पोर्टल पर LL के लिए आवेदन करें", "RTO में LL परीक्षा पास करें", "30 दिन प्रतीक्षा करें", "स्थायी DL के लिए आवेदन करें", "ड्राइविंग टेस्ट पास करें", "15–30 दिनों में DL भेजा जाता है"] },
    mistakes: { en: ["Applying before 30 days", "Not carrying originals", "Wrong vehicle class", "Uninsured test vehicle"], te: ["30 రోజులకు ముందు దరఖాస్తు చేయడం", "ఒరిజినల్స్ తీసుకెళ్ళకపోవడం", "తప్పు వాహన తరగతి", "బీమా లేని పరీక్ష వాహనం"], hi: ["30 दिनों से पहले आवेदन", "मूल दस्तावेज़ न ले जाना", "गलत वाहन श्रेणी", "बीमा रहित परीक्षा वाहन"] },
  },
  "voter-id": {
    name: { en: "Voter ID", te: "వోటర్ ID", hi: "मतदाता पहचान पत्र" },
    department: { en: "Election Commission of India", te: "భారత ఎన్నికల సంఘం", hi: "भारत निर्वाचन आयोग" },
    category: { en: "Identity", te: "గుర్తింపు", hi: "पहचान" },
    shortDesc: { en: "Electoral Photo Identity Card for voting and identity proof.", te: "ఓటింగ్ మరియు గుర్తింపు రుజువు కోసం ఎన్నికల ఫోటో గుర్తింపు కార్డు.", hi: "मतदान और पहचान प्रमाण के लिए चुनावी फोटो पहचान पत्र।" },
    overview: { en: "Voter ID (EPIC) is issued by the Election Commission as proof of voter registration.", te: "వోటర్ ID (EPIC) ఎన్నికల సంఘం ద్వారా ఓటరు నమోదు రుజువుగా జారీ చేయబడుతుంది.", hi: "वोटर ID (EPIC) चुनाव आयोग द्वारा मतदाता पंजीकरण के प्रमाण के रूप में जारी किया जाता है।" },
    whereToApply: { en: "voters.eci.gov.in / ERO Office", te: "voters.eci.gov.in / ERO కార్యాలయం", hi: "voters.eci.gov.in / ERO कार्यालय" },
    processingTime: { en: "15–30 days", te: "15–30 రోజులు", hi: "15–30 दिन" },
    fees: { en: "Free — no charges", te: "ఉచితం — ఎటువంటి ఛార్జీలు లేవు", hi: "मुफ्त — कोई शुल्क नहीं" },
    documents: { en: ["Form 6", "Age proof", "Address proof", "Passport-size photograph"], te: ["ఫారం 6", "వయస్సు రుజువు", "చిరునామా రుజువు", "పాస్‌పోర్ట్ సైజ్ ఫోటో"], hi: ["फॉर्म 6", "आयु प्रमाण", "पते का प्रमाण", "पासपोर्ट साइज फोटो"] },
    eligibility: { en: ["Indian citizen aged 18+", "Ordinary resident of constituency"], te: ["18+ వయస్సు గల భారతీయ పౌరుడు", "నియోజకవర్గ సాధారణ నివాసి"], hi: ["18+ आयु का भारतीय नागरिक", "निर्वाचन क्षेत्र का सामान्य निवासी"] },
    steps: { en: ["Visit voters.eci.gov.in", "Fill Form 6", "Upload documents", "BLO verification", "Card dispatched by post"], te: ["voters.eci.gov.in సందర్శించండి", "ఫారం 6 నింపండి", "పత్రాలు అప్‌లోడ్ చేయండి", "BLO వెరిఫికేషన్", "పోస్ట్ ద్వారా కార్డు డిస్పాచ్"], hi: ["voters.eci.gov.in पर जाएँ", "फॉर्म 6 भरें", "दस्तावेज़ अपलोड करें", "BLO सत्यापन", "डाक से कार्ड भेजा जाता है"] },
    mistakes: { en: ["Wrong constituency", "Not updating after moving", "Missing BLO verification"], te: ["తప్పు నియోజకవర్గం", "మారిన తర్వాత అప్‌డేట్ చేయకపోవడం", "BLO వెరిఫికేషన్ మిస్ అవడం"], hi: ["गलत निर्वाचन क्षेत्र", "स्थानांतरण के बाद अपडेट न करना", "BLO सत्यापन छूटना"] },
  },
  "pan-card": {
    name: { en: "PAN Card", te: "PAN కార్డు", hi: "पैन कार्ड" },
    department: { en: "Income Tax Department", te: "ఆదాయపు పన్ను శాఖ", hi: "आयकर विभाग" },
    category: { en: "Finance", te: "ఆర్థికం", hi: "वित्त" },
    shortDesc: { en: "Permanent Account Number for tax filing and financial transactions.", te: "పన్ను దాఖలు మరియు ఆర్థిక లావాదేవీల కోసం శాశ్వత ఖాతా సంఖ్య.", hi: "कर दाखिल करने और वित्तीय लेनदेन के लिए स्थायी खाता संख्या।" },
    overview: { en: "PAN is a 10-digit code issued by the Income Tax Department, mandatory for tax returns and financial transactions.", te: "PAN అనేది ఆదాయపు పన్ను శాఖ జారీ చేసిన 10-అంకెల కోడ్, పన్ను రిటర్న్‌లు మరియు ఆర్థిక లావాదేవీలకు తప్పనిసరి.", hi: "PAN आयकर विभाग द्वारा जारी 10-अंकीय कोड है, कर रिटर्न और वित्तीय लेनदेन के लिए अनिवार्य।" },
    whereToApply: { en: "onlineservices.nsdl.com / incometax.gov.in", te: "onlineservices.nsdl.com / incometax.gov.in", hi: "onlineservices.nsdl.com / incometax.gov.in" },
    processingTime: { en: "15–20 days (physical) / Instant (e-PAN)", te: "15–20 రోజులు (భౌతిక) / తక్షణ (e-PAN)", hi: "15–20 दिन (भौतिक) / तुरंत (e-PAN)" },
    fees: { en: "Physical: ₹107. Instant e-PAN via Aadhaar: Free.", te: "భౌతిక: ₹107. ఆధార్ ద్వారా తక్షణ e-PAN: ఉచితం.", hi: "भौतिक: ₹107. आधार से तुरंत e-PAN: मुफ्त।" },
    documents: { en: ["Proof of Identity", "Proof of Address", "Proof of Date of Birth", "Photographs", "Form 49A"], te: ["గుర్తింపు రుజువు", "చిరునామా రుజువు", "జన్మ తేదీ రుజువు", "ఫోటోలు", "ఫారం 49A"], hi: ["पहचान प्रमाण", "पते का प्रमाण", "जन्मतिथि प्रमाण", "फोटो", "फॉर्म 49A"] },
    eligibility: { en: ["Any Indian citizen", "No age limit", "Entities also eligible"], te: ["ఏ భారతీయ పౌరుడైనా", "వయస్సు పరిమితి లేదు", "సంస్థలు కూడా అర్హులే"], hi: ["कोई भी भारतीय नागरिक", "कोई आयु सीमा नहीं", "संस्थाएँ भी पात्र"] },
    steps: { en: ["Visit onlineservices.nsdl.com", "Fill Form 49A", "Upload documents", "Pay ₹107", "PAN generated in 7–10 days", "Card delivered in 15–20 days"], te: ["onlineservices.nsdl.com సందర్శించండి", "ఫారం 49A నింపండి", "పత్రాలు అప్‌లోడ్ చేయండి", "₹107 చెల్లించండి", "7–10 రోజుల్లో PAN జనరేట్", "15–20 రోజుల్లో కార్డు డెలివరీ"], hi: ["onlineservices.nsdl.com पर जाएँ", "फॉर्म 49A भरें", "दस्तावेज़ अपलोड करें", "₹107 भरें", "7–10 दिनों में PAN जनरेट", "15–20 दिनों में कार्ड डिलीवरी"] },
    mistakes: { en: ["Applying for duplicate PAN (illegal)", "Name mismatch", "Not linking with Aadhaar"], te: ["డూప్లికేట్ PAN కోసం దరఖాస్తు (చట్టవిరుద్ధం)", "పేరు అసమానత", "ఆధార్‌తో లింక్ చేయకపోవడం"], hi: ["डुप्लिकेट PAN के लिए आवेदन (अवैध)", "नाम बेमेल", "आधार से लिंक न करना"] },
  },
  "telangana-schemes": {
    name: { en: "Telangana Govt. Schemes", te: "తెలంగాణ ప్రభుత్వ పథకాలు", hi: "तेलंगाना सरकारी योजनाएँ" },
    department: { en: "Various Departments, Govt. of Telangana", te: "వివిధ విభాగాలు, తెలంగాణ ప్రభుత్వం", hi: "विभिन्न विभाग, तेलंगाना सरकार" },
    category: { en: "Scheme", te: "పథకం", hi: "योजना" },
    shortDesc: { en: "Welfare and development schemes by the Telangana government.", te: "తెలంగాణ ప్రభుత్వం ద్వారా సంక్షేమ మరియు అభివృద్ధి పథకాలు.", hi: "तेलंगाना सरकार की कल्याण और विकास योजनाएँ।" },
    overview: { en: "Telangana offers multiple welfare schemes covering agriculture, education, healthcare, housing and social security.", te: "తెలంగాణ వ్యవసాయం, విద్య, ఆరోగ్యం, గృహనిర్మాణం మరియు సామాజిక భద్రతను కవర్ చేసే బహుళ సంక్షేమ పథకాలను అందిస్తుంది.", hi: "तेलंगाना कृषि, शिक्षा, स्वास्थ्य, आवास और सामाजिक सुरक्षा को कवर करने वाली अनेक कल्याण योजनाएँ प्रदान करता है।" },
    whereToApply: { en: "Respective Dept. Portal / MeeSeva", te: "సంబంధిత శాఖ పోర్టల్ / మీసేవ", hi: "संबंधित विभाग पोर्टल / मीसेवा" },
    processingTime: { en: "Varies by scheme", te: "పథకం ప్రకారం మారుతుంది", hi: "योजना के अनुसार भिन्न" },
    fees: { en: "Varies by scheme", te: "పథకం ప్రకారం మారుతుంది", hi: "योजना के अनुसार भिन्न" },
    documents: { en: ["Varies — typically Aadhaar, income certificate, caste certificate"], te: ["మారుతుంది — సాధారణంగా ఆధార్, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం"], hi: ["भिन्न — आमतौर पर आधार, आय प्रमाणपत्र, जाति प्रमाणपत्र"] },
    eligibility: { en: ["Varies — check specific scheme requirements"], te: ["మారుతుంది — నిర్దిష్ట పథకం అవసరాలను తనిఖీ చేయండి"], hi: ["भिन्न — विशिष्ट योजना आवश्यकताएँ जाँचें"] },
    steps: { en: ["Identify relevant scheme", "Check eligibility", "Visit MeeSeva or dept. portal", "Submit application", "Track status"], te: ["సంబంధిత పథకాన్ని గుర్తించండి", "అర్హత తనిఖీ చేయండి", "మీసేవ లేదా శాఖ పోర్టల్ సందర్శించండి", "దరఖాస్తు సమర్పించండి", "స్టేటస్ ట్రాక్ చేయండి"], hi: ["संबंधित योजना की पहचान करें", "पात्रता जाँचें", "मीसेवा या विभाग पोर्टल जाएँ", "आवेदन जमा करें", "स्थिति ट्रैक करें"] },
    mistakes: { en: ["Applying to wrong scheme", "Incomplete documentation", "Missing eligibility criteria"], te: ["తప్పు పథకానికి దరఖాస్తు చేయడం", "అసంపూర్ణ డాక్యుమెంటేషన్", "అర్హత ప్రమాణాలు మిస్ అవడం"], hi: ["गलत योजना में आवेदन", "अपूर्ण दस्तावेज़", "पात्रता मानदंड छूटना"] },
  },
  "meeseva-services": {
    name: { en: "MeeSeva Services", te: "మీసేవా సేవలు", hi: "मीसेवा सेवाएँ" },
    department: { en: "Government of Telangana", te: "తెలంగాణ ప్రభుత్వం", hi: "तेलंगाना सरकार" },
    category: { en: "Platform", te: "వేదిక", hi: "प्लेटफॉर्म" },
    shortDesc: { en: "Telangana's citizen service platform with 600+ services.", te: "600+ సేవలతో తెలంగాణ పౌర సేవా వేదిక.", hi: "600+ सेवाओं वाला तेलंगाना नागरिक सेवा मंच।" },
    overview: { en: "MeeSeva provides 600+ government services through 3500+ centres across Telangana.", te: "మీసేవా తెలంగాణ అంతటా 3500+ కేంద్రాల ద్వారా 600+ ప్రభుత్వ సేవలను అందిస్తుంది.", hi: "मीसेवा तेलंगाना भर में 3500+ केंद्रों के माध्यम से 600+ सरकारी सेवाएँ प्रदान करता है।" },
    whereToApply: { en: "Any MeeSeva centre / meeseva.telangana.gov.in", te: "ఏదైనా మీసేవ కేంద్రం / meeseva.telangana.gov.in", hi: "कोई भी मीसेवा केंद्र / meeseva.telangana.gov.in" },
    processingTime: { en: "Varies (3–45 days)", te: "మారుతుంది (3–45 రోజులు)", hi: "भिन्न (3–45 दिन)" },
    fees: { en: "₹10–₹50 per service", te: "ప్రతి సేవకు ₹10–₹50", hi: "प्रति सेवा ₹10–₹50" },
    documents: { en: ["Varies — carry Aadhaar, originals and photocopies"], te: ["మారుతుంది — ఆధార్, ఒరిజినల్స్ మరియు ఫోటోకాపీలు తీసుకెళ్ళండి"], hi: ["भिन्न — आधार, मूल और फोटोकॉपी ले जाएँ"] },
    eligibility: { en: ["Any Telangana citizen"], te: ["ఏ తెలంగాణ పౌరుడైనా"], hi: ["कोई भी तेलंगाना नागरिक"] },
    steps: { en: ["Visit nearest MeeSeva centre or portal", "Select service", "Submit documents and pay fee", "Collect receipt", "Track status"], te: ["సమీప మీసేవ కేంద్రం లేదా పోర్టల్ సందర్శించండి", "సేవ ఎంచుకోండి", "పత్రాలు సమర్పించి ఫీజు చెల్లించండి", "రసీదు సేకరించండి", "స్టేటస్ ట్రాక్ చేయండి"], hi: ["निकटतम मीसेवा केंद्र या पोर्टल जाएँ", "सेवा चुनें", "दस्तावेज़ जमा करें और शुल्क भरें", "रसीद लें", "स्थिति ट्रैक करें"] },
    mistakes: { en: ["Not carrying originals", "Visiting on holidays", "Not collecting receipt"], te: ["ఒరిజినల్స్ తీసుకెళ్ళకపోవడం", "సెలవు రోజుల్లో సందర్శించడం", "రసీదు సేకరించకపోవడం"], hi: ["मूल दस्तावेज़ न ले जाना", "छुट्टी के दिन जाना", "रसीद न लेना"] },
  },
};

/**
 * Get a localized field for a service.
 * @param {string} serviceId
 * @param {string} field
 * @param {string} lang — "en" | "te" | "hi"
 * @returns {string|string[]}
 */
export function getServiceField(serviceId, field, lang = "en") {
  const service = DATA[serviceId];
  if (!service) return "";
  const value = service[field];
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  return value[lang] || value.en || "";
}

/**
 * Get localized value from any { en, te, hi } object.
 */
export function loc(obj, lang = "en") {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj;
  return obj[lang] || obj.en || "";
}

export default DATA;

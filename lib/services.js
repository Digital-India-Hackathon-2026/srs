export const services = [
  {
    id: "income-certificate",
    name: { en: "Income Certificate", hi: "आय प्रमाण पत्र", te: "ఆదాయ ధృవీకరణ పత్రం" },
    department: { en: "Revenue Department, Telangana", hi: "राजस्व विभाग, तेलंगाना", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ" },
    category: "Certificate",
    where: { en: "MeeSeva / Mee-Seva Portal", hi: "MeeSeva / Mee-Seva पोर्टल", te: "మీసేవ / మీ-సేవ పోర్టల్" },
    officialSource: "https://meeseva.telangana.gov.in/",
    lastVerified: "2026-07-01",
    processingTime: { en: "7–15 working days", hi: "7–15 कार्य दिवस", te: "7–15 పని దినాలు" },
    status: "active",
    overview: {
      en: "An Income Certificate is an official document issued by the Revenue Department of Telangana certifying the annual income of a family or individual. It is required for various government schemes, scholarships, and reservations.",
      hi: "आय प्रमाण पत्र तेलंगाना के राजस्व विभाग द्वारा जारी एक आधिकारिक दस्तावेज़ है जो परिवार या व्यक्ति की वार्षिक आय को प्रमाणित करता है।",
      te: "ఆదాయ ధృవీకరణ పత్రం అనేది తెలంగాణ రెవెన్యూ డిపార్ట్‌మెంట్ జారీ చేసే అధికారిక పత్రం, ఇది ఒక కుటుంబం లేదా వ్యక్తి యొక్క వార్షిక ఆదాయాన్ని ధృవీకరిస్తుంది."
    },
    documents: {
      en: ["Aadhaar Card (applicant and family members)", "Ration Card", "Address Proof (Electricity bill / Voter ID)", "Salary Certificate or Income Proof", "Recent Passport-size Photograph", "Mobile number linked to Aadhaar"],
      hi: ["आधार कार्ड (आवेदक और परिवार के सदस्य)", "राशन कार्ड", "पता प्रमाण (बिजली बिल / मतदाता पहचान पत्र)", "सैलरी सर्टिफिकेट या आय प्रमाण", "पासपोर्ट साइज फोटो", "आधार से जुड़ा मोबाइल नंबर"],
      te: ["ఆధార్ కార్డు (దరఖాస్తుదారు మరియు కుటుంబ సభ్యులు)", "రేషన్ కార్డు", "చిరునామా రుజువు (విద్యుత్ బిల్లు / వోటర్ ID)", "జీతం సర్టిఫికేట్ లేదా ఆదాయ రుజువు", "ఇటీవలి పాస్‌పోర్ట్ సైజ్ ఫోటో", "ఆధార్‌కు లింక్ అయిన మొబైల్ నంబర్"]
    },
    eligibility: {
      en: ["Resident of Telangana", "Income below the threshold for the purpose applied (e.g., below ₹2 lakh/year for OBC, below ₹8 lakh for EWS)", "Valid Aadhaar and address proof"],
      hi: ["तेलंगाना का निवासी", "आवेदित उद्देश्य के लिए आय सीमा से नीचे (जैसे OBC के लिए ₹2 लाख/वर्ष से कम)", "वैध आधार और पता प्रमाण"],
      te: ["తెలంగాణ నివాసి", "దరఖాస్తు చేసిన ప్రయోజనం కోసం ఆదాయ పరిమితి కంటే తక్కువ (OBCకి ₹2 లక్షలు/సంవత్సరం కంటే తక్కువ)", "చెల్లుబాటు అయ్యే ఆధార్ మరియు చిరునామా రుజువు"]
    },
    steps: {
      en: ["Visit nearest MeeSeva centre or go to meeseva.telangana.gov.in", "Select 'Revenue Department' → 'Income Certificate'", "Fill in applicant details and family income", "Upload scanned copies of required documents", "Pay prescribed fee (approx. ₹35)", "Note the Application Reference Number", "Certificate issued within 7–15 working days after verification by Tahsildar"],
      hi: ["नजदीकी MeeSeva केंद्र जाएं या meeseva.telangana.gov.in पर जाएं", "'Revenue Department' → 'Income Certificate' चुनें", "आवेदक विवरण और पारिवारिक आय भरें", "आवश्यक दस्तावेज़ों की स्कैन की गई प्रतियां अपलोड करें", "निर्धारित शुल्क दें (लगभग ₹35)", "आवेदन संदर्भ संख्या नोट करें", "तहसीलदार द्वारा सत्यापन के बाद 7–15 कार्य दिवसों में प्रमाण पत्र जारी होगा"],
      te: ["సమీప మీసేవ కేంద్రానికి వెళ్లండి లేదా meeseva.telangana.gov.in కి వెళ్లండి", "'Revenue Department' → 'Income Certificate' ఎంచుకోండి", "దరఖాస్తుదారు వివరాలు మరియు కుటుంబ ఆదాయం నింపండి", "అవసరమైన పత్రాల స్కాన్ చేసిన కాపీలు అప్‌లోడ్ చేయండి", "నిర్ణీత రుసుము చెల్లించండి (సుమారు ₹35)", "అప్లికేషన్ రిఫరెన్స్ నంబర్ నోట్ చేసుకోండి", "తహసీల్దార్ ద్వారా ధృవీకరణ తర్వాత 7–15 పని దినాల్లో సర్టిఫికేట్ జారీ అవుతుంది"]
    },
    mistakes: {
      en: ["Uploading blurry or incomplete documents", "Mismatch between Aadhaar name and application name", "Not linking mobile number to Aadhaar before applying", "Visiting unofficial agents or websites"],
      hi: ["धुंधले या अधूरे दस्तावेज़ अपलोड करना", "आधार नाम और आवेदन नाम में अंतर", "आवेदन से पहले मोबाइल नंबर आधार से न जोड़ना", "अनधिकृत एजेंट या वेबसाइट से संपर्क करना"],
      te: ["మసకగా లేదా అసంపూర్ణ పత్రాలు అప్‌లోడ్ చేయడం", "ఆధార్ పేరు మరియు దరఖాస్తు పేరులో వ్యత్యాసం", "దరఖాస్తు చేయడానికి ముందు మొబైల్ నంబర్‌ను ఆధార్‌కు లింక్ చేయకపోవడం", "అనధికారిక ఏజెంట్లు లేదా వెబ్‌సైట్లను సంప్రదించడం"]
    }
  },
  {
    id: "caste-certificate",
    name: { en: "Caste Certificate", hi: "जाति प्रमाण पत्र", te: "కులం ధృవీకరణ పత్రం" },
    department: { en: "Revenue Department, Telangana", hi: "राजस्व विभाग, तेलंगाना", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ" },
    category: "Certificate",
    where: { en: "MeeSeva / Tahsildar Office", hi: "MeeSeva / तहसीलदार कार्यालय", te: "మీసేవ / తహసీల్దార్ కార్యాలయం" },
    officialSource: "https://meeseva.telangana.gov.in/",
    lastVerified: "2026-07-01",
    processingTime: { en: "15–30 working days", hi: "15–30 कार्य दिवस", te: "15–30 పని దినాలు" },
    status: "active",
    overview: {
      en: "A Caste Certificate is issued by the Revenue Department to certify the caste/community of an individual for availing reservations in education, employment, and government schemes under SC, ST, OBC, or BC categories.",
      hi: "जाति प्रमाण पत्र राजस्व विभाग द्वारा जारी किया जाता है जो SC, ST, OBC या BC श्रेणियों में शिक्षा, रोजगार और सरकारी योजनाओं में आरक्षण के लिए जाति/समुदाय को प्रमाणित करता है।",
      te: "కులం ధృవీకరణ పత్రం రెవెన్యూ డిపార్ట్‌మెంట్ ద్వారా జారీ చేయబడుతుంది, ఇది SC, ST, OBC లేదా BC వర్గాల కింద విద్య, ఉద్యోగం మరియు ప్రభుత్వ పథకాలలో రిజర్వేషన్‌లు పొందడానికి వ్యక్తి యొక్క కులం/సమాజాన్ని ధృవీకరిస్తుంది."
    },
    documents: {
      en: ["Aadhaar Card", "Ration Card", "School Transfer Certificate / SSC Certificate", "Father's or ancestor's caste certificate (if available)", "Address Proof", "Birth Certificate"],
      hi: ["आधार कार्ड", "राशन कार्ड", "स्कूल ट्रांसफर सर्टिफिकेट / SSC सर्टिफिकेट", "पिता या पूर्वज का जाति प्रमाण पत्र (यदि उपलब्ध हो)", "पता प्रमाण", "जन्म प्रमाण पत्र"],
      te: ["ఆధార్ కార్డు", "రేషన్ కార్డు", "స్కూల్ ట్రాన్స్‌ఫర్ సర్టిఫికేట్ / SSC సర్టిఫికేట్", "తండ్రి లేదా పూర్వీకుల కులం సర్టిఫికేట్ (అందుబాటులో ఉంటే)", "చిరునామా రుజువు", "జనన ధృవీకరణ పత్రం"]
    },
    eligibility: {
      en: ["Resident of Telangana", "Must belong to a recognized SC/ST/BC/OBC community as per Telangana government schedule", "Domicile proof in Telangana"],
      hi: ["तेलंगाना का निवासी", "तेलंगाना सरकार की अनुसूची के अनुसार मान्यता प्राप्त SC/ST/BC/OBC समुदाय से संबंधित होना चाहिए", "तेलंगाना में अधिवास प्रमाण"],
      te: ["తెలంగాణ నివాసి", "తెలంగాణ ప్రభుత్వ షెడ్యూల్ ప్రకారం గుర్తింపు పొందిన SC/ST/BC/OBC సమాజానికి చెందినవారై ఉండాలి", "తెలంగాణలో డోమిసైల్ రుజువు"]
    },
    steps: {
      en: ["Visit MeeSeva centre or meeseva.telangana.gov.in", "Select 'Revenue' → 'Caste Certificate'", "Fill in personal and family details", "Upload all required documents", "Pay the prescribed fee (approx. ₹35–₹45)", "Application forwarded to Tahsildar for field verification", "Certificate issued after verification (15–30 working days)"],
      hi: ["MeeSeva केंद्र जाएं या meeseva.telangana.gov.in पर जाएं", "'Revenue' → 'Caste Certificate' चुनें", "व्यक्तिगत और पारिवारिक विवरण भरें", "सभी आवश्यक दस्तावेज़ अपलोड करें", "निर्धारित शुल्क दें (लगभग ₹35–₹45)", "क्षेत्र सत्यापन के लिए आवेदन तहसीलदार को भेजा जाएगा", "सत्यापन के बाद प्रमाण पत्र जारी होगा (15–30 कार्य दिवस)"],
      te: ["మీసేవ కేంద్రానికి వెళ్లండి లేదా meeseva.telangana.gov.in కి వెళ్లండి", "'Revenue' → 'Caste Certificate' ఎంచుకోండి", "వ్యక్తిగత మరియు కుటుంబ వివరాలు నింపండి", "అన్ని అవసరమైన పత్రాలు అప్‌లోడ్ చేయండి", "నిర్ణీత రుసుము చెల్లించండి (సుమారు ₹35–₹45)", "ఫీల్డ్ వెరిఫికేషన్ కోసం అప్లికేషన్ తహసీల్దార్‌కు పంపబడుతుంది", "ధృవీకరణ తర్వాత సర్టిఫికేట్ జారీ అవుతుంది (15–30 పని దినాలు)"]
    },
    mistakes: {
      en: ["Not providing ancestral caste proof", "Name mismatch across documents", "Applying in wrong caste category", "Missing school records"],
      hi: ["पूर्वज जाति प्रमाण न देना", "दस्तावेज़ों में नाम में अंतर", "गलत जाति श्रेणी में आवेदन करना", "स्कूल रिकॉर्ड का अभाव"],
      te: ["పూర్వీకుల కులం రుజువు అందించకపోవడం", "పత్రాల మధ్య పేరులో వ్యత్యాసం", "తప్పు కులం వర్గంలో దరఖాస్తు చేయడం", "పాఠశాల రికార్డులు లేకపోవడం"]
    }
  },
  {
    id: "residence-certificate",
    name: { en: "Residence Certificate", hi: "निवास प्रमाण पत्र", te: "నివాస ధృవీకరణ పత్రం" },
    department: { en: "Revenue Department, Telangana", hi: "राजस्व विभाग, तेलंगाना", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ" },
    category: "Certificate",
    where: { en: "MeeSeva / Tahsildar Office", hi: "MeeSeva / तहसीलदार कार्यालय", te: "మీసేవ / తహసీల్దార్ కార్యాలయం" },
    officialSource: "https://meeseva.telangana.gov.in/",
    lastVerified: "2026-07-01",
    processingTime: { en: "7–10 working days", hi: "7–10 कार्य दिवस", te: "7–10 పని దినాలు" },
    status: "active",
    overview: {
      en: "A Residence Certificate (Domicile Certificate) confirms that the applicant is a permanent resident of a specific location in Telangana. It is required for educational admissions, employment, and government scheme benefits.",
      hi: "निवास प्रमाण पत्र (डोमिसाइल सर्टिफिकेट) पुष्टि करता है कि आवेदक तेलंगाना में एक विशिष्ट स्थान का स्थायी निवासी है।",
      te: "నివాస ధృవీకరణ పత్రం (డోమిసైల్ సర్టిఫికేట్) దరఖాస్తుదారు తెలంగాణలో నిర్దిష్ట స్థానంలో శాశ్వత నివాసి అని ధృవీకరిస్తుంది."
    },
    documents: {
      en: ["Aadhaar Card", "Ration Card", "Voter ID Card", "Electricity/Water/Telephone Bill (address proof)", "Property Tax Receipt (if applicable)", "Passport-size Photograph"],
      hi: ["आधार कार्ड", "राशन कार्ड", "मतदाता पहचान पत्र", "बिजली/पानी/टेलीफोन बिल (पता प्रमाण)", "संपत्ति कर रसीद (यदि लागू हो)", "पासपोर्ट साइज फोटो"],
      te: ["ఆధార్ కార్డు", "రేషన్ కార్డు", "వోటర్ ID కార్డు", "విద్యుత్/నీరు/టెలిఫోన్ బిల్లు (చిరునామా రుజువు)", "ఆస్తి పన్ను రసీదు (వర్తించినచో)", "పాస్‌పోర్ట్ సైజ్ ఫోటో"]
    },
    eligibility: {
      en: ["Must be residing in Telangana for at least 10 years", "Should have permanent address proof in Telangana", "Valid Aadhaar card with current address"],
      hi: ["कम से कम 10 वर्षों से तेलंगाना में रहना चाहिए", "तेलंगाना में स्थायी पता प्रमाण होना चाहिए", "वर्तमान पते के साथ वैध आधार कार्ड"],
      te: ["కనీసం 10 సంవత్సరాలు తెలంగాణలో నివసిస్తున్నారై ఉండాలి", "తెలంగాణలో శాశ్వత చిరునామా రుజువు ఉండాలి", "ప్రస్తుత చిరునామాతో చెల్లుబాటు అయ్యే ఆధార్ కార్డు"]
    },
    steps: {
      en: ["Visit MeeSeva centre or meeseva.telangana.gov.in", "Select 'Revenue' → 'Residence/Domicile Certificate'", "Enter personal and address details", "Upload required documents", "Pay fee (approx. ₹35)", "Tahsildar verifies residence through records or field visit", "Certificate issued within 7–10 working days"],
      hi: ["MeeSeva केंद्र जाएं या meeseva.telangana.gov.in पर जाएं", "'Revenue' → 'Residence/Domicile Certificate' चुनें", "व्यक्तिगत और पता विवरण दर्ज करें", "आवश्यक दस्तावेज़ अपलोड करें", "शुल्क दें (लगभग ₹35)", "तहसीलदार रिकॉर्ड या फील्ड विजिट से निवास सत्यापित करेगा", "7–10 कार्य दिवसों में प्रमाण पत्र जारी होगा"],
      te: ["మీసేవ కేంద్రానికి వెళ్లండి లేదా meeseva.telangana.gov.in కి వెళ్లండి", "'Revenue' → 'Residence/Domicile Certificate' ఎంచుకోండి", "వ్యక్తిగత మరియు చిరునామా వివరాలు నమోదు చేయండి", "అవసరమైన పత్రాలు అప్‌లోడ్ చేయండి", "రుసుము చెల్లించండి (సుమారు ₹35)", "తహసీల్దార్ రికార్డులు లేదా ఫీల్డ్ విజిట్ ద్వారా నివాసాన్ని ధృవీకరిస్తారు", "7–10 పని దినాల్లో సర్టిఫికేట్ జారీ అవుతుంది"]
    },
    mistakes: {
      en: ["Address on Aadhaar not matching application address", "Missing utility bill proof", "Applying from a rented address without proper tenancy proof", "Incomplete form submission"],
      hi: ["आधार पर पता और आवेदन पते में अंतर", "यूटिलिटी बिल प्रमाण का अभाव", "उचित किरायेदारी प्रमाण के बिना किराए के पते से आवेदन करना", "अधूरा फॉर्म जमा करना"],
      te: ["ఆధార్‌పై చిరునామా మరియు దరఖాస్తు చిరునామా సరిపడకపోవడం", "యుటిలిటీ బిల్లు రుజువు లేకపోవడం", "సరైన అద్దె రుజువు లేకుండా అద్దె చిరునామా నుండి దరఖాస్తు చేయడం", "అసంపూర్ణ ఫారం సమర్పణ"]
    }
  },
  {
    id: "birth-certificate",
    name: { en: "Birth Certificate", hi: "जन्म प्रमाण पत्र", te: "జనన ధృవీకరణ పత్రం" },
    department: { en: "Municipal Administration / GHMC / Gram Panchayat", hi: "नगर प्रशासन / GHMC / ग्राम पंचायत", te: "మునిసిపల్ అడ్మినిస్ట్రేషన్ / GHMC / గ్రామ పంచాయతీ" },
    category: "Certificate",
    where: { en: "GHMC / Municipality / MeeSeva", hi: "GHMC / नगरपालिका / MeeSeva", te: "GHMC / మునిసిపాలిటీ / మీసేవ" },
    officialSource: "https://cdma.telangana.gov.in",
    lastVerified: "2026-07-01",
    processingTime: { en: "3–7 working days (if birth registered); up to 30 days for delayed registration", hi: "3–7 कार्य दिवस (यदि जन्म पंजीकृत है); विलंबित पंजीकरण के लिए 30 दिन तक", te: "3–7 పని దినాలు (జనన నమోదు అయినట్లయితే); ఆలస్య నమోదుకు 30 రోజుల వరకు" },
    status: "active",
    overview: {
      en: "A Birth Certificate is issued by the municipal authority or gram panchayat to record the birth of a child. It is a primary identity document required for school admission, passport, Aadhaar, and other government services.",
      hi: "जन्म प्रमाण पत्र नगर प्राधिकरण या ग्राम पंचायत द्वारा बच्चे के जन्म को दर्ज करने के लिए जारी किया जाता है।",
      te: "జనన ధృవీకరణ పత్రం పురపాలక సంస్థ లేదా గ్రామ పంచాయతీ ద్వారా పిల్లల జననాన్ని నమోదు చేయడానికి జారీ చేయబడుతుంది."
    },
    documents: {
      en: ["Hospital Discharge Summary / Certificate of Birth from hospital", "Parents' Aadhaar Cards", "Parents' Marriage Certificate", "Address Proof of parents", "Ration Card"],
      hi: ["अस्पताल डिस्चार्ज सारांश / अस्पताल से जन्म प्रमाण पत्र", "माता-पिता के आधार कार्ड", "माता-पिता का विवाह प्रमाण पत्र", "माता-पिता का पता प्रमाण", "राशन कार्ड"],
      te: ["ఆస్పత్రి డిశ్చార్జ్ సారాంశం / ఆస్పత్రి నుండి జనన సర్టిఫికేట్", "తల్లిదండ్రుల ఆధార్ కార్డులు", "తల్లిదండ్రుల వివాహ సర్టిఫికేట్", "తల్లిదండ్రుల చిరునామా రుజువు", "రేషన్ కార్డు"]
    },
    eligibility: {
      en: ["Birth must have occurred in Telangana", "Registration should be done within 21 days of birth (free); after that late fees apply", "Delayed registration (after 1 year) requires Judicial Magistrate order"],
      hi: ["जन्म तेलंगाना में होना चाहिए", "जन्म के 21 दिनों के भीतर पंजीकरण (नि:शुल्क); उसके बाद विलंब शुल्क लागू होगा", "विलंबित पंजीकरण (1 वर्ष के बाद) के लिए न्यायिक मजिस्ट्रेट का आदेश आवश्यक है"],
      te: ["జన్మ తెలంగాణలో జరిగి ఉండాలి", "జన్మించిన 21 రోజులలో నమోదు (ఉచితం); తర్వాత ఆలస్య రుసుముు వర్తిస్తుంది", "ఆలస్య నమోదు (1 సంవత్సరం తర్వాత)కు న్యాయ మేజిస్ట్రేట్ ఆదేశం అవసరం"]
    },
    steps: {
      en: ["Contact GHMC / Municipal Office / Gram Panchayat with jurisdiction", "Submit hospital birth record and parents' documents", "Fill the prescribed birth registration form", "Pay applicable fee", "Receive acknowledgment slip", "Collect birth certificate within 3–7 working days"],
      hi: ["GHMC / नगरपालिका कार्यालय / ग्राम पंचायत से संपर्क करें", "अस्पताल जन्म रिकॉर्ड और माता-पिता के दस्तावेज़ जमा करें", "निर्धारित जन्म पंजीकरण फॉर्म भरें", "लागू शुल्क दें", "पावती पर्ची लें", "3–7 कार्य दिवसों में जन्म प्रमाण पत्र प्राप्त करें"],
      te: ["అధికారపరిధిలో GHMC / మునిసిపల్ కార్యాలయం / గ్రామ పంచాయతీని సంప్రదించండి", "ఆస్పత్రి జనన రికార్డు మరియు తల్లిదండ్రుల పత్రాలు సమర్పించండి", "నిర్ణీత జనన నమోదు ఫారం నింపండి", "వర్తించే రుసుముు చెల్లించండి", "అక్నాలెడ్జ్‌మెంట్ స్లిప్ తీసుకోండి", "3–7 పని దినాల్లో జనన ధృవీకరణ పత్రం సేకరించండి"]
    },
    mistakes: {
      en: ["Delaying registration beyond 21 days", "Not getting birth certificate from hospital before discharge", "Name mismatch in parents' documents", "Approaching agents instead of municipal office"],
      hi: ["21 दिनों के बाद पंजीकरण में देरी करना", "अस्पताल छोड़ने से पहले जन्म प्रमाण पत्र न लेना", "माता-पिता के दस्तावेज़ों में नाम में अंतर", "नगरपालिका कार्यालय की बजाय एजेंटों से संपर्क करना"],
      te: ["21 రోజుల తర్వాత నమోదు వాయిదా వేయడం", "డిశ్చార్జ్ కంటే ముందు ఆస్పత్రి నుండి జనన సర్టిఫికేట్ తీసుకోకపోవడం", "తల్లిదండ్రుల పత్రాలలో పేరులో వ్యత్యాసం", "మునిసిపల్ కార్యాలయానికి బదులుగా ఏజెంట్లను సంప్రదించడం"]
    }
  },
  { id: "death-certificate", name: { en: "Death Certificate", hi: "मृत्यु प्रमाण पत्र", te: "మరణ ధృవీకరణ పత్రం" }, department: { en: "Municipal Administration / GHMC", hi: "नगर प्रशासन / GHMC", te: "మునిసిపల్ అడ్మినిస్ట్రేషన్ / GHMC" }, category: "Certificate", where: { en: "GHMC / Municipality / MeeSeva", hi: "GHMC / नगरपालिका / MeeSeva", te: "GHMC / మునిసిపాలిటీ / మీసేవ" }, officialSource: "https://cdma.telangana.gov.in", lastVerified: "2026-07-01", processingTime: { en: "3–7 working days", hi: "3–7 कार्य दिवस", te: "3–7 పని దినాలు" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } },
  { id: "ration-card", name: { en: "Ration Card", hi: "राशन कार्ड", te: "రేషన్ కార్డు" }, department: { en: "Civil Supplies Department, Telangana", hi: "नागरिक आपूर्ति विभाग, तेलंगाना", te: "సివిల్ సప్లైస్ డిపార్ట్‌మెంట్, తెలంగాణ" }, category: "Scheme", where: { en: "Civil Supplies / MeeSeva", hi: "नागरिक आपूर्ति / MeeSeva", te: "సివిల్ సప్లైస్ / మీసేవ" }, officialSource: "https://tgfood.gov.in", lastVerified: "2026-07-01", processingTime: { en: "30–45 days", hi: "30–45 दिन", te: "30–45 రోజులు" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } },
  { id: "aadhaar-update", name: { en: "Aadhaar Update", hi: "आधार अपडेट", te: "ఆధార్ అప్‌డేట్" }, department: { en: "UIDAI", hi: "UIDAI", te: "UIDAI" }, category: "Identity", where: { en: "Aadhaar Seva Kendra / UIDAI Portal", hi: "आधार सेवा केंद्र / UIDAI पोर्टल", te: "ఆధార్ సేవా కేంద్రం / UIDAI పోర్టల్" }, officialSource: "https://uidai.gov.in", lastVerified: "2026-07-01", processingTime: { en: "7–10 working days", hi: "7–10 कार्य दिवस", te: "7–10 పని దినాలు" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } },
  { id: "driving-licence", name: { en: "Driving Licence", hi: "ड्राइविंग लाइसेंस", te: "డ్రైవింగ్ లైసెన్స్" }, department: { en: "Transport Department, Telangana", hi: "परिवहन विभाग, तेलंगाना", te: "ట్రాన్స్‌పోర్ట్ డిపార్ట్‌మెంట్, తెలంగాణ" }, category: "Transport", where: { en: "RTO / Sarathi Portal", hi: "RTO / सारथी पोर्टल", te: "RTO / సారథి పోర్టల్" }, officialSource: "https://sarathi.parivahan.gov.in", lastVerified: "2026-07-01", processingTime: { en: "15–30 days", hi: "15–30 दिन", te: "15–30 రోజులు" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } },
  { id: "voter-id", name: { en: "Voter ID", hi: "मतदाता पहचान पत्र", te: "వోటర్ ID" }, department: { en: "Election Commission of India", hi: "भारत निर्वाचन आयोग", te: "భారత ఎన్నికల సంఘం" }, category: "Identity", where: { en: "Electoral Registration Officer / Voter Helpline", hi: "मतदाता पंजीकरण अधिकारी / वोटर हेल्पलाइन", te: "ఎన్నికల నమోదు అధికారి / వోటర్ హెల్ప్‌లైన్" }, officialSource: "https://voters.eci.gov.in", lastVerified: "2026-07-01", processingTime: { en: "15–30 days", hi: "15–30 दिन", te: "15–30 రోజులు" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } },
  { id: "ts-schemes", name: { en: "Telangana Govt. Schemes", hi: "तेलंगाना सरकारी योजनाएं", te: "తెలంగాణ ప్రభుత్వ పథకాలు" }, department: { en: "Various Departments, Govt. of Telangana", hi: "विभिन्न विभाग, तेलंगाना सरकार", te: "వివిధ విభాగాలు, తెలంగాణ ప్రభుత్వం" }, category: "Scheme", where: { en: "Respective Dept. Portal / MeeSeva", hi: "संबंधित विभाग पोर्टल / MeeSeva", te: "సంబంధిత విభాగ పోర్టల్ / మీసేవ" }, officialSource: "https://telangana.gov.in", lastVerified: "2026-07-01", processingTime: { en: "Varies by scheme", hi: "योजना अनुसार", te: "పథకం ప్రకారం మారుతుంది" }, status: "coming-soon", overview: { en: "Coming soon.", hi: "जल्द आ रहा है।", te: "త్వరలో వస్తుంది." }, documents: { en: [], hi: [], te: [] }, eligibility: { en: [], hi: [], te: [] }, steps: { en: [], hi: [], te: [] }, mistakes: { en: [], hi: [], te: [] } }
];

export function getService(id) {
  return services.find(s => s.id === id) || services[0];
}

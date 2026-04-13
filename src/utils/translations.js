const translations = {
  mr: {
    printSchedule: "प्रिंट वेळापत्रक",
    printQuotation: "कोटेशन प्रिंट",
    farmerDetails: "👨‍🌾 शेतकरी माहिती",
    date: "दिनांक",

    header: (crop, acres) => `${crop} साठी ${acres} एकर क्षेत्रासाठी पर्णनेत्र आयुर्वेदीक कृषि शेड्यूल`,

    farmer: {
      name: "शेतकरी नाव",
      number: "मोबाईल नंबर",
      email: "ईमेल",
      place: "गाव",
      tahsil: "तालुका",
      district: "जिल्हा",
      state: "राज्य",
    },

    table: {
      week: "सप्ताह",
      date: "तारीख/उपयोग दिन",
      products: "उत्पाद",
      perLitre: "प्रति लीटर पानी मे मिली",
      waterPerAcre: "पानी प्रती एकड़",
      totalWater: "पानी कुल एकड़",
      productQty: "उत्पाद व मात्रा",
      instruction: "निर्देश",
    },
  },

  en: {
    printSchedule: "Print Schedule",
    printQuotation: "📄 Print Quotation",
    farmerDetails: "👨‍🌾 Farmer Details",
    date: "Date",

    header: (crop, acres) => `${crop} schedule for ${acres} acre plot (Parnanetra Ayurvedic Agro System)`,

    farmer: {
      name: "Name",
      number: "Number",
      email: "Email",
      place: "Place",
      tahsil: "Tahsil",
      district: "District",
      state: "State",
    },

    table: {
      week: "Week",
      date: "Date / Usage Day",
      products: "Products",
      perLitre: "Per Litre Mix",
      waterPerAcre: "Water per Acre",
      totalWater: "Total Water",
      productQty: "Product & Quantity",
      instruction: "Instructions",
    },
  },

  hi: {
    printSchedule: "प्रिंट शेड्यूल",
    printQuotation: "📄 कोटेशन प्रिंट",
    farmerDetails: "👨‍🌾 किसान जानकारी",
    date: "दिनांक",

    header: (crop, acres) => `${crop} का ${acres} एकड़ का प्लॉट और पर्णनेत्र आयुर्वेदीक कृषि प्रणाली का शेड्यूल`,

    farmer: {
      name: "किसान नाम",
      number: "मोबाइल नंबर",
      email: "ईमेल",
      place: "गांव",
      tahsil: "तहसील",
      district: "जिला",
      state: "राज्य",
    },

    table: {
      week: "सप्ताह",
      date: "तारीख/उपयोग दिन",
      products: "उत्पाद",
      perLitre: "प्रति लीटर पानी में मिलाएं",
      waterPerAcre: "पानी प्रति एकड़",
      totalWater: "कुल पानी",
      productQty: "उत्पाद व मात्रा",
      instruction: "निर्देश",
    },
  },

  gu: {
    printSchedule: "પ્રિન્ટ શેડ્યૂલ",
    printQuotation: "📄 કોટેશન પ્રિન્ટ",
    farmerDetails: "👨‍🌾 ખેડૂત માહિતી",
    date: "તારીખ",

    header: (crop, acres) => `${crop} માટે ${acres} એકર પ્લોટ અને પર્ણનેત્ર આયુર્વેદિક કૃષિ શેડ્યૂલ`,

    farmer: {
      name: "ખેડૂત નામ",
      number: "મોબાઈલ નંબર",
      email: "ઈમેલ",
      place: "ગામ",
      tahsil: "તાલુકો",
      district: "જિલ્લો",
      state: "રાજ્ય",
    },

    table: {
      week: "અઠવાડિયું",
      date: "તારીખ / ઉપયોગ દિવસ",
      products: "ઉત્પાદનો",
      perLitre: "પ્રતિ લીટર મિશ્રણ",
      waterPerAcre: "પાણી પ્રતિ એકર",
      totalWater: "કુલ પાણી",
      productQty: "ઉત્પાદન અને માત્રા",
      instruction: "સૂચનાઓ",
    },
  },
};

export default translations;

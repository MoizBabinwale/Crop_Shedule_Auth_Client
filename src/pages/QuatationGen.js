import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuotationBill, getQuotationById, removeCalendarSync } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import translations from "../utils/translations";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.jpg";
import { BACKEND_BASE_URL } from "../config/baseURL";

const QuatationGen = () => {
  const { quatationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem("quotationLanguage") || "mr"); // "mr" | "en"
  const t = translations[language] || translations.mr;

  const [removingCalendar, setRemovingCalendar] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("quotationLanguage", language);
  }, [language]);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const data = await getQuotationById(quatationId);
        setQuotation(data);
      } catch (error) {
        console.error("Error fetching quotation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (quatationId) fetchQuotation();
  }, [quatationId]);

  if (loading)
    return (
      <p className="p-6 text-lg">
        <Loading />
      </p>
    );
  if (!quotation) return <p className="p-6 text-red-600">❌ Quotation नहीं मिला</p>;

  const handleGenerateBill = async (quotation) => {
    try {
      const res = await createQuotationBill(quotation._id, quotation.acres);
      navigate(`/quotationBill/view/${res.bill._id}`);
    } catch (error) {
      toast.error("बिल तयार करण्यात अडचण आली");
      console.error(error);
    }
  };

  // Utility to replace numbers in the instructions HTML
  // eslint-disable-next-line no-unused-vars
  function updateInstructionValues(html, week) {
    return html.replace(/\b\d+(\.\d+)?\b/g, (match) => {
      if (match === String(week.waterPerAcre)) {
        // convert to string for safe comparison
        const num = parseFloat(match);
        if (!isNaN(num)) {
          return (num * quotation.acres).toFixed(0); // or toFixed(1/2) if decimals needed
        }
      }

      // ✅ return original if no match
      return match;
    });
  }

  const detectEnglishExtraInstruction = (mrInstruction = "") => {
    const text = mrInstruction.toLowerCase();

    if (text.includes("ड्रेंचिंग") || text.includes("drenching")) {
      return "Apply the mixture through drip irrigation or by drenching.";
    }

    if (text.includes("स्प्रे") || text.includes("spray") || text.includes("ड्रिप") || text.includes("drip")) {
      return "Apply this mixture by spraying or through drip irrigation system.";
    }

    return "Apply the prepared mixture as per recommended method.";
  };

  const parseQtyString = (qtyStr = "") => {
    let ml = null;
    let l = null;

    const mlMatch = qtyStr.match(/([\d.]+)\s*ml/i);
    if (mlMatch) ml = parseFloat(mlMatch[1]);

    const lMatch = qtyStr.match(/([\d.]+)\s*(ltr|liter|लीटर)/i);
    if (lMatch) l = parseFloat(lMatch[1]);

    return { ml, l };
  };

  const formatWaterAmount = (value) => parseFloat(Number(value).toFixed(2));

  const buildEnglishInstruction = (week) => {
    const products = Object.values(week.products || {}).filter((p) => p.categoryKey !== "leaf_smoke");

    const productText = products
      .map((p) => {
        const { ml, l } = parseQtyString(p.quantity);
        if (l) return `${p.name} ${l} liter`;
        if (ml) return `${p.name} ${ml} ml`;
        return p.name;
      })
      .join(" and ");

    const water = week.waterPerAcre * week.totalAcres < 0.5 ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml` : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} liter`;

    const extraLine = detectEnglishExtraInstruction(week.instructions);

    return {
      prefix: "Mix ",
      highlighted: `${productText} with ${water}`,
      suffix: ` of water to prepare the solution. Prepare the mixture by mixing with water. ${extraLine}`,
      totalWater: week.totalWater ? `— Total ${formatWaterAmount(week.totalWater)} liter water required` : null,
    };
  };

  const buildHindiInstruction = (week) => {
    const products = Object.values(week.products || {}).filter((p) => p.category !== "खेत पर पत्तों से धुवा");

    const productText = products
      .map((p) => {
        const { ml, l } = parseQtyString(p.quantity);
        if (l) return `${p.name} ${l} लीटर`;
        if (ml) return `${p.name} ${ml} ml`;
        return p.name;
      })
      .join(" और ");

    const water = week.waterPerAcre * week.totalAcres < 0.5 ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml` : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} लीटर`;

    // Detect the extra instruction in Hindi
    const extraLine = detectHindiExtraInstruction(week.instructions);

    return {
      prefix: "",
      highlighted: `${productText} ${water}`,
      // Use the extraLine instead of week.instructions
      suffix: ` पानी में मिलाकर घोल तैयार करें। ${extraLine}`,
      totalWater: week.totalWater ? `— कुल ${formatWaterAmount(week.totalWater)} लीटर पानी लगेगा` : null,
    };
  };

  const buildGujaratiInstruction = (week) => {
    const products = Object.values(week.products || {}).filter((p) => p.category !== "खेत पर पत्तों से धुवा");

    const productText = products
      .map((p) => {
        const { ml, l } = parseQtyString(p.quantity);
        if (l) return `${p.name} ${l} લીટર`;
        if (ml) return `${p.name} ${ml} ml`;
        return p.name;
      })
      .join(" અને ");

    const water = week.waterPerAcre * week.totalAcres < 0.5 ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml` : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} લીટર`;

    // Detect the extra instruction in Gujarati
    const extraLine = detectGujaratiExtraInstruction(week.instructions);

    return {
      prefix: "",
      highlighted: `${productText} ${water}`,
      // Use the extraLine instead of week.instructions
      suffix: ` પાણીમાં મિક્સ કરીને દ્રાવણ તૈયાર કરો. ${extraLine}`,
      totalWater: week.totalWater ? `— કુલ ${formatWaterAmount(week.totalWater)} લીટર પાણી લાગશે` : null,
    };
  };

  const buildPunjabiInstruction = (week) => {
    const products = Object.values(week.products || {}).filter((p) => p.categoryKey !== "leaf_smoke");

    const productText = products
      .map((p) => {
        const { ml, l } = parseQtyString(p.quantity);
        if (l) return `${p.name} ${l} ਲੀਟਰ`;
        if (ml) return `${p.name} ${ml} ml`;
        return p.name;
      })
      .join(" ਅਤੇ ");

    const water = week.waterPerAcre * week.totalAcres < 0.5 ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml` : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} ਲੀਟਰ`;
    const extraLine = detectPunjabiExtraInstruction(week.instructions);

    return {
      prefix: "",
      highlighted: `${productText} ${water}`,
      suffix: ` ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਘੋਲ ਤਿਆਰ ਕਰੋ। ${extraLine}`,
      totalWater: week.totalWater ? `— ਕੁੱਲ ${formatWaterAmount(week.totalWater)} ਲੀਟਰ ਪਾਣੀ ਲੱਗੇਗਾ` : null,
    };
  };

  const buildInstructionByLanguage = (week, language) => {
    if (language === "en") return buildEnglishInstruction(week);
    if (language === "hi") return buildHindiInstruction(week);
    if (language === "gu") return buildGujaratiInstruction(week);
    if (language === "pa") return buildPunjabiInstruction(week);
    return buildMarathiInstruction(week); // default
  };

  const formatUseStartDay = (useStartDay = "", language) => {
    if (!useStartDay) return "";

    const dayNumber = useStartDay.match(/\d+/)?.[0];
    const isStartDay = !dayNumber;

    const labels = {
      mr: {
        start: "आरंभ दिवस",
        day: (day) => `${day} वा दिवस`,
      },
      en: {
        start: "Start day",
        day: (day) => `Day ${day}`,
      },
      hi: {
        start: "आरंभ दिवस",
        day: (day) => `${day}वां दिन`,
      },
      gu: {
        start: "શરૂઆતનો દિવસ",
        day: (day) => `${day}મો દિવસ`,
      },
      pa: {
        start: "ਸ਼ੁਰੂਆਤੀ ਦਿਨ",
        day: (day) => `${day}ਵਾਂ ਦਿਨ`,
      },
    };

    const selectedLabels = labels[language] || labels.mr;
    return isStartDay ? selectedLabels.start : selectedLabels.day(dayNumber);
  };

  const buildMarathiInstruction = (week) => {
    const products = Object.values(week.products || {}).filter((p) => p.category !== "खेत पर पत्तों से धुवा");

    const productText = products
      .map((p) => {
        const { ml, l } = parseQtyString(p.quantity);
        if (l) return `${p.name} ${l} लीटर`;
        if (ml) return `${p.name} ${ml} ml`;
        return p.name;
      })
      .join(" आणि ");

    const water = week.waterPerAcre * week.totalAcres < 0.5 ? `${(week.waterPerAcre * week.totalAcres * 1000).toFixed(0)} ml` : `${(week.waterPerAcre * week.totalAcres).toFixed(2)} लीटर`;

    // Detect the extra instruction in Marathi
    const extraLine = detectMarathiExtraInstruction(week.instructions);

    return {
      prefix: "",
      highlighted: `${productText} ${water}`,
      // Use the extraLine instead of week.instructions
      suffix: ` पाणी मध्ये मिसळून द्रावण तयार करावे. ${extraLine}`,
      totalWater: week.totalWater ? `— एकूण ${formatWaterAmount(week.totalWater)} लीटर पाणी लागेल` : null,
    };
  };

  const detectMarathiExtraInstruction = (instruction = "") => {
    const text = instruction.toLowerCase();

    if (text.includes("ड्रेंचिंग") || text.includes("drenching")) {
      return "हे द्रावण ठिबक सिंचन किंवा आळवणी (drenching) द्वारे द्यावे.";
    }

    if (text.includes("स्प्रे") || text.includes("spray") || text.includes("ड्रिप") || text.includes("drip")) {
      return "हे द्रावण फवारणी (spray) किंवा ठिबक द्वारे द्यावे.";
    }

    return "तयार केलेले द्रावण शिफारस केलेल्या पद्धतीनुसार द्यावे.";
  };

  const detectGujaratiExtraInstruction = (instruction = "") => {
    const text = instruction.toLowerCase();

    if (text.includes("ड्रेंचिंग") || text.includes("drenching")) {
      return "આ મિશ્રણ ડ્રિપ સિંચાઈ અથવા ડ્રેન્ચિંગ દ્વારા આપવું.";
    }

    if (text.includes("स्प्रे") || text.includes("spray") || text.includes("ड्रिप") || text.includes("drip")) {
      return "આ મિશ્રણ છંટકાવ (spray) અથવા ડ્રિપ દ્વારા આપવું.";
    }

    return "તૈયાર કરેલ મિશ્રણ ભલામણ કરેલ પદ્ધતિ મુજબ આપવું.";
  };

  const detectHindiExtraInstruction = (instruction = "") => {
    const text = instruction.toLowerCase();

    if (text.includes("ड्रेंचिंग") || text.includes("drenching")) {
      return "पानी में मिलाकर ड्रिप या ड्रेंचिंग के माध्यम से देना है।";
    }

    if (text.includes("स्प्रे") || text.includes("spray") || text.includes("ड्रिप") || text.includes("drip")) {
      return "पानी में मिलाकर स्प्रे या ड्रिप के माध्यम से देना है।";
    }

    return "तैयार मिश्रण को अनुशंसित विधि के अनुसार दें।";
  };

  const detectPunjabiExtraInstruction = (instruction = "") => {
    const text = instruction.toLowerCase();

    if (text.includes("drenching")) {
      return "ਇਹ ਘੋਲ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਜਾਂ ਡ੍ਰੈਂਚਿੰਗ ਰਾਹੀਂ ਦਿਓ।";
    }

    if (text.includes("spray") || text.includes("drip")) {
      return "ਇਹ ਘੋਲ ਸਪਰੇ ਜਾਂ ਡ੍ਰਿਪ ਰਾਹੀਂ ਦਿਓ।";
    }

    return "ਤਿਆਰ ਕੀਤਾ ਘੋਲ ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਵਿਧੀ ਅਨੁਸਾਰ ਦਿਓ।";
  };

  const handleRemoveCalendar = async (quotationId) => {
    try {
      setRemovingCalendar(true);

      await removeCalendarSync(quotationId);

      toast.success("Calendar events removed");

      // refresh quotation data
      window.location.reload();
    } catch (err) {
      console.log(err);

      toast.error("Failed to remove calendar events");
    } finally {
      setRemovingCalendar(false);
    }
  };
  const handleGoogleCalendarConnect = () => {
    if (!auth?.user?._id) {
      toast.error("User data not loaded yet. Please try again.");
      return;
    }
    window.location.href = `${BACKEND_BASE_URL}/auth/google?userId=${auth.user._id}&quotationId=${quotation?._id}&redirect=/schedule/quotation/${quotation?._id}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 print:p-0">
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0.7cm 1cm 0.35cm 1cm; /* top, right, bottom, left */
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-area {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          thead {
            display: table-header-group;
          }
          .week-block tfoot {
            display: none !important;
          }
          .print-footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            display: block !important;
            z-index: 20;
            margin: 0 !important;
            padding: 0 1cm 0.15cm 1cm !important;
            box-sizing: border-box;
          }
          .print-footer p {
            margin: 0 !important;
            line-height: 1.1 !important;
          }
          .print-footer div {
            margin: 0 !important;
          }
          .print-end-line {
            display: block !important;
            text-align: center;
            margin: 0.08cm 0 0.05cm 0 !important;
            line-height: 1.1 !important;
          }
          .print-footer-spacer {
            display: none !important;
          }
        }
      `}</style>
      {/* Button Actions */}
      <div className="flex flex-col sm:flex-row justify-end mb-4 print:hidden gap-3 sm:gap-10">
        {quotation.weeks?.some((week) => week.googleEventId) ? (
          <button
            onClick={() => handleRemoveCalendar(quotation._id)}
            disabled={removingCalendar}
            className={`
    px-4
    py-2
    rounded-lg
    text-white
    transition
    ${removingCalendar ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
  `}
          >
            {removingCalendar ? "Unsyncing..." : "Unsync Calendar"}
          </button>
        ) : (
          <button onClick={handleGoogleCalendarConnect} className="    flex    items-center gap-2    bg-green-600    hover:bg-green-700    text-white    px-4    py-2    rounded-lg    transition">
            📅 Verify Email & Sync Calendar
          </button>
        )}
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm">
          {t.printSchedule}
        </button>
        <button onClick={() => handleGenerateBill(quotation)} className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 text-sm">
          {t.printQuotation}
        </button>
      </div>

      {/* Main Print Area */}
      <div className="print-area bg-white p-4 sm:p-6 rounded shadow-md text-sm border border-gray-300 print:border-0 print:shadow-none print:rounded-none print:page-break-before-auto ">
        {/* Header / Date Row */}
        <div className="flex justify-between items-start print:mt-5">
          <h3 className="text-green-700 font-semibold text-base mb-3  print:text-sm">{t.farmerDetails}</h3>
          <p className="font-bold text-right">
            {t.date}: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
        {/* Header */}
        <div className="flex items-start gap-4 px-4 py-2 print:px-0 print:py-0">
          {/* ✅ Logo (VISIBLE EVERYWHERE) */}
          <div className="flex-shrink-0 hidden md:block">
            <img src={logo} alt="Parnanetra Logo" className="h-16 w-auto object-contain " />
          </div>

          {/* ✅ Right Content */}
          <div className="flex-1">
            {/* Company Name */}
            <div className="text-left mb-1 print:mb-0">
              <span className="text-base font-bold print:text-sm">
                <span className="text-green-700">Parnanetra</span> Ayurvedic Agro System
              </span>
            </div>

            {/* Farmer Info */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse print:text-[17px]">
                <tbody>
                  <tr className="block sm:table-row border-b sm:border-0">
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.name}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.name || "-"}</td>
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.number}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.number || "-"}</td>
                  </tr>

                  <tr className="block sm:table-row border-b sm:border-0">
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.email}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.email || "-"}</td>
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.place}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.place || "-"}</td>
                  </tr>

                  <tr className="block sm:table-row border-b sm:border-0">
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.tahsil}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.tahsil || "-"}</td>
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.district}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.district || "-"}</td>
                  </tr>

                  <tr className="block sm:table-row">
                    <td className="font-semibold block sm:table-cell py-1">{t.farmer.state}:</td>
                    <td className="block sm:table-cell py-1">{quotation.farmerInfo?.state || "-"}</td>
                    <td className="hidden sm:table-cell"></td>
                    <td className="hidden sm:table-cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {quotation.createdBy && (
              <div className="flex justify-end">
                <div className="mt-1 rounded border border-green-200 bg-green-50 px-3 py-2 print:border-0 print:bg-none print:my-1 flex justify-normal gap-4 w-fit ">
                  <div className="text-base font-semibold text-green-700">{t.createdBy}</div>
                  <div className="text-base font-medium text-gray-800">
                    {t.name} : {quotation.createdBy.name || "-"}
                  </div>
                  <div className="text-base text-gray-600">
                    {t.farmer.email} : {quotation.createdBy.email || "-"}
                  </div>
                  <div className="text-base text-gray-600">
                    {t.farmer.number} : {quotation.createdBy.number || "-"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Farmer Info */}
        {/* Screen Farmer Info (normal box) */}
        <div className=" p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800 block print:my-0 print:shadow-none">
          <div className="text-center font-bold text-base sm:text-lg border-b leading-snug print:text-sm">{t.header(quotation.cropName, quotation.acres)}</div>
        </div>

        <div className="flex justify-end mb-3 print:hidden">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 border border-green-500 rounded-md px-3 py-1 text-sm focus:outline-none">
            <option value="mr">मराठी</option>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>
        {quotation.weeks.map((week, index) => (
          <div key={index} className="week-block break-avoid py-2 overflow-x-auto print:overflow-visible print:w-full print:mt-1 print:mb-0" style={{ breakInside: "avoid" }}>
            {/* HEADER REPEATS ON EVERY PAGE IN PRINT */}
            {/* Farmer Info - Top Right on Every Printed Page */}

            {/* <div className="print-header-space hidden print:block"></div> */}
            <table className="table-auto min-w-[980px] border border-separate text-xs print:min-w-0 print:text-[14px] w-full print:mt-3" style={{ borderSpacing: "0 6px" }}>
              <thead className="bg-green-100 text-gray-900 print:table-header-group">
                <tr>
                  <th className="border py-2 whitespace-normal w-[60px]">{t.table.week}</th>
                  <th className="border py-2 whitespace-nowrap w-[110px]">{t.table.date}</th>
                  <th className="border py-2 max-w-[260px]">{t.table.products}</th>
                  <th className="border  py-2 print:hidden  whitespace-normal"> {t.table.perLitre}</th>
                  <th className="border  py-2 whitespace-normal">{t.table.waterPerAcre}</th>

                  <th className="border  py-1 whitespace-normal">{t.table.totalWater}</th>

                  <th className="border py-1 w-[14%]">{t.table.productQty}</th>

                  <th className="border px-3 py-2 w-[38%] text-base print:text-[16px]">{t.table.instruction}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border py-1 text-center w-[60px]">{week.weekNumber}</td>
                  <td className="border py-1 text-center whitespace-normal">
                    <span className="underline">
                      {week.date
                        ? new Date(week.date).toLocaleDateString("hi-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                    <br />
                    {formatUseStartDay(week.useStartDay, language)}
                  </td>
                  <td className="border p-2">
                    <ul className="list-disc pl-4 space-y-1">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 print:hidden">
                    {(week.products || []).map((prod, i) =>
                      prod.perLitreMix ? (
                        <div key={i}>
                          {prod.name}: <span className="text-blue-700 font-medium">{prod.perLitreMix * quotation.acres}</span>
                        </div>
                      ) : null,
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {week.waterPerAcre} {t.unit?.liter || "ltr"}
                  </td>
                  <td className="border p-2 text-center">
                    {formatWaterAmount(week.totalWater)} {t.unit?.liter || "ltr"}
                  </td>
                  <td className="border p-2">
                    <ul className="space-y-1">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>:<br />
                          {prod.quantity.split("&")[0]}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-3 align-top">
                    {week.products &&
                      (() => {
                        const text = buildInstructionByLanguage(week, language);
                        return (
                          <p className="text-[15px] font-medium leading-7 text-green-950 print:text-[17px] print:leading-7">
                            {text.prefix}
                            <span className="font-bold">{text.highlighted}</span>
                            {text.suffix}

                            {text.totalWater && (
                              <>
                                <br />
                                <span className="font-bold">{text.totalWater}</span>
                              </>
                            )}
                          </p>
                        );
                      })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <div className="print-end-line hidden print:block">
          <p className="text-sm text-gray-600">--- End of Schedule ---</p>
        </div>

        <div className="print-footer print:block">
          <div className="text-center text-xs border-t border-gray-300 bg-white py-1 px-3 shadow-sm">
            📍 300 Gov. Press Colony DABHA, Nagpur, 440023 &nbsp; | &nbsp; ✉️ info@parnanetra.org - parnanetra.org &nbsp; | &nbsp; 📞 +91 9226258656 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>{t.farmer.name}:</strong> {quotation.farmerInfo?.name} &nbsp;&nbsp;&nbsp;
            <strong>{t.farmer.number}:</strong> {quotation.farmerInfo?.number}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4 print:hidden mt-4">
          {quotation.weeks.map((week, index) => (
            <div key={index} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-green-700">Week {week.weekNumber}</span>

                <span className="text-sm">{week.date ? new Date(week.date).toLocaleDateString("hi-IN") : "-"}</span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>{t.table.waterPerAcre}:</strong> {week.waterPerAcre} Ltr
                </p>

                <p>
                  <strong>{t.table.totalWater}:</strong> {formatWaterAmount(week.totalWater)} Ltr
                </p>

                <div>
                  <strong>{t.table.products}:</strong>

                  <ul className="list-disc pl-5 mt-1">
                    {week.products?.map((prod, i) => (
                      <li key={i}>{prod.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>{t.table.productQty}:</strong>

                  <ul className="mt-1 space-y-1">
                    {week.products?.map((prod, i) => (
                      <li key={i}>
                        {prod.name}: {prod.quantity.split("&")[0]}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>{t.table.instruction}:</strong>

                  <p className="mt-1 text-gray-700">
                    {buildInstructionByLanguage(week, language).prefix}
                    <span className="font-bold">{buildInstructionByLanguage(week, language).highlighted}</span>
                    {buildInstructionByLanguage(week, language).suffix}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuatationGen;

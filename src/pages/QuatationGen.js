import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuotationBill, getQuotationById, removeCalendarSync } from "../api/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import translations from "../utils/translations";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.jpg";
import { googleBaseURL } from "../config/baseURL";

const QuatationGen = () => {
  const { quatationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("mr"); // "mr" | "en"
  const t = translations[language] || translations.mr;

  const [removingCalendar, setRemovingCalendar] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();
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
      totalWater: week.totalWater ? `— Total ${week.totalWater} liter water required` : null,
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
      totalWater: week.totalWater ? `— कुल ${week.totalWater} लीटर पानी लगेगा` : null,
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
      totalWater: week.totalWater ? `— કુલ ${week.totalWater} લીટર પાણી લાગશે` : null,
    };
  };
  const buildInstructionByLanguage = (week, language) => {
    if (language === "en") return buildEnglishInstruction(week);
    if (language === "hi") return buildHindiInstruction(week);
    if (language === "gu") return buildGujaratiInstruction(week);
    return buildMarathiInstruction(week); // default
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
      totalWater: week.totalWater ? `— एकूण ${week.totalWater} लीटर पाणी लागेल` : null,
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
    window.location.href = `${googleBaseURL}/auth/google?userId=${auth.user._id}&quotationId=${quotation._id}&redirect=/schedule/quotation/${quotation._id}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 print:p-4 print:text-lg">
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
      <div className="print-area bg-white p-4 sm:p-6 rounded shadow-md text-sm border border-gray-300 print:p-0 print:border-0 print:shadow-none print:rounded-none">
        {/* Header / Date Row */}
        <div className="flex justify-between items-start">
          <h3 className="text-green-700 font-semibold text-base mb-3">{t.farmerDetails}</h3>
          <p className="font-bold text-right">
            {t.date}: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
        {/* Header */}
        <div className="flex items-start gap-4 px-4 py-2">
          {/* ✅ Logo (VISIBLE EVERYWHERE) */}
          <div className="flex-shrink-0">
            <img src={logo} alt="Parnanetra Logo" className="h-16 w-auto object-contain" />
          </div>

          {/* ✅ Right Content */}
          <div className="flex-1">
            {/* Company Name */}
            <div className="text-left mb-1">
              <span className="text-base font-bold">
                <span className="text-green-700">Parnanetra</span> Ayurvedic Agro System
              </span>
            </div>

            {/* Farmer Info */}
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="font-semibold w-1/4">{t.farmer.name}:</td>
                  <td className="w-1/4">{quotation.farmerInfo?.name || "-"}</td>
                  <td className="font-semibold w-1/4">{t.farmer.number}:</td>
                  <td className="w-1/4">{quotation.farmerInfo?.number || "-"}</td>
                </tr>

                <tr>
                  <td className="font-semibold">{t.farmer.email}:</td>
                  <td>{quotation.farmerInfo?.email || "-"}</td>
                  <td className="font-semibold">{t.farmer.place}:</td>
                  <td>{quotation.farmerInfo?.place || "-"}</td>
                </tr>

                <tr>
                  <td className="font-semibold">{t.farmer.tahsil}:</td>
                  <td>{quotation.farmerInfo?.tahsil || "-"}</td>
                  <td className="font-semibold">{t.farmer.district}:</td>
                  <td>{quotation.farmerInfo?.district || "-"}</td>
                </tr>

                <tr>
                  <td className="font-semibold">{t.farmer.state}:</td>
                  <td>{quotation.farmerInfo?.state || "-"}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Farmer Info */}
        {/* Screen Farmer Info (normal box) */}
        <div className=" my-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm leading-relaxed text-gray-800 block">
          <div className="text-center font-bold text-base sm:text-lg border-b leading-snug ">{t.header(quotation.cropName, quotation.acres)}</div>
        </div>

        <div className="flex justify-end mb-3 print:hidden">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border border-green-500 rounded-md px-3 py-1 text-sm focus:outline-none">
            <option value="mr">मराठी</option>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>
        {quotation.weeks.map((week, index) => (
          <div key={index} className="py-2 overflow-x-auto print:overflow-visible print:w-full mt-4 break-inside-avoid">
            <table className="table-auto min-w-max border border-separate text-xs print:text-[14px] w-full" style={{ borderSpacing: "0 6px" }}>
              <thead className="bg-green-100 text-gray-900 print:table-header-group">
                <tr>
                  <th className="border  py-2 whitespace-normal w-[15px]">{t.table.week}</th>
                  <th className="border py-2 whitespace-nowrap w-[9%]">{t.table.date}</th>
                  <th className="border py-2  max-w-[250px]"> {t.table.products}</th>
                  <th className="border  py-2 print:hidden  whitespace-normal"> {t.table.perLitre}</th>
                  <th className="border  py-2 whitespace-normal">{t.table.waterPerAcre}</th>

                  <th className="border  py-1 whitespace-normal">{t.table.totalWater}</th>

                  <th className="border py-1 max-w-[250px]">{t.table.productQty}</th>

                  <th className="border  py-1 max-w-[350px] w-[200px]">{t.table.instruction}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border  py-1 text-center w-[15px]">{week.weekNumber}</td>
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
                    {week.useStartDay ? `${week.useStartDay}` : ""}
                  </td>
                  <td className="border px-2 py-1 break-words w-[60px] max-w-[100px]">
                    <ul className="list-disc pl-4 space-y-1  ">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 print:hidden  break-words w-[90px] max-w-[150px] ">
                    {(week.products || []).map((prod, i) =>
                      prod.perLitreMix ? (
                        <div key={i} className="text-green-800">
                          {prod.name}: <span className="text-blue-700 font-medium">{prod.perLitreMix * quotation.acres}</span>
                        </div>
                      ) : null,
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center w-[60px] max-w-[150px]">{week.waterPerAcre} ltr</td>
                  {/* <td className="border px-2 py-1 text-center">{week.totalAcres}</td> */}
                  <td className="border px-2 py-1 text-center w-[60px] max-w-[150px]">{week.totalWater} लीटर </td>
                  <td className="border px-2 py-1 break-words w-[65px] max-w-[100px]">
                    <ul className=" space-y-1  max-w-[250px]">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>:<br /> {prod.quantity.split("&")[0]}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 w-[200px]  break-words">
                    {week.products &&
                      (() => {
                        const text = buildInstructionByLanguage(week, language);
                        return (
                          <p className=" text-green-900 leading-relaxed">
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
        {/* print:fixed print:bottom-0 print:left-0 print:right-0 */}
        <div className="hidden print:block fixed bottom-0 left-0 right-0 text-center text-xs border-t border-gray-300 bg-white py-1">
          📍 235 Gov. Press Colony DABHA, Nagpur, 440023 &nbsp; | &nbsp; ✉️ info@parnanetra.org - parnanetra.org &nbsp; | &nbsp; 📞 +012 345 67890
        </div>

        {/* Shown only at the very end (last page) */}
        {/* <div className="end-of-schedule text-center border-t border-gray-300 print:block"> */}
        <p className="print:block hidden text-sm text-gray-600 text-center h-0 mt-1">--- End of Schedule ---</p>
        {/* <p className="text-xs text-gray-500 mt-1">
              Thank you for choosing <span className="font-semibold text-green-700">Parnanetra Ayurvedic Agro System</span>
            </p> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default QuatationGen;

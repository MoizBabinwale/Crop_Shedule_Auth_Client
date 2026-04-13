import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCropById, getSchedulesByCropId } from "../api/api";

const ScheduleView = () => {
  const { cropId } = useParams();
  const [cropName, setCropName] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [scheduleNotFoud, setScheduleNotFoud] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cropRes = await getCropById(cropId);
        setCropName(cropRes.name);

        const scheduleRes = await getSchedulesByCropId(cropId);
        if (scheduleRes.status === 404) {
          setScheduleNotFoud(true);
        }

        setWeeks(scheduleRes.weeks || []);
      } catch (error) {
        console.error("Error fetching crop or schedule:", error);
      }
    };

    if (cropId) fetchData();
  }, [cropId]);

  // helpers.js (या इसी फाइल में ऊपर define कर सकते हो)

  // Extract mg/ml part from prod.quantity
  // const getMgValue = (quantity) => {
  //   if (!quantity) return 0;
  //   const mlPart = quantity.split("&")[0].trim(); // "200 ml/grm"
  //   const num = parseFloat(mlPart);
  //   return isNaN(num) ? 0 : num;
  // };

  // // Extract litre/kg part from prod.quantity
  // const getLitreValue = (quantity) => {
  //   if (!quantity) return 0;
  //   const parts = quantity.split("&");
  //   if (parts.length < 2) return 0;
  //   const ltrPart = parts[1].trim(); // "0.200 ltr/kg"
  //   const num = parseFloat(ltrPart);
  //   return isNaN(num) ? 0 : num;
  // };

  if (scheduleNotFoud)
    return (
      <>
        {scheduleNotFoud && (
          <div className="flex justify-center items-center h-64">
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-6 rounded shadow-md text-center w-full max-w-md">
              <p className="text-lg font-semibold">⚠️ No Schedule Data Found!</p>
              <p className="text-sm mt-1">Please check if the schedule has been created for this crop.</p>
            </div>
          </div>
        )}
      </>
    );

  return (
    <div className="p-4 sm:p-6 bg-green-50 min-h-screen">
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-4 sm:px-6 py-2 rounded-md shadow-md text-sm sm:text-base font-medium">
          🖨️ Print Schedule
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 underline decoration-orange-500 underline-offset-4">फसल का नाम: {cropName}</h1>
      </div>

      {/* Schedule Table for each Week */}
      <div className="space-y-6 print-area">
        {weeks?.map((week, index) => (
          <div key={index} className="overflow-x-auto rounded border border-green-300 shadow-md bg-white">
            <table className="min-w-full w-full text-xs sm:text-sm text-green-800">
              <thead className="bg-green-200 text-green-900 text-center">
                <tr>
                  <th className="border p-2 w-[60px]">सप्ताह</th>
                  <th className="border p-2 w-[110px]">तारीख/उपयोग दिन</th>
                  <th className="border p-2">उत्पाद</th>
                  <th className="border p-2">प्रति लीटर पानी</th>
                  <th className="border p-2">पानी/एकड़</th>
                  <th className="border p-2">कुल एकड़</th>
                  <th className="border p-2">पानी कुल</th>
                  <th className="border p-2">उत्पाद (मिली/ग्राम)</th>
                  <th className="border p-2">उत्पाद (लीटर/किग्रा)</th>
                  <th className="border p-2 w-[90px]">उपयोग दिन</th>
                  <th className="border p-2">उत्पाद</th>
                  <th className="border p-2 max-w-[250px] whitespace-normal text-left">निर्देश</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t text-center">
                  <td className="border p-2 font-semibold">{week.weekNumber}</td>
                  <td className="border p-2 whitespace-nowrap">
                    <span className="underline">{week.date ? new Date(week.date).toLocaleDateString("en-GB") : ""}</span>
                    <br />
                    {week.useStartDay ? `${week.useStartDay}` : ""}
                  </td>
                  <td className="border p-2">
                    <ul className="list-disc pl-4 space-y-1 text-left">
                      {(week.products || []).map((prod, i) => (
                        <li key={i}>
                          <span className="font-medium">{prod.name}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 text-left">
                    {(week.products || []).map((prod, i) =>
                      prod.perLitreMix ? (
                        <div key={i} className="text-green-800">
                          {prod.name}: <span className="text-blue-700 font-medium">{prod.perLitreMix}</span>
                        </div>
                      ) : null,
                    )}
                  </td>
                  <td className="border p-2">{week.waterPerAcre}</td>
                  <td className="border p-2">{week.totalAcres}</td>
                  <td className="border p-2">{week.totalWater}</td>
                  <td className="border p-2">
                    {(week.products || []).map((prod, i) => {
                      const mgPart = prod.quantity?.split("&")[0]?.trim() || "";
                      return <div key={i}>{mgPart.replace(/ml\/grm/i, "").trim()} ml/grm</div>;
                    })}
                  </td>

                  <td className="border p-2">
                    {(week.products || []).map((prod, i) => {
                      const ltrPart = prod.quantity?.split("&")[1]?.trim() || "";
                      return <div key={i}>{ltrPart.replace(/ltr\/kg/i, "").trim()} ltr/kg</div>;
                    })}
                  </td>

                  <td className="border p-2">{week.useStartDay}</td>
                  <td className="border p-2 text-left">
                    <ul className="list-disc list-inside space-y-1">
                      {(week.products || []).map((prod, i) => (
                        <li key={i} className="text-xs sm:text-sm">
                          <span className="text-green-900 font-medium">{prod.name}</span>: <span className="text-orange-600">{prod.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2 text-left text-green-900 text-sm max-w-[250px] whitespace-normal">
                    {/* <div className="inline-flex flex-wrap items-center gap-1">
                      {(week.products || [])
                        .filter((prod) => prod.category !== "खेत पर पत्तों से धुवा")
                        .map((prod, i, arr) => (
                          <span key={i} className="text-xs sm:text-sm font-bold">
                            {prod.quantity} {prod.name}
                            {i < arr.length - 1 && " और "}
                          </span>
                        ))}

                      <span dangerouslySetInnerHTML={{ __html: week.instructions }} className="text-xs sm:text-sm" />

                      {(week.products || [])
                        .filter((prod) => prod.category === "खेत पर पत्तों से धुवा")
                        .map((prod, i, arr) => {
                          let kgValue = "";
                          const mlPart = prod.quantity.split("&")[0].trim();
                          const num = parseFloat(mlPart);
                          if (!isNaN(num)) {
                            kgValue = (num / 1000).toFixed(3) + " KG";
                          }

                          return (
                            <span key={i} className="text-xs sm:text-sm">
                              {arr.length > 1 && i > 0 && " और "}
                              <span className="font-bold">
                                {kgValue} {prod.name}
                              </span>{" "}
                              धुवा करना.
                            </span>
                          );
                        })}
                    </div> */}
                    <div>
                      {Object.entries(week.products).length > 0 && week.instructions && (
                        <p className="text-sm text-green-900 leading-relaxed">
                          {(() => {
                            // Helper to parse qty string like "300 ml/grm & 0.300 ltr/kg"
                            const parseQtyString = (qtyStr) => {
                              let ml = null;
                              let l = null;

                              // Match ml
                              const mlMatch = qtyStr.match(/([\d.]+)\s*ml/);
                              if (mlMatch) ml = parseFloat(mlMatch[1]);

                              // Match liter
                              const lMatch = qtyStr.match(/([\d.]+)\s*(?:ltr|लीटर)/);
                              if (lMatch) l = parseFloat(lMatch[1]);

                              return { ml, l };
                            };

                            // Normal products
                            const normalProducts = Object.entries(week.products)
                              .filter(([id, data]) => data?.category !== "खेत पर पत्तों से धुवा")
                              .map(([id, data]) => {
                                // const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                const { ml, l } = parseQtyString(data.quantity);

                                let qtyText = "";
                                if (l && l >= 1) {
                                  qtyText = `${l} लीटर`;
                                } else if (ml && ml > 0) {
                                  qtyText = `${ml} ml`;
                                }

                                return `${data.name} ${qtyText}`;
                              });

                            // धुवा products
                            const smokeProducts = Object.entries(week.products)
                              .filter(([id, data]) => data?.category === "खेत पर पत्तों से धुवा")
                              .map(([id, data]) => {
                                // const productName = products.find((p) => p._id === id)?.name || "Unknown";

                                const { l } = parseQtyString(data.quantity || "");

                                let qtyText = "";
                                if (l && l > 0) {
                                  qtyText = `${l} किलो`;
                                }

                                return `${data.name} ${qtyText} धुवा करना.`;
                              });

                            return (
                              <>
                                <span className="font-bold text-green-900">
                                  {normalProducts.join(" और ")} को {week.waterPerAcre} लीटर
                                </span>{" "}
                                {week.instructions}
                                {smokeProducts.length > 0 && (
                                  <>
                                    {" "}
                                    और <span className="font-bold text-green-900">{smokeProducts.join(" और ")}</span>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;

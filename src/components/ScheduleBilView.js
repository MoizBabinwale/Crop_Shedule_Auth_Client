/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getScheduleBillByScheduleId } from "../api/api"; // adjust path as needed

const ScheduleBillView = () => {
  const { scheduleId } = useParams();
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await getScheduleBillByScheduleId(scheduleId);

        setBillData(res);
      } catch (err) {
        console.error("Error fetching bill:", err);
      }
    };
    fetchBill();
  }, [scheduleId]);

  if (!billData) return <div className="p-4 text-green-800">लोड करत आहे...</div>;

  const { cropName, createdBy, billDate, items, additionalInfo = {} } = billData;

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white border border-green-300 rounded shadow text-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-green-700">💼 शेड्यूल बिल - Schedule Bill</h1>
          <p className="text-green-600">पीक: {cropName}</p>
          {/* <p className="text-green-600">बनवले: {createdBy}</p> */}
          <p className="text-green-600">दिनांक: {new Date(billDate).toLocaleDateString("en-GB")}</p>
        </div>
        <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded shadow print:hidden">
          🖨️ Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-green-500 text-center">
          <thead className="bg-green-100">
            <tr>
              <th className="border px-2 py-1">साहित्य</th>
              <th className="border px-2 py-1">वेळा</th>
              <th className="border px-2 py-1">कुल Ml</th>
              <th className="border px-2 py-1">Ltr/Kg</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Total Amt</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.times}</td>
                <td className="border px-2 py-1">{item.totalMl}</td>
                <td className="border px-2 py-1">{item.ltrKg}</td>
                <td className="border px-2 py-1">{item.rate}</td>
                <td className="border p-1 text-center">
                  ₹
                  {(item.totalMl * item.rate).toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Total Cost Row */}
          <tfoot>
            <tr className="bg-green-100">
              <td colSpan="5" className="border px-2 py-2 text-right font-bold text-green-800">
                एकूण रक्कम:
              </td>
              <td className="border px-2 py-2 font-bold text-green-800">₹{items.reduce((acc, item) => acc + (parseFloat(item.totalAmt) || 0), 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h2 className="mt-6 mb-2 text-green-700 font-semibold text-base">💰 खर्चाचा सारांश - Cost Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-green-800">
        <SummaryField label="Total Plants (7 Feet x5 Feet)" value={additionalInfo.totalPlants} />
        <SummaryField label="Total Acres" value={additionalInfo.totalAcres} />
        <SummaryField label="Total Guntha" value={additionalInfo.totalGuntha} />
        <SummaryField label="Total Cost" value={`₹${additionalInfo.totalCost}`} />
        <SummaryField label="Per Plant Cost" value={`₹${additionalInfo.perPlantCost}`} />
      </div>

      {/* Grouped Costs */}
      <GroupedCost title="🌿 पर्णनेत्र उत्पादों की लागत" data={additionalInfo.leafProductCost} />
      <GroupedCost title="🧪 जैव नियंत्रण उत्पादों की लागत" data={additionalInfo.bioControlCost} />
      <GroupedCost title="🧂 खेत पर इनपुट तैयार करने की लागत" data={additionalInfo.fieldInputPrepCost} />
      <GroupedCost title="🔥 खेत पर पत्तों से धुवा की लागत" data={additionalInfo.smokeCost} />
    </div>
  );
};

const SummaryField = ({ label, value }) => {
  // Extract numeric part if string contains ₹
  let displayValue = value;

  if (typeof value === "string" && value.includes("₹")) {
    const num = parseFloat(value.replace(/[^0-9.]/g, "")); // get only numbers
    if (!isNaN(num)) {
      displayValue = `₹${num.toFixed(2)}`;
    }
  } else if (typeof value === "number" && !isNaN(value)) {
    displayValue = value.toFixed(2);
  }

  return (
    <div className="bg-green-50 p-2 rounded border border-green-200">
      <div className="text-xs text-green-600">
        {label} :- <span className="text-sm font-semibold">{displayValue}</span>
      </div>
    </div>
  );
};

const GroupedCost = ({ title, data = {} }) => (
  <div className="mt-6">
    <h3 className="text-green-600 font-semibold mb-2">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
      <SummaryField label="एकूण ₹" value={`₹${data.totalRs || 0}`} />
      <SummaryField label="प्रति हेक्टर (100 गुंठा)" value={`₹${data.perHectare || 0}`} />
      <SummaryField label="प्रति एकर (40 गुंठा)" value={`₹${data.perAcre || 0}`} />
      <SummaryField label="प्रति बीघा (24 गुंठा)" value={`₹${data.perBigha || 0}`} />
      <SummaryField label="प्रति गुंठा (1089 Sft)" value={`₹${data.perGuntha || 0}`} />
    </div>
  </div>
);

export default ScheduleBillView;

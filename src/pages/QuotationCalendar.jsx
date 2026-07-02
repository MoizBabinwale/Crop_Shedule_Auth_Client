import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaPhone, FaSearch, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import CommonAlert from "../components/CommonAlert";
import { getQuotationCalendarFeed, sendQuotationWhatsAppAlert } from "../api/api";
import { useNavigate } from "react-router-dom";

const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getLocalDateKey = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthStartGrid = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  return cells;
};

const getUniqueProducts = (week) => Array.from(new Set((week?.products || []).map((product) => product?.name).filter(Boolean)));

const buildWeekLabel = (week) => {
  if (!week) return "No week data";
  const datePart = week.date ? ` - ${new Date(week.date).toLocaleDateString()}` : "";
  return `Week ${week.weekNumber || "-"}${datePart}`;
};

const matchesSearchQuery = (quotation, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const farmer = quotation.farmerInfo || {};
  const farmerName = String(farmer.name || "").toLowerCase();
  const cropName = String(quotation.cropName || "").toLowerCase();
  const farmerNumber = String(farmer.number || "").replace(/\D/g, "");
  const queryDigits = normalizedQuery.replace(/\D/g, "");

  return farmerName.includes(normalizedQuery) || cropName.includes(normalizedQuery) || (queryDigits.length > 0 && farmerNumber.includes(queryDigits));
};

export default function QuotationCalendar() {
  const { auth, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "success" });

  const canView = auth?.user?.role === "admin" || auth?.user?.canAccessQuotationCalendar;

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setLoading(true);
        const data = await getQuotationCalendarFeed();
        setQuotations(data || []);
      } catch (error) {
        setAlert({
          message: "Unable to load quotation calendar",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && canView) {
      loadCalendar();
    }
  }, [authLoading, canView]);

  const groupedByDate = useMemo(() => {
    return quotations.reduce((acc, quotation) => {
      const weeks = Array.isArray(quotation.weeks) ? quotation.weeks : [];
      weeks.forEach((week) => {
        const key = getLocalDateKey(week.date);
        if (!key) return;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ quotation, week });
      });
      return acc;
    }, {});
  }, [quotations]);

  const monthCells = useMemo(() => getMonthStartGrid(visibleMonth), [visibleMonth]);

  const selectedEntries = selectedDate ? groupedByDate[selectedDate] || [] : [];

  const selectedQuotations = useMemo(() => {
    const map = new Map();
    selectedEntries.forEach(({ quotation, week }) => {
      if (!map.has(quotation._id)) {
        map.set(quotation._id, { quotation, weeks: [] });
      }
      map.get(quotation._id).weeks.push(week);
    });
    return Array.from(map.values());
  }, [selectedEntries]);

  const filteredQuotations = useMemo(() => {
    if (!searchQuery.trim()) return selectedQuotations;
    return selectedQuotations.filter(({ quotation }) => matchesSearchQuery(quotation, searchQuery));
  }, [selectedQuotations, searchQuery]);

  const handleWhatsApp = async (quotationId, weekNumber) => {
    try {
      setAlert({ message: "Preparing WhatsApp message...", type: "success" });
      const result = await sendQuotationWhatsAppAlert(quotationId, weekNumber);

      console.log("[WhatsApp] Response:", result);

      // Open WhatsApp URL if available
      if (result?.whatsappUrl) {
        setTimeout(() => {
          window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
        }, 500);
      }

      setAlert({
        message: result?.message || "WhatsApp message prepared! Opening WhatsApp...",
        type: "success",
      });
    } catch (error) {
      console.error("[WhatsApp Error]", error);

      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to prepare WhatsApp alert. Please check farmer's mobile number.";

      setAlert({
        message: errorMessage,
        type: "error",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="page-shell">
        <div className="container-pro panel-pro mx-auto max-w-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">Quotation Calendar</h1>
          <p className="mt-3 text-gray-700">This view is available for admin and subadmin users only.</p>
          <button onClick={() => navigate("/admin")} className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container-pro mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="panel-pro overflow-hidden rounded-3xl border border-green-900/10 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                <FaCalendarAlt />
                Quotation Calendar
              </div>
              <h1 className="mt-3 text-3xl font-bold text-green-900 sm:text-4xl">Farmer schedule dates in one place</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-700 sm:text-base">
                Click any date to see which quotations have schedule instructions due that day, farmer contact details, and the week-wise products and instructions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-green-900/10 bg-white p-2 shadow-sm">
              <button
                onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
                className="rounded-xl p-2 text-green-700 hover:bg-green-50"
                aria-label="Previous month"
              >
                <FaChevronLeft />
              </button>
              <div className="min-w-[180px] px-3 py-2 text-center">
                <div className="text-sm font-semibold uppercase tracking-wide text-green-700">{monthLabels[visibleMonth.getMonth()]}</div>
                <div className="text-xl font-bold text-green-900">{visibleMonth.getFullYear()}</div>
              </div>
              <button
                onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
                className="rounded-xl p-2 text-green-700 hover:bg-green-50"
                aria-label="Next month"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-green-900/10 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2">
                {monthCells.map((cell, index) => {
                  if (!cell) {
                    return <div key={`empty-${index}`} className="min-h-[110px] rounded-2xl bg-gray-50/70" />;
                  }

                  const key = getLocalDateKey(cell);
                  const items = groupedByDate[key] || [];
                  const isSelected = key === selectedDate;
                  const isToday = key === getLocalDateKey(new Date());
                  const hasItems = items.length > 0;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedDate(key);
                        setVisibleMonth(new Date(cell.getFullYear(), cell.getMonth(), 1));
                      }}
                      className={`min-h-[110px] rounded-2xl border p-3 text-left transition ${
                        isSelected ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className={`text-lg font-bold ${isToday ? "text-green-700" : "text-gray-800"}`}>{cell.getDate()}</div>
                        {hasItems && <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">{items.length}</span>}
                      </div>

                      <div className="mt-3 space-y-2">
                        {hasItems ? (
                          items.slice(0, 2).map((entry) => (
                            <div key={`${entry.quotation._id}-${entry.week.weekNumber}`} className="rounded-xl bg-green-100/70 px-2 py-1 text-xs text-green-900">
                              <div className="font-semibold">{entry.quotation.farmerInfo?.name || "Farmer"}</div>
                              <div className="truncate">{entry.quotation.cropName || "Quotation"}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-400">No schedules</div>
                        )}

                        {items.length > 2 && <div className="text-xs font-semibold text-green-700">+{items.length - 2} more</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-green-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Selected Date</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">{selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString() : "No date selected"}</h2>
                </div>
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{filteredQuotations.length}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-green-700">{searchQuery.trim() ? "Filtered" : "Schedules"}</div>
                </div>
              </div>

              <div className="relative mt-4">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by farmer name, mobile no., or crop name..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {searchQuery.trim() && (
                <p className="mt-2 text-xs text-gray-500">
                  Showing {filteredQuotations.length} of {selectedQuotations.length} schedule
                  {selectedQuotations.length === 1 ? "" : "s"} for this date
                </p>
              )}

              <div className="mt-5 max-h-[72vh] space-y-4 overflow-y-auto pr-1">
                {filteredQuotations.length > 0 ? (
                  filteredQuotations.map(({ quotation, weeks }) => {
                    const farmer = quotation.farmerInfo || {};

                    return (
                      <div key={quotation._id} className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-green-50 p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{quotation.cropName || "Quotation"}</h3>
                            <p className="mt-1 text-sm text-gray-600">Generated on {new Date(quotation.createdAt).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => navigate(`/schedule/quotation/${quotation._id}`)}
                            className="rounded-xl border border-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-600 hover:text-white"
                          >
                            Open quotation
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 text-sm text-gray-700 sm:grid-cols-2">
                          <div>
                            <div className="font-semibold text-gray-500">Farmer</div>
                            <div className="font-medium text-gray-900">{farmer.name || "N/A"}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-500">Mobile</div>
                            <div className="font-medium text-gray-900">{farmer.number || "N/A"}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-500">Place</div>
                            <div className="font-medium text-gray-900">{farmer.place || "N/A"}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-500">Acres</div>
                            <div className="font-medium text-gray-900">{quotation.acres || "N/A"}</div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {weeks.length > 0 ? (
                            weeks.map((week) => (
                              <div key={`${quotation._id}-${week.weekNumber}`} className="rounded-2xl border border-green-900/10 bg-white p-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <div className="text-sm font-bold text-green-800">{buildWeekLabel(week)}</div>
                                    <div className="mt-1 text-sm text-gray-700">{week.instructions || "No instructions added"}</div>
                                  </div>

                                  <button
                                    onClick={() => handleWhatsApp(quotation._id, week.weekNumber)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                  >
                                    <FaWhatsapp />
                                    WhatsApp
                                  </button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {getUniqueProducts(week).length > 0 ? (
                                    getUniqueProducts(week).map((productName) => (
                                      <span key={productName} className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                        {productName}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-gray-500">No products listed</span>
                                  )}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                                  <div className="inline-flex items-center gap-2">
                                    <FaPhone />
                                    {farmer.number || "N/A"}
                                  </div>
                                  <div>{week.date ? `Week date: ${new Date(week.date).toLocaleDateString()}` : "Week date not set"}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">No weekly plan found for this quotation.</div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                    {searchQuery.trim() ? "No schedules match your search for this date." : "No schedule instructions are due on this date."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
    </div>
  );
}

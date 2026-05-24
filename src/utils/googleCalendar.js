import { BASE_URL } from "../config/baseURL";
import axios from "axios";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

export const syncQuotationToGoogleCalendar = async (quotationData) => {
  try {
    const events = quotationData.weeks.map((week) => ({
      summary: `Farm Schedule: ${quotationData.cropName}`,
      description: `
        Crop: ${quotationData.cropName}
        Farmer: ${quotationData.farmerInfo.name}
        Location: ${quotationData.farmerInfo.place}, ${quotationData.farmerInfo.district}
        Products: ${week.products.map((p) => p.name).join(", ")}
      `,
      startDate: week.date,
      endDate: week.date,
    }));

    const response = await axios.post(`${BASE_URL}/calendar/sync-events`, { events }, getAuthHeader());

    return response.data;
  } catch (error) {
    console.error("Calendar sync error:", error);
    throw error;
  }
};

export const getGoogleCalendarEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/calendar/events`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};

export const deleteGoogleCalendarEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/calendar/events/${eventId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw error;
  }
};

export const updateGoogleCalendarEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${BASE_URL}/calendar/events/${eventId}`, eventData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw error;
  }
};

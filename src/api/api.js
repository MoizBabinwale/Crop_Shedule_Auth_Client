import axios from "axios";

import { BASE_URL } from "../config/baseURL.js";

const token = sessionStorage.getItem("token");
const user = JSON.parse(sessionStorage.getItem("user"));

// Attach token manually like your style
const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const getCropData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/crop`);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
// Function to get crop by ID
export const getCropById = async (cropId) => {
  try {
    const res = await axios.get(`${BASE_URL}/crop/${cropId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching crop by ID:", err);
    throw err;
  }
};

export const submitData = async (cropId, schedule) => {
  try {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const res = await axios.post(
      `${BASE_URL}/schedule/create/${cropId}`,
      {
        ...schedule,
        userId: user._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const editCropData = async (editCropId, newCrop) => {
  try {
    const res = await axios.put(`${BASE_URL}/crop/${editCropId}`, newCrop);

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const addCropData = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/crop/add`,
      {
        ...data,
        userId: user?._id, // ✅ send userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error adding crop:", error);
    throw error;
  }
};

export const deleteCropById = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/crop/${id}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getProductList = async () => {
  const res = await axios.get(`${BASE_URL}/products`);
  if (res) {
    return res.data;
  }
};

export const addProduct = async (data) => {
  const res = await axios.post(`${BASE_URL}/products`, data);
  return res.data;
};

export const updateProductById = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/products/${id}`, data);
  return res.data;
};

export const deleteProductById = async (id) => {
  const res = await axios.delete(`${BASE_URL}/products/${id}`);
  return res.data;
};

export const getSchedulesByCropId = async (cropId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedule/get/${cropId}`);
    if (res) {
      return res.data;
    }
    return res;
  } catch (error) {
    console.error("Error ", error);
    return error;
  }
};

// QUOTATION APIS
export const createQuotation = async (quotationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/quotations`, quotationData);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const getAllQuotations = async () => {
  try {
    const token = sessionStorage.getItem("token"); // ✅ moved here

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await axios.get(`${BASE_URL}/quotations/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.quotations;
  } catch (error) {
    console.error("Error fetching quotations:", error);
    throw error;
  }
};

export const getQuotationById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/quotations/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error(error.response?.data?.error || "Failed to create quotation.");
  }
};

export const updateQuotation = async (id, data) => {
  const res = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteQuotation = async (id) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/quotations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};

export const getScheduleBillByScheduleId = async (scheduleId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedulebill/${scheduleId}`);

    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    console.error("Error fetching schedule bill:", error);
    throw error;
  }
};

export const createScheduleBill = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/schedulebill`, payload);
    return res;
  } catch (error) {
    console.error("Error creating schedule bill:", error);
    throw error;
  }
};
export const createQuotationBill = async (quotationId, totalAcres) => {
  try {
    // Step 1: Fetch Quotation (you might already have it in frontend, or fetch if needed)
    const quotationBillRes = await axios.post(`${BASE_URL}/quotationbills/${quotationId}/${totalAcres}`);
    return quotationBillRes.data;
  } catch (error) {
    console.error("Error generating quotation bill:", error);
    throw error;
  }
};

export const getQuotationBillById = async (billId) => {
  try {
    const res = await axios.get(`${BASE_URL}/quotationbills/${billId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting bill:", error);
    throw error;
  }
};
export const getScheduleById = async (scheduleId) => {
  try {
    const res = await axios.get(`${BASE_URL}/schedule/${scheduleId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting schedule:", error);
    throw error;
  }
};

// Fetch all instructions
export const getInstructions = async () => {
  const res = await axios.get(`${BASE_URL}/instructions`);
  return res.data;
};

// Add a new instruction
export const addInstruction = async (text) => {
  const res = await axios.post(`${BASE_URL}/instructions`, { text });
  return res.data;
};
export const editInstruction = async (id, text) => {
  const res = await axios.post(`${BASE_URL}/instructions/${id}`, { text });
  return res.data;
};
export const deleteInstruction = async (id) => {
  const res = await axios.post(`${BASE_URL}/instructions/delinstruction/${id}`);
  return res.data;
};

export const copyCrop = async (cropId, data) => {
  const res = await axios.post(`${BASE_URL}/schedule/copyCrop/${cropId}`, data);
  return res.data;
};

export const getUserQuotations = async () => {
  const token = sessionStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/quotations/by-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update user profile API
export const updateUserProfile = async (userId, data) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.put(`${BASE_URL}/auth/admin/edit/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const submitContactMessage = async (data) => {
  const token = sessionStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/notifications/contact`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Get all notifications
export const getNotifications = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (token) {
      const res = await axios.get(BASE_URL + "/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    }
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = async (id) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.put(
      BASE_URL + `/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw error;
  }
};

export const getContactMessageById = async (id) => {
  const token = sessionStorage.getItem("token");

  const res = await axios.get(BASE_URL + `/notifications/message/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const approveSchedule = (scheduleId) => {
  return axios.put(
    `${BASE_URL}/schedule/approve/${scheduleId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const updateProfile = async (userData, userId) => {
  const res = await axios.put(`${BASE_URL}/auth/admin/edit-user/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMyQuotationCount = async () => {
  const token = sessionStorage.getItem("token");

  const res = await axios.get(BASE_URL + `/quotations/count/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getQuotationCountByUser = async () => {
  const token = sessionStorage.getItem("token");

  const res = await axios.get(BASE_URL + `/quotations/count/by-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

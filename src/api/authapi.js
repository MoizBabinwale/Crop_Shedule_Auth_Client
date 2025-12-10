import axios from "axios";
import { BASE_URL } from "../config/baseURL";

// Attach token manually like your style
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    if (response) return response;
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    if (response) return response;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, getAuthHeader());
    if (response) return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const editUser = async (userId, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/edit/${userId}`, data, getAuthHeader());
    if (response) return response;
  } catch (error) {
    console.error("Edit user error:", error);
    return null;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/admin/delete/${userId}`, getAuthHeader());
    if (response) return response;
  } catch (error) {
    console.error("Delete user error:", error);
    return null;
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/approve/${userId}`, {}, getAuthHeader());
    if (response) return response;
  } catch (error) {
    console.error("Approve error:", error);
    return null;
  }
};

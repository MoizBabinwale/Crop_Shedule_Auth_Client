import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [form, setForm] = useState({
    place: "",
    tahsil: "",
    district: "",
    state: "",
  });

  const token = localStorage.getItem("token");

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/admin/get-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Approve user
  const approveUser = async (id) => {
    try {
      await axios.put(`${BASE_URL}/auth/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      getAllUsers();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/auth/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Update user role
  const updateRole = async (id, role) => {
    try {
      await axios.put(`${BASE_URL}/auth/admin/update-role/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      getAllUsers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  useEffect(() => {
    getAllUsers();

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setCurrentAdmin(loggedInUser);

    if (loggedInUser) {
      setForm({
        place: loggedInUser.place || "",
        tahsil: loggedInUser.tahsil || "",
        district: loggedInUser.district || "",
        state: loggedInUser.state || "",
      });
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${BASE_URL}/auth/admin/edit/${currentAdmin._id}`, form, { headers: { Authorization: `Bearer ${token}` } });

      const updatedUser = { ...auth.user, ...form };

      // ✅ update context (this auto updates localStorage through useEffect)
      setAuth({
        ...auth,
        user: updatedUser,
      });

      setCurrentAdmin(updatedUser);
      setShowModal(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🛠️ Admin Dashboard</h1>

        <p className="text-lg mb-6 text-gray-700">Manage users, approve accounts, edit roles, and remove users.</p>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <div>
            {currentAdmin && (
              <div className="mb-6 space-y-3 bg-green-50 p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-lg">
                    <span className="font-semibold">Name:</span> {currentAdmin.name}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Email:</span> {currentAdmin.email}
                  </p>

                  <p className="text-lg">
                    <span className="font-semibold">Role:</span> <span className="capitalize">{currentAdmin.role}</span>
                  </p>

                  <p className="text-lg">
                    <span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">Approved ✔️</span>
                  </p>

                  <p className="text-lg">
                    <span className="font-semibold">Place:</span> {currentAdmin.place || "Not Updated"}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Tahsil:</span> {currentAdmin.tahsil || "Not Updated"}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">District:</span> {currentAdmin.district || "Not Updated"}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">State:</span> {currentAdmin.state || "Not Updated"}
                  </p>

                  <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-900">
                    <FaPencil /> Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
          <table className="w-full text-left border border-gray-300 rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 || users.length === 1 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                <>
                  {users
                    .filter((u) => u._id !== currentAdmin?._id)
                    .map((u) => (
                      <tr key={u._id} className="border-b hover:bg-green-100">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3">{u.approved ? <span className="text-green-700 font-bold">Approved ✔</span> : <span className="text-red-600 font-bold">Pending ✖</span>}</td>

                        <td className="p-3 flex flex-col gap-2 items-center">
                          {/* Approve Button */}
                          {!u.approved && (
                            <button onClick={() => approveUser(u._id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg w-32">
                              Approve
                            </button>
                          )}

                          {/* Change Role */}
                          <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} className="border px-3 py-1 rounded-lg text-sm w-32">
                            <option value="user">User</option>
                            <option value="subadmin">Sub Admin</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Delete Button */}
                          <button onClick={() => deleteUser(u._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg w-32">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-green-700 mb-4">Edit Profile</h2>

            <div className="space-y-3">
              <div>
                <label className="font-semibold">Place:</label>
                <input name="place" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} className="w-full mt-1 p-2 border rounded" />
              </div>

              <div>
                <label className="font-semibold">Tahsil:</label>
                <input name="tahsil" value={form.tahsil} onChange={(e) => setForm({ ...form, tahsil: e.target.value })} className="w-full mt-1 p-2 border rounded" />
              </div>

              <div>
                <label className="font-semibold">District:</label>
                <input name="district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full mt-1 p-2 border rounded" />
              </div>

              <div>
                <label className="font-semibold">State:</label>
                <input name="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full mt-1 p-2 border rounded" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleSaveProfile} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

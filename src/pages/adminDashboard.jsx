import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import CommonAlert from "../components/CommonAlert";
import { getMyQuotationCount, getQuotationCountByUser, updateProfile } from "../api/api";
import Loading from "../components/Loading";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminDashboard() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [form, setForm] = useState({
    place: "",
    tahsil: "",
    district: "",
    state: "",
  });

  const [alert, setAlert] = useState({
    message: "",
    type: "success",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const token = sessionStorage.getItem("token");

  const currentRole = auth?.user?.role; // "admin" | "subadmin"

  // Fetch all users
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/auth/admin/get-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response.data.users ", response.data.users);

      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
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

      // ✅ update context (this auto updates sessionStorage through useEffect)
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

  const [editUserModal, setEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    number: "",
    role: "user",
    approved: false,
    place: "",
    tahsil: "",
    district: "",
    state: "",
  });

  const updateUserDetails = async () => {
    try {
      const res = await updateProfile(editForm, selectedUser._id);
      if (res) {
        setAlert({
          message: "User Updated Successfully!",
          type: "success",
        });
        setEditUserModal(false);
        getAllUsers();
      }
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      number: user.number || "",
      role: user.role || "user",
      approved: user.approved || false,
      place: user.place || "",
      tahsil: user.tahsil || "",
      district: user.district || "",
      state: user.state || "",
    });
    setEditUserModal(true);
  };

  const isAdmin = currentRole === "admin";
  const isSubAdmin = currentRole === "subadmin";

  const canEditUser = (user) => {
    if (isAdmin) return true;
    if (isSubAdmin && user.role !== "admin") return true;
    return false;
  };

  const canDeleteUser = (user) => {
    if (isAdmin) return true;
    if (isSubAdmin && user.role !== "admin") return true;
    return false;
  };

  const canChangeRole = (user) => {
    if (isAdmin) return true;
    if (isSubAdmin && user.role !== "admin") return true;
    return false;
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId); // 🔥 API call

      setConfirmOpen(false);
      setSelectedUserId(null);
      setSelectedUserName("");

      // Optional: refresh users list
      getAllUsers();
    } catch (err) {
      console.error(err);
      setConfirmOpen(false);
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
          <div className="bg-green-100 p-6 rounded-xl shadow w-1/2 mb-3">
            {" "}
            <h2 className="font-bold text-xl text-green-700 mb-2">📄 Quotations</h2> <p className="text-gray-700">Check your generated quotations.</p>{" "}
            <button onClick={() => navigate("/quotation/master")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              {" "}
              View Quotations{" "}
            </button>{" "}
          </div>{" "}
          {loading ? (
            <Loading />
          ) : (
            <table className="w-full text-left border border-gray-300 rounded-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Quotations</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length <= 1 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users
                    .filter((u) => u._id !== currentAdmin?._id)
                    .map((u) => (
                      <tr key={u._id} className="border-b hover:bg-green-50 transition">
                        {/* NAME */}
                        <td className="p-3 font-medium text-gray-800">{u.name}</td>

                        {/* EMAIL */}
                        <td className="p-3 text-gray-700">{u.email}</td>

                        {/* ROLE */}
                        <td className="p-3 capitalize">
                          <span className="px-2 py-1 rounded-md bg-gray-200 text-sm font-semibold">{u.role}</span>
                        </td>

                        {/* QUOTATIONS COUNT */}
                        <td className="p-3 text-center font-bold text-green-700">{u.totalQuotations || 0}</td>

                        {/* STATUS */}
                        <td className="p-3">{u.approved ? <span className="text-green-700 font-bold">Approved ✔</span> : <span className="text-red-600 font-bold">Pending ✖</span>}</td>

                        {/* ACTIONS */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {/* Role Change */}
                            {canChangeRole(u) && (
                              <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} className="border px-2 py-1 rounded-md text-sm">
                                <option value="user">User</option>
                                <option value="subadmin">Sub Admin</option>
                                {isAdmin && <option value="admin">Admin</option>}
                              </select>
                            )}

                            {/* Edit */}
                            {canEditUser(u) && (
                              <button onClick={() => openEditUserModal(u)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full" title="Edit User">
                                <FaEdit size={14} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setSelectedUserId(u._id);
                                setSelectedUserName(u.name);
                                setConfirmOpen(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                              title="Delete User"
                            >
                              <FaTrash size={14} />
                            </button>

                            {/* Approve */}
                            {!u.approved && u.role !== "admin" && (
                              <button onClick={() => approveUser(u._id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full" title="Approve User">
                                <FaCheck size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          )}
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

      {editUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Edit User Details</h2>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input placeholder="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="p-2 border rounded" />

              <input placeholder="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="p-2 border rounded" />

              <input placeholder="Mobile Number" value={editForm.number} onChange={(e) => setEditForm({ ...editForm, number: e.target.value })} className="p-2 border rounded" />

              <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="p-2 border rounded">
                <option value="user">User</option>
                <option value="subadmin">Sub Admin</option>
                <option value="admin">Admin</option>
              </select>

              <select value={editForm.approved} onChange={(e) => setEditForm({ ...editForm, approved: e.target.value === "true" })} className="p-2 border rounded">
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>

              <input placeholder="Place" value={editForm.place} onChange={(e) => setEditForm({ ...editForm, place: e.target.value })} className="p-2 border rounded" />

              <input placeholder="Tahsil" value={editForm.tahsil} onChange={(e) => setEditForm({ ...editForm, tahsil: e.target.value })} className="p-2 border rounded" />

              <input placeholder="District" value={editForm.district} onChange={(e) => setEditForm({ ...editForm, district: e.target.value })} className="p-2 border rounded" />

              <input placeholder="State" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} className="p-2 border rounded" />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setEditUserModal(false)} className="px-5 py-2 bg-gray-400 text-white rounded-lg">
                Cancel
              </button>

              <button onClick={updateUserDetails} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUserName}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

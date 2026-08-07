import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import CommonAlert from "../components/CommonAlert";
import { updateProfile } from "../api/api";
import Loading from "../components/Loading";
import ConfirmDialog from "../components/ConfirmDialog";

import { useCallback } from "react";

export default function AdminDashboard() {
  const { auth, setAuth, logout } = useAuth();
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
  const currentViewAccess = auth?.user?.viewAccess || "none";
  const visibleUsers = users.filter((u) => u._id !== currentAdmin?._id);
  const canShowEmptyUsersState = currentRole === "admin" || currentViewAccess !== "none";
  const canAccessQuotationCalendar = auth?.user?.role === "admin" || auth?.user?.canAccessQuotationCalendar;

  // Fetch all users
  const getAllUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/auth/admin/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

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
  // const updateRole = async (id, role) => {
  //   try {
  //     await axios.put(`${BASE_URL}/auth/admin/update-role/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
  //     getAllUsers();
  //   } catch (error) {
  //     console.error("Error updating role:", error);
  //   }
  // };

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
  }, [getAllUsers]);

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
    isActive: true,
    status: "approved",
    place: "",
    tahsil: "",
    district: "",
    state: "",
    viewAccess: "none",
    canEditSchedule: false,
    canSeeSchedule: false,
    canRemoveSchedule: false,
    canAccessQuotationCalendar: false,
      canActiveQuotation: false,
  });

  const updateUserDetails = async () => {
    try {
      const res = await updateProfile(editForm, selectedUser._id);
      if (res) {
        const updatedUser = res.user || null;
        setAlert({
          message: "User Updated Successfully!",
          type: "success",
        });

        if (updatedUser && auth?.user?._id === updatedUser._id) {
          const mustLogout = updatedUser.isActive === false || !updatedUser.approved;

          setAuth({
            ...auth,
            user: updatedUser,
          });
          sessionStorage.setItem("user", JSON.stringify(updatedUser));

          if (mustLogout) {
            logout();
            return;
          }
        }

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
      isActive: user.isActive !== false,
      status: user.approved ? "approved" : "pending",
      place: user.place || "",
      tahsil: user.tahsil || "",
      district: user.district || "",
      state: user.state || "",
      viewAccess: user.viewAccess || "none",
      canEditSchedule: user.canEditSchedule || false,
      canSeeSchedule: user.canSeeSchedule || false,
      canRemoveSchedule: user.canRemoveSchedule || false,
      canAccessQuotationCalendar: user.canAccessQuotationCalendar || false,
        canActiveQuotation: user.canActiveQuotation || false,
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

  // const canChangeRole = (user) => {
  //   if (isAdmin) return true;
  //   if (isSubAdmin && user.role !== "admin") return true;
  //   return false;
  // };

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
    <div className="page-shell w-full">
      <div className="container-pro max-w-full w-full px-0 panel-pro p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🛠️ Admin Dashboard</h1>

        <p className="text-lg mb-6 text-gray-700">Manage users, approve accounts, edit roles, and remove users.</p>

        {/* Users Table */}
        <div className="w-full">
          <div>
            {currentAdmin && (
              <div className="mb-6 rounded-2xl border border-green-900/10 bg-green-50/80 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <div className="flex justify-start ">
            <div className="mb-5 w-full rounded-2xl border border-green-900/10 bg-white p-5 shadow-sm sm:max-w-md mr-3">
              {" "}
              <h2 className="font-bold text-xl text-green-700 mb-2">📄 Quotations</h2> <p className="text-gray-700">Check your generated quotations.</p>{" "}
              <button onClick={() => navigate("/quotation/master")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                {" "}
                View Quotations{" "}
              </button>{" "}
            </div>{" "}
            {canAccessQuotationCalendar && (
              <div className="mb-5 w-full rounded-2xl border border-green-900/10 bg-white p-5 shadow-sm sm:max-w-md">
                <h2 className="font-bold text-xl text-green-700 mb-2">🗓️ Quotation Calendar</h2>
                <p className="text-gray-700">See quotation dates, farmer details, instructions, and send WhatsApp alerts from one place.</p>
                <button onClick={() => navigate("/quotation/calendar")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  Open Calendar
                </button>
              </div>
            )}
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="w-full overflow-x-auto border rounded-lg">
              {canShowEmptyUsersState && (
                <table className="table-pro w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-3 min-w-[40px] text-center"></th>
                      <th className="p-3 min-w-[140px] text-center">Name</th>
                      <th className="p-3 min-w-[180px] text-center">Email</th>
                      <th className="p-3 min-w-[80px] text-center">Role</th>
                      {isAdmin && <th className="p-3 min-w-[110px] text-center">View Access</th>}
                      {isAdmin && <th className="p-2 min-w-[72px] text-center">Edit</th>}
                      {isAdmin && <th className="p-2 text-center min-w-[72px]">View</th>}
                      {isAdmin && <th className="p-2 text-center min-w-[92px]">Calendar</th>}
                      {isAdmin && <th className="p-2 text-center min-w-[72px]">Remove</th>}
                      <th className="p-3 text-center min-w-[80px]">Quotations</th>
                      {/* <th className="p-3 min-w-[100px] text-center">Status</th> */}
                      {isAdmin && <th className="p-3 text-center min-w-[140px]">Actions</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {visibleUsers.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 10 : 5} className="text-center p-4 text-gray-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      visibleUsers.map((u) => (
                  <tr key={u._id} className="px-2 border-b hover:bg-green-50 transition">
  <td className="w-6 p-1">
  <div
    className={`mx-auto h-[15px] w-[4px] rounded-full ${
      u.isActive === false
        ? "bg-red-600"
        : u.approved
        ? "bg-green-600"
        : "bg-yellow-500"
    }`}
    title={
      u.isActive === false
        ? "Inactive"
        : u.approved
        ? "Approved"
        : "Pending"
    }
  />
</td>
                          {/* NAME */}
                          <td className="p-1 font-medium text-gray-800 min-w-[140px]">{u.name}</td>

                          {/* EMAIL */}
                          <td className="p-1 text-gray-700 min-w-[180px] break-words">{u.email}</td>

                          {/* ROLE */}
                          <td className="p-1 capitalize min-w-[80px] text-center"> 
                            <span className="px-2 py-1 rounded-md bg-gray-200 text-sm font-semibold">{u.role}</span>
                          </td>

                          {isAdmin && (
                            <td className="p-1 min-w-[110px]  text-center">
                              <span className="text-sm font-semibold capitalize">{u.viewAccess || "none"}</span>
                            </td>
                          )}

                          {isAdmin && (
                            <td className="p-1 text-center min-w-[100px]">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${u.canEditSchedule ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {u.canEditSchedule ? "Yes" : "No"}
                              </span>
                            </td>
                          )}

                          {isAdmin && (
                            <td className="p-1 text-center min-w-[100px]">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${u.canSeeSchedule ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {u.canSeeSchedule ? "Yes" : "No"}
                              </span>
                            </td>
                          )}

                          {isAdmin && (
                            <td className="p-1 text-center min-w-[120px]">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${u.canAccessQuotationCalendar ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {u.canAccessQuotationCalendar ? "Yes" : "No"}
                              </span>
                            </td>
                          )}

                          {isAdmin && (
                            <td className="p-1 text-center min-w-[100px]">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${u.canRemoveSchedule ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {u.canRemoveSchedule ? "Yes" : "No"}
                              </span>
                            </td>
                          )}

                          {/* QUOTATIONS COUNT */}
                          <td className="p-1 text-center font-bold text-green-700 min-w-[90px]">{u.totalQuotations || 0}</td>

                          {/* STATUS */}
                          {/* <td className="p-1 text-center min-w-[70px]">
                            <div
                              className={`mx-auto h-[15px] w-[15px] rounded-full ${
                                u.isActive === false ? "bg-red-600" : u.approved ? "bg-green-600" : "bg-yellow-500"
                              }`}
                              title={u.isActive === false ? "Inactive" : u.approved ? "Approved" : "Pending"}
                            />
                          </td> */}

                          {/* ACTIONS */}
                          {isAdmin && (
                            <td className="p-1 min-w-[140px] ">
                              <div className="flex items-center gap-2 flex-wrap  justify-center d-flex">
                                {/* Role Change */}
                                {/* {canChangeRole(u) && (
                                  <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} className="border px-2 py-1 rounded-md text-sm whitespace-nowrap">
                                    <option value="user">User</option>
                                    <option value="subadmin">Sub Admin</option>
                                    {isAdmin && <option value="admin">Admin</option>}
                                  </select>
                                )} */}

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
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
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

              <label className="space-y-1">
                <span className="font-semibold">Role</span>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="p-2 border rounded w-full">
                  <option value="user">User — basic access</option>
                  <option value="subadmin">Sub Admin — schedule support</option>
                  <option value="admin">Admin — full permissions</option>
                </select>
                <p className="text-xs text-gray-500">Choose the permission level for this user.</p>
              </label>

              <label className="space-y-1">
                <span className="font-semibold">Account status</span>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className={`p-2 border rounded w-full ${
                    editForm.status === "approved"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  <option value="approved">Approved & Active</option>
                  <option value="pending">Pending approval</option>
                </select>
                <p className="text-xs text-gray-500">Set whether the user can log in and whether their account is approved.</p>
              </label>

              <label className="space-y-1">
                <span className="font-semibold">User visibility</span>
                <select value={editForm.viewAccess} onChange={(e) => setEditForm({ ...editForm, viewAccess: e.target.value })} className="p-2 border rounded w-full">
                  <option value="none">No user list access</option>
                  <option value="all-users">Can view all users</option>
                  <option value="subadmins">Can view subadmins only</option>
                </select>
                <p className="text-xs text-gray-500">Control which users this user can see in the admin list.</p>
              </label>

              <label className="flex flex-col gap-1 rounded border p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editForm.canSeeSchedule} onChange={(e) => setEditForm({ ...editForm, canSeeSchedule: e.target.checked })} />
                  <span className="text-sm font-medium">Can view farmer schedules</span>
                </div>
                <p className="text-xs text-gray-500">Allows this user to view schedules created for farmers.</p>
              </label>

              <label className="flex flex-col gap-1 rounded border p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editForm.canEditSchedule} onChange={(e) => setEditForm({ ...editForm, canEditSchedule: e.target.checked })} />
                  <span className="text-sm font-medium">Can create or update schedules</span>
                </div>
                <p className="text-xs text-gray-500">Grants permission to create new schedules or edit existing ones.</p>
              </label>

              <label className="flex flex-col gap-1 rounded border p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editForm.canRemoveSchedule} onChange={(e) => setEditForm({ ...editForm, canRemoveSchedule: e.target.checked })} />
                  <span className="text-sm font-medium">Can remove schedules</span>
                </div>
                <p className="text-xs text-gray-500">Allows deleting schedules (use with caution).</p>
              </label>

              <label className="flex flex-col gap-1 rounded border p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editForm.canAccessQuotationCalendar} onChange={(e) => setEditForm({ ...editForm, canAccessQuotationCalendar: e.target.checked })} />
                  <span className="text-sm font-medium">Can access quotation calendar</span>
                </div>
                <p className="text-xs text-gray-500">Allows opening the shared quotation calendar and sending reminders.</p>
              </label>

              <label className="flex flex-col gap-1 rounded border p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.canActiveQuotation}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        canActiveQuotation: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium">Can activate / deactivate quotations</span>
                </div>
                <p className="text-xs text-gray-500">When enabled the user can toggle a quotation's active state (affects calendar visibility).</p>
              </label>

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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPencil } from "react-icons/fa6";
import CommonAlert from "../components/CommonAlert";

import { getMyQuotationCount, updateUserProfile } from "../api/api"; // adjust path

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quotationCount, setQuotationCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    place: "",
    tahsil: "",
    district: "",
    state: "",
  });
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) return navigate("/login");

    const parsedUser = JSON.parse(userData);

    if (!parsedUser.approved) {
      return navigate("/pending");
    }

    setUser(parsedUser);
    setForm({
      name: parsedUser.name || "",
      place: parsedUser.place || "",
      tahsil: parsedUser.tahsil || "",
      district: parsedUser.district || "",
      state: parsedUser.state || "",
    });
  }, [navigate]);

  const { auth, setAuth } = useAuth();

  const handleUpdate = async () => {
    try {
      await updateUserProfile(user._id, detailform);

      const updatedUser = { ...auth.user, ...detailform };

      // ✅ Update context (this also syncs sessionStorage)
      setAuth({ ...auth, user: updatedUser });

      setUser(updatedUser);
      setShowModal(false);
      setIsEditing(false);

      setAlert({
        message: "Profile updated successfully ✅",
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: "Something went wrong ❌",
        type: "error",
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [detailform, setDetailForm] = useState({
    place: user?.place || "",
    tahsil: user?.tahsil || "",
    district: user?.district || "",
    state: user?.state || "",
  });

  const handleformChange = (e) => {
    setDetailForm({ ...detailform, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getMyQuotationCount();
        setQuotationCount(res.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">👨‍🌾 User Dashboard</h1>

        {user && (
          <div className="mb-6 space-y-3">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-lg">
                <span className="font-semibold">Name:</span> {user.name}
              </p>

              <p className="text-lg">
                <span className="font-semibold">Email:</span> {user.email}
              </p>

              <p className="text-lg">
                <span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span>
              </p>

              <p className="text-lg">
                <span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">Approved ✔️</span>
              </p>

              {/* NEW FIELDS */}
              <p className="text-lg">
                <span className="font-semibold">Place:</span> {user.place || "Not Updated"}
              </p>

              <p className="text-lg">
                <span className="font-semibold">Tahsil:</span> {user.tahsil || "Not Updated"}
              </p>

              <p className="text-lg">
                <span className="font-semibold">District:</span> {user.district || "Not Updated"}
              </p>

              <p className="text-lg">
                <span className="font-semibold">State:</span> {user.state || "Not Updated"}
              </p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-green-600 hover:text-green-800 font-semibold">
                <FaPencil size={18} /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {" "}
              {auth.user?.role !== "user" && (
                <div className="bg-green-100 p-6 rounded-xl shadow">
                  {" "}
                  <h2 className="font-bold text-xl text-green-700 mb-2">🌱 Crop Schedules</h2> <p className="text-gray-700">View your crop schedules and updates.</p>{" "}
                  <button onClick={() => navigate("/crop-schedule")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    {" "}
                    View Schedules{" "}
                  </button>{" "}
                </div>
              )}{" "}
              <div className="bg-green-100 p-6 rounded-xl shadow">
                <h2 className="font-bold text-xl text-green-700 mb-2">📄 Quotations</h2>

                <p className="text-gray-700">
                  Total Generated: <span className="font-bold">{quotationCount}</span>
                </p>

                <button onClick={() => navigate("/quotation/master")} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  View Quotations
                </button>
              </div>
            </div>
            {/* NAME (Read Only) */}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-green-700 mb-4">Edit Farmer Details</h2>

            <div className="space-y-4">
              {/* PLACE */}
              <div>
                <label className="font-semibold">Place:</label>
                <input type="text" name="place" value={detailform.place} onChange={handleformChange} className="w-full mt-1 p-2 border rounded" />
              </div>

              {/* TAHSIL */}
              <div>
                <label className="font-semibold">Tahsil:</label>
                <input type="text" name="tahsil" value={detailform.tahsil} onChange={handleformChange} className="w-full mt-1 p-2 border rounded" />
              </div>

              {/* DISTRICT */}
              <div>
                <label className="font-semibold">District:</label>
                <input type="text" name="district" value={detailform.district} onChange={handleformChange} className="w-full mt-1 p-2 border rounded" />
              </div>

              {/* STATE */}
              <div>
                <label className="font-semibold">State:</label>
                <input type="text" name="state" value={detailform.state} onChange={handleformChange} className="w-full mt-1 p-2 border rounded" />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>

              <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
    </div>
  );
}

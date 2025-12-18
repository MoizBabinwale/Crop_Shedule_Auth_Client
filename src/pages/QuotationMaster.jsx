import React, { useEffect, useState, useCallback } from "react";
import { getAllQuotations, deleteQuotation, getUserQuotations, updateQuotation, getQuotationById } from "../api/api";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images.jpg";
import Loading from "../components/Loading";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import CommonAlert from "../components/CommonAlert";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

function QuotationMaster() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteCropName, setDeleteCropName] = useState("");
  // const user = JSON.parse(localStorage.getItem("user"));
  // const role = user?.role;

  const { auth, loading: authLoading } = useAuth();

  const role = auth.user?.role;

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Alert
  const [alert, setAlert] = useState({ message: "", type: "success" });

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    cropName: "",
    acres: "",
    farmerInfo: { name: "", place: "" },
  });

  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FETCH QUOTATIONS ---------------- */
  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      const res = role === "admin" || role === "subadmin" ? await getAllQuotations() : await getUserQuotations();

      setQuotations(res || []);
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to load quotations ❌", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!authLoading && role) {
      fetchQuotations();
    }
  }, [authLoading, role, fetchQuotations]);
  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    try {
      await deleteQuotation(deleteId);

      setAlert({
        message: `Quotation "${deleteCropName}" deleted successfully ✅`,
        type: "success",
      });

      fetchQuotations();
      if ((currentPage - 1) * ITEMS_PER_PAGE >= filteredQuotations.length - 1) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to delete quotation ❌", type: "error" });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setDeleteCropName("");
    }
  };

  const openDeleteConfirm = (id, cropName) => {
    setDeleteId(id);
    setDeleteCropName(cropName);
    setConfirmOpen(true);
  };

  /* ---------------- VIEW ---------------- */
  const handleView = (id) => navigate(`/schedule/quotation/${id}`);

  /* ---------------- EDIT ---------------- */
  const handleEdit = async (id) => {
    try {
      const res = await getQuotationById(id);
      setEditId(id);
      setEditData(res);
      setEditModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async () => {
    try {
      await updateQuotation(editId, editData);
      setEditModalOpen(false);
      fetchQuotations();
      setAlert({ message: "Quotation updated successfully ✅", type: "success" });
    } catch (err) {
      console.error(err);
      setAlert({ message: "Update failed ❌", type: "error" });
    }
  };

  // FILTER (ADMIN ONLY)
  const filteredQuotations =
    role === "admin" || role === "subadmin"
      ? quotations.filter((q) => {
          const s = search.toLowerCase();
          return q.cropName?.toLowerCase().includes(s) || q.farmerInfo?.name?.toLowerCase().includes(s) || q.farmerInfo?.place?.toLowerCase().includes(s);
        })
      : quotations;

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredQuotations.length / ITEMS_PER_PAGE);

  const paginatedQuotations = filteredQuotations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl shadow bg-white mb-6">
        <img src={banner} alt="Quotation Banner" className="w-fit h-40 object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/70 to-green-500/60"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">Quotation Master</h1>
          <p className="text-white/90 mt-1 text-sm md:text-base">Manage, view, and organize crop quotations.</p>
        </div>
      </div>

      {/* SEARCH */}
      {(role === "admin" || role === "subadmin") && (
        <div className="mb-4">
          <input type="text" placeholder="Search by Farmer / Place / Crop" className="p-3 w-full border border-green-600 rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <p className="p-6 text-lg">
          ⏳<Loading />
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-green-600 pl-3 mb-4">All Quotations</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Crop Name</th>
                  <th className="p-3 text-left">Farmer Name</th>
                  <th className="p-3 text-left">Place</th>
                  <th className="p-3 text-left">Acres</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredQuotations.length > 0 ? (
                  paginatedQuotations.map((q, index) => (
                    <tr key={q._id} className="border-b hover:bg-gray-100 transition">
                      <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                      <td className="p-3 font-medium">{q.cropName}</td>
                      <td className="p-3 font-medium">{q.farmerInfo.name}</td>
                      <td className="p-3 font-medium">{q.farmerInfo.place}</td>
                      <td className="p-3">{q.acres}</td>
                      <td className="p-3">{new Date(q.createdAt).toLocaleDateString()}</td>

                      <td className="p-3 flex gap-4 items-center">
                        {/* VIEW */}
                        <button onClick={() => handleView(q._id)} className="text-blue-600 hover:text-blue-800" title="View">
                          <FaEye size={18} />
                        </button>

                        {/* ADMIN / SUBADMIN */}
                        {(role === "admin" || role === "subadmin") && (
                          <>
                            <button onClick={() => handleEdit(q._id)} className="text-green-600 hover:text-green-800" title="Edit">
                              <FaEdit size={18} />
                            </button>

                            <button onClick={() => openDeleteConfirm(q._id, q.cropName)} className="text-red-600 hover:text-red-800" title="Delete">
                              <FaTrash size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No quotations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50">
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                    {i + 1}
                  </button>
                ))}

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[400px]">
            <h3 className="text-xl font-bold mb-4">Edit Quotation</h3>

            <input type="text" value={editData.cropName} onChange={(e) => setEditData({ ...editData, cropName: e.target.value })} className="w-full border p-2 rounded mb-3" placeholder="Crop Name" />

            <input type="number" value={editData.acres} onChange={(e) => setEditData({ ...editData, acres: e.target.value })} className="w-full border p-2 rounded mb-3" placeholder="Acres" />

            <input
              type="text"
              value={editData.farmerInfo.name}
              onChange={(e) => setEditData({ ...editData, farmerInfo: { ...editData.farmerInfo, name: e.target.value } })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Farmer Name"
            />

            <input
              type="text"
              value={editData.farmerInfo.place}
              onChange={(e) => setEditData({ ...editData, farmerInfo: { ...editData.farmerInfo, place: e.target.value } })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Place"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-400 rounded text-white">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-2 bg-green-600 rounded text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "success" })} />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Quotation"
        message={`Do you really want to delete "${deleteCropName}" quotation?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default QuotationMaster;

import React, { useEffect, useState } from "react";
import { getAllQuotations, deleteQuotation, getUserQuotations, updateQuotation, getQuotationById } from "../api/api";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images.jpg";
import Loading from "../components/Loading";

function QuotationMaster() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // EDIT MODAL STATE
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    cropName: "",
    acres: "",
    farmerInfo: { name: "", place: "" },
  });
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // FETCH DATA
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      let res;

      if (role === "admin" || role === "subadmin") {
        res = await getAllQuotations();
      } else {
        res = await getUserQuotations();
      }

      if (res.length > 0) setQuotations(res);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch quotations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;

    await deleteQuotation(id);
    fetchQuotations();
  };

  // VIEW
  const handleView = (id) => navigate(`/schedule/quotation/${id}`);

  // EDIT (OPEN MODAL)
  const handleEdit = async (id) => {
    try {
      const res = await getQuotationById(id);
      setEditId(id);
      setEditData(res);
      setEditModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  // EDIT (SAVE TO BACKEND)
  const saveEdit = async () => {
    try {
      await updateQuotation(editId, editData);
      setEditModalOpen(false);
      fetchQuotations();
    } catch (err) {
      console.log(err);
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
                  filteredQuotations.map((q, index) => (
                    <tr key={q._id} className="border-b hover:bg-gray-100 transition">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">{q.cropName}</td>
                      <td className="p-3 font-medium">{q.farmerInfo.name}</td>
                      <td className="p-3 font-medium">{q.farmerInfo.place}</td>
                      <td className="p-3">{q.acres}</td>
                      <td className="p-3">{new Date(q.createdAt).toLocaleDateString()}</td>

                      <td className="p-3 flex gap-3">
                        {/* VIEW */}
                        <button onClick={() => handleView(q._id)} className="text-blue-600 hover:underline">
                          View
                        </button>

                        {/* ADMIN ONLY */}
                        {(role === "admin" || role === "subadmin") && (
                          <>
                            <button onClick={() => handleEdit(q._id)} className="text-green-600 hover:underline">
                              Edit
                            </button>

                            <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:underline">
                              Delete
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
    </div>
  );
}

export default QuotationMaster;

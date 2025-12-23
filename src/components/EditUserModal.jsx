const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Edit User</h3>

        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Name" />

        <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Email" />

        <select name="role" value={form.role} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value="user">User</option>
          <option value="subadmin">Sub Admin</option>
          <option value="admin">Admin</option>
        </select>

        <select name="approved" value={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.value === "true" })} className="border p-2 w-full mb-4">
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-1 bg-green-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

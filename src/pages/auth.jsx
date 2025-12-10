import React, { useState } from "react";
import { loginUser, registerUser } from "../api/authapi";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const res = await loginUser({ email: form.email, password: form.password });
      if (res?.data?.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } else {
      const res = await registerUser(form);
      if (res?.data?.success) {
        alert("Registration successful! Wait for admin approval.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-300">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input type="text" name="name" placeholder="Full Name" className="w-full p-3 border rounded-lg" onChange={handleChange} required />}

          <input type="email" name="email" placeholder="Email Address" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <input type="number" name="number" placeholder="Mobile Number" className="w-full p-3 border rounded-lg" onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={handleChange} required />

          <button type="submit" className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button className="w-full text-green-700 mt-4 font-medium" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

// ========================= ADMIN DASHBOARD ============================
export function AdminDashboard() {
  const [users, setUsers] = React.useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await getAllUsers();
    if (res?.data) setUsers(res.data);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    await approveUser(id);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Admin Dashboard</h1>

      <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Number</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Approved</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-gray-200">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.number}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{u.approved ? "Yes" : "No"}</td>
              <td className="p-3 flex gap-2">
                {!u.approved && (
                  <button onClick={() => handleApprove(u._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg">
                    Approve
                  </button>
                )}
                <button onClick={() => handleDelete(u._id)} className="px-3 py-1 bg-red-600 text-white rounded-lg">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

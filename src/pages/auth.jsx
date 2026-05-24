import React, { useState } from "react";
import { loginUser, registerUser } from "../api/authapi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import CommonAlert from "../components/CommonAlert";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUserWithGoogle } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", number: "" });
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async (response) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/google-login`, {
        token: response.credential,
      });

      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.googleAccessToken) {
          sessionStorage.setItem("googleAccessToken", res.data.googleAccessToken);
        }

        if (loginUserWithGoogle) {
          loginUserWithGoogle(res.data.token, res.data.user, res.data.googleAccessToken);
        }

        setAlert({ message: "Google login successful!", type: "success" });
        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin");
          } else if (res.data.user.approved) {
            navigate("/dashboard");
          } else {
            navigate("/pending");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setAlert({
        message: error.response?.data?.message || "Google login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password });
        if (res?.data?.success) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        } else {
          setAlert({ message: "Login failed. Check your credentials.", type: "error" });
        }
      } else {
        const res = await registerUser(form);
        if (res?.data?.success) {
          setAlert({
            message: "Registration successful! Wait for admin approval.",
            type: "success",
          });
          setIsLogin(true);
          setForm({ name: "", email: "", password: "", number: "" });
        } else {
          setAlert({ message: res?.data?.message || "Registration failed", type: "error" });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setAlert({
        message: error.response?.data?.message || "An error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-300">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">{isLogin ? "Login" : "Register"}</h2>

        {alert.message && <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />}

        {isLogin && (
          <div className="mb-6">
            <GoogleLogin onSuccess={handleGoogleSignIn} onError={() => setAlert({ message: "Google login failed", type: "error" })} text="signin_with" width="100%" />
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={handleChange}
                value={form.name}
                required
              />
              <input
                type="tel"
                name="number"
                placeholder="Mobile Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={handleChange}
                value={form.number}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={handleChange}
            value={form.email}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={handleChange}
            value={form.password}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          type="button"
          className="w-full text-green-700 mt-4 font-medium hover:text-green-800 transition"
          onClick={() => {
            setIsLogin(!isLogin);
            setForm({ name: "", email: "", password: "", number: "" });
            setAlert({ message: "", type: "success" });
          }}
        >
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
      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
    </div>
  );
}

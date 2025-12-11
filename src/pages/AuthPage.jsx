import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import Loading from "../components/Loading";
import CommonAlert from "../components/CommonAlert";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { loginUser } = useAuth();

  // LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        number: formData.number,
        password: formData.password,
      });

      if (res.data) {
        loginUser(res.data.token, res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setLoading(false);

        if (!res.data.user.approved) {
          navigate("/pending");
          return;
        }

        if (res.data.user.role === "admin") navigate("/admin");
        else navigate("/user");
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        message: err.response?.data?.message || "Invalid login details!",
        type: "error",
      });
      console.log(err);
    }
  };

  // REGISTER
  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/register`, formData);

      if (res.data) {
        setAlert({
          message: "Registered successfully! Wait for admin approval.",
          type: "success",
        });
        setIsLogin(true);
        setLoading(false);
        setFormData({ name: "", email: "", password: "", number: "" });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setAlert({
        message: err.response?.data?.message || "Registration failed!",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded-lg mb-3" />}
          {!isLogin && <input type="email" name="email" placeholder="email" onChange={handleChange} className="w-full p-3 border rounded-lg mb-3" />}

          <input type="number" name="number" placeholder="Mobile Number" onChange={handleChange} className="w-full p-3 border rounded-lg mb-3" />

          <div className="relative">
            <input type={showPass ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg mb-4" />

            <button type="button" onClick={() => setShowPass(!showPass)} className="pt-3 absolute inset-y-0 right-3 flex opacity-60 hover:opacity-100 transition">
              {showPass ? <IoIosEyeOff size={22} /> : <IoMdEye size={22} />}
            </button>
          </div>

          <button onClick={isLogin ? handleLogin : handleRegister} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-center mt-4">
            <button className="text-green-700 underline" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </p>
        </div>
      )}
      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
    </div>
  );
}

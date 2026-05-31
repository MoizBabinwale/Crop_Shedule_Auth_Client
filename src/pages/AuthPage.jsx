import React, { useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../config/baseURL";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Phone, UserPlus } from "lucide-react";
import Loading from "../components/Loading";
import CommonAlert from "../components/CommonAlert";
import { useAuth } from "../context/AuthContext";
import bannerImg from "../assets/banner1.webp";

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", number: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        number: formData.number,
        password: formData.password,
      });

      if (res.data) {
        loginUser(res.data.token, res.data.user);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));

        if (!res.data.user.approved) {
          navigate("/pending");
          return;
        }

        navigate(res.data.user.role === "admin" ? "/admin" : "/user");
      }
    } catch (err) {
      setAlert({ message: err.response?.data?.message || "Invalid login details.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/register`, formData);

      if (res.data) {
        setAlert({ message: "Registered successfully. Wait for admin approval.", type: "success" });
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", number: "" });
      }
    } catch (err) {
      setAlert({ message: err.response?.data?.message || "Registration failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-green-950 px-4 py-10 sm:py-16">
      <img src={bannerImg} alt="Crop field" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-950/90 to-emerald-900/75" />

      <div className="container-pro relative grid min-h-[calc(100vh-160px)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden text-white lg:block">
          <p className="text-sm font-black uppercase tracking-normal text-amber-300">Parnanetra Agro System</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight">Manage crop work with a cleaner digital cockpit.</h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-green-50/85">
            Login to manage quotations, schedules, products, approvals, and farmer information from one responsive workspace.
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {["Secure", "Responsive", "Fast"].map((label) => (
              <div key={label} className="rounded-xl border border-white/15 bg-white/10 p-4 text-center text-sm font-black backdrop-blur">
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="panel-pro overflow-hidden">
            <div className="border-b border-green-900/10 bg-white px-6 py-6 sm:px-8">
              <p className="text-sm font-black uppercase tracking-normal text-green-700">{isLogin ? "Welcome back" : "Create account"}</p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">{isLogin ? "Login" : "Register"}</h2>
              <p className="mt-2 text-sm text-slate-500">{isLogin ? "Use your mobile number and password to continue." : "Submit your details for admin approval."}</p>
            </div>

            <div className="bg-white p-6 sm:p-8">
              {loading ? (
                <Loading />
              ) : (
                <div className="space-y-4">
                  {!isLogin && (
                    <>
                      <input type="text" name="name" value={formData.name} placeholder="Full name" onChange={handleChange} className="w-full border px-4 py-3" />
                      <input type="email" name="email" value={formData.email} placeholder="Email address" onChange={handleChange} className="w-full border px-4 py-3" />
                    </>
                  )}

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" name="number" value={formData.number} placeholder="Mobile number" onChange={handleChange} className="w-full border py-3 pl-10 pr-4" />
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type={showPass ? "text" : "password"} name="password" value={formData.password} placeholder="Password" onChange={handleChange} className="w-full border py-3 pl-10 pr-12" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
                      {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>

                  <button onClick={isLogin ? handleLogin : handleRegister} className="btn-primary w-full">
                    {isLogin ? "Login" : "Register"}
                  </button>

                  {isLogin && (
                    <>
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-bold uppercase text-slate-400">or</span>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      <button onClick={() => (window.location.href = `${BACKEND_BASE_URL}/auth/google`)} className="btn-secondary w-full">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="" className="h-5 w-5" />
                        Continue with Google
                      </button>
                    </>
                  )}

                  <button className="mx-auto flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900" onClick={() => setIsLogin(!isLogin)}>
                    <UserPlus size={16} />
                    {isLogin ? "Need an account? Register" : "Already registered? Login"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <CommonAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, message: "" })} />
    </main>
  );
}

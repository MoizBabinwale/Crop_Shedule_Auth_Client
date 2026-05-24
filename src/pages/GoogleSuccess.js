import React, { useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { BASE_URL } from "../config/baseURL";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  const { loginUserWithGoogle } = useAuth();

  useEffect(() => {
    const loginGoogleUser = async () => {
      try {
        // GET TOKEN FROM URL

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");

        if (!token) {
          navigate("/login");

          return;
        }

        // GET USER DATA

        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;

        // SAVE LOGIN

        loginUserWithGoogle(token, user, user.googleAccessToken);

        // SAVE SESSION

        sessionStorage.setItem("token", token);

        sessionStorage.setItem("user", JSON.stringify(user));

        // REDIRECT

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } catch (err) {
        console.log(err);

        navigate("/login");
      }
    };

    loginGoogleUser();
  }, []);

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        text-green-700
      "
    >
      Logging you in...
    </div>
  );
}

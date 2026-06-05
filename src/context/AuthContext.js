import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/baseURL.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
    loading: true,
    googleAccessToken: null,
  });

  useEffect(() => {
    const bootstrap = async () => {
      const saved = sessionStorage.getItem("authState");

      if (saved) {
        const parsed = JSON.parse(saved);
        setAuth({
          ...parsed,
          loading: true,
        });
      } else {
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("user");
        const googleAccessToken = sessionStorage.getItem("googleAccessToken");

        if (token && user) {
          setAuth({
            isLoggedIn: true,
            token,
            user: JSON.parse(user),
            loading: true,
            googleAccessToken,
          });
        } else {
          setAuth({
            isLoggedIn: false,
            token: null,
            user: null,
            loading: false,
            googleAccessToken: null,
          });
          return;
        }
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        setAuth((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const freshUser = res.data;
        sessionStorage.setItem("user", JSON.stringify(freshUser));
        setAuth((prev) => ({
          ...prev,
          isLoggedIn: true,
          token,
          user: freshUser,
          loading: false,
          googleAccessToken: sessionStorage.getItem("googleAccessToken"),
        }));
      } catch (error) {
        const fallbackUser = sessionStorage.getItem("user");

        setAuth((prev) => ({
          ...prev,
          isLoggedIn: !!token,
          token,
          user: fallbackUser ? JSON.parse(fallbackUser) : prev.user,
          loading: false,
          googleAccessToken: sessionStorage.getItem("googleAccessToken"),
        }));
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (auth.token) {
      const { loading, ...persistedAuth } = auth;
      sessionStorage.setItem("authState", JSON.stringify(persistedAuth));
    } else {
      sessionStorage.removeItem("authState");
    }
  }, [auth]);

  const loginUser = (token, user) => {
    setAuth({
      isLoggedIn: true,
      token,
      user,
      loading: false,
      googleAccessToken: null,
    });
  };

  const loginUserWithGoogle = (token, user, googleAccessToken) => {
    setAuth({
      isLoggedIn: true,
      token,
      user,
      loading: false,
      googleAccessToken,
    });
    sessionStorage.setItem("googleAccessToken", googleAccessToken);
  };

  const logout = () => {
    sessionStorage.clear();

    setAuth({
      isLoggedIn: false,
      token: null,
      user: null,
      loading: false,
      googleAccessToken: null,
    });

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loginUser,
        loginUserWithGoogle,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

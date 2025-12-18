import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("authState");

    if (saved) {
      const parsed = JSON.parse(saved);

      setAuth({
        ...parsed,
        loading: false, // ✅ ensure loading is false
      });
    } else {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        setAuth({
          isLoggedIn: true,
          token,
          user: JSON.parse(user),
          loading: false,
        });
      } else {
        setAuth({
          isLoggedIn: false,
          token: null,
          user: null,
          loading: false,
        });
      }
    }
  }, []);

  // Persist auth to localStorage whenever it changes
  useEffect(() => {
    if (auth.token) {
      const { loading, ...persistedAuth } = auth;
      localStorage.setItem("authState", JSON.stringify(persistedAuth));
    } else {
      localStorage.removeItem("authState");
    }
  }, [auth]);

  const loginUser = (token, user) => {
    setAuth({
      isLoggedIn: true,
      token,
      user,
      loading: false,
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      token: null,
      user: null,
      loading: false,
    });
  };

  return <AuthContext.Provider value={{ auth, loginUser, logout, setAuth }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

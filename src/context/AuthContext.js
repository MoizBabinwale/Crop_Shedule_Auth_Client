import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const [loading, setLoading] = useState(true); // ✅ IMPORTANT

  // Load saved auth on mount
  useEffect(() => {
    const saved = localStorage.getItem("authState");

    if (saved) {
      setAuth(JSON.parse(saved));
    } else {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        setAuth({ isLoggedIn: true, token, user: JSON.parse(user) });
      }
    }

    setLoading(false); // ✅ auth is now loaded
  }, []);

  // Persist auth to localStorage whenever it changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("authState", JSON.stringify(auth));
      localStorage.setItem("token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      localStorage.removeItem("authState");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [auth]);

  const loginUser = (token, user) => {
    setAuth({ isLoggedIn: true, token, user });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, token: null, user: null });
    localStorage.clear();
  };

  return <AuthContext.Provider value={{ auth, loginUser, logout, setAuth, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

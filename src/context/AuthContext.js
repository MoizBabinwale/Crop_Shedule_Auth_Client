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
    const saved = sessionStorage.getItem("authState");

    if (saved) {
      const parsed = JSON.parse(saved);

      setAuth({
        ...parsed,
        loading: false, // ✅ ensure loading is false
      });
    } else {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");

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

  // Persist auth to sessionStorage whenever it changes
  useEffect(() => {
    if (auth.token) {
      const { loading, ...persistedAuth } = auth;
      sessionStorage.setItem("authState", JSON.stringify(persistedAuth));
    } else {
      sessionStorage.removeItem("authState");
      // sessionStorage.removeItem("token");
      // sessionStorage.removeItem("user");
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

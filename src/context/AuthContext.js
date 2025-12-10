import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  // load saved auth on mount
  useEffect(() => {
    const saved = localStorage.getItem("authState");
    if (saved) {
      setAuth(JSON.parse(saved));
    } else {
      // also try the older storage keys in case you were saving token/user separately
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setAuth({ isLoggedIn: true, token, user: JSON.parse(user) });
      }
    }
  }, []);

  // persist auth
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

  // function available to components to log in
  const loginUser = (token, user) => {
    setAuth({ isLoggedIn: true, token, user });
  };

  // function to log out
  const logout = () => {
    setAuth({ isLoggedIn: false, token: null, user: null });
    // localStorage cleared by effect, or do explicitly:
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // window.location.reload();
  };

  return <AuthContext.Provider value={{ auth, loginUser, logout, setAuth }}>{children}</AuthContext.Provider>;
}

// helper hook for easier imports
export const useAuth = () => useContext(AuthContext);

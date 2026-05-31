import React, { createContext, useContext, useEffect, useState } from "react";

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
    const saved = sessionStorage.getItem("authState");

    if (saved) {
      const parsed = JSON.parse(saved);

      setAuth({
        ...parsed,
        loading: false,
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
          loading: false,
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
      }
    }
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

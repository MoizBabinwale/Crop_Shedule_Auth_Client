import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { auth } = useAuth();

  // If already logged in → do NOT allow entering /login
  if (auth.isLoggedIn) {
    if (auth.user?.role === "admin" || auth.user?.role === "subadmin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return children;
}

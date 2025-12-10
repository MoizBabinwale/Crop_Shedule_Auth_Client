import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role, roles }) {
  const { auth } = useAuth();

  // Not logged in
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Not approved
  if (auth.user && auth.user.approved === false) {
    return <Navigate to="/pending" replace />;
  }

  // Single role check
  if (role && auth.user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Multiple roles check
  if (roles && !roles.includes(auth.user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

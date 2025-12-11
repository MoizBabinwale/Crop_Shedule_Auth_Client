import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role, roles }) {
  const { auth, loading } = useAuth();

  // WAIT until auth loads
  if (loading) return <div className="p-6 text-center">Checking access...</div>;

  if (!auth.isLoggedIn) return <Navigate to="/login" replace />;

  if (auth.user?.approved === false) return <Navigate to="/pending" replace />;

  if (role && auth.user?.role !== role) return <Navigate to="/" replace />;

  if (roles && !roles.includes(auth.user?.role)) return <Navigate to="/" replace />;

  return children;
}

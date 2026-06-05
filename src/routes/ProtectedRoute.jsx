import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

export default function ProtectedRoute({ children, role, roles, permission }) {
  const { auth } = useAuth();

  // WAIT until auth loads
  if (auth.loading)
    return (
      <div className="page-shell min-h-screen bg-green-50">
        <div className="container-pro flex min-h-screen items-center justify-center px-4">
          <div className="panel-pro w-full max-w-md border border-green-900/10 bg-white p-8 shadow-sm">
            <Loading message={null} />
          </div>
        </div>
      </div>
    );

  if (!auth.isLoggedIn) return <Navigate to="/login" replace />;

  if (auth.user?.approved === false) return <Navigate to="/pending" replace />;

  if (role && auth.user?.role !== role) return <Navigate to="/" replace />;

  if (roles && !roles.includes(auth.user?.role)) return <Navigate to="/" replace />;

  if (permission && !permission(auth.user)) return <Navigate to="/" replace />;

  return children;
}

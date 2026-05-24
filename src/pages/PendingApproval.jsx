import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PendingApproval() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const user = auth.user;

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-3xl font-bold text-yellow-700 mb-2">Approval Pending</h1>
          <p className="text-gray-600 text-sm">Your account is awaiting admin approval</p>
        </div>

        {/* User Profile Info */}
        {user && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-yellow-500">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-800 font-medium">{user.name || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-800 font-medium">{user.email || "N/A"}</p>
              </div>
              {user.number && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <p className="text-gray-800 font-medium">{user.number}</p>
                </div>
              )}
              {user.role && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-gray-800 font-medium capitalize">{user.role}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-yellow-700 font-medium">⏳ Pending Approval</p>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
          <p className="text-gray-700 text-sm">
            Your account has been registered successfully. An administrator will review your profile and approve your account shortly.
            <br />
            <br />
            <strong>Please check your email</strong> for approval notifications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button onClick={() => window.location.reload()} className="w-full p-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition">
            Refresh Status
          </button>
          <button onClick={logout} className="w-full p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Logout
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">💡 What Happens Next?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Admin reviews your profile information</li>
            <li>✓ You receive approval/rejection email</li>
            <li>✓ Upon approval, you can access full dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

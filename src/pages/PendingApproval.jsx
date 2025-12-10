import React from "react";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-lg">
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">Approval Pending ⏳</h1>
        <p className="text-gray-700">Your account is registered successfully. Please wait for admin approval.</p>
      </div>
    </div>
  );
}

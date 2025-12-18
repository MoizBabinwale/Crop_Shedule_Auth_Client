import React from "react";

const ConfirmDialog = ({ isOpen, message = "Are you sure?", title = "Confirm Action", confirmText = "Yes", cancelText = "Cancel", onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 animate-scaleIn">
        <h2 className="text-xl font-bold text-green-700 mb-3 text-center">{title}</h2>

        <p className="text-gray-700 text-center mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800">
            {cancelText}
          </button>

          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

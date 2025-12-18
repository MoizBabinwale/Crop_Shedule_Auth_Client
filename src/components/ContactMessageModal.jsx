import React from "react";

const ContactMessageModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl">
          ✕
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">Contact Message</h2>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Subject:</strong> {data.subject}
          </p>

          <div className="border-t pt-3">
            <p className="font-semibold mb-1">Message:</p>
            <p className="text-gray-700 whitespace-pre-line">{data.message}</p>
          </div>

          <p className="text-sm text-gray-500 pt-2">{new Date(data.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageModal;

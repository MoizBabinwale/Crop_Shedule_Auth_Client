import { useEffect } from "react";

const CommonAlert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // auto close

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slideIn">
      <div
        className={`px-6 py-3 rounded-xl shadow-xl text-white font-medium
        ${type === "success" ? "bg-green-600" : ""}
        ${type === "error" ? "bg-red-600" : ""}
        ${type === "info" ? "bg-blue-600" : ""}`}
      >
        {message}
      </div>
    </div>
  );
};

export default CommonAlert;

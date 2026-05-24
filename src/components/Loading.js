import React from "react";
import leaf from "../assets/leaf-logo.png"; // 👈 adjust path as per your structure

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={leaf} alt="Leaf" className="leaf-spinner" />
      <p className="loading-text">कृपया प्रतीक्षा करे.. </p>
    </div>
  );
};

export default Loading;

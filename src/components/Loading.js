import React from "react";
import leaf from "../assets/leaf-logo.png"; // 👈 adjust path as per your structure

const Loading = ({ message = "कृपया प्रतीक्षा करे.." }) => {
  return (
    <div className="loading-container">
      <img src={leaf} alt="Leaf" className="leaf-spinner" />
      {message ? <p className="loading-text">{message}</p> : null}
    </div>
  );
};

export default Loading;

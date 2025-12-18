import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationProvider>
          <Navbar />
          <AllRoutes />
        </NotificationProvider>
        <ToastContainer />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

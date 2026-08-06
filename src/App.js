import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <NotificationProvider>
            <Navbar />
            <AllRoutes />
             <SpeedInsights />
          </NotificationProvider>
          <ToastContainer />
          <Footer />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

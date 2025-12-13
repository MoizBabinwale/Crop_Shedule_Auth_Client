import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Form1 from "../components/Form1.js";
import ProductList from "../pages/ProductList.js";
import QuatationGen from "../pages/QuatationGen.js";
import QuotationMaster from "../pages/QuotationMaster.jsx";
import QuotationBill from "../pages/QuotationBill.js";
import ScheduleBill from "../pages/ScheduleBill.js";
import ScheduleBillView from "../components/ScheduleBilView.js";
import ScheduleView from "../pages/ScheduleView.js";
import CropList from "../pages/CropList.js";
import BillsPage from "../pages/BillsPage.js";
import GalleryPage from "../pages/GalleryPage.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import AdminDashboard from "../pages/adminDashboard.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import CreateQuotation from "../pages/CreateQuotation.js";
import PublicRoute from "./PublicRoute.jsx";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* USER DASHBOARD */}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotation/createQuotation"
        element={
          <ProtectedRoute role="user">
            <CreateQuotation />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/form1"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]}>
            <Form1 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule/:cropId"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]}>
            {" "}
            <ScheduleView />
          </ProtectedRoute>
        }
      />
      <Route path="/schedule/quotation/:quatationId" element={<QuatationGen />} />

      <Route
        path="/croplists"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]}>
            {" "}
            <CropList />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotation/master"
        element={
          // <ProtectedRoute roles={["admin", "subadmin"]}>
          <QuotationMaster />
          // </ProtectedRoute>
        }
      />
      <Route path="/bills" element={<BillsPage />} />

      <Route path="/bill/:billId" element={<QuotationBill />} />
      <Route path="/scheduleBill/:scheduleId" element={<ScheduleBill />} />
      <Route path="/scheduleBill/view/:scheduleId" element={<ScheduleBillView />} />
      <Route path="/quotationBill/view/:quotationId" element={<QuotationBill />} />
      <Route path="/gallery" element={<GalleryPage />} />

      {/* MUST BE LAST */}
      <Route path="*" element={<AuthPage />} />
    </Routes>
  );
};

export default AllRoutes;

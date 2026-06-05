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
import Notification from "../pages/Notifications.jsx";
import PublicRoute from "./PublicRoute.jsx";
import GoogleSuccess from "../pages/GoogleSuccess.js";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";
import PendingApproval from "../pages/PendingApproval.jsx";

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
          <ProtectedRoute roles={["admin", "subadmin"]}>
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

      {/* PENDING APPROVAL PAGE */}
      <Route path="/pending" element={<PendingApproval />} />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/form1"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]} permission={(user) => user.role === "admin" || user.canEditSchedule}>
            <Form1 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule/:cropId"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]} permission={(user) => user.role === "admin" || user.canSeeSchedule || user.canEditSchedule || user.canRemoveSchedule}>
            <ScheduleView />
          </ProtectedRoute>
        }
      />
      <Route path="/schedule/quotation/:quatationId" element={<QuatationGen />} />

      <Route
        path="/croplists"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]} permission={(user) => user.role === "admin" || user.canSeeSchedule || user.canEditSchedule || user.canRemoveSchedule}>
            <CropList />
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
          <ProtectedRoute>
            <QuotationMaster />
          </ProtectedRoute>
        }
      />
      <Route path="/bills" element={<BillsPage />} />

      <Route path="/bill/:billId" element={<QuotationBill />} />
      <Route
        path="/scheduleBill/:scheduleId"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]} permission={(user) => user.role === "admin" || user.canSeeSchedule || user.canEditSchedule || user.canRemoveSchedule}>
            <ScheduleBill />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheduleBill/view/:scheduleId"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]} permission={(user) => user.role === "admin" || user.canSeeSchedule || user.canEditSchedule || user.canRemoveSchedule}>
            <ScheduleBillView />
          </ProtectedRoute>
        }
      />
      <Route path="/quotationBill/view/:quotationId" element={<QuotationBill />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="/terms-and-conditions" element={<TermsConditions />} />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute roles={["admin", "subadmin"]}>
            {" "}
            <Notification />
          </ProtectedRoute>
        }
      />

      <Route path="/google-success" element={<GoogleSuccess />} />
      {/* MUST BE LAST */}
      <Route path="*" element={<AuthPage />} />
    </Routes>
  );
};

export default AllRoutes;

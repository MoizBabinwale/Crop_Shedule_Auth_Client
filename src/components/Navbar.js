import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { logout, auth } = useAuth();
  const token = localStorage.getItem("token"); // check login

  const navLinks = [
    { to: "/", label: "HOME", visible: true },
    { to: "/about", label: "ABOUT", visible: true },
    { to: "/products", label: "PRODUCT", visible: true, visible: auth?.user && auth.user?.role !== "user" },

    // 🔥 Only show for admin + subadmin
    { to: "/quotation/master", label: "QUOTATION MASTER", visible: auth?.user && auth.user?.role !== "user" },
    { to: "/quotation/createQuotation", label: "GENERATE QUOTATION ", visible: auth?.user && auth.user?.role === "user" },

    { to: "/contact", label: "CONTACT", visible: true },
  ];

  const isActive = (path) => location.pathname === path;

  const [profileOpen, setProfileOpen] = React.useState(false);

  const firstLetter = auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : "?";

  const goToDashboard = () => {
    if (auth.user.role === "admin" || auth.user.role === "subadmin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
    setProfileOpen(false);
  };

  const { notifications } = useNotifications();

  // ✅ NOW THIS MAKES SENSE
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const showBell = !auth.loading && auth.isLoggedIn && (auth.user?.role === "admin" || auth.user?.role === "subadmin");

  return (
    <nav className="bg-[#3BB149] text-white print:hidden">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
            <div className="text-white">
              <Link to="/">
                <div className="text-lg md:text-xl font-bold leading-tight">
                  <span className="text-white-600">Parnanetra</span> Ayurvedic Agro System
                </div>
                <div className="text-sm italic text-[#FFD580]">... since 1988</div>
              </Link>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks

              .filter((link) => link.visible)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded text-sm font-semibold uppercase transition duration-300 
                  ${isActive(link.to) ? "bg-[#FFA534]" : "hover:bg-[#FFA534]"}
                `}
                >
                  {link.label}
                </Link>
              ))}

            {/* ✅ LOGIN / LOGOUT BUTTON */}
            {/* PROFILE + LOGOUT DROPDOWN */}
            {auth.isLoggedIn ? (
              <div className="relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
                <button className="w-10 h-10 rounded-full bg-white text-[#3BB149] font-bold flex items-center justify-center text-lg border-2 border-white hover:bg-[#FFA534] hover:text-white transition">
                  {firstLetter}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg py-2 z-50
      transition-all duration-200 ease-out
      ${profileOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}
    `}
                >
                  <div className="flex p-2">
                    <button onClick={goToDashboard} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Profile
                    </button>
                    {showBell && (
                      <button onClick={() => navigate("/notifications")} className="pr-1 relative p-2 rounded-full hover:bg-green-100">
                        <Bell className="text-green-700" />

                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>}
                      </button>
                    )}
                  </div>

                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block mt-2 bg-white text-[#3BB149] px-4 py-2 rounded font-bold uppercase hover:bg-[#FFA534] hover:text-white transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-white">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#3BB149] px-4 py-2 space-y-1">
          {navLinks
            .filter((link) => link.visible)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded text-sm font-semibold uppercase transition duration-300 
                ${isActive(link.to) ? "bg-[#FFA534]" : "hover:bg-[#FFA534]"}
              `}
              >
                {link.label}
              </Link>
            ))}

          {/* Mobile Login Button */}
          {auth.isLoggedIn && (
            <div className="mt-4">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-white text-[#3BB149] font-bold flex items-center justify-center text-lg border-2 border-white mx-auto"
              >
                {firstLetter}
              </button>

              {profileOpen && (
                <div className="bg-white text-black rounded-lg shadow-lg py-2 mt-2">
                  <button
                    onClick={() => {
                      goToDashboard();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

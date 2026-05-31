import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, User, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, auth } = useAuth();
  const { notifications } = useNotifications();

  const navLinks = [
    { to: "/", label: "Home", visible: true },
    { to: "/about", label: "About", visible: true },
    { to: "/products", label: "Products", visible: auth?.user && auth.user?.role !== "user" },
    {
      to: "/quotation/master",
      label: auth?.user?.role === "user" ? "Quotations" : "Quotation Master",
      visible: auth?.isLoggedIn,
    },
    { to: "/quotation/createQuotation", label: "Generate", visible: auth?.user && auth.user?.role === "user" },
    { to: "/contact", label: "Contact", visible: true },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const showBell = !auth.loading && auth.isLoggedIn && (auth.user?.role === "admin" || auth.user?.role === "subadmin");
  const firstLetter = auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : "?";

  const isActive = (path) => location.pathname === path;

  const goToDashboard = () => {
    navigate(auth.user?.role === "admin" || auth.user?.role === "subadmin" ? "/admin" : "/user");
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const visibleLinks = navLinks.filter((link) => link.visible);

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/10 bg-white/95 text-slate-900 shadow-sm backdrop-blur print:hidden">
      <div className="container-pro px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Parnanetra logo" className="h-12 w-12 shrink-0 rounded-xl object-contain ring-1 ring-green-900/10" />
            <div className="min-w-0">
              <p className="truncate text-base font-black leading-tight text-green-900 sm:text-lg">Parnanetra Ayurvedic</p>
              <p className="truncate text-xs font-semibold text-amber-600">Agro System since 1988</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive(link.to) ? "bg-green-700 text-white shadow-sm" : "text-slate-700 hover:bg-green-50 hover:text-green-800"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {showBell && (
              <button
                onClick={() => navigate("/notifications")}
                className="relative rounded-full border border-green-900/10 bg-green-50 p-2.5 text-green-800 transition hover:bg-green-100"
                aria-label="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">{unreadCount}</span>}
              </button>
            )}

            {auth.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-green-900/10 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:bg-green-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 font-bold text-white">{firstLetter}</span>
                  <span className="max-w-32 truncate text-sm font-bold text-slate-800">{auth.user?.name || "Profile"}</span>
                  <ChevronDown size={16} className="text-slate-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <button onClick={goToDashboard} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-green-50">
                      <LayoutDashboard size={17} /> Dashboard
                    </button>
                    <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                      <LogOut size={17} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                <LogIn size={17} /> Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-green-900/10 bg-green-50 text-green-900 lg:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-green-900/10 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="container-pro space-y-2">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-bold ${isActive(link.to) ? "bg-green-700 text-white" : "bg-slate-50 text-slate-800"}`}
              >
                {link.label}
              </Link>
            ))}

            {showBell && (
              <button onClick={() => navigate("/notifications")} className="flex w-full items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-900">
                <span className="flex items-center gap-2">
                  <Bell size={17} /> Notifications
                </span>
                {unreadCount > 0 && <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}
              </button>
            )}

            {auth.isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={goToDashboard} className="btn-secondary">
                  <User size={17} /> Profile
                </button>
                <button onClick={logout} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                <LogIn size={17} /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

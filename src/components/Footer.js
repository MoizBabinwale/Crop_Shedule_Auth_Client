import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    ["Home", "/"],
    ["About Us", "/about"],
    ["Products", "/products"],
    ["Gallery", "/gallery"],
    ["Contact", "/contact"],
  ];

  const legalLinks = [
    ["Privacy Policy", "/privacy-policy"],
    ["Terms & Conditions", "/terms-and-conditions"],
  ];

  return (
    <footer className="border-t border-green-900/10 bg-green-950 text-white print:hidden">
      <div className="container-pro grid gap-8 px-4 py-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
        <div>
          <h2 className="text-xl font-black">Parnanetra Ayurvedic Agro System</h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-green-50/75">Research-led organic agriculture support, crop planning, quotation workflows, and farmer-focused operations since 1988.</p>
          <div className="mt-5 space-y-3 text-sm text-green-50/85">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-amber-300" />
              235, Govt. Press Colony, Dabha, Nagpur - 440023
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-amber-300" />
              info@parnanetra.org
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-amber-300" />
              +91 9960186016
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-normal text-amber-300">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm font-semibold text-green-50/80 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-normal text-amber-300">Legal</h3>
          <ul className="mt-4 space-y-3">
            {legalLinks.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm font-semibold text-green-50/80 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://logixious.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-green-50/80 transition hover:text-white">
                Logixious
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
          <h3 className="text-lg font-black">Stay connected</h3>
          <p className="mt-2 text-sm leading-6 text-green-50/75">Visit the official site for programs, updates, and research information.</p>
          <a href="https://www.parnanetra.org/" target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 bg-amber-500 text-green-950 hover:bg-amber-400">
            Visit Website
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="container-pro flex flex-col gap-2 text-sm text-green-50/70 sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright 2025 Parnanetra Ayurvedic Agro System. All rights reserved.</span>
          <span>Designed by MN Developer</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

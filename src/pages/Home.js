import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "../components/Loading";
import { FaFileInvoice, FaEdit, FaTrash } from "react-icons/fa";
import bannerImg from "../assets/banner.jpg";
import leaf from "../assets/Greenleaf.png";
import { useRef } from "react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { auth } = useAuth();
  return (
    <>
      <section
        className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')", // farmer field bg
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">🌾 Parnanetra Ayurvedic</h1>
          <p className="text-lg md:text-2xl mb-6">शेतकऱ्यांसाठी आधुनिक उपाय — Since 1988 ...Parnanetra Sanshodhanalay is working in the field of Organic Agriculture.</p>
          {/* <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow-lg transition duration-300">Get Started</button> */}
        </div>
      </section>

      <section className="py-12 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-16">
          {[
            { title: "Crop Schedules", desc: "Weekly guidance for your crops.", icon: "📅", to: "/croplists", visible: auth.user?.role !== "user" },
            { title: "Quotations", desc: "Get cost estimations instantly.", icon: "💰", to: "/quotation/master", visible: true },
            {
              title: "About Us",
              desc: "Learn more about our mission and services for farmers.",
              icon: "ℹ️",
              to: "/about",
              visible: true,
            },
            { title: "Products", desc: "Know exactly what your crop needs.", icon: "🌱", to: "/products" },
            // { title: "Water Management", desc: "Plan irrigation efficiently.", icon: "💧", to: "/water-management" },
            { title: "Gallery", desc: "Awareness camps & organic farming events.", icon: "🖼️", to: "/gallery", visible: true },
            // { title: "Expert Support", desc: "Get help from agriculture experts.", icon: "👨‍🌾", to: "/support" },
          ]
            .filter((item) => item.visible)
            .map((service, index) => (
              <Link key={index} to={service.to} className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300 block">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-green-700">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
};

export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, FileText, Images, Leaf, PackageSearch, ShieldCheck } from "lucide-react";
import bannerImg from "../assets/banner.jpg";
import medicineImg from "../assets/medicine.jpeg";
import aboutImg from "../assets/aboutpage.jpg";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { auth } = useAuth();

  const services = [
    { title: "Crop Schedules", desc: "Plan week-wise crop care with organized schedules and product instructions.", icon: CalendarDays, to: "/croplists", visible: auth.user?.role !== "user" },
    { title: "Quotations", desc: "Create, review, and manage quotations from a clean digital workflow.", icon: FileText, to: "/quotation/master", visible: true },
    { title: "Products", desc: "Maintain product details, pricing, and usage guidance in one place.", icon: PackageSearch, to: "/products", visible: auth.user?.role !== "user" },
    { title: "About Parnanetra", desc: "Learn about the research-led work behind the agro system.", icon: Leaf, to: "/about", visible: true },
    { title: "Gallery", desc: "View field visits, awareness programs, and farming outcomes.", icon: Images, to: "/gallery", visible: true },
    { title: "Contact", desc: "Reach the team for support, onboarding, and farmer guidance.", icon: ShieldCheck, to: "/contact", visible: true },
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-green-950 text-white">
        <img src={bannerImg} alt="Agriculture field" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-950/88 to-green-900/35" />
        <div className="container-pro relative grid min-h-[calc(100vh-80px)] items-center gap-10 px-4 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-green-50 backdrop-blur">Organic agriculture operations platform</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Parnanetra Ayurvedic Agro System</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-green-50/90 sm:text-lg">
              A polished workflow for crop schedules, quotations, farmer records, and product planning, built around real agricultural operations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={auth.isLoggedIn ? "/quotation/master" : "/login"} className="btn-primary bg-amber-500 text-green-950 hover:bg-amber-400">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
                Learn More
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <img src={medicineImg} alt="Parnanetra product" className="h-[440px] w-full rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbf8] px-4 py-14 sm:py-18">
        <div className="container-pro">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-green-700">Workflows</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Everything farmers and admins need</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Responsive screens, quicker actions, and clear navigation across field planning, billing, quotation, and user management.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((item) => item.visible)
              .map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.title} to={service.to} className="group rounded-2xl border border-green-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-50 text-green-700">
                      <Icon size={24} />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-900">{service.title}</h3>
                    <p className="mt-2 min-h-[56px] text-sm leading-7 text-slate-600">{service.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-green-700">
                      Open <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="container-pro grid items-center gap-10 lg:grid-cols-2">
          <img src={aboutImg} alt="Agriculture support team" className="h-[360px] w-full rounded-2xl object-cover shadow-xl" />
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-green-700">Built for daily use</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Cleaner data, smoother decisions</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The interface now focuses on clarity: stronger spacing, consistent controls, readable tables, mobile-friendly navigation, and calmer color balance across the app.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Responsive", "Fast actions", "Readable records"].map((item) => (
                <div key={item} className="rounded-xl border border-green-900/10 bg-green-50 p-4 text-sm font-black text-green-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Layout } from "./layout/Layout";

const SERVICES = [
  { label: "WEBSITE DESIGN", href: "/services" },
  { label: "MOTION DESIGN", href: "/services" },
  { label: "FRONT-END DEVELOPMENT", href: "/services" },
  { label: "BACK-END DEVELOPMENT", href: "/services" },
  { label: "SHOPIFY DEVELOPMENT", href: "/services" },
  { label: "WEBSITE SUPPORT", href: "/services" },
  { label: "PAID SEARCH ADVERTISING", href: "/services" },
  { label: "SOCIAL MEDIA ADVERTISING", href: "/services" },
  { label: "EMAIL MARKETING", href: "/services" },
  { label: "SEO", href: "/services" },
];

const SOCIALS = [
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

const RedDot = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const s =
    size === "sm" ? "w-2 h-2" : size === "lg" ? "w-5 h-5" : "w-3 h-3 md:w-4 md:h-4";
  return <div className={`${s} bg-[#ef4444] rotate-45 shrink-0`} />;
};

const BlueprintLine = () => (
  <div className="w-full h-px bg-white/10 relative my-5">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/20 bg-[#1f2547]" />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/20 bg-[#1f2547]" />
  </div>
);

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <footer className="min-h-screen flex flex-col justify-between relative overflow-hidden text-white font-sans py-8 md:py-10"
      style={{ background: "linear-gradient(160deg, #181c3a 0%, #1f2547 50%, #1a1f40 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fGrid)" />
        </svg>
      </div>

      {/* Red ambient glow top-right */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#ef4444]/5 blur-[120px] rounded-full pointer-events-none" />

      <Layout className="flex flex-col flex-1 justify-between gap-0 relative z-10">

        {/* ── ROW 1: LET'S TALK ── */}
        <div className="flex justify-center items-center">
          <motion.div
            className="flex items-center gap-2 md:gap-4 cursor-pointer group"
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate("/contact")}
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-[-0.04em] uppercase leading-none group-hover:text-[#ef4444] transition-colors duration-300">
              LET'S TALK
            </h2>
            <RedDot size="md" />
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        <BlueprintLine />

        {/* ── ROW 2: STUDIO | Services List | SERVICES ── */}
        <div className="grid grid-cols-12 gap-4 items-start">
          {/* STUDIO */}
          <div className="col-span-4 flex flex-col items-start">
            <Link to="/studio">
              <motion.div
                className="flex items-center gap-2 md:gap-3 mb-3 cursor-pointer group"
                whileHover={{ x: 4 }}
              >
                <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-[-0.04em] uppercase leading-none group-hover:text-[#ef4444] transition-colors duration-300">
                  STUDIO
                </h3>
                <RedDot size="sm" />
              </motion.div>
            </Link>
            <p className="text-white text-[11px] md:text-[13px] font-display font-black tracking-[-0.02em] uppercase leading-relaxed">
              81 PROSPECT ST, SUITE 9069,<br />
              BROOKLYN, NY 11201
            </p>
          </div>

          {/* Services List */}
          <div className="col-start-5 col-span-4 flex flex-col gap-[3px] pt-1">
            {SERVICES.map((s) => (
              <Link key={s.label} to={s.href}>
                <motion.span
                  whileHover={{ x: 4, color: "#ef4444" }}
                  transition={{ duration: 0.1 }}
                  className="text-white text-[11px] md:text-[13px] font-display font-black tracking-[-0.02em] uppercase cursor-pointer leading-snug block transition-all"
                >
                  {s.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* SERVICES big word */}
          <div className="col-start-9 col-span-4 flex items-center justify-end gap-2 md:gap-3 self-end">
            <Link to="/services">
              <motion.div
                className="flex items-center gap-2 group cursor-pointer"
                whileHover={{ x: -4 }}
              >
                <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-[-0.04em] uppercase leading-none text-right group-hover:text-[#ef4444] transition-colors duration-300">
                  SERVICES
                </h3>
                <RedDot size="sm" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <BlueprintLine />

        {/* ── ROW 3: WORK big word ── */}
        <Link to="/work">
          <motion.div
            className="flex items-center gap-3 md:gap-5 cursor-pointer group w-fit"
            whileHover={{ x: 6 }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-[-0.04em] uppercase leading-none group-hover:text-[#ef4444] transition-colors duration-300">
              WORK
            </h2>
            <RedDot size="lg" />
          </motion.div>
        </Link>

        {/* ── ROW 4: Newsletter / Copyright / Socials ── */}
        <div className="grid grid-cols-12 items-end gap-6 pt-4 border-t border-white/5">
          {/* Newsletter */}
          <div className="col-span-4">
            <span className="text-white text-[8px] font-black tracking-[0.25em] uppercase block mb-3">
              NEWSLETTER
            </span>
            <div className="relative border-b border-white/20 group focus-within:border-[#ef4444] transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full bg-transparent py-2.5 text-[11px] md:text-[13px] font-display font-black tracking-[-0.02em] uppercase focus:outline-none placeholder:text-white/60 text-white"
              />
              <motion.button
                whileHover={{ x: 3, color: "#ef4444" }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white"
                onClick={() => { if (email) alert(`Subscribed: ${email}`); }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-start-5 col-span-4 text-center">
            <span className="text-white text-[11px] font-black tracking-tight opacity-80">
              ©2026 Buzzworthy Studio
            </span>
          </div>

          {/* Socials */}
          <div className="col-start-9 col-span-4 flex justify-end flex-wrap gap-3 md:gap-5">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, color: "#ef4444" }}
                transition={{ duration: 0.1 }}
                className="text-white text-[11px] md:text-[12px] font-black tracking-tight uppercase cursor-pointer transition-all"
              >
                {s.label}
              </motion.a>
            ))}
          </div>
        </div>

      </Layout>
    </footer>
  );
};

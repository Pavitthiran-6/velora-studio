import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Layout } from "../components/layout/Layout";

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#1f2547] text-white flex flex-col">
      <Layout className="py-12 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-[#ef4444] transition-colors text-xs font-black tracking-[0.2em] uppercase">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </Layout>
      <Layout className="flex-1 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-[12vw] font-black tracking-tighter uppercase leading-none mb-8">
            STUDIO<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-white/40 text-sm font-black tracking-[0.2em] uppercase max-w-lg leading-relaxed">
            Creative Design & Development Studio.<br />
            Crafting modern digital experiences through motion,<br />
            interaction, and scalable engineering.<br /><br />
            Chennai, India.
          </p>
        </motion.div>
      </Layout>
    </div>
  );
}

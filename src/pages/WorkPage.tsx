"use client";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Layout } from "../components/layout/Layout";
import { Footer } from "../components/Footer";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { useTransition } from "../components/TransitionProvider";
import { WaveMenu } from "../components/WaveMenu";
import { CinematicText } from "../components/CinematicText";
import CircularGallery from "../components/CircularGallery";
import HexIcon from "../components/HexIcon";

/* --- ASSET IMPORTS --- */
import valaclavaImg from "../assets/projects/valaclava_project_hero_1778243074252.png";
import oceanImg from "../assets/projects/ocean_agency_hero_1778243090443.png";
import yogiImg from "../assets/projects/hoboken_yogi_hero_1778243105729.png";
import mdImg from "../assets/projects/modern_md_hero_1778243119932.png";

const GALLERY_ITEMS = [
  { image: valaclavaImg, text: "VALACLAVA" },
  { image: oceanImg, text: "OCEAN AGENCY" },
  { image: yogiImg, text: "HOBOKEN YOGI" },
  { image: mdImg, text: "MODERN MD" },
];

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerPageTransition } = useTransition();
  const [isWaveOpen, setIsWaveOpen] = useState(false);

  return (
    <SmoothScrollProvider containerRef={containerRef} ease={0.09}>
      <div className="h-screen bg-[#ef4444] p-2 md:p-3 lg:p-4 font-sans select-none overflow-hidden">

        {/* STUDIO BOX */}
        <div className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#1f2547] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">

          <WaveMenu isOpen={isWaveOpen} onClose={() => setIsWaveOpen(false)} />

          {/* CONTENT AREA (FIXED VIEW) */}
          <div ref={containerRef} className="h-full relative overflow-hidden flex flex-col justify-center">

            {/* STICKY HEADER */}
            <div className="sticky top-0 left-0 right-0 z-[200] h-0 overflow-visible pointer-events-none">
              <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12 flex justify-between items-start">
                <div className="flex items-center gap-8 pointer-events-auto">
                  <button onClick={() => triggerPageTransition("/")} className="group">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-[#ef4444] rounded-full flex items-center justify-center p-2 md:p-3 group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5z" />
                      </svg>
                    </div>
                  </button>

                  <div className="hidden md:flex items-center gap-4 pointer-events-auto">
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 leading-none">
                      BUZZWORTHY
                    </span>
                    <HexIcon className="w-2.5 h-2.5 translate-y-[0.5px]" fill="#ef4444" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#ef4444] leading-none">
                      WORK
                    </span>
                  </div>
                </div>

                <button onClick={() => setIsWaveOpen(!isWaveOpen)} className="relative z-[100] flex gap-3 md:gap-4 h-14 md:h-20 items-center cursor-pointer group pointer-events-auto">
                  <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                    <motion.div animate={{ y: isWaveOpen ? 24 : 0, opacity: isWaveOpen ? 0 : 1 }} className="absolute top-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2" />
                  </div>
                  <div className="flex flex-col items-center h-6 md:h-10 w-px bg-white/50 relative">
                    <motion.div animate={{ opacity: isWaveOpen ? 0 : 1 }} className="absolute inset-0 bg-white/80" />
                  </div>
                  <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                    <motion.div animate={{ y: isWaveOpen ? -24 : 0, opacity: isWaveOpen ? 0 : 1 }} className="absolute bottom-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2" />
                  </div>
                </button>
              </div>
            </div>

            {/* HERO SECTION WITH CIRCULAR GALLERY */}
            <section className="h-screen relative flex flex-col justify-center overflow-hidden pt-20">
              <Layout className="flex flex-col gap-8 h-full relative">
                <div className="z-10 flex flex-col items-center text-center pointer-events-none">
                  <CinematicText as="h1" className="text-[12vw] md:text-[8vw] font-display font-black tracking-[-0.06em] leading-[0.8] uppercase text-white" intensity={1.2}>
                    SELECTED <span className="text-[#ef3b5d]">PROJECTS</span>
                  </CinematicText>
                </div>

                {/* THE GALLERY CONTAINER */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pt-24">
                  <div className="w-full h-[70vh] relative">
                    <CircularGallery
                      items={GALLERY_ITEMS}
                      bend={3}
                      textColor="#ffffff"
                      borderRadius={0.05}
                      font='900 80px "Big Shoulders Display", sans-serif'
                      scrollEase={0.08}
                      scrollSpeed={3}
                    />
                  </div>
                </div>
              </Layout>
            </section>
          </div>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

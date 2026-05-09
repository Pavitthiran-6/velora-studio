import React, { useState, useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, useTexture, Float, Environment } from "@react-three/drei";
import { WaveMenu } from "../components/WaveMenu";
import { useTransition } from "../components/TransitionProvider";
import { Layout } from "../components/layout/Layout";
import { cn } from "@/lib/utils";
import * as THREE from "three";
import HexIcon from "../components/HexIcon";

// Project Data
const PROJECTS = [
  {
    id: "01",
    title: "SLING SHOT",
    services: ["UX/UI DESIGN", "DEVELOPMENT", "STRATEGY"],
    img: "/src/assets/projects/valaclava_project_hero_1778243074252.png",
    color: "#ef3054"
  },
  {
    id: "02",
    title: "OCEAN AGENCY",
    services: ["BRANDING", "3D ANIMATION", "WEBGL"],
    img: "/src/assets/projects/ocean_agency_hero_1778243090443.png",
    color: "#ef3054"
  },
  {
    id: "03",
    title: "HOBOKEN YOGI",
    services: ["MARKETING", "SEO", "E-COMMERCE"],
    img: "/src/assets/projects/hoboken_yogi_hero_1778243105729.png",
    color: "#ef3054"
  },
  {
    id: "04",
    title: "MODERN MD",
    services: ["HEALTH-TECH", "UX DESIGN", "AI"],
    img: "/src/assets/projects/modern_md_hero_1778243119932.png",
    color: "#ef3054"
  }
];

// Web Globe Component (Holographic Wireframe & Points)
function WebGlobe({ isTransitioning }: { isTransitioning: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -time * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main Wireframe Sphere */}
        <Sphere ref={wireframeRef} args={[1, 32, 32]}>
          <meshPhongMaterial
            wireframe
            color="#22ff00"
            transparent
            opacity={0.6}
            emissive="#22ff00"
            emissiveIntensity={2}
          />
        </Sphere>

        {/* Floating Data Points */}
        <Sphere args={[1.02, 48, 48]}>
          <meshPhongMaterial
            transparent
            opacity={0.15}
            color="#ffffff"
            emissive="#22ff00"
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Holographic Points Cloud */}
        <points>
          <sphereGeometry args={[1.05, 64, 64]} />
          <pointsMaterial
            size={0.02}
            color="#22ff00"
            transparent
            opacity={1}
            sizeAttenuation
          />
        </points>

        {/* Inner Glow Core */}
        <Sphere args={[0.8, 32, 32]}>
          <meshBasicMaterial
            color="#22ff00"
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>

      {/* Dynamic Lighting for the Globe */}
      <pointLight position={[2, 2, 2]} intensity={3} color="#ffffff" />
      <pointLight position={[-2, -2, -2]} intensity={2} color="#22ff00" />
    </group>
  );
}



export default function WorkPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWaveOpen, setIsWaveOpen] = useState(false);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const { triggerLogoTransition } = useTransition();
  const lastScrollTime = useRef(0);

  // Event-Driven Stepping for absolute control
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      // Kinetic Lock: Prevent transitions faster than 0.6s for snappier response
      if (now - lastScrollTime.current < 600) return;

      if (Math.abs(e.deltaY) > 50) { // Threshold to ignore tiny movements
        lastScrollTime.current = now;
        setIsTransitioning(true);

        if (e.deltaY > 0) {
          // Scroll Down: Next Project (Looping)
          setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
        } else {
          // Scroll Up: Previous Project (Looping)
          setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
        }

        setTimeout(() => setIsTransitioning(false), 400);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const activeProject = PROJECTS[activeIndex];

  return (
    <div className="h-screen bg-[#ef4444] p-2 md:p-3 lg:p-4 font-sans select-none overflow-hidden">
      <div className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#1f2547] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        {/* RIGHT SIDE: WEB GLOBE (GLOBAL BACKGROUND) */}
        <div className={cn(
          "absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-end pr-[-10vw] transition-opacity duration-700",
          isWaveOpen ? "opacity-0" : "opacity-100"
        )}>
          <div className="w-[110vh] h-[110vh] opacity-40 translate-x-[25%]">
            <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
              <Suspense fallback={null}>
                <WebGlobe isTransitioning={isTransitioning} />
                <ambientLight intensity={0.8} />
              </Suspense>
            </Canvas>
          </div>
        </div>

        <WaveMenu isOpen={isWaveOpen} onClose={() => setIsWaveOpen(false)} />

        {/* FIXED SHOWCASE LAYER */}
        <div className={cn(
          "absolute inset-0 h-full w-full overflow-hidden flex flex-col py-8 md:py-12 lg:py-16 transition-all duration-700",
          isWaveOpen ? "scale-[0.98] opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}>

          {/* TOP LAYER: LOGO & BREADCRUMBS & SETTINGS */}
          <div className="w-full px-8 md:px-12 lg:px-16 flex justify-between items-start z-50 mb-4 pointer-events-none">
            <div className="flex items-start gap-12 pointer-events-auto">
              {/* Logo */}
              <button onClick={() => triggerPageTransition("/")} className="w-14 h-14 bg-[#ef4444] rounded-full flex items-center justify-center p-3 group hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5z" />
                </svg>
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-4 pt-4 pointer-events-auto">
                <button
                  onClick={() => triggerPageTransition("/")}
                  className="text-[10px] font-black tracking-[0.2em] uppercase text-white/90 hover:text-white transition-opacity cursor-pointer"
                >
                  BUZZWORTHY
                </button>
                <HexIcon className="w-2.5 h-2.5" fill="#ef4444" />
                <span
                  onClick={() => triggerPageTransition("/work")}
                  className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  WORK
                </span>
              </div>
            </div>

            {/* Settings Icon (Right) */}
            <button
              onClick={() => setIsWaveOpen(!isWaveOpen)}
              className="relative z-[100] flex gap-3 md:gap-4 h-14 md:h-20 items-center cursor-pointer group pointer-events-auto"
            >
              <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                <motion.div
                  animate={{ y: isWaveOpen ? 24 : 0, opacity: isWaveOpen ? 0 : 1 }}
                  className="absolute top-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2"
                />
              </div>
              <div className="flex flex-col items-center h-6 md:h-10 w-px bg-white/50 relative">
                <motion.div
                  animate={{ opacity: isWaveOpen ? 0 : 1 }}
                  className="absolute inset-0 bg-white/80"
                />
              </div>
              <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                <motion.div
                  animate={{ y: isWaveOpen ? -24 : 0, opacity: isWaveOpen ? 0 : 1 }}
                  className="absolute bottom-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2"
                />
              </div>
            </button>
          </div>

          {/* MAIN SHOWCASE CONTENT */}
          <Layout className="flex-1 flex items-center relative z-10 -mt-10">
            <div className="w-full grid grid-cols-12 gap-12 items-center">

              {/* LEFT: PROJECT PREVIEW */}
              <div className="col-span-12 lg:col-span-6 relative h-[65vh] flex flex-col justify-center gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full rounded-[20px] overflow-hidden relative shadow-[0_60px_100px_rgba(0,0,0,0.6)]"
                  >
                    <motion.img
                      src={activeProject.img}
                      className="w-full h-full object-cover"
                      animate={{ scale: isTransitioning ? 1.05 : 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f2547]/40 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Index Counter (Below Image) */}
                <div className="flex items-center gap-4 px-2">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white">00{activeProject.id}</span>
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/20">/</span>
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/20">00{PROJECTS.length}</span>
                </div>
              </div>

              {/* RIGHT: PROJECT INFO */}
              <div className="col-span-12 lg:col-span-6 h-[65vh] flex flex-col justify-between py-12 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col h-full"
                  >
                    {/* Project Title with Arrow */}
                    <div className="mt-12">
                      <h1 className="text-[9vw] font-display font-black tracking-[-0.06em] leading-[0.8] uppercase flex flex-wrap gap-x-[0.1em] items-baseline">
                        {activeProject.title.split(" ").map((word, i) => (
                          <span key={i} className={i === 0 ? "text-[#ef4444]" : "text-white"}>
                            {word}
                          </span>
                        ))}
                      </h1>
                    </div>

                    {/* Services Metadata & Arrow (Bottom Aligned) */}
                    <div className="mt-auto flex items-end justify-start gap-16 w-full pr-12">
                      <div className="flex flex-col gap-2">
                        {activeProject.services.map((s) => (
                          <span key={s} className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase text-left">{s}</span>
                        ))}
                      </div>

                      <motion.div
                        whileHover="hovered"
                        initial="initial"
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#2a3154] flex items-center justify-center cursor-pointer group border border-white/5 shadow-2xl relative shrink-0 overflow-hidden"
                      >
                        <motion.svg 
                          viewBox="0 0 24 24" 
                          className="w-8 h-8 md:w-12 md:h-12 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.2"
                        >
                          {/* The diagonal line that becomes straight */}
                          <motion.line 
                            variants={{
                              initial: { x1: 7, y1: 17, x2: 16, y2: 8 },
                              hovered: { x1: 5, y1: 12, x2: 19, y2: 12 }
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            strokeLinecap="round" 
                          />
                          {/* The arrow head that changes shape */}
                          <motion.path 
                            variants={{
                              initial: { d: "M12 8H16V12" },
                              hovered: { d: "M14 7l5 5-5 5" }
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                          {/* The custom hexagon that fades out */}
                          <motion.path 
                            d="M7 17l1.5.8v1.5L7 20l-1.5-.7v-1.5L7 17z" 
                            variants={{
                              initial: { opacity: 1, scale: 1 },
                              hovered: { opacity: 0, scale: 0 }
                            }}
                            transition={{ duration: 0.3 }}
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1"
                            className="translate-y-[-0.5px] translate-x-[-0.5px]"
                          />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Layout>

          {/* ALL PROJECTS OVERLAY */}
          <AnimatePresence>
            {isAllProjectsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-[#1f2547] flex flex-col"
              >
                {/* TOP HEADER (Consistent with Main Page) */}
                <div className="w-full px-8 md:px-12 lg:px-16 flex justify-between items-start z-50 pt-8 pointer-events-none">
                  <div className="flex items-start gap-12 pointer-events-auto">
                    {/* Logo */}
                    <button onClick={() => setIsAllProjectsOpen(false)} className="w-14 h-14 bg-[#ef4444] rounded-full flex items-center justify-center p-3 group hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5zZ" />
                      </svg>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-4 pt-4">
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/90">BUZZWORTHY</span>
                      <HexIcon className="w-2.5 h-2.5" fill="#ef4444" />
                      <button
                        onClick={() => setIsAllProjectsOpen(false)}
                        className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        WORK
                      </button>
                      <HexIcon className="w-2.5 h-2.5" fill="#ef4444" />
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">ALL PROJECTS</span>
                    </div>
                  </div>

                  {/* Settings Icon (Right) */}
                  <button
                    onClick={() => {
                      setIsAllProjectsOpen(false);
                      setIsWaveOpen(true);
                    }}
                    className="relative z-[100] flex gap-3 md:gap-4 h-14 md:h-20 items-center cursor-pointer group pointer-events-auto"
                  >
                    <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                      <motion.div
                        animate={{ y: isWaveOpen ? 24 : 0, opacity: isWaveOpen ? 0 : 1 }}
                        className="absolute top-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2"
                      />
                    </div>
                    <div className="flex flex-col items-center h-6 md:h-10 w-px bg-white/50 relative">
                      <motion.div
                        animate={{ opacity: isWaveOpen ? 0 : 1 }}
                        className="absolute inset-0 bg-white/80"
                      />
                    </div>
                    <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative">
                      <motion.div
                        animate={{ y: isWaveOpen ? -24 : 0, opacity: isWaveOpen ? 0 : 1 }}
                        className="absolute bottom-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2"
                      />
                    </div>
                  </button>
                </div>

                {/* OVERLAY CONTENT */}
                <div className="relative z-10 flex-1 flex flex-col justify-center items-center gap-4 py-4 px-12 overflow-hidden h-full pb-16">

                  {/* MAIN CENTER IMAGE */}
                  <div className="w-full flex justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setIsAllProjectsOpen(false)}
                        className="relative w-full max-w-4xl h-[40vh] rounded-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 cursor-pointer group"
                      >
                        <img
                          src={PROJECTS[activeIndex].img}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest uppercase border border-white/20">VIEW PROJECT</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Thumbnails Row with Titles */}
                  <div className="w-full">
                    <div className="flex justify-start md:justify-center gap-6 overflow-x-auto py-2 scrollbar-hide px-12 items-start">
                      {PROJECTS.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          className="flex flex-col items-center gap-2 flex-shrink-0"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05, y: -3 }}
                            onClick={() => {
                              setActiveIndex(idx);
                              setIsAllProjectsOpen(false);
                            }}
                            className={cn(
                              "w-40 h-24 rounded-lg overflow-hidden border-2 transition-all duration-500 relative z-[1100]",
                              activeIndex === idx ? "border-[#ef4444] scale-110 shadow-[0_0_30px_rgba(239,68,68,0.3)]" : "border-white/10 opacity-40 hover:opacity-100"
                            )}
                          >
                            <img src={project.img} className="w-full h-full object-cover" alt="" />
                          </motion.button>

                          {/* Thumbnail Title with Arrow */}
                          <motion.div
                            animate={{ opacity: activeIndex === idx ? 1 : 0.3 }}
                            className="flex items-center gap-4"
                          >
                            <span className={cn(
                              "text-[10px] font-black tracking-widest uppercase transition-all duration-500 text-center",
                              activeIndex === idx ? "scale-105" : "opacity-60"
                            )}>
                              {project.title.split(" ").map((word, i) => (
                                <span key={i} className={activeIndex === idx && i === 0 ? "text-[#ef4444]" : "text-white"}>
                                  {word}{" "}
                                </span>
                              ))}
                            </span>
                            <div className={cn(
                              "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-500",
                              activeIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-50"
                            )}>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="7" y1="17" x2="16" y2="8" strokeLinecap="round" />
                                <path d="M12 8H16V12" strokeLinecap="round" strokeLinejoin="round" />
                                <path 
                                  d="M7 17l1 .5v1L7 19l-1-.5v-1L7 17z" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="1"
                                />
                              </svg>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                      {/* Extra space for scroll */}
                      <div className="w-32 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsAllProjectsOpen(false)}
                      className="flex items-center gap-4 px-8 py-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center group-hover:bg-[#ef4444] group-hover:border-[#ef4444] transition-all">
                        <span className="text-white text-xs">✕</span>
                      </div>
                      <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">CLOSE</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM LAYER: NAV */}
          <div className="w-full px-8 md:px-12 lg:px-16 flex justify-center items-end z-50 pb-8">
            <button
              onClick={() => setIsAllProjectsOpen(true)}
              className="flex items-center gap-8 group pointer-events-auto"
            >
              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex gap-2 group-hover:bg-white/10 transition-colors">
                {[...Array(PROJECTS.length)].map((_, i) => (
                  <HexIcon
                    key={i}
                    className="w-1.5 h-1.5"
                    fill={i === activeIndex ? "#ef4444" : "rgba(255,255,255,0.2)"}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-white/90 uppercase group-hover:text-white transition-colors">ALL PROJECTS</span>
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}

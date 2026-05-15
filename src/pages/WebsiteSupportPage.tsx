"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { Footer } from "../components/Footer";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { useTransition } from "../components/TransitionProvider";
import { WaveMenu } from "../components/WaveMenu";
import { CinematicText } from "../components/CinematicText";
import { cn } from "@/lib/utils";
import HexIcon from "../components/HexIcon";

import valaclavaImg from "../assets/projects/valaclava_project_hero_1778243074252.png";
import oceanImg from "../assets/projects/ocean_agency_hero_1778243090443.png";
import yogiImg from "../assets/projects/hoboken_yogi_hero_1778243105729.png";

const PROCESS_STEPS = [
  { id: "01", title: "SECURITY AUDITS", desc: "Constant vigilance in the digital age. We conduct weekly security sweeps and vulnerability assessments to ensure your website remains a fortress against evolving cyber threats." },
  { id: "02", title: "CONTENT UPDATES", desc: "Keeping your brand story fresh and relevant. Our support team handles all content migrations and asset updates with surgical precision, ensuring zero downtime and perfect visual integrity." },
  { id: "03", title: "PERFORMANCE TUNING", desc: "Maintaining peak digital velocity. We continuously optimize server response times and asset delivery, ensuring your website provides a buttery-smooth experience as your traffic grows." },
  { id: "04", title: "BACKUPS & RESTORE", desc: "Absolute data peace of mind. We implement redundant, daily cloud backups and rigorous restore protocols, ensuring your brand's digital history is never more than a click away." },
  { id: "05", title: "24/7 MONITORING", desc: "A proactive eye on your digital ecosystem. Our automated systems track uptime and error rates around the clock, allowing us to resolve potential issues before they ever impact your users." }
];

const PROJECTS = [
  { name: "VALACLAVA", category: "SUPPORT / MAINTAIN", id: "01", img: valaclavaImg },
  { name: "OCEAN AGENCY", category: "SUPPORT / SCALE", id: "02", img: oceanImg },
  { name: "HOBOKEN YOGI", category: "SUPPORT / SECURITY", id: "03", img: yogiImg },
];

const OTHER_SERVICES = [
  "Website design", "Motion design", "Front-end development", "Back-end development",
  "Shopify development", "Paid search advertising", "Social media advertising", "Email marketing", "SEO"
];

export default function WebsiteSupportPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerLogoTransition, triggerPageTransition } = useTransition();
  const [isWaveOpen, setIsWaveOpen] = useState(false);

  return (
    <SmoothScrollProvider containerRef={containerRef} ease={0.09}>
      <div 
        onScroll={(e) => (e.currentTarget.scrollTop = 0)}
        className="h-screen bg-[#ef4444] p-2 md:p-3 lg:p-4 font-sans select-none transition-colors duration-700"
      >
        <div 
          onScroll={(e) => (e.currentTarget.scrollTop = 0)}
          className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#1f2547] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <WaveMenu isOpen={isWaveOpen} onClose={() => setIsWaveOpen(false)} />
          <div ref={containerRef} className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="sticky top-0 left-0 right-0 z-[200] h-0 overflow-visible pointer-events-none">
              <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12 flex justify-between items-start">
                <div className="flex items-center gap-8 pointer-events-auto">
                  <button onClick={() => triggerLogoTransition()} className="group">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                      <img src="/W2C Studios.png" alt="W2C Studios" className="w-full h-full object-contain" />
                    </div>
                  </button>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 leading-none">W2C Studios</span>
                    <HexIcon className="w-2.5 h-2.5" fill="#ef3b5d" />
                    <span 
                      onClick={() => triggerPageTransition("/services")}
                      className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 cursor-pointer transition-opacity leading-none"
                    >
                      SERVICES
                    </span>
                    <HexIcon className="w-2.5 h-2.5" fill="#ef3b5d" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ef3b5d] leading-none">WEBSITE SUPPORT</span>
                  </div>
                </div>
                <button onClick={() => setIsWaveOpen(!isWaveOpen)} className="relative z-[100] flex gap-3 md:gap-4 h-14 md:h-20 items-center cursor-pointer group pointer-events-auto">
                  <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative"><motion.div animate={{ y: isWaveOpen ? 24 : 0, opacity: isWaveOpen ? 0 : 1 }} className="absolute top-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2" /></div>
                  <div className="flex flex-col items-center h-6 md:h-10 w-px bg-white/50 relative"><motion.div animate={{ opacity: isWaveOpen ? 0 : 1 }} className="absolute inset-0 bg-white/80" /></div>
                  <div className="flex flex-col items-center h-10 md:h-14 w-px bg-white/30 relative"><motion.div animate={{ y: isWaveOpen ? -24 : 0, opacity: isWaveOpen ? 0 : 1 }} className="absolute bottom-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-white/60 rounded-full bg-[#1f2547] -translate-x-1/2 left-1/2" /></div>
                </button>
              </div>
            </div>
            <HeroSection />
            <ProcessSection containerRef={containerRef} />
            <LatestProjects />
            <OtherServices containerRef={containerRef} />
            <Footer />
          </div>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

function HeroSection() {
  const { triggerLogoTransition, triggerPageTransition } = useTransition();
  return (
    <section className="h-full relative flex flex-col pt-16 md:pt-20 pb-8 overflow-hidden justify-center">
      <Layout>

        <div className="flex flex-col mb-6 md:mb-10">
          <CinematicText as="h1" className="text-[12vw] md:text-[10vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.85] text-[#ef3b5d]" intensity={1.2}>WEBSITE</CinematicText>
          <CinematicText as="h1" className="text-[12vw] md:text-[10vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.85] text-white" intensity={1.2}>SUPPORT</CinematicText>
        </div>
        <div className="w-full space-y-4 md:space-y-6">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} className="w-full h-px bg-white/10 origin-center" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="md:col-span-2 flex items-center gap-3"><HexIcon className="w-3 h-3" fill="#ef3b5d" /><CinematicText className="text-[10px] font-black tracking-[0.3em] uppercase text-white">THE SERVICE</CinematicText></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="md:col-span-4"><p className="text-xl md:text-2xl font-display font-black tracking-[-0.02em] leading-tight uppercase text-white">WE PROVIDE PROACTIVE, HIGH-END MAINTENANCE AND SUPPORT THAT ENSURES YOUR DIGITAL PRESENCE REMAINS FLAWLESS, SECURE, AND PERFORMANT.</p></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="md:col-span-6"><p className="text-base md:text-lg font-display font-black tracking-[-0.01em] leading-relaxed opacity-40 uppercase">Website support at W2C Studios is more than just fixing bugs. We offer a comprehensive suite of proactive services designed to protect your brand and optimize your digital ecosystem. From surgical security audits to global performance tuning, we ensure your website continues to evolve and excel long after its initial launch, giving you the peace of mind to focus on your core business goals.</p></motion.div>
          </div>
        </div>
      </Layout>
    </section>
  );
}

function WaveLetter({ char, index, progress }: { char: string; index: number; progress: any }) {
  const startEnter = index * 0.04; const endEnter = startEnter + 0.4;
  const y = useTransform(progress, [startEnter, endEnter], [400, 0]);
  const opacity = useTransform(progress, [startEnter, endEnter], [0, 1]);
  return ( <motion.span style={{ y, opacity }} className="inline-block">{char}</motion.span> );
}

function ProcessSection({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const targetRef = useRef<HTMLDivElement>(null); const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const { scrollYProgress } = useScroll({ target: targetRef, container: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  useEffect(() => { const computeMaxScroll = () => { if (trackRef.current) setMaxScroll(trackRef.current.scrollWidth); }; computeMaxScroll(); window.addEventListener("resize", computeMaxScroll); return () => window.removeEventListener("resize", computeMaxScroll); }, []);
  const x = useTransform(smoothProgress, [0, 0.9], [0, -maxScroll]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
  const fillClipPath = useTransform(smoothProgress, [0.3, 0.9], ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]);
  return (
    <section ref={targetRef} className="relative h-[500vh] bg-[#1f2547]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="relative">
            <h2 className="text-[20vw] font-display font-black uppercase tracking-[-0.04em] text-white/5 leading-none text-center whitespace-nowrap">{"PROCESS".split("").map((char, i) => ( <WaveLetter key={i} char={char} index={i} progress={smoothProgress} /> ))}</h2>
            <motion.div style={{ clipPath: fillClipPath }} className="absolute inset-0 flex justify-center items-center"><h2 className="text-[20vw] font-display font-black uppercase tracking-[-0.04em] text-[#ef3b5d] leading-none text-center whitespace-nowrap">{"PROCESS".split("").map((char, i) => ( <WaveLetter key={i} char={char} index={i} progress={smoothProgress} /> ))}</h2></motion.div>
          </div>
        </motion.div>
        <div className="relative z-10 w-full"><div className="flex items-center"><motion.div ref={trackRef} style={{ x }} className="flex flex-row gap-8 md:gap-16 items-center"><div className="flex-shrink-0 w-[100vw]" />{PROCESS_STEPS.map((step, i) => ( <ProcessCard key={step.id} step={step} index={i} /> ))}<div className="flex-shrink-0 w-[20vw]" /></motion.div></div></div>
      </div>
    </section>
  );
}

function ProcessCard({ step, index }: { step: any; index: number }) {
  const shiftClass = index % 2 === 0 ? "translate-y-8 md:translate-y-12" : "-translate-y-8 md:-translate-y-12";
  return (
    <div className={cn("flex-shrink-0 w-[85vw] md:w-[450px] min-h-[400px] md:h-[550px] group relative bg-[#1a1f3d] p-10 md:p-16 rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col", shiftClass)}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-12"><span className="text-xs font-black tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity uppercase">{step.id} / STEP</span></div>
        <h3 className="text-4xl md:text-6xl font-display font-black tracking-[-0.04em] uppercase leading-none mb-8 group-hover:text-[#ef3b5d] transition-colors text-white">{step.title}</h3>
        <p className="text-base md:text-lg font-display font-black tracking-[-0.01em] leading-relaxed text-white/70 group-hover:text-white transition-colors uppercase mb-12">{step.desc}</p>
        <div className="mt-auto flex justify-between items-center"><HexIcon className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" fill="#ef3b5d" /></div>
      </div>
    </div>
  );
}

function LatestProjects() {
  return (
    <section className="py-32 md:py-48 bg-[#1f2547]">
      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-6">
            <div className="flex items-center gap-3"><HexIcon className="w-3 h-3" fill="#ef3b5d" /><CinematicText className="text-[10px] font-black tracking-[0.3em] uppercase text-white">PORTFOLIO</CinematicText></div>
            <CinematicText as="h2" className="text-6xl md:text-8xl font-display font-black tracking-[-0.04em] uppercase leading-[0.85] text-white">LATEST<br /><span className="text-[#ef3b5d]">PROJECTS<span className="text-white">.</span></span></CinematicText>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-0 lg:pt-24">{PROJECTS.map((proj, i) => ( <ProjectCard key={proj.name} project={proj} index={i} /> ))}</div>
        </div>
        <div className="mt-32 flex justify-center"><motion.button whileHover={{ y: -5 }} className="group flex flex-col items-center gap-4"><span className="text-xs font-black tracking-[0.4em] uppercase text-white/40 group-hover:text-white transition-colors">VIEW ALL WORK</span><div className="w-12 h-[1px] bg-white/20 relative overflow-hidden"><motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6, ease: "easeInOut" }} className="absolute inset-0 bg-[#ef3b5d]" /></div></motion.button></div>
      </Layout>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef(null); const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -100 : -50]);
  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative flex flex-col group cursor-pointer", index === 1 ? "md:mt-32" : "")}>
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-8 relative">
        <motion.img src={project.img} alt={project.name} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="text-xs font-black tracking-[0.3em] uppercase text-[#ef3b5d] mb-2 block">{project.id}</span>
          <div className="relative inline-block"><h4 className="text-3xl font-display font-black tracking-[-0.02em] uppercase text-white">{project.name}</h4><div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#ef3b5d] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" /></div>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60 block mt-2">{project.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

function WaveText({ text, className, containerRef }: { text: string; className?: string; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container: containerRef, offset: ["start 98%", "start 60%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <div ref={ref} className={cn("flex flex-wrap", className)}>
      {text.split("").map((char, i) => {
        const start = i * 0.015;
        const end = Math.min(start + 0.6, 1);
        const y = useTransform(smoothProgress, [start, end], [60, 0]);
        const opacity = useTransform(smoothProgress, [start, end], [0, 1]);

        return (
          <motion.span
            key={i}
            style={{ y, opacity }}
            className="inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </div>
  );
}

function OtherServices({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { triggerLogoTransition, triggerPageTransition } = useTransition();
  return (
    <section className="py-32 md:py-48 bg-[#1f2547]">
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-4 flex flex-col items-start gap-8">
            <div className="flex items-center gap-3">
              <HexIcon className="w-3 h-3" fill="#ef3b5d" />
              <CinematicText className="text-[10px] font-black tracking-[0.3em] uppercase text-white">OTHER SERVICES</CinematicText>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col md:-mt-12">
            {/* Current Service (Struck-through) */}
            <div className="flex flex-col">
              <div className="w-full h-px bg-white/5" />
              <div className="py-8 md:py-12 relative">
                <h3 className="text-3xl md:text-5xl font-display font-black text-white/10 uppercase tracking-[-0.04em] relative inline-block">
                  Website support
                  <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 origin-left" />
                </h3>
              </div>
            </div>

            {OTHER_SERVICES.map((service) => (
              <motion.div key={service} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group flex flex-col">
                <div className="w-full h-px bg-[#ef3b5d] transition-transform duration-500 scale-x-0 group-hover:scale-x-100 origin-left z-10" />
                <div className="w-full h-px bg-white/5" />
                <div className="py-8 md:py-12 flex items-center justify-between cursor-pointer group" onClick={() => triggerPageTransition(`/${service.toLowerCase().replace(/ /g, "-")}`)}>
                  <WaveText text={service} containerRef={containerRef} className="text-3xl md:text-5xl font-display font-black text-white transition-all duration-300 group-hover:translate-x-8 uppercase tracking-[-0.04em]" />
                  <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-[-10px] text-[#ef3b5d]" />
                </div>
              </motion.div>
            ))}
            <div className="w-full h-px bg-white/5" />
          </div>
        </div>
      </Layout>
    </section>
  );
}

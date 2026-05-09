import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Settings } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { useState, useRef } from "react";
import { WaveMenu } from "../components/WaveMenu";
import { useTransition } from "../components/TransitionProvider";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import HexIcon from "../components/HexIcon";

export default function StudioPage() {
  const [isWaveOpen, setIsWaveOpen] = useState(false);
  const { triggerLogoTransition, triggerPageTransition } = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SmoothScrollProvider containerRef={containerRef} ease={0.09}>
      <div className="h-screen bg-[#ef4444] p-2 md:p-3 lg:p-4 font-sans select-none overflow-hidden">
        <div className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#1f2547] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <WaveMenu isOpen={isWaveOpen} onClose={() => setIsWaveOpen(false)} />
          
          <div className="sticky top-0 left-0 right-0 z-[200] h-0 overflow-visible pointer-events-none">
            <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12 flex justify-between items-start">
              <button onClick={() => triggerPageTransition("/")} className="pointer-events-auto group">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-[#ef4444] rounded-full flex items-center justify-center p-2 md:p-3 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5z" />
                  </svg>
                </div>
              </button>

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
          </div>

          <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hide">
      <Layout className="py-12 flex items-center gap-4">
        <span 
          onClick={() => triggerPageTransition("/")}
          className="flex items-center gap-2 text-white/40 hover:text-[#ef4444] transition-colors text-xs font-black tracking-[0.2em] uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </span>
      </Layout>
      <Layout className="flex-1 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-[12vw] font-black tracking-tighter uppercase leading-none mb-8 flex items-baseline gap-2">
            STUDIO<HexIcon className="w-[4vw] h-[4vw]" fill="#ef4444" />
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
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

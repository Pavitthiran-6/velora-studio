import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useTransition } from "./TransitionProvider";
import HexIcon from "./HexIcon";

interface WaveMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaveMenu: React.FC<WaveMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && waveRef.current && !waveRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const { triggerLogoTransition, triggerPageTransition } = useTransition();
  const navItems = [
    { label: "WORK", path: "/work" },
    { label: "SERVICES", path: "/services" },
    { label: "STUDIO", path: "/studio" },
    { label: "CONTACT", path: "/contact" }
  ];

  return (
    <motion.div
      ref={waveRef}
      initial={false}
      animate={{ y: isOpen ? "0%" : "100%" }}
      transition={{ type: "spring", stiffness: 35, damping: 10, mass: 1.2, restDelta: 0.001 }}
      className="absolute inset-0 z-[1000] flex flex-col pointer-events-none"
    >
      <div className="relative w-full h-[240px] -mb-1">
        <svg viewBox="0 0 1440 240" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            animate={{
              d: isOpen
                ? "M0,0 C240,-60 480,100 720,0 C960,-60 1200,100 1440,0 V240 H0 Z"
                : "M0,240 C240,240 480,240 720,240 C960,240 1200,240 1440,240 V240 H0 Z"
            }}
            transition={{ type: "spring", stiffness: 40, damping: 12, mass: 2 }}
            fill="#ffffff"
          />
          <motion.path
            animate={{
              x: [0, -60, 0],
              d: isOpen
                ? "M0,20 C360,-40 720,80 1080,20 C1440,-40 1800,80 2160,20 V240 H0 Z"
                : "M0,240 C360,240 720,240 1080,240 C1440,240 1800,240 2160,240 V240 H0 Z"
            }}
            transition={{ x: { duration: 8, repeat: Infinity, ease: "linear" }, d: { type: "spring", stiffness: 30, damping: 10, mass: 2.5 } }}
            fill="#ffffff"
            opacity="0.3"
          />
        </svg>
      </div>
      <div className="flex-1 bg-[#ffffff] pointer-events-auto px-6 md:px-16 py-8 md:py-12 flex flex-col justify-between -mt-10">
        <motion.div animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }} transition={{ delay: 0.6, duration: 1 }} className="flex justify-between items-center w-full">
          <button 
            onClick={() => {
              onClose();
              triggerLogoTransition();
            }}
            className="w-10 h-10 md:w-14 md:h-14 bg-[#ef4444] rounded-full flex items-center justify-center p-2 md:p-3 hover:scale-110 transition-transform cursor-pointer"
          >
             <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5zZ" />
             </svg>
          </button>
          <nav className="flex items-center gap-3 md:gap-6 lg:gap-8 flex-1 justify-center min-w-0">
            {navItems.map((item, index) => (
              <div key={item.label} className="flex items-center gap-3 md:gap-6 lg:gap-8">
                <span 
                  onClick={() => {
                    onClose();
                    triggerPageTransition(item.path);
                  }}
                  className="text-xl md:text-3xl lg:text-[4.5vw] font-display font-black tracking-tighter cursor-pointer text-[#1f2547] hover:text-[#ef4444] transition-colors duration-300 whitespace-nowrap uppercase flex items-baseline gap-1"
                >
                  {item.label}<HexIcon className="w-[1vw] h-[1vw]" fill="#ef4444" />
                </span>
                {index < navItems.length - 1 && <HexIcon className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 lg:w-3.5 lg:h-3.5" fill="#ef4444" />}
              </div>
            ))}
          </nav>
          <button onClick={onClose} className="relative flex gap-2 md:gap-3 h-10 md:h-12 items-center cursor-pointer group">
            <div className="flex flex-col items-center h-8 md:h-10 w-px bg-black/20 relative">
               <motion.div animate={{ y: isOpen ? 20 : 0 }} className="absolute top-0 -translate-x-1/2 left-1/2">
                 <HexIcon className="w-1.5 md:w-2 h-1.5 md:h-2" fill="white" />
               </motion.div>
            </div>
            <div className="flex flex-col items-center h-8 md:h-10 w-px bg-black/40 relative">
               <motion.div animate={{ y: isOpen ? -20 : 0 }} className="absolute bottom-0 -translate-x-1/2 left-1/2">
                 <HexIcon className="w-1.5 md:w-2 h-1.5 md:h-2 shadow-[0_0_10px_#ef4444]" fill="#ef4444" />
               </motion.div>
            </div>
            <div className="flex flex-col items-center h-8 md:h-10 w-px bg-black/20 relative" />
          </button>
        </motion.div>
        <motion.div animate={{ opacity: isOpen ? 1 : 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex justify-center gap-6 md:gap-12 pb-4">
          {["LINKEDIN", "INSTAGRAM", "TWITTER", "BEHANCE", "DRIBBBLE"].map((link) => (
            <span key={link} className="text-[7px] md:text-[9px] font-black tracking-[0.3em] text-black hover:text-[#ef4444] transition-colors cursor-pointer uppercase">{link}</span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";

interface TransitionContextType {
  isTransitioning: boolean;
  isLoading: boolean;
  triggerLogoTransition: () => void;
  heroKey: number;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within a TransitionProvider");
  return context;
};

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroKey, setHeroKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 800);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const triggerLogoTransition = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Peak of the splash (impact)
    setTimeout(() => {
      if (location.pathname !== "/") {
        navigate("/");
      }
      setHeroKey(prev => prev + 1);
      
      // Scroll top if on home page
      const container = document.querySelector(".overflow-y-auto");
      if (container) {
        container.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 1200);

    // End of transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2300);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, isLoading, triggerLogoTransition, heroKey }}>
      {children}
      
      {/* Global Floating Contact Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: (isTransitioning || location.pathname === "/contact") ? 0 : 1, 
          x: (isTransitioning || location.pathname === "/contact") ? 20 : 0 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/contact")}
        className="fixed bottom-8 md:bottom-12 right-6 md:right-16 z-[150] w-12 h-12 md:w-16 md:h-16 bg-[#ef4444] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(239,68,68,0.3)] pointer-events-auto cursor-pointer"
      >
        <Pencil className="text-white w-5 h-5 md:w-7 md:h-7" />
      </motion.button>

      {/* Global Cinematic Portal */}
      <CinematicWarpTransition isActive={isTransitioning} />
    </TransitionContext.Provider>
  );
};

/* --- GLOBAL WARP TRANSITION COMPONENT --- */
const CinematicWarpTransition = ({ isActive }: { isActive: boolean }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0 } }}
          transition={{ duration: 0.3 }}
          className="fixed top-2 md:top-3 lg:top-4 bottom-2 md:bottom-3 lg:bottom-4 left-2 md:left-3 lg:left-4 right-2 md:right-3 lg:right-4 z-[9000] pointer-events-none overflow-hidden rounded-[16px] md:rounded-[28px] lg:rounded-[40px]"
        >
          {/* Temporary Background Shield */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 1.6, times: [0, 0.85, 1], ease: "linear" }}
            className="absolute inset-0 bg-[#1f2547] z-0"
          />

          {/* Droplet Descent */}
          <motion.div
            initial={{ x: 88, y: 88, scale: 0.2, opacity: 1 }}
            animate={{ 
              x: [88, typeof window !== 'undefined' ? window.innerWidth / 2 : 0], 
              y: [88, typeof window !== 'undefined' ? window.innerHeight / 2 : 0],
              scale: [0.2, 1.6, 0.8],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 w-16 h-16 bg-white rounded-full blur-[1px] shadow-[0_0_25px_white]"
            style={{ top: 0, left: 0 }}
          />

          {/* Ripples */}
          {[
            { scale: 10, color: "#ef3b5d", delay: 1.1, duration: 0.7, z: 10 },
            { scale: 12, color: "#ffffff", delay: 1.2, duration: 0.8, z: 20 },
            { scale: 14, color: "#1f2547", delay: 1.3, duration: 0.9, z: 30 }
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: r.scale, opacity: [0, 1, 0] }}
              transition={{ duration: r.duration, delay: r.delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
              style={{ backgroundColor: r.color, zIndex: r.z }}
            />
          ))}

          {/* Splash Particles */}
          <div className="absolute top-1/2 left-1/2 z-40">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 1200,
                  y: (Math.random() - 0.5) * 1200
                }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className={`absolute w-2 h-2 rounded-full blur-[1px] ${i % 2 === 0 ? "bg-[#ef4444]" : "bg-white"}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

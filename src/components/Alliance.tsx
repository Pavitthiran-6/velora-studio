import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Layout } from "./layout/Layout";
import { CinematicText } from "./CinematicText";

const partners = [
  { name: "ModernMD", sub: "URGENT CARE", stat: "20K+", label: "SIGN UPS", client: "ModernMD Urgent Care" },
  { name: "OCEAN BLUE", sub: "LOGISTICS", stat: "45%", label: "REVENUE INCREASE", client: "Ocean Blue Logistics" },
  { name: "wework", sub: "GLOBAL", stat: "15+", label: "DESIGN AWARDS", client: "WeWork Global" },
  { name: "SKYLINE", sub: "DYNAMICS", stat: "12M+", label: "USER REACH", client: "Skyline Dynamics" },
  { name: "SELENE", sub: "AVIATION", stat: "20K+", label: "SIGN UPS", client: "ModernMD Urgent Care" },
  { name: "SLING SHOT", sub: "INTERGALACTIC", stat: "45%", label: "REVENUE INCREASE", client: "Ocean Blue Logistics" },
  { name: "HELIAS", sub: "100% PURE OILS", stat: "15+", label: "DESIGN AWARDS", client: "WeWork Global" },
  { name: "AWESTRUCK", sub: "CREATIVE", stat: "12M+", label: "USER REACH", client: "Skyline Dynamics" },
];

export const Alliance = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  // Specifically track the section entering the screen for the initial reveal
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ["start 100%", "start 0%"]
  });

  // Smooth out the scroll progress for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 20,
    restDelta: 0.001
  });

  const smoothEnterProgress = useSpring(enterProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const calculateRange = () => {
      if (topRowRef.current && sectionRef.current) {
        const rowWidth = topRowRef.current.scrollWidth;
        const containerWidth = sectionRef.current.clientWidth;
        // Calculate how much we need to move to show all cards
        // We start slightly offset (15%) and end when the last card is aligned
        setScrollRange(rowWidth - containerWidth + (containerWidth * 0.15));
      }
    };

    calculateRange();
    window.addEventListener("resize", calculateRange);
    return () => window.removeEventListener("resize", calculateRange);
  }, []);

  // Upper row: RIGHT -> LEFT
  // 0 -> 0.2: Settle phase (moving to horizontal "center" alignment)
  // 0.2 -> 1: Glide phase (cinematic horizontal scroll)
  const xTop = useTransform(
    smoothProgress, 
    [0, 0.2, 1], 
    ["20vw", "0vw", `-${scrollRange * 2.5}px`]
  );
  
  // Lower row: LEFT -> RIGHT
  const xBottom = useTransform(
    smoothProgress, 
    [0, 0.2, 1], 
    ["-20vw", "0vw", `${scrollRange * 2.8}px`]
  );
  
  // Reveal content as it enters the screen
  const textProgress = useTransform(smoothEnterProgress, [0, 1], [0, 0.5]);

  const upperRow = partners.slice(0, 4);
  const lowerRow = partners.slice(4, 8);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#1f2547] relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center py-8 md:py-12">
        <div className="w-full h-full flex flex-col justify-center">

          <Layout className="relative z-10 mb-8 md:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Left Column: Label and Description */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-4">
              <div className="flex flex-col gap-12">
                {/* Label */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border border-[#ef4444] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full" />
                  </div>
                  <span className="text-white text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap">
                    CREATIVE ALLIANCE
                  </span>
                </div>

                {/* Paragraph */}
                <p className="text-white/60 text-sm md:text-base lg:text-lg leading-relaxed max-w-md font-medium">
                  At Graphoria, we craft immersive digital experiences designed to elevate brands and engage audiences. Through innovative design, strategic thinking, and seamless technology, we empower our partners to achieve greatness and redefine the boundaries of their industries.
                </p>
              </div>
            </div>

            {/* Right Column: Main Heading */}
            <div className="lg:col-span-7">
              <h2 className="text-white text-[10vw] lg:text-[6.5vw] font-black leading-[0.85] tracking-tighter uppercase relative cursor-default">
                <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" progress={textProgress}>BUILD THE</CinematicText><br />
                <CinematicText as="span" className="text-[#ef4444] hover:text-white transition-colors duration-500" progress={textProgress}>GRAPHORIA</CinematicText><br />
                <div className="flex items-baseline gap-4">
                  <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" progress={textProgress}>EXPERIENCE</CinematicText>
                  {/* Red Hexagon Accent */}
                  <div className="w-[2.5vw] h-[2.5vw] bg-[#ef4444] relative" style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }} />
                </div>
              </h2>
            </div>
          </div>
        </Layout>

        {/* Partners Animated Tracks */}
        <div className="flex flex-col gap-4 relative w-full translate-z-0 will-change-transform overflow-hidden shrink-0">
          {/* Upper Row: RIGHT -> LEFT */}
          <motion.div 
            ref={topRowRef}
            style={{ x: xTop }}
            className="flex gap-4 px-[10vw]"
          >
            {upperRow.map((partner, i) => (
              <PartnerCard key={partner.name + i} partner={partner} i={i} />
            ))}
          </motion.div>

          {/* Lower Row: LEFT -> RIGHT */}
          <motion.div 
            ref={bottomRowRef}
            style={{ x: xBottom }}
            className="flex gap-4 px-[10vw]"
          >
            {lowerRow.map((partner, i) => (
              <PartnerCard key={partner.name + i} partner={partner} i={i + 4} />
            ))}
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};

interface PartnerProps {
  partner: typeof partners[0];
  i: number;
  key?: React.Key;
}

const PartnerCard = ({ partner, i }: PartnerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: (i % 4) * 0.1 }}
    whileHover="hover"
    className="w-[45vw] md:w-[26vw] lg:w-[18vw] shrink-0 aspect-video bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 relative group cursor-crosshair overflow-hidden transform-gpu translate-z-0 transition-transform duration-300 hover:scale-[1.02]"
  >
    <span className="text-white text-xs md:text-base lg:text-xl font-display font-black tracking-[-0.04em] uppercase opacity-80 group-hover:opacity-100 transition-opacity text-center px-4">
      {partner.name}
    </span>
    <span className="text-white text-[8px] md:text-[10px] font-display font-black tracking-[0.2em] uppercase opacity-30 mt-1">
      {partner.sub}
    </span>

    {/* Hover Stat Overlay */}
    <motion.div
      variants={{
        hover: { opacity: 1, scale: 1, y: 0 }
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-[#ef4444] rounded-full flex flex-col items-center justify-center text-white p-4 shadow-2xl">
        <span className="text-xl md:text-4xl font-display font-black tracking-[-0.04em]">{partner.stat}</span>
        <span className="text-[8px] md:text-[10px] font-display font-black tracking-[0.2em] uppercase text-center leading-tight mt-1 px-4">
          {partner.label}
        </span>
      </div>
    </motion.div>
  </motion.div>
);


import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { Layout } from "./layout/Layout";
import { CinematicText } from "./CinematicText";

// Specific Graphoria Branding Content
const TESTIMONIALS = [
  {
    id: 1,
    name: "Arjun Menon",
    role: "Founder / Novagrid",
    text: "Graphoria transformed our early-stage idea into a polished digital experience with remarkable attention to motion, interaction, and detail.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Blake",
    role: "Creative Director / Fluxify",
    text: "The balance between visual design and scalable development was exceptional. Every interaction felt intentional and refined.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Kavin Raj",
    role: "Startup Founder / Orbit Labs",
    text: "We needed more than a website — we needed identity. Graphoria delivered something modern, immersive, and memorable.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Nina Carter",
    role: "Marketing Director / Elevora",
    text: "The smooth animations and premium interactions completely elevated our brand presence. The final result genuinely impressed our clients.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Leo Brooks",
    role: "Founder / Vertex Labs",
    text: "The collaboration felt like an extension of our own team. They didn't just build a site; they built a scalable design system that we continue to use today.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
  }
];

const STATS = [
  { label: "Startup Collaborations", value: "18+" },
  { label: "Client Retention", value: "92%" },
  { label: "Creative Launches", value: "24" }
];

export const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const updateConstraints = () => {
      // Calculate the difference between the full track width and the visible container width
      const trackWidth = track.scrollWidth;
      const visibleWidth = container.offsetWidth;
      setDragConstraints({ 
        left: Math.min(0, -(trackWidth - visibleWidth)), 
        right: 0 
      });
    };

    // Use ResizeObserver for high-precision constraint updates
    const observer = new ResizeObserver(updateConstraints);
    observer.observe(track);
    observer.observe(container);

    updateConstraints();
    // Fallback for image loading
    const timer = setTimeout(updateConstraints, 1000);
    
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="bg-[#1f2547] py-32 md:py-48 relative overflow-hidden">
      {/* Background Decorative Ambient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-[#ef4444]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] bg-[#ef4444]/5 blur-[120px] rounded-full" />
      </div>

      <Layout className="relative z-10">
        {/* TOP AREA: Header and Stats (STRICTLY UNCHANGED) */}
        <div ref={containerRef} className="flex flex-col md:grid md:grid-cols-12 gap-12 md:gap-8 items-start mb-24 md:mb-32">
          {/* Left Side: Title */}
          <div className="md:col-span-6 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#ef4444] rounded-full" />
              <span className="text-white/40 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase">CLIENT TRUST</span>
            </div>
            <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter uppercase cursor-default">
              <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>REAL</CinematicText>
              <br />
              <CinematicText as="span" className="text-[#ef4444] hover:text-white transition-colors duration-500" intensity={1.0}>PARTNERS.</CinematicText>
              <br />
              <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>REAL</CinematicText>
              <br />
              <div className="flex flex-row items-baseline">
                <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>RESULTS</CinematicText>
                <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>.</CinematicText>
              </div>
            </h2>
          </div>

          {/* Right Side: Circular Stats */}
          <div className="md:col-span-6 flex flex-wrap md:flex-nowrap gap-6 md:gap-4 lg:gap-8 justify-start md:justify-end w-full pt-12 md:pt-24">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col items-center justify-center p-4 text-center group hover:border-[#ef4444]/30 transition-colors duration-500"
              >
                <span className="text-2xl md:text-3xl lg:text-4xl font-display font-black tracking-[-0.04em] text-white group-hover:text-[#ef4444] transition-colors">
                  {stat.value}
                </span>
                <span className="text-[8px] md:text-[9px] lg:text-[10px] font-display font-black tracking-[0.15em] uppercase text-white/40 mt-1 leading-tight px-2">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM AREA: HORIZONTAL REVIEW STRIP (INTEGRATED) */}
        <div className="relative mt-12 md:mt-0">
          <div className="flex items-center gap-4 mb-8 opacity-40">
             <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white/60">FOUNDER FEEDBACK</span>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="overflow-visible cursor-grab active:cursor-grabbing">
            <motion.div
              ref={trackRef}
              drag="x"
              dragConstraints={dragConstraints}
              style={{ x }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
              className="flex gap-6 md:gap-8 w-max"
            >
              {TESTIMONIALS.map((t, i) => (
                <ReviewCard key={t.id} data={t} index={i} />
              ))}
              {/* Spacer for proper end alignment */}
              <div className="min-w-[10vw] shrink-0 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </Layout>
    </section>
  );
};

interface ReviewData {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

const ReviewCard: React.FC<{ data: ReviewData, index: number }> = ({ data, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + (index * 0.1), duration: 0.8 }}
      whileHover={{ y: -5 }}
      className="w-[85vw] md:w-[460px] min-h-[300px] md:h-[340px] bg-[#1a1e3b] border border-white/5 p-8 md:p-10 rounded-[32px] relative group transition-all duration-500 hover:border-white/10 shadow-2xl flex flex-col shrink-0"
    >
      {/* Top Label: Red Dot + Name/Company */}
      <div className="flex items-center gap-3 mb-10 shrink-0">
        <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full" />
        </div>
        <span className="text-white font-display font-black text-[10px] md:text-xs tracking-[-0.02em] uppercase opacity-80">
          {data.name} / {data.role.split(" / ")[1] || data.role.split(" / ")[0]}
        </span>
      </div>

      {/* Content Area: Side-by-side as per previously approved image style */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 overflow-hidden shrink-0 bg-white/5">
            <img 
              src={data.avatar} 
              alt={data.name} 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-base md:text-lg font-display font-black leading-[1.6] tracking-[-0.02em] uppercase">
              "{data.text}"
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Blueprint Accent (Corner Detail) */}
      <div className="absolute bottom-10 right-10 opacity-10 group-hover:opacity-30 transition-opacity shrink-0">
        <span className="text-[10px] font-black tracking-widest uppercase text-white">00{index + 1}</span>
      </div>
    </motion.div>
  );
};

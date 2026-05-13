import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EarthGlobe } from "../components/EarthGlobe";
import { Layout } from "../components/layout/Layout";
import { Footer } from "../components/Footer";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { useTransition } from "../components/TransitionProvider";
import { CinematicText } from "../components/CinematicText";
import { WaveMenu } from "../components/WaveMenu";
import HexIcon from "../components/HexIcon";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS_CONTENT: Record<string, any> = {
  "sling-shot": {
    title: "SLING SHOT",
    subtitle: "Sling Shot Intergalactic is the foremost choice for file transfers among film producers, spanning from Hollywood to Paris and Bangkok.",
    metric1: { value: "30", label: "KEYWORDS ACHIEVED TOP 20 RANKING IN FIRST MONTH" },
    metric2: { value: "279", label: "INCREASED INQUIRIES IN FIRST MONTH" },
    editorialImages: {
      left: "/slingshot_editorial_1_1778663217841.png",
      right: "/slingshot_editorial_2_1778663418746.png"
    },
    nextProject: { title: "OCEAN AGENCY", path: "/work/ocean-agency", image: "/src/assets/projects/ocean_agency_hero_1778243090443.png" }
  },
  "ocean-agency": {
    title: "OCEAN AGENCY",
    subtitle: "A digital sanctuary for maritime innovation and global logistics excellence, redefining how the world connects across the seas.",
    metric1: { value: "45", label: "REDUCTION IN BOOKING OVERHEAD THROUGH AUTOMATION" },
    metric2: { value: "180", label: "PERCENT INCREASE IN GLOBAL RETENTION" },
    editorialImages: {
      left: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200",
      right: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&q=80&w=1200"
    },
    nextProject: { title: "HOBOKEN YOGI", path: "/work/hoboken-yogi", image: "/src/assets/projects/hoboken_yogi_hero_1778243105729.png" }
  },
  "hoboken-yogi": {
    title: "HOBOKEN YOGI",
    subtitle: "Elevating the spirit through digital tranquility and community-driven wellness, bringing the studio experience to your home.",
    metric1: { value: "12", label: "NEW CLASSES BOOKED PER MINUTE GLOBALLY" },
    metric2: { value: "340", label: "PERCENT GROWTH IN DIGITAL MEMBERSHIPS" },
    editorialImages: {
      left: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      right: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
    },
    nextProject: { title: "MODERN MD", path: "/work/modern-md", image: "/src/assets/projects/modern_md_hero_1778243119932.png" }
  },
  "modern-md": {
    title: "MODERN MD",
    subtitle: "Redefining the medical landscape through human-centric design and precision tech, making healthcare accessible and intuitive.",
    metric1: { value: "89", label: "PATIENT SATISFACTION SCORE ACROSS PLATFORMS" },
    metric2: { value: "50", label: "PERCENT FASTER DIAGNOSTIC WORKFLOWS" },
    editorialImages: {
      left: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
      right: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
    },
    nextProject: { title: "SLING SHOT", path: "/work/sling-shot", image: "/src/assets/projects/valaclava_project_hero_1778243074252.png" }
  }
};

const HeroSection = ({ title }: { title: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={container} className="relative h-full shrink-0 overflow-hidden bg-[#f5f5f3]">
      <div className="relative h-full w-full flex flex-col items-center justify-center -top-10 md:-top-16">
        <motion.div style={{ opacity: globeOpacity }} className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]} performance={{ min: 0.5 }} gl={{ antialias: true, alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <EarthGlobe />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </motion.div>

        <motion.div
          style={{ scale: titleScale }}
          className="relative z-10 text-center px-4"
        >
          <CinematicText 
            as="h1" 
            className="text-[12vw] md:text-[15vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.8] text-[#050505] mix-blend-multiply"
            intensity={1.2}
          >
            {title}
          </CinematicText>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectIntroSection = ({ data }: { data: any }) => {
  return (
    <section className="py-24 md:py-40 bg-[#f5f5f3] border-t border-[#050505]/5">
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-4 flex flex-col gap-10">
            <div className="flex items-center gap-3">
              <HexIcon className="w-2.5 h-2.5" fill="#050505" />
              <span className="text-[10px] font-black tracking-[0.4em] text-[#050505] uppercase">SERVICES</span>
            </div>
            <div className="space-y-6">
              {["Digital Strategy", "Brand Design", "Frontend Dev", "SEO Optimization", "Strapi CMS"].map((service, i) => (
                <motion.div 
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group flex items-center justify-between border-b border-[#050505]/10 pb-4 cursor-default"
                >
                  <span className="text-xl md:text-2xl font-display font-black text-[#050505] uppercase tracking-tighter group-hover:text-[#ef4444] transition-colors">
                   {service}
                 </span>
                 <div className="w-2 h-2 rounded-full bg-[#050505]/20 group-hover:bg-[#ef4444] transition-colors" />
               </motion.div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-12">
            <div className="flex items-center gap-3">
              <HexIcon className="w-2.5 h-2.5" fill="rgba(5, 5, 5, 0.2)" />
              <span className="text-[10px] font-display font-black tracking-[0.4em] text-[#050505]/40 uppercase">THE PROJECT</span>
            </div>
            <CinematicText 
              as="p" 
              className="text-4xl md:text-6xl lg:text-[5.5vw] font-display font-black text-[#050505] leading-[0.9] tracking-tighter uppercase"
              intensity={0.8}
            >
              {data.subtitle}
            </CinematicText>
            <div className="h-px w-full bg-[#050505]/10 mt-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-display font-black tracking-[0.4em] text-[#050505]/40 uppercase">KEY METRIC</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl md:text-9xl font-display font-black text-[#050505]">{data.metric1.value}</span>
                  <span className="text-3xl font-display font-black text-[#ef4444]">%</span>
                </div>
                <p className="text-xs font-sans font-medium tracking-tight text-[#050505]/60 uppercase leading-relaxed max-w-[240px]">
                  {data.metric1.label}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-display font-black tracking-[0.4em] text-[#050505]/40 uppercase">SUCCESS</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl md:text-9xl font-display font-black text-[#050505]">{data.metric2.value}</span>
                  <span className="text-3xl font-display font-black text-[#ef4444]">%</span>
                </div>
                <p className="text-xs font-sans font-medium tracking-tight text-[#050505]/60 uppercase leading-relaxed max-w-[240px]">
                  {data.metric2.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </section>
  );
};

const ImageCompositionSection = ({ editorialImages }: { editorialImages: any }) => {
  const [imageSet, setImageSet] = useState(0);
  const imagePairs = useMemo(() => [
    { left: editorialImages.left, right: editorialImages.right },
    { left: editorialImages.right, right: editorialImages.left }
  ], [editorialImages]);

  const handleNext = () => setImageSet((prev) => (prev + 1) % imagePairs.length);

  return (
    <section className="pt-24 md:pt-40 pb-20 bg-[#f5f5f3]">
      <Layout className="relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#050505]/10 flex items-center justify-between px-4">
          <div className="w-2 h-2 border border-[#050505]/20 rotate-45 bg-[#f5f5f3]" />
          <div className="w-2 h-2 border border-[#050505]/20 rotate-45 bg-[#f5f5f3]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-20">
          <div className="md:col-span-5 relative">
            <motion.div
              key={`left-${imageSet}-${editorialImages.left}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[20px] overflow-hidden aspect-[4/5] bg-gray-200"
            >
              <img src={imagePairs[imageSet].left} alt="Editorial Left" className="w-full h-full object-cover scale-110" />
            </motion.div>
            <div className="absolute top-20 -right-16 md:-right-24 z-20">
              <button 
                onClick={handleNext}
                className="w-32 h-32 md:w-48 md:h-48 bg-[#4b2e83] rounded-full flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer active:scale-95 shadow-2xl"
              >
                <span className="text-white text-xs font-display font-black tracking-[0.4em] uppercase group-hover:tracking-[0.6em] transition-all">SHUFFLE</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-7 mt-20 md:mt-40 space-y-24">
            <motion.div
              key={`right-${imageSet}-${editorialImages.right}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[20px] overflow-hidden aspect-[16/18] bg-gray-300"
            >
              <img src={imagePairs[imageSet].right} alt="Editorial Right" className="w-full h-full object-cover scale-110" />
            </motion.div>
            <div className="space-y-16">
              <CinematicText as="h2" className="text-[8vw] md:text-[6vw] font-display font-black text-[#050505] leading-[0.85] uppercase tracking-[-0.04em]" intensity={0.9}>
                FUSING TECH WITH<br />HUMANITY
              </CinematicText>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-[#050505] rounded-full" />
                  <span className="text-[10px] font-display font-black tracking-[0.4em] text-[#050505] uppercase">CHALLENGE</span>
                </div>
                <div className="md:col-span-8">
                  <p className="text-base md:text-lg font-sans font-medium text-[#050505]/70 leading-relaxed">
                    Step into a space where innovation meets every click, redefining your interaction with the digital landscape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </section>
  );
};

const DeviceShowcaseSection = ({ title }: { title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <section ref={containerRef} className="relative min-h-[700vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <img src="/ny_times_square_hd.png" alt="Times Square HD" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="absolute inset-0 z-10">
        <Layout>
          <div className="h-screen flex flex-col items-center justify-center text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <CinematicText as="h2" className="text-[10vw] font-display font-black text-white leading-[0.8] uppercase tracking-[-0.05em]" intensity={1.5}>
                UNIVERSAL<br />{title}
              </CinematicText>
            </motion.div>
          </div>

          <div className="h-screen flex items-center justify-center">
             <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl relative group transform-gpu">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" alt="Video Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-black border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
             </motion.div>
          </div>

          <div className="h-[40vh]" />

          <div className="h-screen flex items-center justify-start px-10 md:px-40">
             <motion.div initial={{ opacity: 0, x: -200, y: 100, rotate: -5, scale: 0.9 }} whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-[320px] md:w-[380px] aspect-[9/18] rounded-[48px] bg-[#050505] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col p-8 space-y-8 transform-gpu">
                <div className="flex justify-between items-center"><span className="text-white font-display font-black text-xs tracking-widest">{title}</span><div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><div className="w-5 h-[1px] bg-white" /></div></div>
                <div className="flex-1 flex flex-col justify-center space-y-6"><h3 className="text-white text-6xl font-display font-black leading-none uppercase">OUR<br/>COMPANY</h3></div>
                <div className="h-52 rounded-2xl overflow-hidden bg-blue-100"><img src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=600" alt="Clouds" className="w-full h-full object-cover" /></div>
             </motion.div>
          </div>

          <div className="h-screen flex items-center justify-end px-10 md:px-40">
             <motion.div initial={{ opacity: 0, x: 200, y: 100, rotate: 5, scale: 0.9 }} whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-[280px] md:w-[320px] aspect-[9/18] rounded-[48px] bg-[#050505] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col p-6 relative transform-gpu mt-40">
                <div className="absolute inset-0 opacity-40"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" alt="Abstract Tech" className="w-full h-full object-cover" /></div>
                <div className="relative z-10 space-y-8 flex-1 flex flex-col"><div className="flex justify-between items-center"><span className="text-white font-display font-black text-xs tracking-widest">{title}</span></div><div className="flex-1" /><p className="text-white/80 text-xs font-sans font-medium leading-relaxed uppercase tracking-wider">WE PROVIDE SECURE SOLUTIONS GLOBALLY.</p></div>
             </motion.div>
          </div>

          <div className="h-screen flex items-center justify-start px-10 md:px-40">
             <motion.div initial={{ opacity: 0, x: -200, y: 100, rotate: -5, scale: 0.9 }} whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-[320px] md:w-[380px] aspect-[9/18] rounded-[48px] bg-[#050505] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col p-8 space-y-8 transform-gpu">
              <div className="flex justify-between items-center"><span className="text-white font-display font-black text-xs tracking-widest">{title}</span></div>
              <div className="flex-1 flex flex-col justify-center space-y-4"><h3 className="text-white text-4xl font-display font-black leading-none uppercase">DYNAMIC<br/>SYNC</h3><p className="text-white/60 text-[8px] font-sans font-bold tracking-widest uppercase">REAL-TIME GLOBAL CONNECTIVITY</p></div>
              <div className="h-40 rounded-2xl overflow-hidden bg-purple-900/20 border border-white/5"><img src="https://images.unsplash.com/photo-1614850523296-e8c041de4398?auto=format&fit=crop&q=80&w=600" alt="Tech Gradient" className="w-full h-full object-cover" /></div>
             </motion.div>
          </div>
        </Layout>
      </div>
    </section>
  );
};

const VisualStyleSection = () => {
  return (
    <section className="py-40 md:py-60 bg-[#f5f5f3] relative z-10 border-t border-[#050505]/5">
      <Layout>
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[#050505]/20" />
            <span className="text-[10px] font-display font-black tracking-[0.5em] text-[#050505]/40 uppercase">VISUAL LANGUAGE</span>
            <div className="w-12 h-[1px] bg-[#050505]/20" />
          </div>
          <CinematicText as="h2" className="text-[10vw] md:text-[8vw] font-display font-black text-[#050505] leading-[0.8] uppercase tracking-[-0.06em]" intensity={0.8}>
            BOLD. RAW.<br /><span className="text-[#050505]/30">ESSENTIAL.</span>
          </CinematicText>
        </div>
      </Layout>
    </section>
  );
};

const VisionMilestonesSection = () => {
  const milestones = [
    { year: "2026", event: "STUDIO FOUNDED", label: "VISION" },
    { year: "2027", event: "GLOBAL BRAND COLLABORATIONS", label: "GROWTH" },
    { year: "2028", event: "NEXT GEN DIGITAL PRODUCTS", label: "CREATIVE" }
  ];
  return (
    <section className="pt-40 pb-40 bg-[#f5f5f3] relative z-10">
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-start">
          <div className="md:col-span-6 sticky top-40">
            <CinematicText as="h2" className="text-6xl md:text-8xl font-display font-black text-[#050505] leading-[0.85] uppercase tracking-[-0.05em]" intensity={0.9}>
              VISION &<br />MILESTONES
            </CinematicText>
          </div>
          <div className="md:col-span-6 space-y-0">
            {milestones.map((m, i) => (
              <motion.div key={i} className="group relative py-10 border-b border-[#050505]/10 flex items-center justify-between cursor-pointer overflow-hidden transform-gpu">
                <div className="flex items-center gap-8 group-hover:translate-x-6 transition-transform duration-500 ease-out">
                  <span className="text-[10px] font-display font-black text-[#050505]/40 tracking-widest">{m.year}</span>
                  <span className="text-xl md:text-2xl font-display font-black text-[#050505] uppercase tracking-tight group-hover:tracking-[0.05em] transition-all duration-500">{m.event}</span>
                </div>
                <span className="text-[10px] font-display font-black text-[#050505]/40 uppercase tracking-[0.4em] group-hover:opacity-100 transition-opacity">{m.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    </section>
  );
};

const NextProjectSection = ({ nextProject }: { nextProject: any }) => {
  const { triggerPageTransition } = useTransition();
  return (
    <section className="py-40 md:py-60 bg-[#f5f5f3] group border-t border-[#050505]/10 relative z-10">
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
          <div className="md:col-span-7 space-y-8">
            <div className="flex items-center gap-4"><div className="w-8 h-px bg-[#050505]/40" /><span className="text-[10px] font-display font-black tracking-[0.4em] text-[#050505]/40 uppercase">NEXT PROJECT</span></div>
            <CinematicText as="h2" className="text-7xl md:text-[10vw] font-display font-black text-[#050505] uppercase leading-[0.8] tracking-[-0.05em] group-hover:translate-x-10 transition-transform duration-700" intensity={1.0}>
              {nextProject.title.split(' ')[0]}<br />{nextProject.title.split(' ').slice(1).join(' ')}
            </CinematicText>
            <div onClick={() => triggerPageTransition(nextProject.path)} className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-10 group-hover:translate-x-14 transition-transform cursor-pointer w-fit">
              <span className="text-xs font-display font-black tracking-widest text-[#050505]">VIEW CASE STUDY</span>
              <div className="w-10 h-10 rounded-full border border-[#050505]/20 flex items-center justify-center group-hover:bg-[#050505] group-hover:text-white transition-colors"><span className="text-xl">→</span></div>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <motion.div className="aspect-video md:aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-200 grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl">
              <img src={nextProject.image} alt="Next Project" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </Layout>
    </section>
  );
};

export default function WorkDetailsPage() {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWaveOpen, setIsWaveOpen] = useState(false);
  const { triggerPageTransition } = useTransition();
  const { scrollY } = useScroll({ container: containerRef });

  const navOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const navY = useTransform(scrollY, [0, 150], [0, -20]);

  const content = PROJECTS_CONTENT[id || "sling-shot"] || PROJECTS_CONTENT["sling-shot"];

  return (
    <SmoothScrollProvider containerRef={containerRef} ease={0.09}>
      <div 
        onScroll={(e) => (e.currentTarget.scrollTop = 0)}
        className="h-screen bg-black p-2 md:p-3 lg:p-4 font-sans select-none overflow-hidden"
      >
        <div 
          onScroll={(e) => (e.currentTarget.scrollTop = 0)}
          className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#f5f5f3] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <WaveMenu isOpen={isWaveOpen} onClose={() => setIsWaveOpen(false)} bgColor="#1f2547" textColor="#ffffff" closeBtnColor="#050505" />
          <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-visible relative scrollbar-hide flex flex-col">
            <div className="sticky top-4 md:top-8 left-0 right-0 z-[100] px-10 md:px-20 py-10 flex justify-between items-center h-0 overflow-visible pointer-events-none">
              <div className="flex items-center">
                <button onClick={() => triggerPageTransition("/")} className="pointer-events-auto group"><div className="w-10 h-10 md:w-14 md:h-14 bg-[#050505] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><HexIcon className="w-4 h-4 md:w-6 md:h-6" fill="white" /></div></button>
                <motion.div style={{ opacity: navOpacity, y: navY }} className="ml-8 flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase pointer-events-auto">
                  <span className="text-[#050505]/40 uppercase">BUZZWORTHY</span><HexIcon className="w-2.5 h-2.5" fill="rgba(5, 5, 5, 0.4)" /><button onClick={() => triggerPageTransition("/work")} className="text-[#050505]/40 hover:text-[#050505] transition-colors cursor-pointer uppercase">WORK</button><HexIcon className="w-2.5 h-2.5" fill="rgba(5, 5, 5, 0.4)" /><span className="text-[#050505] uppercase">{content.title}</span>
                </motion.div>
              </div>
              <div className="flex items-center gap-10">
                <motion.div style={{ opacity: navOpacity, y: navY }} className="text-[10px] font-black tracking-[0.3em] text-[#050505] uppercase pointer-events-auto">OCT 2023</motion.div>
                <button onClick={() => setIsWaveOpen(!isWaveOpen)} className="relative z-[100] flex gap-3 md:gap-4 h-14 md:h-20 items-center cursor-pointer group pointer-events-auto"><div className="flex flex-col items-center h-10 md:h-14 w-px bg-[#050505]/20 relative"><div className="absolute top-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-[#050505]/40 rounded-full bg-[#f5f5f3] -translate-x-1/2 left-1/2" /></div><div className="flex flex-col items-center h-6 md:h-10 w-px bg-[#050505]/40 relative" /><div className="flex flex-col items-center h-10 md:h-14 w-px bg-[#050505]/20 relative"><div className="absolute bottom-0 w-2.5 md:w-3.5 h-2.5 md:h-3.5 border-2 border-[#050505]/40 rounded-full bg-[#f5f5f3] -translate-x-1/2 left-1/2" /></div></button>
              </div>
            </div>
            <HeroSection title={content.title} />
            <ProjectIntroSection data={content} />
            <ImageCompositionSection editorialImages={content.editorialImages} />
            <DeviceShowcaseSection title={content.title} />
            <VisualStyleSection />
            <VisionMilestonesSection />
            <NextProjectSection nextProject={content.nextProject} />
            <Footer isLight={true} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

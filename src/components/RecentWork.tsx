import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";
import { motion, useScroll } from "motion/react";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useRef } from "react";
import { Layout } from "./layout/Layout";
import { CinematicText } from "./CinematicText";

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];

export const RecentWork = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  // Map horizontal motion to the middle part of the vertical scroll
  // We start the horizontal move after the title has likely scrolled up (approx 0.1 progress)
  // and finish before the section unpins (approx 0.9 progress)
  const cards = [
    ...data.map((card, index) => (
      <Card key={card.src} card={card} index={index} />
    )),
    <motion.div
      key="view-all"
      whileHover={{ x: 10 }}
      className="flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all duration-300 px-12 md:px-20 h-full self-center"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        <IconArrowNarrowRight className="w-12 h-12 md:w-16 md:h-16 text-[#ef4444] transition-colors duration-500 group-hover:text-white" />
      </div>
      <span className="text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 group-hover:text-[#ef4444] transition-all duration-500 whitespace-nowrap">
        VIEW ALL WORK
      </span>
    </motion.div>
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#1f2547]">
      {/* Title Area - Scrolls naturally at the top */}
      <Layout className="py-20 md:py-32">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full border border-[#ef4444] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full" />
            </div>
            <span className="text-white text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap">PROJECTS</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase cursor-default">
              <CinematicText as="span" className="text-[#ef4444] hover:text-white transition-colors duration-500" intensity={1.0}>RECENT</CinematicText>
              <br />
              <div className="flex flex-row items-baseline">
                <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>WORK</CinematicText>
                <CinematicText as="span" className="hover:text-[#ef4444] transition-colors duration-500" intensity={1.0}>.</CinematicText>
              </div>
            </h2>
          </div>
        </div>
      </Layout>

      {/* Carousel Sticky Area - Handles the horizontal movement */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden will-change-transform transform-gpu">
        <Layout>
          <Carousel items={cards} scrollYProgress={scrollYProgress} />
        </Layout>
      </div>
    </section>
  );
}

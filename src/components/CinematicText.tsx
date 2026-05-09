/**
 * CinematicText v6 — The Professional.
 * 
 * NEW STYLE:
 * - Refined Vertical Rise: Subtle 24px rise into position.
 * - Progressive Focus: Letters start slightly blurred and snap into sharpness.
 * - Tracking Compression: Sophisticated letter-spacing shift on entry.
 * - Balanced Spring: High-end, smooth physics with zero bounce.
 * - Gradient Opacity: Soft entry mask for a "fog-to-clear" feel.
 */

"use client";

import React, { useRef, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { SmoothScrollContext } from "./SmoothScrollProvider";

type AsElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

const CinematicChar: React.FC<{
  char: string;
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  intensity: number;
}> = ({ char, index, total, smoothProgress, intensity: I }) => {
  const pct = index / Math.max(total - 1, 1);
  
  // 1. Subtle Vertical Rise
  const y = useTransform(smoothProgress, [0, 0.45], [24 * I, 0]);
  
  // 2. Tracking Compression
  const x = useTransform(smoothProgress, [0, 0.45], [(pct - 0.5) * 40 * I, 0]);
  
  // 3. Opacity + Soft Focus
  const opacity = useTransform(smoothProgress, [0.05, 0.35], [0, 1]);
  
  // 4. Soft Focus (GPU-friendly blur)
  const blurValue = useTransform(smoothProgress, [0, 0.35], [8 * I, 0]);
  const blur = useTransform(blurValue, (v) => `blur(${v}px)`);
  
  // 5. Scale
  const scale = useTransform(smoothProgress, [0, 0.45], [0.96, 1]);

  if (char === "\n") return <br />;

  return (
    <motion.span
      style={{
        y,
        x,
        opacity,
        filter: blur,
        scale,
        display: "inline-block",
        willChange: "transform, opacity, filter",
        transformOrigin: "center bottom",
      }}
      className="select-none whitespace-pre translate-z-0"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export const CinematicText: React.FC<{
  as?: AsElement;
  className?: string;
  children: React.ReactNode;
  split?: "char" | "word";
  intensity?: number;
  progress?: MotionValue<number>;
}> = ({
  as: Tag = "div",
  className = "",
  children,
  split = "char",
  intensity = 1.0,
  progress,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const scrollCtx = useContext(SmoothScrollContext);
  
  const { scrollYProgress: internalProgress } = useScroll({
    target: textRef,
    container: scrollCtx?.containerRef ?? undefined,
    offset: ["start 92%", "center 50%"],
  });

  const scrollProgress = (progress ?? internalProgress) as unknown as MotionValue<number>;
  
  // Create a single, shared spring for the entire block
  const smoothP = useSpring(scrollProgress, { 
    stiffness: 50, 
    damping: 35,
    mass: 1.0
  });

  if (intensity === 0) return <Tag className={className}>{children}</Tag>;

  // Recursive function to process text within children nodes
  const renderChildren = (node: React.ReactNode, startIndex: { value: number }, totalCount: number): React.ReactNode => {
    if (typeof node === "string") {
      const tokens = split === "char" ? node.split("") : node.split(" ");
      return tokens.map((token, i) => {
        const globalIndex = startIndex.value++;
        return split === "char" ? (
          <CinematicChar
            key={globalIndex}
            char={token}
            index={globalIndex}
            total={totalCount}
            smoothProgress={smoothP}
            intensity={intensity}
          />
        ) : (
          <motion.span
            key={globalIndex}
            style={{
              opacity: useTransform(smoothP, [0.1, 0.4], [0, 1]),
              y: useTransform(smoothP, [0, 0.4], [15 * intensity, 0]),
              display: "inline-block",
              marginRight: "0.25em"
            }}
            className="translate-z-0"
          >
            {token}
          </motion.span>
        );
      });
    }

    if (React.isValidElement(node)) {
      return React.cloneElement(
        node as React.ReactElement,
        { key: Math.random() },
        renderChildren((node as any).props.children, startIndex, totalCount)
      );
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => renderChildren(child, startIndex, totalCount));
    }

    return node;
  };

  // Pre-calculate total tokens for normalized animation progress
  const countTokens = (node: React.ReactNode): number => {
    if (typeof node === "string") return split === "char" ? node.split("").length : node.split(" ").length;
    if (Array.isArray(node)) return node.reduce((acc, child) => acc + countTokens(child), 0);
    if (React.isValidElement(node)) return countTokens((node as any).props.children);
    return 0;
  };

  const totalTokens = countTokens(children);
  const startIndex = { value: 0 };

  return (
    <Tag
      // @ts-ignore
      ref={textRef}
      className={`font-display font-black tracking-[-0.04em] uppercase ${className} overflow-visible`}
      aria-label={typeof children === "string" ? children : ""}
    >
      {renderChildren(children, startIndex, totalTokens)}
    </Tag>
  );
};

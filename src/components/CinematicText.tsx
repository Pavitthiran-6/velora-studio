/**
 * CinematicText v7 — The Professional.
 * 
 * FIX: Moved hooks into separate components to follow Rules of Hooks.
 */

"use client";

import React, { useRef, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { SmoothScrollContext } from "./SmoothScrollProvider";

type AsElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

const CinematicChar = React.memo(({ char, index, total, smoothProgress, intensity: I }: {
  char: string;
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  intensity: number;
}) => {
  const pct = index / Math.max(total - 1, 1);
  
  const y = useTransform(smoothProgress, [0, 0.45], [20 * I, 0]);
  const x = useTransform(smoothProgress, [0, 0.45], [(pct - 0.5) * 30 * I, 0]);
  const opacity = useTransform(smoothProgress, [0.05, 0.35], [0, 1]);
  const scale = useTransform(smoothProgress, [0, 0.45], [0.98, 1]);

  if (char === "\n") return <br />;

  return (
    <motion.span
      style={{
        y,
        x,
        opacity,
        scale,
        display: "inline-block",
        willChange: "transform, opacity",
        transformOrigin: "center bottom",
      }}
      className="select-none whitespace-pre transform-gpu backface-hidden"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
});

CinematicChar.displayName = "CinematicChar";

const CinematicWord = React.memo(({ word, smoothProgress, intensity }: {
  word: string;
  smoothProgress: MotionValue<number>;
  intensity: number;
}) => {
  const opacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);
  const y = useTransform(smoothProgress, [0, 0.4], [15 * intensity, 0]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        display: "inline-block",
        marginRight: "0.25em"
      }}
      className="translate-z-0"
    >
      {word}
    </motion.span>
  );
});

CinematicWord.displayName = "CinematicWord";

export const CinematicText: React.FC<{
  as?: AsElement;
  className?: string;
  children: React.ReactNode;
  split?: "char" | "word";
  intensity?: number;
  progress?: MotionValue<number>;
} & React.HTMLAttributes<HTMLElement>> = ({
  as: Tag = "div",
  className = "",
  children,
  split = "char",
  intensity = 1.0,
  progress,
  ...props
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const scrollCtx = useContext(SmoothScrollContext);
  
  const { scrollYProgress: internalProgress } = useScroll({
    target: textRef,
    container: scrollCtx?.containerRef ?? undefined,
    offset: ["start 92%", "center 50%"],
  });

  const scrollProgress = (progress ?? internalProgress) as unknown as MotionValue<number>;
  
  const smoothP = useSpring(scrollProgress, { 
    stiffness: 50, 
    damping: 35,
    mass: 1.0
  });

  if (intensity === 0) return <Tag className={className} {...props}>{children}</Tag>;

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
          <CinematicWord
            key={globalIndex}
            word={token}
            smoothProgress={smoothP}
            intensity={intensity}
          />
        );
      });
    }

    if (React.isValidElement(node)) {
      return React.cloneElement(
        node as React.ReactElement,
        { key: `node-${startIndex.value}` },
        renderChildren((node as any).props.children, startIndex, totalCount)
      );
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => renderChildren(child, startIndex, totalCount));
    }

    return node;
  };

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
      className={`font-display font-black uppercase ${className} overflow-visible`}
      aria-label={typeof children === "string" ? children : ""}
      {...props}
    >
      {renderChildren(children, startIndex, totalTokens)}
    </Tag>
  );
};

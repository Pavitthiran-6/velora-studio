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
  
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [20 * I, 0, 0, -20 * I]);
  const x = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [(pct - 0.5) * 30 * I, 0, 0, (pct - 0.5) * -30 * I]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.98, 1, 1, 0.98]);

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
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [15 * intensity, 0, 0, -15 * intensity]);

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
    offset: ["start end", "end start"],
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
      if (split === "word") {
        const words = node.split(" ");
        return words.map((word, i) => {
          const globalIndex = startIndex.value++;
          return (
            <CinematicWord
              key={globalIndex}
              word={word}
              smoothProgress={smoothP}
              intensity={intensity}
            />
          );
        });
      } else {
        // Character split with word preservation
        const words = node.split(" ");
        return words.map((word, wordIndex) => {
          const chars = word.split("");
          return (
            <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
              {chars.map((char, charIndex) => {
                const globalIndex = startIndex.value++;
                return (
                  <CinematicChar
                    key={globalIndex}
                    char={char}
                    index={globalIndex}
                    total={totalCount}
                    smoothProgress={smoothP}
                    intensity={intensity}
                  />
                );
              })}
              {/* Add a space after the word unless it's the last one */}
              {wordIndex < words.length - 1 && (
                <CinematicChar
                  key={`space-${wordIndex}`}
                  char=" "
                  index={startIndex.value++}
                  total={totalCount}
                  smoothProgress={smoothP}
                  intensity={intensity}
                />
              )}
            </span>
          );
        });
      }
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

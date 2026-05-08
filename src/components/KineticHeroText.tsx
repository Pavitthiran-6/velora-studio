"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KineticHeroTextProps {
  children: string;
  className?: string;
  as?: any;
  isActive?: boolean;
  delay?: number;
}

const getRandomTransform = () => {
  const directions = [
    { x: -1800, y: 0, z: 500 },   // Far Left
    { x: 1800, y: 0, z: 500 },    // Far Right
    { x: 0, y: -1200, z: 800 },   // Far Top
    { x: 0, y: 1200, z: 800 },    // Far Bottom
    { x: 0, y: 0, z: -2000 },     // Ultra Deep Z
    { x: 1200, y: -1200, z: 1000 }, // Top Right Corner
    { x: -1200, y: 1200, z: 1000 }  // Bottom Left Corner
  ];
  
  const dir = directions[Math.floor(Math.random() * directions.length)];
  return {
    x: dir.x + (Math.random() - 0.5) * 500,
    y: dir.y + (Math.random() - 0.5) * 500,
    z: dir.z + (Math.random() - 0.5) * 1000,
    rotateX: (Math.random() - 0.5) * 540,
    rotateY: (Math.random() - 0.5) * 540,
    rotateZ: (Math.random() - 0.5) * 360,
    scale: 0.1 + Math.random() * 4.0,
  };
};

export const KineticHeroText: React.FC<KineticHeroTextProps> = ({
  children,
  className = "",
  as: Tag = "h1",
  isActive = true,
  delay = 0
}) => {
  const letters = children.split("");

  return (
    <Tag className={`${className} flex flex-nowrap whitespace-nowrap overflow-visible perspective-[1000px]`}>
      <AnimatePresence mode="popLayout">
        {isActive && (
          <motion.span className="flex">
            {letters.map((letter, i) => {
              return (
                <motion.span
                  key={`${letter}-${i}`}
                  initial={{ 
                    opacity: 0,
                    y: "100%",
                  }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: delay + (i * 0.03),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              );
            })}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
};

/**
 * RootLayout — Global layout wrapper for ALL pages.
 *
 * PURPOSE:
 * This component is the single source of truth for:
 *  - Smooth scroll (RAF lerp-based, Framer Motion compatible)
 *  - Global scroll container reference
 *  - Any future global UI (toasts, modals, overlays)
 *
 * RULES FOR AI MODELS AND DEVELOPERS:
 * ─────────────────────────────────────────────────────────────────
 * 1. EVERY new page/route MUST be a child of RootLayout.
 * 2. DO NOT add overflow-y-auto, scroll-smooth, or custom scroll
 *    logic to individual pages — RootLayout handles it globally.
 * 3. To track scroll progress in any component, use:
 *      const { containerRef } = useSmoothScrollContext();
 *      const { scrollYProgress } = useScroll({ container: containerRef });
 * 4. DO NOT wrap individual pages in their own SmoothScrollProvider.
 *    One global instance is correct. Nesting them causes double-smoothing.
 * ─────────────────────────────────────────────────────────────────
 *
 * USAGE (in main.tsx or router):
 *   <RootLayout>
 *     <HomePage />
 *   </RootLayout>
 *
 *   or with a router:
 *   <RootLayout>
 *     <RouterOutlet />
 *   </RootLayout>
 */

import React, { useRef } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

interface RootLayoutProps {
  children: React.ReactNode;
  /** Override ease. Default 0.09 = Apple-smooth. Range: 0.06 (floaty) → 0.18 (snappy) */
  ease?: number;
}

export function RootLayout({ children, ease = 0.09 }: RootLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SmoothScrollProvider containerRef={containerRef} ease={ease}>
      {/*
        This div is the GLOBAL scroll container.
        - overflow-y-auto: enables scrolling
        - h-screen: locks height to viewport
        - scrollbar-hide: hides native scrollbar (defined in index.css)
        Any page rendered as a child scrolls within this container.
      */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ scrollBehavior: "auto" }} // Never use CSS smooth-scroll — lerp handles it
      >
        {children}
      </div>
    </SmoothScrollProvider>
  );
}

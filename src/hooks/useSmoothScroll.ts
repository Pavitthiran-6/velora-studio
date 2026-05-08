import { useEffect, RefObject } from "react";

/**
 * useSmoothScroll — RAF lerp-based smooth scroll.
 *
 * Supports two modes:
 *  - Custom container div  →  pass containerRef
 *  - Window / document     →  pass null / omit containerRef
 *
 * How it works:
 *  1. Intercepts wheel & touch events, preventing default browser scroll.
 *  2. Accumulates a float "target" scroll position.
 *  3. Every RAF tick, lerps actual scrollTop → target with configurable ease.
 *  4. Because el.scrollTop is always the authoritative value, Framer Motion's
 *     useScroll / useScrollYProgress reads it correctly — zero interference.
 *
 * Ease guide:
 *  0.06 = ultra smooth / floaty
 *  0.09 = premium Apple-like  ← default
 *  0.12 = snappy smooth
 *  0.18 = near-instant
 */
export function useSmoothScroll(
  containerRef?: RefObject<HTMLDivElement | null>,
  ease = 0.09
) {
  useEffect(() => {
    // Resolve the scrollable element: custom container OR document body fallback
    const el: HTMLElement | null =
      containerRef?.current ?? document.documentElement;

    if (!el) return;

    let target = el.scrollTop;
    let current = el.scrollTop;
    let raf = 0;
    let touchStartY = 0;
    let isScrolling = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(Math.max(v, lo), hi);

    const tick = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      target = clamp(target, 0, maxScroll);

      const diff = target - current;

      if (Math.abs(diff) < 0.3) {
        current = target;
        el.scrollTop = target;
        isScrolling = false;
        return;
      }

      current = lerp(current, target, ease);
      el.scrollTop = Math.round(current * 100) / 100; // sub-pixel precision
      raf = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (!isScrolling) {
        isScrolling = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      } else {
        // Already running — just let it continue
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normalize delta across different devices/trackpads
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40;  // line mode
      if (e.deltaMode === 2) delta *= 800; // page mode
      target += delta;
      startTick();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      target += dy * 1.5; // slight multiplier for touch feel
      startTick();
    };

    // Sync target if something else scrolls the container (e.g. anchor links)
    const onNativeScroll = () => {
      if (!isScrolling) {
        target = el.scrollTop;
        current = el.scrollTop;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("scroll", onNativeScroll);
      cancelAnimationFrame(raf);
    };
  }, [containerRef, ease]);
}

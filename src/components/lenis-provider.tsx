"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      prevent: (node) => node.tagName === "DIALOG",
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

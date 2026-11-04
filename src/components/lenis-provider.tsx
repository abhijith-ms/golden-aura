"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    function update() {
      lenis?.destroy();
      lenis = undefined;
      if (preference.matches) return;
      lenis = new Lenis({
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
    }
    update();
    preference.addEventListener("change", update);
    return () => { preference.removeEventListener("change", update); lenis?.destroy(); };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

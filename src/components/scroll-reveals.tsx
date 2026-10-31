"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveals() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const animation = entry.target.animate(
          [
            { opacity: 0, transform: "translateY(24px)", filter: "blur(6px)" },
            { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
          ],
          { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { rootMargin: "0px 0px -24px 0px" });
    // Content stays visible without JavaScript; only reveal sections below the fold.
    document.querySelectorAll("main > section").forEach((section) => {
      if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
    });
    function stop() {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    }
    preference.addEventListener("change", stop);
    return () => {
      stop();
      preference.removeEventListener("change", stop);
    };
  }, [pathname]);
  return null;
}

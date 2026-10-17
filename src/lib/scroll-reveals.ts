export function startScrollReveals() {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window)) return;
  const animations = new Map<Animation, Element>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const grouped = entry.target.hasAttribute("data-reveal-group");
      const targets = grouped
        ? Array.from(entry.target.children)
        : [entry.target];
      targets.forEach((target, index) => {
        if (target.contains(document.activeElement) || typeof target.animate !== "function") return;
        const animation = target.animate(
          [{ opacity: 0, transform: grouped ? "translateY(18px) scale(.985)" : "translateY(18px)" }, { opacity: 1, transform: "none" }],
          { duration: 560, delay: Math.min(index, 4) * 65, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        );
        animations.set(animation, target);
        animation.onfinish = () => animations.delete(animation);
      });
    }
  }, { rootMargin: "0px 0px -24px 0px" });
  // Keep server content visible and avoid animating both a section and its group.
  document.querySelectorAll("main > section, [data-reveal-group]").forEach((target) => {
    if (!target.hasAttribute("data-reveal-group") && target.querySelector("[data-reveal-group]")) return;
    if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
  });
  function focus(event: FocusEvent) {
    for (const [animation, target] of animations) {
      if (event.target instanceof Node && target.contains(event.target)) {
        animation.cancel();
        animations.delete(animation);
      }
    }
  }
  function stop() {
    observer.disconnect();
    animations.forEach((_, animation) => animation.cancel());
    animations.clear();
    document.removeEventListener("focusin", focus);
  }
  document.addEventListener("focusin", focus);
  preference.addEventListener("change", stop);
  return () => {
    stop();
    preference.removeEventListener("change", stop);
  };
}

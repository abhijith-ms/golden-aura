import { motionTokens as tokens } from "./motion-tokens.ts";

export function startReveals(root: ParentNode, intro = false) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window)) return () => {};
  const animations = new Map<Element, Animation>();
  const seen = new Set<Element>();
  const distance = window.matchMedia("(pointer: coarse)").matches ? tokens.distance.mobile : tokens.distance.enter;
  const observer = new IntersectionObserver((entries) => {
    let rowIndex = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      play(entry.target as HTMLElement, Math.min(rowIndex++ * tokens.stagger, tokens.maxDelay));
    }
  }, { rootMargin: "0px 0px -16px 0px" });

  function play(target: HTMLElement, delay = 0) {
    if (seen.has(target) || target.getClientRects().length === 0) return;
    seen.add(target);
    target.dataset.motionEntered = "true";
    const line = target.dataset.reveal === "line";
    const animation = target.animate(line ? [
      { transform: "scaleX(0)", opacity: 0.4 },
      { transform: "scaleX(1)", opacity: 1 },
    ] : [
      { transform: `translateY(${distance}px)`, opacity: 0.55 },
      { transform: "translateY(0)", opacity: 1 },
    ], {
      duration: (line ? tokens.duration.slow : tokens.duration.normal) * 1000,
      delay: delay * 1000,
      easing: tokens.easing.css,
      fill: "backwards",
    });
    animations.set(target, animation);
    animation.onfinish = () => animations.delete(target);
  }

  const targets = new Set(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  root.querySelectorAll<HTMLElement>("[data-motion-group]").forEach((group) => {
    Array.from(group.children).forEach((child) => { if (child instanceof HTMLElement) targets.add(child); });
  });
  targets.forEach((target) => {
    const owner = target.closest("[data-motion-local]");
    if (owner && owner !== root) return;
    if (target.getBoundingClientRect().top >= window.innerHeight * 0.9) observer.observe(target);
    // Above-fold text is already readable; only decorative rules play on arrival.
    else if (intro && target.dataset.reveal === "line") play(target);
  });
  if (intro && !window.location.hash) {
    root.querySelectorAll<HTMLElement>("[data-motion-intro]").forEach((group) => {
      if (group.getBoundingClientRect().top >= window.innerHeight) return;
      Array.from(group.children).slice(0, 3).forEach((child, i) => {
        if (child instanceof HTMLElement && !child.hasAttribute("data-reveal")) play(child, Math.min(i * tokens.stagger, tokens.maxDelay));
      });
    });
  }
  function finishFocus(event: Event) {
    targets.forEach((target) => {
      if (target.contains(event.target as Node)) { seen.add(target); observer.unobserve(target); }
    });
    for (const [target, animation] of animations) {
      if (target.contains(event.target as Node)) { animation.cancel(); animations.delete(target); }
    }
  }
  function cancel() {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }
  root.addEventListener("focusin", finishFocus);
  preference.addEventListener("change", cancel);
  return () => {
    cancel();
    root.removeEventListener("focusin", finishFocus);
    preference.removeEventListener("change", cancel);
  };
}

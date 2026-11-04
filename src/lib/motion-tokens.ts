export const motionTokens = {
  duration: { fast: 0.18, normal: 0.44, slow: 0.7 },
  easing: { smooth: [0.16, 1, 0.3, 1] as const, css: "cubic-bezier(0.16, 1, 0.3, 1)" },
  distance: { mobile: 8, enter: 16, parallax: 12 },
  stagger: 0.05,
  maxDelay: 0.15,
  scale: { photo: 1.025, dialog: 0.985 },
};

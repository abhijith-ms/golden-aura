export type HeroCapabilities = {
  width: number;
  reducedMotion: boolean;
  finePointer: boolean;
  hover: boolean;
  saveData?: boolean;
  effectiveType?: string;
};

export function canEnhanceHero(capabilities: HeroCapabilities) {
  return capabilities.width > 1040
    && !capabilities.reducedMotion
    && capabilities.finePointer
    && capabilities.hover
    && !capabilities.saveData
    && !["slow-2g", "2g", "3g"].includes(capabilities.effectiveType || "");
}

export function heroPointerTarget(x: number, y: number) {
  return {
    yaw: Math.max(-1, Math.min(1, x)) * Math.PI / 45,
    pitch: Math.max(-1, Math.min(1, y)) * Math.PI / 120,
  };
}

export function dampHeroAngle(current: number, target: number, seconds: number) {
  const next = current + (target - current) * (1 - Math.exp(-Math.max(0, Math.min(seconds, 0.05)) / 0.15));
  return Math.abs(target - next) < 0.0002 ? target : next;
}

export function openingKnightPosition(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return { x: -0.21 + 0.84 * p, y: p === 0 || p === 1 ? 0 : Math.sin(Math.PI * p) * 0.32, z: 0.63 - 0.42 * p };
}

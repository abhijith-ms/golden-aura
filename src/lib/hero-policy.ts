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

type HeroQuality = {
  stage: "full" | "reduced" | "static";
  moving: boolean;
  warmup: number;
  elapsed: number;
  frames: number;
  slow: number;
};

export function createHeroQuality(dpr: number): HeroQuality {
  return {
    stage: dpr > 1 ? "full" : "reduced",
    moving: false, warmup: 0.25, elapsed: 0, frames: 0, slow: 0,
  };
}

export function sampleHeroQuality(quality: HeroQuality, seconds: number, moving: boolean) {
  if (quality.stage === "static") return null;
  // The first demand frame can include the entire idle interval.
  if (!moving || !quality.moving) {
    quality.moving = moving;
    quality.warmup = 0.25;
    quality.elapsed = quality.frames = quality.slow = 0;
    return null;
  }
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (quality.warmup > 0) {
    quality.warmup = Math.max(0, quality.warmup - seconds);
    return null;
  }
  quality.elapsed += seconds;
  quality.frames++;
  if (seconds > 0.03) quality.slow++;
  if (quality.elapsed < 1 || quality.frames < 12) return null;
  const poor = quality.slow / quality.frames >= 0.6;
  quality.elapsed = quality.frames = quality.slow = 0;
  if (!poor) return null;
  quality.stage = quality.stage === "full" ? "reduced" : "static";
  quality.warmup = 0.25;
  return quality.stage;
}

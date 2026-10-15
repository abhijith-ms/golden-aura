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

import { DataTexture, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace } from "three";

export const heroPieceScale = { knight: 0.68, pawn: 0.8, rook: 0.88 };

export function createBoardTextures(anisotropy: number) {
  const size = 1024;
  const surface = new Uint8Array(size * size * 4);
  const grain = new Uint8Array(size * size * 4);
  const tones = [[35, 43, 35], [154, 142, 113]];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const light = (Math.floor(x / 128) + Math.floor(y / 128)) % 2 === 1;
    const along = light ? y : x;
    const across = light ? x : y;
    const fibres = Math.sin(across * 1.7 + Math.sin(along * 0.035) * 2.5);
    const pores = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    const variation = fibres * 2 + Math.sin(across * 0.21 + Math.sin(along * 0.025) * 2) * 3 + (pores - Math.floor(pores) - 0.5) * 4;
    const tone = tones[Number(light)];
    const offset = (y * size + x) * 4;
    for (let channel = 0; channel < 3; channel++) surface[offset + channel] = Math.round(tone[channel] + variation);
    surface[offset + 3] = 255;
    const relief = Math.round(170 + variation * 5);
    grain[offset] = grain[offset + 1] = grain[offset + 2] = relief;
    grain[offset + 3] = 255;
  }
  const map = new DataTexture(surface, size, size);
  const detail = new DataTexture(grain, size, size);
  map.colorSpace = SRGBColorSpace;
  for (const texture of [map, detail]) {
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = Math.min(8, anisotropy);
    texture.needsUpdate = true;
  }
  return { map, detail };
}

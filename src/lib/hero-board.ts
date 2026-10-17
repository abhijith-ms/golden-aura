import { DataTexture, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace } from "three";

export const heroPieceScale = { knight: 0.68, pawn: 0.8, rook: 0.88 };

const size = 1024;

function boardPixels() {
  return { surface: new Uint8Array(size * size * 4), grain: new Uint8Array(size * size * 4) };
}

function fillBoardRows({ surface, grain }: ReturnType<typeof boardPixels>, first: number, last: number) {
  const tones = [[35, 43, 35], [154, 142, 113]];
  for (let y = first; y < last; y++) for (let x = 0; x < size; x++) {
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
}

function boardTextures({ surface, grain }: ReturnType<typeof boardPixels>, anisotropy: number) {
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

export function createBoardTextures(anisotropy: number) {
  const pixels = boardPixels();
  fillBoardRows(pixels, 0, size);
  return boardTextures(pixels, anisotropy);
}

export async function prepareBoardTextures(anisotropy: number, signal: AbortSignal) {
  signal.throwIfAborted();
  const pixels = boardPixels();
  for (let row = 0; row < size; row += 32) {
    signal.throwIfAborted();
    fillBoardRows(pixels, row, row + 32);
    // Yield between small batches so preparation cannot monopolise navigation/input.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  signal.throwIfAborted();
  return boardTextures(pixels, anisotropy);
}

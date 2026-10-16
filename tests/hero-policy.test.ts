import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { canEnhanceHero, dampHeroAngle, heroPointerTarget, openingKnightPosition, type HeroCapabilities } from "../src/lib/hero-policy.ts";
import { createBoardTextures, heroPieceScale } from "../src/lib/hero-board.ts";

test("the board has eight alternating squares per side with filtered, opaque grain", () => {
  const { map, detail } = createBoardTextures(4);
  assert(map.image.data && detail.image.data);
  assert.equal(map.image.width, 1024);
  assert.equal(map.image.height, 1024);
  assert.equal(map.image.data.length, 1024 * 1024 * 4);
  for (let row = 0; row < 8; row++) for (let column = 0; column < 8; column++) {
    const offset = ((row * 128 + 64) * 1024 + column * 128 + 64) * 4;
    const expectedLight = (row + column) % 2 === 1;
    assert.equal(map.image.data[offset] > 100, expectedLight);
    assert.equal(map.image.data[offset + 3], 255);
    assert(detail.image.data[offset] >= 130 && detail.image.data[offset] <= 210);
  }
  assert.equal(map.generateMipmaps, true);
  assert.equal(detail.generateMipmaps, true);
  assert.equal(map.anisotropy, 4);
  const capped = createBoardTextures(16);
  assert.equal(capped.map.anisotropy, 8);
  for (const texture of [map, detail, capped.map, capped.detail]) texture.dispose();
});

const desktop: HeroCapabilities = { width: 1440, reducedMotion: false, finePointer: true, hover: true };

test("the opening move follows a knight's two-file, one-rank hop and lands on the board", () => {
  const start = openingKnightPosition(0);
  const end = openingKnightPosition(1);
  assert.equal(start.y, 0);
  assert.equal(end.y, 0);
  assert(Math.abs((end.x - start.x) / 0.42 - 2) < 1e-12);
  assert(Math.abs((end.z - start.z) / 0.42 + 1) < 1e-12);
  assert.equal(openingKnightPosition(0.5).y, 0.32);
  assert.deepEqual(openingKnightPosition(-10), start);
  assert.deepEqual(openingKnightPosition(10), end);
  for (let frame = 0; frame <= 120; frame++) {
    const pose = openingKnightPosition(frame / 120);
    assert(pose.y >= 0 && pose.y <= 0.32);
    assert(Math.abs(pose.x) < 1.26 && Math.abs(pose.z) < 1.26);
  }
});

test("pointer travel stays within four degrees yaw and one-and-a-half degrees pitch", () => {
  assert.deepEqual(heroPointerTarget(0, 0), { yaw: 0, pitch: 0 });
  for (const sign of [-1, 1]) {
    const target = heroPointerTarget(sign * 10, sign * 10);
    assert.equal(target.yaw, sign * Math.PI / 45);
    assert.equal(target.pitch, sign * Math.PI / 120);
  }
});

test("damping is time-based, settles at rest and bounds a resumed frame", () => {
  function settle(fps: number, seconds: number, start: number, target: number) {
    let angle = start;
    for (let frame = 0; frame < fps * seconds; frame++) angle = dampHeroAngle(angle, target, 1 / fps);
    return angle;
  }
  assert(Math.abs(settle(60, 0.3, 0, 0.07) - settle(120, 0.3, 0, 0.07)) < 1e-12);
  assert.equal(settle(60, 1, 0.07, 0), 0);
  assert.equal(dampHeroAngle(0, 0.07, 10), dampHeroAngle(0, 0.07, 0.05));
  assert.equal(dampHeroAngle(0, 0.07, -1), 0);
});

test("hero enhancement requires desktop space, fine hover input and unrestricted motion/data", () => {
  assert.equal(canEnhanceHero(desktop), true);
  assert.equal(canEnhanceHero({ ...desktop, width: 1041 }), true);
  for (const changes of [
    { width: 1040 }, { width: 390 }, { finePointer: false }, { hover: false },
    { reducedMotion: true }, { saveData: true },
    { effectiveType: "slow-2g" }, { effectiveType: "2g" }, { effectiveType: "3g" },
  ]) assert.equal(canEnhanceHero({ ...desktop, ...changes }), false, JSON.stringify(changes));
  assert.equal(canEnhanceHero({ ...desktop, effectiveType: "4g" }), true);
});

test("the shipped knight is standalone, unit height, uncompressed and within its transfer budget", () => {
  const glb = readFileSync(new URL("../public/models/knight.glb", import.meta.url));
  assert.equal(glb.toString("ascii", 0, 4), "glTF");
  assert.equal(glb.readUInt32LE(4), 2);
  assert.equal(glb.readUInt32LE(8), glb.length);
  assert(glb.length < 1_000_000);
  assert.equal(glb.toString("ascii", 16, 20), "JSON");
  const document = JSON.parse(glb.toString("utf8", 20, 20 + glb.readUInt32LE(12)));
  assert.equal(document.nodes.length, 1);
  assert.equal(document.meshes.length, 1);
  assert.equal(document.materials.length, 1);
  assert.equal(document.buffers.length, 1);
  assert(!document.buffers[0].uri && !document.animations && !document.extensionsRequired);
  assert.equal(document.images.length, 1);
  assert.equal(document.images[0].mimeType, "image/jpeg");
  assert(!document.images[0].uri, "The original wood texture is embedded with no external request");
  assert.match(document.asset.copyright, /Oleksandr Zymohliad.*CC BY 4.0/);
  const primitives = document.meshes[0].primitives;
  assert.equal(primitives.length, 1);
  assert.equal(primitives.reduce((sum: number, primitive: { indices: number }) => sum + document.accessors[primitive.indices].count / 3, 0), 26626);
  const position = document.accessors[primitives[0].attributes.POSITION];
  assert.equal(position.count, 13477);
  assert.equal(document.accessors[primitives[0].attributes.TEXCOORD_0].count, position.count);
  assert.equal(position.min[1], 0);
  assert.equal(position.max[1], 1);
  const view = document.bufferViews[position.bufferView];
  const offset = 20 + glb.readUInt32LE(12) + 8 + view.byteOffset + (position.byteOffset || 0);
  let baseRadius = 0;
  for (let vertex = 0; vertex < position.count; vertex++) {
    const start = offset + vertex * 12;
    if (glb.readFloatLE(start + 4) < 0.1) baseRadius = Math.max(baseRadius, Math.hypot(glb.readFloatLE(start), glb.readFloatLE(start + 8)));
  }
  const footprint = baseRadius * 2 * heroPieceScale.knight / 0.42;
  assert(footprint > 0.7 && footprint < 0.85, "The actual knight base fits its square with visible clearance");
  for (const view of document.bufferViews) assert(view.byteOffset + view.byteLength <= document.buffers[0].byteLength);
});

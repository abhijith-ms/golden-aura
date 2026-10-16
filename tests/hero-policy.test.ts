import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { canEnhanceHero, dampHeroAngle, heroPointerTarget, openingKnightPosition, type HeroCapabilities } from "../src/lib/hero-policy.ts";

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
  for (const view of document.bufferViews) assert(view.byteOffset + view.byteLength <= document.buffers[0].byteLength);
});

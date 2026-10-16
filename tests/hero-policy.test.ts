import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { canEnhanceHero, type HeroCapabilities } from "../src/lib/hero-policy.ts";

const desktop: HeroCapabilities = { width: 1440, reducedMotion: false, finePointer: true, hover: true };

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
  assert.equal(document.materials.length, 2);
  assert.equal(document.buffers.length, 1);
  assert(!document.buffers[0].uri && !document.animations && !document.extensionsRequired);
  assert(!document.images && !document.textures, "The sculpted detail needs no texture downloads");
  assert.match(document.asset.copyright, /Bhargav Limje.*CC BY 4.0/);
  const primitives = document.meshes[0].primitives;
  assert.equal(primitives.length, 2);
  assert.equal(primitives.reduce((sum: number, primitive: { indices: number }) => sum + document.accessors[primitive.indices].count / 3, 0), 39040);
  const position = document.accessors[primitives[0].attributes.POSITION];
  assert.equal(position.min[1], 0);
  assert.equal(position.max[1], 1);
  for (const view of document.bufferViews) assert(view.byteOffset + view.byteLength <= document.buffers[0].byteLength);
});

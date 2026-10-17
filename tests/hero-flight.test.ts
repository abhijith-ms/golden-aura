import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Matrix4, PerspectiveCamera, Vector3 } from "three";
import { createQueenFlight, queenFlightDuration, queenFlightPose, queenLanding, queenScale, setHeroProjection } from "../src/lib/hero-flight.ts";

function camera() {
  const lens = new PerspectiveCamera(27, 1.6, 0.03, 20);
  lens.position.set(2.8, 2.1, 3.8);
  lens.lookAt(0.15, 0.35, 0);
  lens.updateMatrixWorld();
  return lens;
}

const glb = readFileSync(new URL("../public/models/queen.glb", import.meta.url));
const document = JSON.parse(glb.toString("utf8", 20, 20 + glb.readUInt32LE(12)));
const primitive = document.meshes[0].primitives[0];
const bounds = document.accessors[primitive.attributes.POSITION];

test("the isolated licensed queen preserves close-up geometry within its transfer budget", () => {
  assert.equal(glb.readUInt32LE(8), glb.length);
  assert(glb.length < 1_500_000);
  assert.equal(document.meshes.length, 1);
  assert.equal(document.materials.length, 1);
  assert.equal(document.accessors[primitive.indices].count / 3, 57120);
  assert.equal(bounds.count, 29574);
  assert.equal(bounds.min[1], 0);
  assert.equal(bounds.max[1], 1);
  assert(!document.buffers[0].uri && !document.images[0].uri && !document.extensionsRequired);
  assert.match(document.asset.copyright, /Oleksandr Zymohliad.*CC BY 4.0.*queen/);
  assert((bounds.max[0] - bounds.min[0]) * queenScale < 0.42 * 0.85);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 1280, height: 1000 }]) {
  const frame = { left: viewport.width - 800, top: 70, width: 824, height: 515 };
  test(`expanded projection preserves the hero's screen coordinates at ${viewport.width}x${viewport.height}`, () => {
    const lens = camera();
    const board = new Matrix4().makeRotationY(-0.25);
    const points = [queenLanding, new Vector3(-1.68, 0, -1.68), new Vector3(1.68, 0, 1.68), new Vector3(0.63, 0.68, 0.21)];
    setHeroProjection(lens, frame, viewport, false);
    const pixels = points.map((point) => {
      const p = point.clone().applyMatrix4(board).project(lens);
      return { x: frame.left + (p.x + 1) * frame.width / 2, y: frame.top + (1 - p.y) * frame.height / 2 };
    });
    setHeroProjection(lens, frame, viewport, true);
    points.forEach((point, i) => {
      const p = point.clone().applyMatrix4(board).project(lens);
      assert(Math.abs((p.x + 1) * viewport.width / 2 - pixels[i].x) < 1e-8);
      assert(Math.abs((1 - p.y) * viewport.height / 2 - pixels[i].y) < 1e-8);
    });
  });

  test(`queen remains in front of the lens and lands on an empty square at ${viewport.width}x${viewport.height}`, () => {
    const lens = camera();
    const board = new Matrix4().makeRotationY(-0.25);
    const flight = createQueenFlight(lens, frame, viewport, board);
    const expanded = lens.clone();
    setHeroProjection(expanded, frame, viewport, true);
    const leftEntry = queenFlightPose(flight, 0.2).position.clone().applyMatrix4(board).project(expanded);
    const closePass = queenFlightPose(flight, 0.4).position.clone().applyMatrix4(board).project(expanded);
    assert(leftEntry.x < -1 && leftEntry.y < -1, "The queen's base enters from the bottom left");
    assert(closePass.x > leftEntry.x + 1, "The close pass travels across the foreground toward the board");
    assert(queenFlightPose(flight, 1).position.distanceTo(queenLanding) < 1e-12);
    assert(queenFlightPose(flight, 1).rotation.angleTo(queenFlightPose(flight, 2).rotation) < 1e-12);
    let clearance = Infinity;
    for (let i = 0; i <= 240; i++) {
      const pose = queenFlightPose(flight, i / 240);
      for (const x of [bounds.min[0], bounds.max[0]]) for (const y of [0, 1]) for (const z of [bounds.min[2], bounds.max[2]]) {
        const world = new Vector3(x, y, z).multiplyScalar(queenScale).applyQuaternion(pose.rotation).add(pose.position).applyMatrix4(board);
        if (i === 0) assert(world.clone().project(expanded).y < -1, "The initial queen is entirely below the viewport");
        const corner = world.applyMatrix4(lens.matrixWorldInverse);
        clearance = Math.min(clearance, -corner.z);
        assert(Number.isFinite(corner.x) && Number.isFinite(corner.y) && Number.isFinite(corner.z));
      }
    }
    assert(clearance > lens.near, `Queen bounding volume must clear the near plane: ${clearance}`);
    for (const [x, z] of [[-0.21, 0.63], [0.63, 0.21], [-0.63, 1.05], [-0.63, 0.63], [-1.05, -1.05], [-1.05, -0.63], [0.63, -0.63]]) {
      assert(queenLanding.distanceTo(new Vector3(x, 0, z)) >= 0.42 - 1e-12, "The queen occupies a separate square");
    }
  });
}

test("the slower flight's lighting rises smoothly and disappears before landing", () => {
  const flight = createQueenFlight(camera(), { left: 640, top: 70, width: 824, height: 515 }, { width: 1440, height: 900 }, new Matrix4().makeRotationY(-0.25));
  assert(queenFlightDuration >= 3 && queenFlightDuration <= 4);
  assert.equal(queenFlightPose(flight, 0).accent, 0);
  assert.equal(queenFlightPose(flight, 0.4).accent, 1);
  assert.equal(queenFlightPose(flight, 0.94).accent, 0);
  assert.equal(queenFlightPose(flight, 1).accent, 0);
  for (let i = 0; i <= 100; i++) {
    const accent = queenFlightPose(flight, i / 100).accent;
    assert(accent >= 0 && accent <= 1);
  }
});

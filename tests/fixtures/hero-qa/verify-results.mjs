import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";

const root = new URL("../../../", import.meta.url);
const evidence = new URL("docs/verification/chess-3d-hero/readiness/", root);
const read = (name) => JSON.parse(readFileSync(new URL(`${name}.json`, evidence), "utf8"));
for (const name of ["slow-model", "corrupt-model", "shader-failure", "renderer-failure", "context-loss", "cancel-preparation", "save-data"]) {
  const result = read(name);
  assert.equal(result.canvas, null, name);
  assert.equal(result.lenis, false, name);
  assert.equal(result.artwork.scene, "static", name);
  assert.equal(result.artwork.queenPending, "false", name);
}
assert.equal(read("shader-failure").shaderInjected, true);
assert(read("context-loss").transitions.some((entry) => entry.state === "ready/true/true"));
const slow = read("slow-model").transitions;
const deadline = slow.at(-1).time - slow.find((entry) => entry.state.startsWith("loading/")).time;
assert(deadline >= 7900 && deadline < 10000);

const chunks = new URL(".next/static/chunks/", root);
const engine = readdirSync(chunks).filter((name) => name.endsWith(".js") && /Chess piece unavailable|THREE\.WebGLRenderer/.test(readFileSync(new URL(name, chunks), "utf8")));
assert(engine.length > 0, "Identify the actual deferred engine chunks in this build");
for (const name of ["reduced-initial", "save-data-initial", "phone", "tablet"]) {
  const result = read(name);
  assert.equal(result.canvas, null, name);
  assert(!result.resources.some((resource) => resource.name.startsWith("/models/") || engine.some((chunk) => resource.name.endsWith(`/${chunk}`))), name);
}
const cycles = read("resource-cycles");
assert.equal(cycles.length, 5);
for (const cycle of cycles) {
  assert.equal(cycle.active.length, 1);
  assert.equal(cycle.active[0].textures, cycles[0].active[0].textures);
  assert.equal(cycle.active[0].buffers, cycles[0].active[0].buffers);
  assert.equal(cycle.active[0].programs, cycles[0].active[0].programs);
}
const first = read("idle-first");
const second = read("idle-second");
assert.equal(second.draws, first.draws);
assert(second.time - first.time >= 1000);
const after = read("after");
assert.equal(after.cls, 0);
assert.equal(after.flight.over30ms, 0);
assert.deepEqual(after.canvas, { width: 1425, height: 900 });
for (const file of ["desktop.jpg", "desktop-1280.jpg", "tablet.jpg", "phone.jpg", "slow-fallback.jpg"]) assert(statSync(new URL(file, evidence)).size > 0);
const result = { localChecks: "pass", releaseVerdict: "INCONCLUSIVE", slowDeadlineMs: deadline, resourceCycles: cycles.length, idleDraws: second.draws, idleObservationMs: second.time - first.time, deferredEngineChunks: engine, remaining: ["Native browser/CSS preference switching", "Second-device/higher-DPR calibration"] };
writeFileSync(new URL("checks.json", evidence), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));

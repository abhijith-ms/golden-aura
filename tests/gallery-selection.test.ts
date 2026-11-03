import test from "node:test";
import assert from "node:assert/strict";
import { gallerySelection, initialGallerySelection } from "../src/lib/gallery-selection.ts";

test("the displayed photograph stays selected until its replacement is ready", () => {
  const pending = gallerySelection(initialGallerySelection, { type: "select", index: 1 });
  assert.equal(pending.active, 0);
  assert.equal(pending.requested, 1);
  assert.equal(pending.loading, true);
  const ready = gallerySelection(pending, { type: "loaded", index: 1, requestId: pending.requestId });
  assert.equal(ready.active, 1);
  assert.equal(ready.loading, false);
});

test("rapid navigation ignores earlier loads and failures", () => {
  const first = gallerySelection(initialGallerySelection, { type: "select", index: 1 });
  const latest = gallerySelection(first, { type: "select", index: 2 });
  for (const type of ["loaded", "failed"] as const) {
    assert.equal(gallerySelection(latest, { type, index: 1, requestId: first.requestId }), latest);
  }
  assert.equal(gallerySelection(latest, { type: "loaded", index: 2, requestId: latest.requestId }).active, 2);
});

test("a failed replacement preserves the photograph and a retry rejects stale callbacks", () => {
  const pending = gallerySelection(initialGallerySelection, { type: "select", index: 1 });
  const failed = gallerySelection(pending, { type: "failed", index: 1, requestId: pending.requestId });
  assert.equal(failed.active, 0);
  assert.equal(failed.error, true);
  assert.equal(failed.loading, false);
  const retry = gallerySelection(failed, { type: "select", index: 1 });
  assert.notEqual(retry.versions[1], pending.versions[1]);
  assert.equal(gallerySelection(retry, { type: "loaded", index: 1, requestId: pending.requestId }), retry);
  assert.equal(gallerySelection(retry, { type: "loaded", index: 1, requestId: retry.requestId }).active, 1);
});

test("the initial photograph can recover after an error", () => {
  const failed = gallerySelection(initialGallerySelection, { type: "failed", index: 0, requestId: 0 });
  const retry = gallerySelection(failed, { type: "select", index: 0 });
  assert.equal(retry.loading, true);
  assert.equal(retry.error, false);
  assert.notEqual(retry.versions[0], 0);
  const loaded = gallerySelection(retry, { type: "loaded", index: 0, requestId: retry.requestId });
  assert.equal(loaded.active, 0);
  assert.equal(loaded.loading, false);
});

test("returning to the displayed photo cancels a pending selection without reloading it", () => {
  const pending = gallerySelection(initialGallerySelection, { type: "select", index: 1 });
  const cancelled = gallerySelection(pending, { type: "select", index: 0 });
  assert.equal(cancelled.active, 0);
  assert.equal(cancelled.requested, 0);
  assert.equal(cancelled.loading, false);
  assert.equal(cancelled.versions[0], 0);
  assert.equal(gallerySelection(cancelled, { type: "loaded", index: 1, requestId: pending.requestId }), cancelled);
});

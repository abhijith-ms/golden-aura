import assert from "node:assert/strict";
import test from "node:test";
import { statSync } from "node:fs";
import { heroVideoSource } from "../src/lib/hero-media.ts";

test("hero selects only the matching video rendition for normal playback", () => {
  assert.equal(heroVideoSource({ reducedMotion: false, saveData: false, mobile: true }), "/video/hero_video_mobile.mp4");
  assert.equal(heroVideoSource({ reducedMotion: false, saveData: false, mobile: false }), "/video/hero_video.mp4");
});

test("static preferences never select an autoplay video source", () => {
  for (const mobile of [false, true]) {
    assert.equal(heroVideoSource({ reducedMotion: true, saveData: false, mobile }), undefined);
    assert.equal(heroVideoSource({ reducedMotion: false, saveData: true, mobile }), undefined);
    assert.equal(heroVideoSource({ reducedMotion: true, saveData: true, mobile }), undefined);
  }
});

test("the mobile hero stays within its transfer budget", () => {
  assert(statSync("public/video/hero_video_mobile.mp4").size < 2_000_000);
});

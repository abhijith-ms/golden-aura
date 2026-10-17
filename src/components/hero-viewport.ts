import { PerspectiveCamera, type Scene, type WebGLRenderer } from "three";
import { setHeroProjection } from "@/lib/hero-flight";

export function renderHeroViewport(gl: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, artwork: HTMLDivElement, layer: HTMLDivElement, flying: boolean) {
  const frame = artwork.getBoundingClientRect();
  const hero = artwork.closest("section")!.getBoundingClientRect();
  const viewport = layer.getBoundingClientRect();
  gl.autoClear = false;
  gl.setScissorTest(false);
  gl.setViewport(0, 0, viewport.width, viewport.height);
  gl.clear();
  layer.style.zIndex = flying ? "21" : "0";
  layer.style.maskImage = flying ? "none" : "linear-gradient(to right, transparent, #000 18%)";
  layer.style.maskSize = `${frame.width}px ${frame.height}px`;
  layer.style.maskPosition = `${frame.left}px ${frame.top}px`;
  setHeroProjection(camera, frame, viewport, flying);
  // The matching HTML board holds during flight; only the queen crosses above page content.
  camera.layers.set(flying ? 1 : 0);
  if (!flying) {
    const left = Math.max(0, frame.left, hero.left);
    const top = Math.max(0, frame.top, hero.top);
    const right = Math.min(viewport.width, frame.right, hero.right);
    const bottom = Math.min(viewport.height, frame.bottom, hero.bottom);
    if (right <= left || bottom <= top) return;
    gl.setViewport(frame.left, viewport.height - frame.bottom, frame.width, frame.height);
    gl.setScissor(left, viewport.height - bottom, right - left, bottom - top);
    gl.setScissorTest(true);
  }
  gl.render(scene, camera);
  gl.setScissorTest(false);
  camera.layers.set(0);
  setHeroProjection(camera, frame, viewport, false);
}

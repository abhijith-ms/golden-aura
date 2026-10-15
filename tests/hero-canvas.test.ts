import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("the chess canvas initializes a static frame without crashing when reduced motion is enabled", () => {
  let effect: (() => (() => void)) | undefined;
  let draws = 0;
  let disconnected = false;
  const listeners = new Set<string>();
  const events = {
    addEventListener: (name: string) => { listeners.add(name); },
    removeEventListener: (name: string) => { listeners.delete(name); },
  };
  const context = new Proxy({}, {
    get: (_, key) => key === "createRadialGradient"
      ? () => ({ addColorStop() {} })
      : () => { if (key === "clearRect") draws++; },
  });
  const canvas = {
    ...events,
    getContext: () => context,
    getBoundingClientRect: () => ({ width: 1200, height: 800 }),
    closest: () => null,
  };
  const exports: Record<string, () => void> = {};
  const source = ts.transpileModule(readFileSync("src/components/hero-canvas.tsx", "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(source, {
    exports,
    require: (name: string) => {
      if (name === "react") return {
        useRef: () => ({ current: canvas }),
        useEffect: (callback: typeof effect) => { effect = callback; },
      };
      if (name === "react/jsx-runtime") return { jsx: () => null };
      if (name.endsWith(".css")) return { default: {} };
      throw new Error(`Unexpected import: ${name}`);
    },
    window: { ...events, devicePixelRatio: 1, matchMedia: () => ({ ...events, matches: true }) },
    document: events,
    performance: { now: () => 0 },
    Image: class { complete = true; },
    IntersectionObserver: class {
      observe() {}
      disconnect() { disconnected = true; }
    },
    requestAnimationFrame: () => { throw new Error("Reduced motion must not start an animation loop"); },
    cancelAnimationFrame() {},
  });
  exports.HeroCanvas();
  assert(effect);
  const cleanup = effect();
  assert.equal(draws, 1);
  cleanup();
  assert(disconnected);
  assert.equal(listeners.size, 0);
});

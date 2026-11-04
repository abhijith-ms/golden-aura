import test from "node:test";
import assert from "node:assert/strict";
import { startReveals } from "../src/lib/reveal-motion.ts";

class Target extends EventTarget {
  dataset: Record<string, string> = {};
  calls: { cancelled: boolean; options: KeyframeAnimationOptions }[] = [];
  owner: Target | null = null;
  children: Target[] = [];
  getBoundingClientRect() { return { top: 1000 }; }
  getClientRects() { return [1]; }
  closest() { return this.owner; }
  contains(node: unknown) { return node === this; }
  animate(_frames: unknown, options: KeyframeAnimationOptions) {
    const call = { cancelled: false, options };
    this.calls.push(call);
    return { cancel() { call.cancelled = true; }, onfinish: null };
  }
}

test("reveals are bounded, owned once, cancellable on focus and reduced-motion changes", () => {
  const originals = ["window", "HTMLElement", "IntersectionObserver"].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
  const preference = Object.assign(new EventTarget(), { matches: false });
  let callback: (entries: { target: Target; isIntersecting: boolean }[]) => void = () => {};
  const observed = new Set<Target>();
  let disconnected = false;
  const group = new Target();
  group.children = Array.from({ length: 8 }, () => new Target());
  const pendingFocus = new Target();
  const local = new Target();
  local.owner = new Target();
  const root = Object.assign(new EventTarget(), {
    querySelectorAll(selector: string) { return selector === "[data-reveal]" ? [local, pendingFocus] : selector === "[data-motion-group]" ? [group] : []; },
  });
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: { innerHeight: 800, IntersectionObserver: true, location: { hash: "" }, matchMedia: () => preference } });
    Object.defineProperty(globalThis, "HTMLElement", { configurable: true, value: Target });
    Object.defineProperty(globalThis, "IntersectionObserver", { configurable: true, value: class {
      constructor(cb: typeof callback) { callback = cb; }
      observe(target: Target) { observed.add(target); }
      unobserve(target: Target) { observed.delete(target); }
      disconnect() { disconnected = true; observed.clear(); }
    } });
    const cleanup = startReveals(root as unknown as ParentNode);
    assert.equal(observed.size, 9);
    const earlyFocus = new Event("focusin");
    Object.defineProperty(earlyFocus, "target", { value: pendingFocus });
    root.dispatchEvent(earlyFocus);
    callback([{ target: pendingFocus, isIntersecting: true }]);
    assert.equal(pendingFocus.calls.length, 0, "focus before intersection prevents a later entrance");
    assert(!observed.has(local), "a local gallery/controller keeps ownership");
    callback(group.children.map((target) => ({ target, isIntersecting: true })));
    assert(group.children.every((target) => target.calls.length === 1));
    assert(group.children.every((target) => Number(target.calls[0].options.delay) <= 150));
    callback([{ target: group.children[0], isIntersecting: true }]);
    assert.equal(group.children[0].calls.length, 1, "scrolling back does not replay a row");
    const focus = new Event("focusin");
    Object.defineProperty(focus, "target", { value: group.children[0] });
    root.dispatchEvent(focus);
    assert(group.children[0].calls[0].cancelled, "focusing a region immediately finishes its entrance");
    preference.matches = true;
    preference.dispatchEvent(new Event("change"));
    assert(disconnected);
    assert(group.children.every((target) => target.calls[0].cancelled));
    cleanup();
    observed.clear();
    startReveals(root as unknown as ParentNode)();
    assert.equal(observed.size, 0, "reduced motion never starts an observer");
  } finally {
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});

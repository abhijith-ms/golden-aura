import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { startScrollReveals } from "../src/lib/scroll-reveals.ts";

class Item {
  children: Item[] = [];
  group = false;
  top = 1000;
  calls: { frames: Keyframe[]; options: KeyframeAnimationOptions; animation: { cancelCount: number; cancel(): void; onfinish?: () => void } }[] = [];
  hasAttribute() { return this.group; }
  querySelector(): Item | null { return this.children.find((child) => child.group) || null; }
  getBoundingClientRect() { return { top: this.top }; }
  contains(node: unknown): boolean { return node === this || this.children.some((child) => child.contains(node)); }
  animate(frames: Keyframe[], options: KeyframeAnimationOptions) {
    const animation = { cancelCount: 0, cancel() { this.cancelCount++; } };
    this.calls.push({ frames, options, animation });
    return animation;
  }
}

function fixture(t: TestContext) {
  const nodes: Item[] = [];
  const observed = new Set<Item>();
  const events = new Map<string, (event?: unknown) => void>();
  let intersect: (entries: { target: Item; isIntersecting: boolean }[]) => void;
  let disconnects = 0;
  const preference = {
    matches: false,
    addEventListener: (name: string, callback: () => void) => events.set(`media:${name}`, callback),
    removeEventListener: (name: string) => events.delete(`media:${name}`),
  };
  class Observer {
    constructor(callback: typeof intersect) { intersect = callback; }
    observe(item: Item) { observed.add(item); }
    unobserve(item: Item) { observed.delete(item); }
    disconnect() { observed.clear(); disconnects++; }
  }
  const doc = {
    activeElement: null as Item | null,
    querySelectorAll: () => nodes,
    addEventListener: (name: string, callback: (event: unknown) => void) => events.set(name, callback),
    removeEventListener: (name: string) => events.delete(name),
  };
  const globals = {
    window: { matchMedia: () => preference, innerHeight: 900, IntersectionObserver: Observer },
    document: doc, IntersectionObserver: Observer, Node: Item,
  };
  for (const [key, value] of Object.entries(globals)) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  return { nodes, observed, events, preference, doc,
    enter: (target: Item, isIntersecting = true) => intersect([{ target, isIntersecting }]),
    disconnects: () => disconnects,
  };
}

test("reveals stagger only group children, skip the parent and visible content, and leave focus usable", (t) => {
  const f = fixture(t);
  const section = new Item();
  const group = new Item();
  group.group = true;
  group.children = Array.from({ length: 7 }, () => new Item());
  section.children = [group];
  const visible = new Item(); visible.top = 200;
  const ordinary = new Item();
  const link = new Item(); group.children[0].children = [link];
  f.doc.activeElement = link;
  f.nodes.push(section, group, visible, ordinary);
  const cleanup = startScrollReveals();
  assert.deepEqual([...f.observed], [group, ordinary]);
  f.enter(group, false);
  assert.equal(group.children[1].calls.length, 0);
  f.enter(group);
  assert(!f.observed.has(group), "Each group is unobserved after entry");
  assert.equal(group.calls.length, 0, "Do not animate the group and its children together");
  assert.equal(group.children[0].calls.length, 0, "Already focused content never fades");
  assert.deepEqual(group.children.slice(1).map((item) => item.calls[0].options.delay), [65, 130, 195, 260, 260, 260]);
  assert.equal(group.children[1].calls[0].options.fill, "backwards");
  f.enter(ordinary);
  assert.equal(ordinary.calls[0].frames[0].transform, "translateY(18px)", "Existing ordinary section motion is preserved");
  f.events.get("focusin")?.({ target: group.children[1] });
  assert.equal(group.children[1].calls[0].animation.cancelCount, 1);
  ordinary.calls[0].animation.onfinish?.();
  cleanup?.();
  assert.equal(group.children[2].calls[0].animation.cancelCount, 1);
  assert.equal(ordinary.calls[0].animation.cancelCount, 0, "Finished effects are not retained");
  assert.equal(f.events.size, 0);
});

test("a reduced-motion change cancels in-progress entrances and disconnects their observer", (t) => {
  const f = fixture(t);
  const item = new Item(); f.nodes.push(item);
  const cleanup = startScrollReveals();
  f.enter(item);
  f.preference.matches = true;
  f.events.get("media:change")?.();
  assert.equal(item.calls[0].animation.cancelCount, 1);
  assert.equal(f.observed.size, 0);
  assert.equal(f.disconnects(), 1);
  assert(!f.events.has("focusin"));
  cleanup?.();
  assert.equal(item.calls[0].animation.cancelCount, 1);
  assert.equal(f.events.size, 0);
});

test("initial reduced motion and unavailable observation leave content untouched", (t) => {
  const f = fixture(t);
  f.preference.matches = true;
  assert.equal(startScrollReveals(), undefined);
  f.preference.matches = false;
  Reflect.deleteProperty(window, "IntersectionObserver");
  assert.equal(startScrollReveals(), undefined);
  assert.equal(f.events.size, 0);
  assert.equal(f.observed.size, 0);
});

/* Served only by server.mjs; never imported by the site or shipped to Vercel. */
(() => {
  const params = new URLSearchParams(location.search);
  const metrics = { lcp: null, cls: 0, longTasks: [], events: [], frames: [], draws: 0, contexts: [], transitions: [] };
  function observe(type, callback, extra = {}) {
    try { new PerformanceObserver((list) => list.getEntries().forEach(callback)).observe({ type, buffered: true, ...extra }); } catch { /* Unsupported metric stays absent. */ }
  }
  observe("largest-contentful-paint", (entry) => { metrics.lcp = { time: entry.startTime, tag: entry.element?.tagName, url: entry.url }; });
  observe("layout-shift", (entry) => { if (!entry.hadRecentInput) metrics.cls += entry.value; });
  observe("longtask", (entry) => metrics.longTasks.push({ start: entry.startTime, duration: entry.duration }));
  observe("event", (entry) => { if (entry.interactionId) metrics.events.push({ name: entry.name, duration: entry.duration }); }, { durationThreshold: 16 });

  // Controlled application-capability doubles, not browser/CSS preference emulation.
  const nativeMedia = window.matchMedia.bind(window);
  const queries = [];
  let reduced = params.get("qa-motion") === "reduce";
  window.matchMedia = (query) => {
    const native = nativeMedia(query);
    if (query !== "(prefers-reduced-motion: reduce)") return native;
    const mock = new EventTarget();
    Object.defineProperties(mock, { media: { value: query }, matches: { get: () => reduced || native.matches } });
    native.addEventListener("change", () => mock.dispatchEvent(new Event("change")));
    queries.push(mock);
    return mock;
  };
  const connection = navigator.connection;
  let saveData = params.get("qa-data") === "save";
  if (connection) Object.defineProperty(connection, "saveData", { configurable: true, get: () => saveData });
  if (params.get("qa-storage") === "blocked") Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage disabled by local QA fixture"); } });

  let shaderInjected = false;
  const nativeContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
    if (params.get("qa-fault") === "renderer" && /^webgl/.test(kind)) return null;
    const gl = nativeContext.call(this, kind, ...args);
    if (!gl || !/^webgl/.test(kind) || metrics.contexts.some((item) => item.gl === gl)) return gl;
    const context = { gl, lost: false, textures: new Set(), buffers: new Set(), programs: new Set() };
    metrics.contexts.push(context);
    this.addEventListener("webglcontextlost", () => { context.lost = true; });
    for (const [name, key] of [["Texture", "textures"], ["Buffer", "buffers"], ["Program", "programs"]]) {
      const create = gl[`create${name}`].bind(gl);
      const dispose = gl[`delete${name}`].bind(gl);
      gl[`create${name}`] = (...values) => { const value = create(...values); if (value) context[key].add(value); return value; };
      gl[`delete${name}`] = (value) => { context[key].delete(value); return dispose(value); };
    }
    const clear = gl.clear.bind(gl);
    gl.clear = (...values) => {
      if (document.querySelector('[data-scene="ready"]')) {
        metrics.draws++;
        const layer = document.querySelector('body > [data-ready="true"]');
        if (layer?.style.zIndex === "21" && document.querySelector('[data-queen-pending="true"]')) metrics.frames.push(performance.now());
      }
      return clear(...values);
    };
    const source = gl.shaderSource.bind(gl);
    gl.shaderSource = (shader, text) => {
      if (!shaderInjected && params.get("qa-fault") === "shader" && gl.getShaderParameter(shader, gl.SHADER_TYPE) === gl.FRAGMENT_SHADER && text.includes("uniform vec3 diffuse;")) {
        shaderInjected = true;
        text += "\ninvalid_hero_qa_shader_token\n";
      }
      return source(shader, text);
    };
    return gl;
  };

  addEventListener("DOMContentLoaded", () => {
    const panel = document.createElement("aside");
    panel.id = "hero-qa";
    panel.style.cssText = "position:fixed;z-index:1000;bottom:4px;right:4px;background:#fff;color:#111;font:12px sans-serif;padding:6px;border:1px solid #aaa;max-width:360px";
    const output = document.createElement("pre");
    output.id = "hero-qa-output";
    output.style.cssText = "display:none;max-height:180px;overflow:auto;white-space:pre-wrap;font-size:10px";
    function button(text, action) { const element = document.createElement("span"); element.setAttribute("role", "button"); element.tabIndex = 0; element.textContent = text; element.style.cssText = "display:inline-block;padding:5px;margin:2px;border:1px solid #aaa;cursor:pointer"; element.onclick = action; element.onkeydown = (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); action(); } }; panel.append(element); }
    const snapshot = () => {
      const frameDeltas = metrics.frames.slice(1).map((value, i) => value - metrics.frames[i]);
      const ordered = [...frameDeltas].sort((a, b) => a - b);
      const artwork = document.querySelector("[data-scene]");
      const canvas = document.querySelector("canvas");
      const layer = document.querySelector('body > [data-ready]');
      const report = {
        url: location.href, time: performance.now(), lcp: metrics.lcp, cls: metrics.cls,
        capabilities: { nativeReduced: nativeMedia("(prefers-reduced-motion: reduce)").matches, appReduced: reduced, saveData, connectionAvailable: !!connection },
        longTasks: metrics.longTasks, events: metrics.events, draws: metrics.draws, shaderInjected,
        flight: { samples: frameDeltas.length, medianMs: ordered[Math.floor(ordered.length / 2)] ?? null, p95Ms: ordered[Math.floor(ordered.length * 0.95)] ?? null, over30ms: frameDeltas.filter((ms) => ms > 30).length, maxMs: ordered.at(-1) ?? null },
        contexts: metrics.contexts.map(({ gl, lost, textures, buffers, programs }) => {
          const debug = !lost && gl.getExtension("WEBGL_debug_renderer_info");
          return { lost, textures: textures.size, buffers: buffers.size, programs: programs.size, width: gl.drawingBufferWidth, height: gl.drawingBufferHeight, renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null };
        }),
        artwork: artwork ? { ...artwork.dataset } : null, canvas: canvas ? { width: canvas.width, height: canvas.height } : null,
        layer: layer ? { z: layer.style.zIndex, visibility: layer.style.visibility } : null, lenis: document.documentElement.classList.contains("lenis"),
        width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        resources: performance.getEntriesByType("resource").map((entry) => ({ name: new URL(entry.name).pathname, type: entry.initiatorType, bytes: entry.transferSize, encoded: entry.encodedBodySize, duration: entry.duration })),
        transitions: metrics.transitions,
      };
      output.style.display = "block";
      output.textContent = JSON.stringify(report);
      return report;
    };
    button("QA snapshot", snapshot);
    button("App motion reduce", () => { reduced = true; queries.forEach((query) => query.dispatchEvent(new Event("change"))); });
    button("App motion allow", () => { reduced = false; queries.forEach((query) => query.dispatchEvent(new Event("change"))); });
    button("App save data", () => { saveData = true; connection?.dispatchEvent(new Event("change")); });
    button("App normal data", () => { saveData = false; connection?.dispatchEvent(new Event("change")); });
    button("Lose WebGL context", () => metrics.contexts.filter((item) => !item.lost).forEach(({ gl }) => gl.getExtension("WEBGL_lose_context")?.loseContext()));
    panel.append(output);
    document.body.append(panel);
    const watcher = new MutationObserver(() => {
      const artwork = document.querySelector("[data-scene]");
      const state = artwork ? `${artwork.dataset.scene}/${artwork.dataset.eligible}/${artwork.dataset.queenPending}` : "absent";
      if (metrics.transitions.at(-1)?.state !== state) metrics.transitions.push({ time: performance.now(), state });
      panel.dataset.settled = state.startsWith("static/true") && metrics.transitions.some((item) => item.state.startsWith("loading/")) ? "failure" : state.startsWith("ready/") ? "ready" : "pending";
    });
    watcher.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-scene", "data-eligible", "data-queen-pending"] });
  });
})();

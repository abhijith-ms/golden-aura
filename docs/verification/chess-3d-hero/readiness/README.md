# Hero readiness checks

## Scope and method recorded before testing

The user approved the current slow bottom-left queen/lighting and requested the next performance/reliability step. Preserve the accepted appearance and compact layout. Check actual production loading, rendering intervals, request isolation, viewport behavior, keyboard/navigation and local renderer/shader/context/model failures. Fix reproducible failures; do not merge production without authorization.

Use the existing production build behind `tests/fixtures/hero-qa/server.mjs`, a read-only localhost proxy. Its injected bootstrap collects buffered LCP/CLS, long tasks, existing WebGL clear intervals and resource lifetime counters. No benchmark render loop. It supplies UI controls for local tests, never a production import. Its media/network doubles exercise application capability-change events; they are **not actual browser/CSS preference emulation**. Delayed/corrupt model responses and shader/renderer failures exercise real loading/WebGL failure paths.

Chrome DevTools MCP could not launch: missing display server. It supplies neither a usable trace nor actual preference emulation in this environment. Use the in-app browser for controlled measurements; record its renderer and instrumentation limits. Representative-laptop calibration, actual browser preference switches and screen-reader review remain distinct checks until real evidence exists.

Targets: desktop 1440x900 and 1280x720, tablet 834x1112, phone 390x844. Compare with the accepted `queen-left-pass/` and `queen-flight/` baselines. Loading/partial/error keep the server HTML and static image; success retains the approved opening; bundled decoration has no empty collection or permission step. No valid enquiry/payment/auth submission is part of these read-only checks.

## Finding and fix

The production baseline had a **318ms long task** during scene preparation. The original board generator also took 127–136ms per synchronous call in the local Node runtime. It created both million-pixel textures inside React rendering.

Runtime board generation now works in **32-row batches**, yielding to the browser between them. The ready handoff waits for both board and models. Navigation/eligibility cancellation aborts unfinished generation, and a completion race disposes textures rather than setting state after unmount. This changes no texture resolution, filtering, material, model, motion, dependency or runtime request.

Pixel regression hashes are fixed to the original accepted result:

```text
colour  d0549f6824f97e5b0e1d09525fdd19ee89d011425fff561af028b12569f9f05e
detail  78c46b915b7e51b068012f1113a59b0ae4ab48f33772e00cf651f6edd997aa6b
```

The new test verifies these bytes, queued work executing before preparation completes, and cancellation before/during preparation. There are **38 passing tests**, plus typecheck, production build, local HTTP and fixture self-checks. The native site returns 404 for the QA script and full source GLB.

## Local measurement

`comparison.json`, `baseline.json` and `after.json` retain observations at **1440x900**, native DPR one, AMD Radeon Graphics / ANGLE / OpenGL 4.6. Resource cache, network and background load were not controlled, so this is a local comparison, not a statistically controlled benchmark or internet-loading claim.

| Observation | Before | After |
| --- | ---: | ---: |
| Largest observed long task | 318ms | 117ms |
| Sum of long-task time above 50ms (estimate, not Lighthouse TBT) | 320ms | 109ms |
| LCP, localhost image | 340ms | 424ms |
| CLS | 0 | 0 |
| Queen median interval | 13.9ms | 13.9ms |
| Queen p95 interval | 14.6ms | 14.5ms |
| Queen intervals over 30ms | 0 / 229 | 0 / 229 |
| Scene ready after navigation | 1148ms | 1582ms |

Cooperative work prioritises input responsiveness over minimum completion time. These samples do not show faster loading; both show the inexpensive image before live readiness. Remaining long tasks include renderer/engine preparation. `after-1280.json` records another successful desktop run. Native event-timing entries did not provide an INP measurement; do not report INP zero or a field Web Vitals pass.

WebGL clear calls were observed only in the application's existing render path; no sampling render loop was added. The full foreground pass kept the same image-to-board handoff. The normal viewport buffer remains allocated at 1425x900; total GPU bytes and higher-DPR cost remain unmeasured. Keep that implementation until device measurements justify a projection/buffer change.

`idle-first.json` / `idle-second.json` record the same **103 clears across 74.14 seconds** after the repeat-visit opening settled: there is no background render loop. This is a local demand-rendering observation, not total application CPU/power measurement.

## Reliability matrix

| Check | Observation / evidence |
| --- | --- |
| Delayed queen response | Real proxy delay of 12s triggers fallback **8014ms after loading**, removes canvas/Lenis and aborts the pending request. `slow-model.json`, `slow-fallback.jpg`. |
| Corrupt queen GLB | Actual invalid HTTP response restores the static image. `corrupt-model.json`. |
| Shader error | Invalid fragment shader reaches the renderer failure path; no canvas/Lenis remains. `shader-failure.json` confirms injection. |
| Renderer unavailable | WebGL context creation returns null; React boundary restores static presentation. `renderer-failure.json`. |
| Context lost during fly-in | Actual `WEBGL_lose_context` before the shot finishes restores the image; ready/pending transitions show it was in flight. `context-loss.json`. |
| Cancel during preparation | Controlled application motion preference change while loading aborts preparation and stays static. `cancel-preparation.json`. |
| Motion/data preference events | Controlled doubles trigger the real application listeners and teardown/remount. `motion-reduced.json`, `save-data.json`. Native browser/CSS changes are **not** established by these tests. |
| Initial motion/data restriction | No hero engine or model request. `reduced-initial.json`, `save-data-initial.json`. |
| Storage access denied | Throwing storage getter still permits rendering; page-local guard prevents replay on eligibility remount. `storage-blocked.json`. |
| Repeated eligibility cycles | Five cycles each have exactly one live context, 11 textures, 84 buffers and six prepared programs at the same stage. Lost contexts are excluded from live counts. `resource-cycles.json`. |
| Phone/tablet isolation | No scene, engine chunk or model requests, equal client/scroll widths (375/819px). `phone.json`, `tablet.json`. |
| Navigation/focus | Phone Menu/Escape restores focus and body overflow. Earlier in-flight link/scroll/keyboard and once-per-session tests remain; visual readback confirms the same approved composition. |

Resource counters retain diagnostic references until page teardown and are **not heap/GPU-memory measurements**. Expected shader/renderer errors occur only in fault cases; direct production rendering has no console errors. Clean `desktop.jpg`, `desktop-1280.jpg`, `tablet.jpg` and `phone.jpg` were captured on the native port without injected controls, against the accepted baselines.

## Reproduction

Use the bundled Node runtime (Node >=22.12), one production build and no concurrent development server:

```sh
SITE_URL=http://localhost:3000 npm start
node tests/fixtures/hero-qa/server.mjs
node tests/fixtures/hero-qa/check.mjs
node tests/http.mjs
node tests/fixtures/hero-qa/verify-results.mjs
```

The proxy listens on port 3001. It forwards only GET/HEAD to the loopback build and rejects mutating methods. Query cases: `?qa-fault=slow|corrupt|shader|renderer`, `?qa-motion=reduce`, `?qa-data=save`, `?qa-storage=blocked`. Use QA snapshot to read the observations. Controls explicitly say “App” for simulated preferences. This fixture is not imported by application code or placed under `public/`.

## Release verdict

**Local hero checks: PASS. Production sign-off: INCONCLUSIVE.** Keep PR #5 in draft until a native browser/CSS reduced-motion change (before and during the shot) and a second-device/higher-DPR check are recorded. The Chrome tracing tool failed to launch because its headful browser has no display server here. No Lighthouse score, field INP, screen-reader certification, fleet performance or total GPU-memory approval is claimed. Broad valid-form/auth/payment journeys were outside this read-only hero pass. No production merge was made.

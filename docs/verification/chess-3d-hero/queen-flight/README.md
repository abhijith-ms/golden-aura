# Queen fly-in review

## Contract recorded before scene implementation

Purpose: preserve immediate access to Golden Aura's tournaments and Trust information, with one cinematic queen arrival as the memorable opening. Primary actions, compact hero, navbar, typography and document height stay in place.

Local references: the accepted board/knight composition and the saved queen-fly-in plan. Source mesh 22 (node 24) is the supplied set's queen; its complete rotational body includes the base. `queen-shape.png` is a Workbench silhouette/normal inspection, not final PBR lighting. At board scale 0.82 its base fits the 0.42-unit grid and its height exceeds the knight's 0.68.

Targets: 1440x900 and 1280x720 desktop, tall 1280x1000, tablet 834x1112 and phone 390x844. Verify queen absent initially, near-camera clearance/crop, readable mid-flight silhouette, board placement and no projection jump. Check once-per-session behavior, input/scroll interruption, static restricted states, failure cleanup and navigation.

Loading: existing four-piece image and HTML remain. Empty: not applicable to bundled decoration. Failure/partial: restore that image and usable links. Success: queen lands then the existing opening runs. Permission: public licensed decoration requires no device permissions. The full source set is never served.

Implementation scope: extraction script/queen asset/credit; pure trajectory and projection helpers with tests; one portal-mounted viewport canvas, coordinated GSAP sequence and session/interrupt state; evidence and handoff. No new dependencies, postprocessing or expanded gallery/card motion.

## Rendered result

[Actual opening recording](queen-fly-in.mp4) is a timestamped browser screenshot sequence, including the initial image, closest pass, recession, landing and existing board opening. Capture overhead affects its cadence; it is not an FPS measurement. The matching domed-crown queen uses the supplied set's full geometry and dark walnut material.

| Artifact | Observation |
| --- | --- |
| `initial.jpg` | 1280x720, queen completely outside the viewport; existing four-piece opening and HTML controls remain. |
| `foreground-1440.jpg`, `foreground-1280.jpg` | Near pass intentionally crops the giant queen beyond the viewport. Whole-model bounding tests stay ahead of near plane 0.03. |
| `tall-mid-flight.jpg` | 1280x1000, full queen silhouette becomes readable as it recedes, with a fixed physical scale. |
| `desktop-final.jpg` | 1440x900, queen on its own square behind the knight, full board opening complete. |
| `production.jpg` | 1280x720 production build, live queen on the board; no review query overrides, pose counters or failure controls. |
| `keyboard-interrupted.jpg` | Tab ends the foreground shot and reaches the visible Skip to content link. |
| `context-loss.jpg` | Actual `WEBGL_lose_context` during the shot removes canvas/Lenis and restores the loaded opening image. |
| `missing-queen.jpg` | Queen request observed as HTTP 404 in local server output; settled state is static, eligible, zero canvases/Lenis. The asset was restored before the production build. |
| `tablet.jpg`, `phone.jpg` | 834x1112 and 390x844 retain the loaded four-piece image and usable compact layout without 3D. |

At 1280x720, initial and foreground document height were both **5212px**, with hero height **561.47px**. At 1440x900 the final document height was **5253px**. Widths equal client widths: 1425px desktop, 819px tablet and 375px phone. No added horizontal overflow or layout row.

## Behavior and checks

- Projection/asset tests: 7 new tests, 36 total passing. They validate standalone asset integrity/budget/license, same-pixel viewport/hero projection, exact empty-square landing, initial invisibility and all eight queen bounds corners at 241 path samples for each of three desktop viewports.
- Keyboard Tab and wheel scroll during a frozen foreground review pose set pending=false and return the canvas below HTML (z-index 0). A production link click during the live foreground shot navigates to Events with zero canvases and no Lenis.
- A played session returns Home with pending=false and no foreground replay. Five production Events/Home cycles produce zero canvases/Lenis on Events and exactly one canvas on Home each time. This is teardown behavior, not proof of GPU-memory stability.
- Phone Menu opens; Escape closes it, returns focus to Menu and restores body overflow. Artwork adds no focus targets, intercepts no pointer input, and keeps copy/actions legible outside the deliberately brief foreground coverage.
- Settled development render counter stayed at **218** across independent observations; demand rendering stops at rest. Foreground measurement **57,122 triangles / 2 draws**; complete scene **90,436 triangles / 21 draws**. Runtime DPR cap is still 1.5, with the existing adaptive reduction/fallback policy. Native DPR in these browser captures was 1.
- Typecheck, 36 tests, one production build, local-only HTTP regression checks and diff whitespace checks passed. Production browser console contained no errors. All temporary review query flags, counters and context-loss controls were removed before building.

## Resource changes and limits

Queen GLB **1,463,528 bytes**, knight **765,460 bytes**, total **2,228,988 bytes**; each embeds a 172,599-byte 512x1024 wood JPEG. The isolated queen has 57,120 triangles / 29,574 vertices; no decimation. The extractor regenerated the knight byte-for-byte. Footer attribution now covers both pieces; separate queen licence and GLB metadata preserve source/changes. The full 38MB supplied source remains ignored and unserved.

The full-viewport drawing buffer is retained after landing for stable projection; ordinary drawing is scissored/masked to the hero. There is one context, demand rendering and no postprocessing, but framebuffer cost is higher than the previous artwork-sized canvas. Two decoded wood textures use roughly 5.3 MiB including mipmaps, plus the existing board/environment/contact/framebuffer resources; total GPU memory is unmeasured.

Actual reduced-motion/network preference transitions, shader/renderer failure injection, extended GPU/resource profiling, representative-laptop frame pacing/loading/Core Web Vitals and motion-comfort approval remain pending. Eligibility/adaptive policy tests are not substitutes for those checks. This is a draft-PR review build, not production approval.

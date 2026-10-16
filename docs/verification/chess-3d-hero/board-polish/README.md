# Board and piece polish

## Contract, recorded before implementation

- Surface: homepage decorative chess hero. Visitors should read the Trust introduction and reach Explore tournaments immediately.
- Direction: a physical tournament board with restrained walnut, warm ivory and charcoal inlays, softly bevelled edges and a thin champagne reveal. Existing accepted camera arc and knight hop remain the memorable moment.
- Current local reference: the cinematic-experiment desktop screenshot shows a very thin, flat six-square board; the exported knight base measures 0.5004 units before its old 1.12 scale, so it exceeds a 0.42-unit square. The rook also overhangs. Correct footprints and pawn/rook/knight height hierarchy rather than adding effects.
- Use a full 8x8 board with 0.42-unit squares. Keep the compact hero, copy, actions, floating navigation and section order. No new dependencies, source model or realtime shadow pass.
- Touch/tablet and restricted devices retain a newly matched static opening render. Loading keeps that image visible; failed enhancement keeps HTML and image usable. No user data/empty collection or account permission state applies.
- Targets: desktop 1440x900, tablet 834x1112, phone 390x844; verify actual layout sizes as well. Inspect opening, landed pose and parallax; verify no navbar/copy collision, focus and mobile menu, no horizontal overflow, and local missing-model recovery.
- Scope: scene geometry/materials and proportions, matching fallback and its HTTP fixture, focused board/footprint tests, handoff/evidence. Motion/performance foundation and other sections stay as they are. Adaptive quality and representative-device performance approval remain subsequent work.

## Result

The board now has 64 inlaid squares in a bevelled walnut frame with two thin champagne borders. Generated 1024px colour/bump maps have fine grain, mipmaps and capped anisotropy. No texture request or dependency was added; these maps consume approximately 10.7 MiB with mipmaps and are disposed on unmount. A left-edge mask softens the artwork crop.

The knight scale changes from 1.12 to 0.68. The actual GLB base now occupies about 81% of a square. Both pawns use scale 0.8, the rook 0.88; their smaller heights and bases form a consistent set. A slightly advanced starting rank keeps the gold pawn separate from the knight's opening silhouette. The legal knight hop, camera, hero height and scroll choreography remain.

The matching `hero-tournament-board.webp` is 88,114 bytes, transparent, 1648x1030, captured from the initial browser pose at temporary DPR 2. Capture code and API were removed; runtime DPR is capped at 1.5 and its deadline remains eight seconds.

## Verification

- Typecheck, 24 tests, production build and localhost HTTP checks passed. Tests check all 64 alternating cells, map sampling settings and the footprint of the actual exported GLB.
- Desktop recording shows the static opening, handoff, hop, camera arc and landing. It is an actual screenshot sequence assembled with capture timestamps, not a frame-rate benchmark. The refined pieces clear the navbar and primary actions.
- Requested viewports: 1440x900, 834x1112, 390x844. Actual content widths were 1425, 819 and 375 respectively, each equal to scroll width. The phone hero remains 542.94px with no new artwork row; Home returns its top to zero. Responsive resizing/reloading can preserve an existing scroll position, so screenshots are not evidence that every reload starts at the top.
- Tablet and phone use the loaded static board with no canvas or smoothing. The mobile menu opens, Escape closes it, restores Menu focus and clears scroll lock. Tab reaches Meet the Trust with a 3px outline; the decorative artwork has zero focus targets. Existing dark overlays keep copy readable over the board.
- Scroll was observed at artwork Y=60.98px/scale=1.0235 and copy Y=16.42px/opacity=0.8241. Events navigation removes the canvas and Lenis. No pointer/scroll algorithm changed.
- Temporarily moving the local knight file produced an observed model HTTP 404. The enhancement settled to static with its new image loaded, no canvas and no Lenis. Restored the file before tests/build.
- Production browser at the default 1280x720 viewport shows one ready canvas, hero top zero and no console errors. Development logs include the installed Fiber/Three Clock deprecation warning; this change adds no clock or render loop.

## Remaining work

Adaptive DPR, actual browser preference transitions, context/shader/renderer failure simulations, prolonged navigation/resource profiling, and representative-device startup/frame pacing/LCP/CLS remain pending. The original experiment's complexity counts are not new measurements. No production merge or wider gallery/card animation changes were made.

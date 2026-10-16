# Adaptive hero rendering quality

## Scope recorded before implementation

Keep the accepted board, pieces, motion, compact layout and static opening image. Add one downward rendering adjustment during sustained poor actual motion, then use the existing terminal fallback if performance remains poor. Never start a benchmark render loop or raise quality automatically.

The change reaches the frame policy and its tests, the existing Sculpture/useFrame callback, the HeroArtwork owner (so its DPR cap survives temporary scene teardown), and the handoff/verification. It changes no dependencies, models, content or HTTP fixture.

Exclude preparation, the crossfade, idle, offscreen/hidden time and the first frame after motion resumes. Allow a short warm-up and require a one-second sample with at least 12 intervals and a majority of frames over budget. One isolated stall must not discard the scene. Sample the opening timeline, actual scroll scrub tween and unsettled pointer damping, using their existing frames.

Check normal rendering, idle/resumption, one-way DPR reduction with a smaller drawing buffer, persistent low cap across responsive teardown, terminal static fallback/Lenis cleanup and working navigation. Use temporary local diagnostics to simulate a slow frame stream without permanently adding debug controls. Record synthetic checks as such; they do not establish real-device performance.

## Implementation

`createHeroQuality` / `sampleHeroQuality` in the existing frame-policy module maintain a small per-scene sample. Opening motion, the actual ScrollTrigger scrub tween and unsettled pointer damping supply the moving flag. The first demand-frame delta is discarded; a 250ms warm-up precedes each session. A sample needs at least one second and 12 intervals. At least 60% of intervals over 30ms triggers one downward adjustment. Sampling resets on idle/suspension without raising quality. No extra frames are requested by this policy.

`HeroArtwork` owns the cap, initially 1.5. A poor sample lowers it to 1; continued poor motion at low quality uses its existing terminal fallback. A native-DPR-one scene starts at low quality. The cap survives temporary responsive/eligibility unmounts. Static fallback remains terminal for that homepage visit, with a fresh visit allowed to enhance again.

## Verification and evidence

- Typecheck, **29 tests**, production build and localhost HTTP suite passed. Five new policy tests cover warm-up, idle/resume gaps, invalid intervals, isolated stalls, sustained slow frames, recovery without upgrades, pause reset, native DPR one and occasional overruns.
- Browser diagnostics were temporary. Query switches fed synthetic 30fps intervals into the actual frame sampler. Canvas DPR was temporarily forced to its configured cap for deterministic testing, independent of this browser's native DPR one. No real GPU slowdown or representative-device FPS is claimed.
- `normal.jpg`: normal timing completes the opening at the forced 1.5 cap. Drawing buffer 1179x737 for a 786.344x491.469 CSS canvas.
- `reduced.jpg`: synthetic poor motion triggers the real React cap callback; drawing buffer becomes 786x491 at DPR 1 while the scene remains ready. This is about 56% fewer drawing-buffer pixels than DPR 1.5.
- `observations.json`: the reduced scene's frame counter stays at 151 across two later reads, with moving=false. Resizing to 834px removes canvas/Lenis; returning to desktop mounts at DPR 1, preserving the reduced cap.
- `fallback.jpg`: continued synthetic slowdown unmounts the scene, removes Lenis, clears GSAP artwork/copy transforms and displays the loaded opening image. Subsequent resize cannot restart it. Explore tournaments still navigates; returning Home creates a fresh scene at the original cap.
- `production.jpg`: final production build with natural DPR clamping, one ready canvas, the original fallback and zero console errors. No temporary attributes, query switches, forced DPR or debug controls remain in source. The browser's native DPR is one, so the production canvas is naturally 786x491.

## Limits and next step

Thresholds are initial responsiveness heuristics and require calibration on representative laptops before production approval. These checks do not establish Core Web Vitals, cold-start budgets, GPU memory, real-device frame pacing or long-term stability. Actual preference transitions, context/shader/renderer failure simulations, prolonged navigation/resource profiling and engine-request isolation remain the next resilience pass. Gallery/card choreography and production merge were outside this step.

# Proposed queen fly-in opening

Date: 2026-10-17. Status: creative/technical proposal; not implemented or deployed.

## User intent

The queen begins invisible, enters from the viewer's side, becomes a very large foreground object that briefly fills/crosses the viewport, then recedes into the scene and settles on an empty board square. It should feel like an object travelling through depth in a 3D movie. Keep the accepted board, corrected piece proportions and existing opening as the destination.

## Creative direction

Use a queen with a readable crown, polished silhouette and convincing close-up shading. Start by inspecting/extracting the queen from the already supplied Oleksandr Zymohliad chess set so its finish and base match the knight. Its source licence is already recorded in the handoff, but the exact queen geometry and close-up suitability still need visual verification. Prefer the existing walnut finish with warm rim lighting. The previous rejected models are not approved alternatives.

Keep physical piece size consistent through the flight. Camera distance and perspective should create the dramatic size change. At the near pass, the queen is intentionally cropped beyond the viewport; it need not be visible as an entire piece at that moment. This distinguishes the giant foreground shot from its final board-sized silhouette.

No artificial waiting after readiness, looping, camera shake, flashes, particles or required scroll interaction. The shot is an opening moment, not extra page length or a loading screen. The final queen should be slightly taller than the knight, with a base that fits the same 0.42-unit squares.

## Proposed storyboard

Times are relative to a fully prepared live scene, not the start of the page request. These are starting timings to judge in a rendered prototype.

| Time | Queen / scene | Intended impression |
| --- | --- | --- |
| 0.00–0.45s | Matching image-to-canvas handoff; queen is fully outside the visible frustum; board and other pieces hold. | Existing readable homepage appears immediately. |
| 0.45–0.85s | Queen sweeps into the foreground from below and slightly to one side, passing very close to the lens. | A large, cropped silhouette briefly dominates the viewport. Full coverage should last roughly 150–250ms, without a flash. |
| 0.85–1.80s | Queen travels away along a smooth depth path toward an empty centre/back square; its full crown and body become readable. | Strong perspective establishes that it is entering the world of the board. |
| 1.80–2.10s | Final descent, restrained deceleration and contact shadow settle the base onto its square. | Weight and a clean landing, without a rubbery bounce. |
| 2.10–3.60s | A tightened version of the existing camera arc, knight hop and supporting-piece movement completes the composition. Queen stays planted. | The arrival leads into the accepted chess opening. |

Do not run every piece move through the near-camera pass. Start other-piece travel after the queen lands. The precise empty landing square and crown orientation should be chosen from projected screenshots, with no collisions or obstruction of the knight. A queen arriving from outside the board is a cinematic placement, not a claim to depict a legal tournament position or move.

## Presentation and input

- The user's screen-filling request requires artwork beyond the current right-hand hero canvas and its clipping/mask. Keep page structure, hero height, text and buttons in place.
- Prototype one canvas with a temporary viewport-sized presentation for the foreground shot. The queen and board must share the same 3D camera/depth relationship; do not add a second independent WebGL scene for the fly-by.
- Returning to the existing hero-sized presentation is a projection/layout problem, not just changing CSS width. Match the board's projected square corners and queen base before/after any resize or crop so there is no visible jump. Do not shrink a DOM overlay containing an unrelated render.
- Keep the lens steady through the foreground pass. Coordinate later camera movement and queen flight in the same GSAP pose calculation so independent writers cannot fight over camera transforms.
- Begin outside the frustum, enter in front of the near clipping plane and inspect the whole model bounding volume through the path. Avoid visible clipping slices, sudden appearance or passing geometry through the lens.
- Foreground coverage is brief. Canvas remains pointer-transparent; navigation, keyboard focus and existing links remain usable. Never lock scrolling. Scrolling away, opening navigation or using a link should end the fly-in and settle/clean up the scene rather than leave a full-screen obstruction following the user.
- Recommend playing the full fly-in once per tab session, marked when it actually starts. Returning to Home, resizing or bringing the hero back into view should not replay the screen-filling shot. If session storage is unavailable, retain a safe page-local guard.
- Desktop eligibility remains. Reduced-motion/data-restricted, touch/tablet and failed-renderer cases keep a static complete composition. Mobile receives no full-screen fly-by.

## Asset and performance requirements

The queen is not yet selected or extracted. First inspect its crown, normals, silhouette and wood texture at the closest projected size. Do not disguise a visibly weak close-up asset with blur. If the supplied queen cannot support the shot, review another free licensed option before implementation.

Export only the required queen geometry, preserving attribution and reusing materials/textures where practical. Never serve the full 38MB source set. Measure the combined knight/queen/supporting-piece scene, transfer size and texture allocations; adding a close-up queen changes the existing geometry budget.

The transient full-viewport drawing buffer costs more than the current small artwork. Keep demand rendering, the DPR cap/adaptive reduction, local failure handling and resource disposal. If quality/performance fails during the flight, remove the foreground layer and restore the usable static hero immediately. Adaptive quality and a synthetic test are not proof that the full-screen shot performs well on typical hardware.

The matching initial fallback must keep the queen invisible to avoid an image/canvas pop. Decide whether restricted devices show the final queen composition through a separate static image or retain the current four-piece opening; render and review the chosen fallback before shipping. No additional postprocessing package is required for the first prototype.

## Smallest implementation sequence

1. **Asset/still gate:** identify the exact queen; export a lean preview and inspect the closest pass and final board proportions. No changes to the existing hero until those stills are credible.
2. **Depth/projection prototype:** render the foreground-to-board path with the camera held steady and other pieces frozen. Verify near-plane safety and the full-viewport-to-hero handoff first.
3. **Choreography:** integrate the proposed sequence with existing GSAP motion, session/replay rules and scroll/navigation interruption. Tighten timing from actual recordings.
4. **Fallback/resilience:** matching static images, reduced motion, slow/failing assets, adaptive-quality transitions, context loss, preference changes and clean route teardown. The outstanding resilience work remains part of this step.
5. **Performance/review:** production build, representative-laptop frame pacing and loading checks, desktop aspect ratios, mobile static layout and recording. Update the draft PR/branch preview for review; no production merge without authorisation.

## Review evidence and acceptance

Capture actual rendered frames for: initial queen absence, closest cropped pass, mid-flight depth, landed queen, final board and interrupted flight. Check 1440x900 and 1280x720 desktop compositions, plus a tall desktop viewport; retain tablet/phone static checks. The shot must not change document height, hide working controls behind a modal or leave a viewport overlay after navigation.

A successful prototype has a clear queen silhouette, a smooth depth path and a seamless landing/handoff. Model quality, fullscreen projection continuity, transient GPU cost and motion comfort remain open until those captures and device checks are complete.

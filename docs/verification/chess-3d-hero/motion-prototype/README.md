# Hero-to-introduction motion prototype

## Contract recorded before implementation

- Job: introduce Golden Aura and lead visitors directly to tournaments. Preserve HTML headings, links, the floating navigation and the existing compact section heights.
- Direction: a warm wooden knight on a shallow, dark chessboard fragment; a soft gold edge and studio lighting give depth without adding more pieces or decorations.
- Reference: [Astra's revised plan](../../../plans/chess-3d-hero/astra-revised-motion-plan.md) supersedes the original pointer-only scope. First review the hero and its transition into the ivory introduction. Other homepage choreography waits for visual approval.
- Motion: short entrance after the matching fallback/canvas handoff; bounded 16-degree scroll turn and a small viewpoint shift over the existing hero scroll distance. Separate scroll and pointer groups. Layered artwork/copy parallax; no pinning or new scroll distance.
- Input: passive pointer response over the artwork only, native keyboard/touch and immediately available tournament links. Trial light desktop wheel smoothing with one GSAP/Lenis scheduling setup; remove it on reduced motion, narrow/touch layouts or navigation away.
- Devices: review requested viewports 1440x900, 834x1112 and 390x844. Small/touch layouts retain a deliberate matching static composition; no separate artwork row.
- Loading/error/partial: keep the matching image until a valid canvas frame; local errors/deadline/context loss restore that image. No spinner or access barrier for this decorative scene.
- Success: one canvas, readable content, downward/upward scroll reverses correctly, movement settles without an ongoing WebGL loop. Repeated navigation must leave one controller.
- Empty/permission: not applicable to bundled public decorative artwork; no device permissions requested.

Scope: hero controller/scene and policy tests, a board surface and matching fallback, homepage intro markers/CSS, package lock, this evidence and the saved handoff. No CMS, registration, payment, gallery or tournament content changes.

## Rendered results

The prototype is implemented on `codex/chess-3d-hero`. [Scroll demo](scroll-demo.mp4) records actual browser screenshots during downward/upward wheel scrolling, assembled using their capture intervals; it is a visual demo, not a frame-pacing benchmark. [Desktop](desktop.jpg), [tablet](tablet.jpg), [phone](phone.jpg), [production](production.jpg) and [production scroll](production-scroll.jpg) show the current composition. The requested overrides were 1440x900, 834x1112 and 390x844; resulting screenshot dimensions are 1425x891, 819x1092 and 375x812. The production default is 1280x720, captured as 1265x712.

- At desktop rest, one ready canvas appears beneath the matching image. After 315px scrolling in a 585px hero, the measured outer turn is 0.15037 radians (8.62 degrees), artwork translation 47.38px and copy translation 15.08px; the introduction moves -9.69px. Upward scroll returns all three to zero with no replay of the handoff.
- Temporary development `useFrame` counters remained at 4 while idle before interaction, and at 167 after the reverse scroll. A separate offscreen check stayed at 485 from hero top -678px to -1080px. These establish cessation in the observed local sessions, not hardware performance. The counters and capture API were removed before production build.
- Passive pointer response was exercised over the artwork, followed by a return over the copy. Unit checks bound yaw/pitch and verify time-based damping, rest snapping and resumed-frame limits.
- Resizing a live desktop scene to tablet removed the canvas and Lenis class and reverted artwork/introduction inline transforms. Tablet/phone have zero canvases, native scrolling and no horizontal overflow: client/scroll widths are 819/819 and 375/375. The compact hero remains 585px at the desktop override and about 543px on phone; no extra scroll section was introduced.
- Tab moves from the tournament action to Meet the Trust with a 3px focus outline; the artwork has zero focus targets. On phone, the Menu dialog opens and Escape closes it, restores focus to Menu and clears the body scroll lock.
- Three Events/Home navigation cycles were exercised. The final two recorded cycles show zero canvases/no Lenis on Events, and exactly one canvas/Lenis on Home. See [navigation observations](navigation-observations.json). This is basic cleanup coverage, not extended memory profiling.
- With the local model temporarily unavailable (HTTP 404), the board image (HTTP 200) and actions stay available, with zero canvases/no Lenis. See [failure view](model-failure.jpg). The model was restored before final checks.
- Production reaches one ready canvas, reports no browser console errors in the check, and runs the same parallax. Typecheck, **22 unit tests**, one production build, local HTTP regression checks and whitespace checks passed. HTTP tests used only the localhost fixture and invalid enquiry requests.

The procedural board adds no download. The GLB remains 765,460 bytes / 26,626 triangles; the matching board fallback is 40,574 bytes / 1003x1003. DPR remains capped at 1.5 and the enhancement deadline remains eight seconds. The old knight-only fallback remains available for rollback.

## Remaining review and limits

Visual approval of this hero/introduction comes before gallery/card choreography. Adaptive DPR, real-device cold startup/LCP/CLS/frame pacing, actual reduced-motion/network preference changes, shader/renderer/context-loss simulations, prolonged navigation/resource measurements and engine-request isolation are still pending. Desktop eligibility unit tests cover reduced motion and data restrictions; the actual browser preference switches were not simulated. Lenis is a desktop trial and should be judged on a normal wheel and trackpad. Production has not been merged.

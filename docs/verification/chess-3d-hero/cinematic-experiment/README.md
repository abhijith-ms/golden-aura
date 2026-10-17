# Cinematic opening-move experiment

## Contract before implementation

The user finds the existing hero acceptable but asks for a stronger Three.js experiment with a visible wow factor. This authorises revising the earlier restriction on additional pieces within the hero. The homepage outside the hero/introduction remains unchanged.

- Job and hierarchy: identify Golden Aura and lead visitors to tournaments. Keep the current typography, HTML copy/actions, floating navigation and compact hero height.
- Direction: a larger, angled chessboard emerging from charcoal, with the existing walnut knight as the focal point, restrained champagne-gold/ivory supporting pieces and studio lighting. Actual chess movement replaces the previous still-sculpture impression.
- Memorable moment: a one-time knight hop of two files/one rank, accompanied by a camera arc and staggered supporting-piece moves. Scroll continues the camera/board reveal and parallax; no pinning or additional page length.
- Asset boundary: reuse the licensed 765 KB knight. Construct the board and supporting silhouettes with Three.js geometry; do not serve the 38 MB source set or add packages/postprocessing.
- Target viewports: 1440x900 desktop, 834x1112 tablet, 390x844 phone. A matching static opening composition remains available on narrow/touch/reduced-motion/data-restricted devices. No separate mobile artwork row.
- Loading: initial matching image and HTML remain visible. Start the one-time scene movement only after the image/canvas handoff; retain the initial composition for static/failure fallback, even after the decorative story has advanced.
- Success: visibly richer composition and actual movement, bounded scroll/pointer transforms, one canvas and no ongoing WebGL loop after settling. Both tournament and Trust links remain usable throughout.
- Error/partial: local loading/deadline/context failure restores the static opening composition and normal scrolling. Empty/permission states do not apply to bundled public decorative art.
- Verify the resting framing and the movement envelope, reverse scroll, responsive teardown, focus/navigation and a local missing-asset fallback. Save actual screenshots and a short browser recording; do not claim representative-device performance from screenshots.

Scope: the scene and its framing/fallback, minimal procedural geometry and motion helpers/tests, current handoff/README, review evidence and existing draft PR. No CMS, payment, registration, content or site-wide gallery changes.

## Result and verification

[Opening recording](opening-demo.mp4) and [animated preview](opening-preview.webp) show actual browser screenshots assembled using their capture intervals. The preview loops for review; the website's move runs once per scene mount. These are visual recordings, not frame-pacing benchmarks.

- The larger board, walnut knight, champagne/obsidian pawns and ivory rook form a single scene. The rook was moved clear of the resting knight's silhouette. The animation's peak still leaves the knight below the navbar in the desktop check; see [mid-hop](knight-hop.jpg) and [resting desktop](desktop.jpg).
- Temporary diagnostics recorded the knight starting at X=-0.21 / Y=0, reaching Y=0.31477 during the hop, then landing at X=0.63 / Y=0. Camera X changes from 2.8 to 1.8. Full-scene counts are **33,262 triangles / 18 draw calls**, with the same 765,460-byte knight asset and no extra model downloads.
- After the move finishes, the frame counter stays at 156 across three samples. Offscreen state reports inactive, and returning Home restores scroll transforms to zero with the knight still at its landing position: the opening does not replay. See [observations](motion-observations.json).
- The stronger scroll reveal and reverse were exercised. Desktop-to-tablet resizing removes the canvas/Lenis and clears the artwork transform. Tablet and phone retain the static opening composition and native scrolling. Document and scroll widths match at 819px and 375px. Hero height stays 585px at the desktop override and about 543px on phone.
- Tab from Explore tournaments reaches Meet the Trust with a 3px outline; the artwork has zero focus targets. The phone menu opens; Escape closes it, restores Menu focus and clears the body scroll lock.
- With the model temporarily unavailable, local HTTP returns 404 for it and 200 for the fallback. The browser keeps the loaded opening image and links, with zero canvases/no Lenis. The model is restored before final checks. See [failure view](model-failure.jpg).
- The production build reaches one ready canvas with no console errors in the check. Navigating through the tournament action removes the canvas/Lenis on Events; returning Home restores one ready scene. The fresh production phone capture has no horizontal overflow.
- Typecheck, **23 unit tests**, one production build, local HTTP regression checks and whitespace checks pass. The new motion test checks two-file/one-rank displacement, hop height, floor contact, board bounds and progress limits. Existing checks retain the server-rendered image/HTML contract.

The matching **opening** fallback is `hero-opening-move.webp`, 65,654 bytes / 1648x1030, captured at temporary DPR 2 and WebP quality 90. It matches the opening camera/piece arrangement, before the decorative story advances. Static devices and failures show that initial composition. Temporary capture API and renderer counters were removed; runtime cap/deadline remain DPR 1.5 / eight seconds. No packages were added.

Requested desktop/tablet/phone overrides are 1440x900, 834x1112 and 390x844; screenshot files capture 1425x891, 819x1092 and 375x812. The default production viewport is 1280x720, captured as 1265x712. No new hero section or page length is added.

## Limits and next review

This is a visual experiment for the user to judge. Adaptive DPR, representative-device loading/frame pacing/LCP/CLS, actual reduced-motion/network preference changes, context/shader/renderer failure simulations and extended resource profiling remain pending. The scene counts and local idle observations do not establish hardware performance. Other homepage choreography and production merge remain outside this change.

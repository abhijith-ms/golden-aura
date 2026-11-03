# Image-loading performance fix plan

Prepared: 2 November 2026.
Status: implemented on 3 November 2026 on `codex/image-loading-fixes`; [verification results](../verification/image-loading/README.md).
Evidence: [PR #6 image-loading review](../reviews/pr-6-image-loading-review.md).
Reviewed baseline: merged `main` at `8bd207719d88d29fb8d1391dea251ef3b74f7c57`.

## Outcome

Reduce unnecessary image traffic, prevent blank gallery transitions, and make visible photographs become clear promptly while preserving the cinematic presentation, image detail, navigation and accessibility.

Use the installed Next Image and Motion APIs. No new runtime dependency or site-wide rewrite is needed.

## Working branch and baseline

1. Recheck the latest `main` before implementing and compare any newer changes with the reviewed baseline.
2. Implement on `codex/image-loading-fixes`, based on that current `main`. Preserve the dirty `codex/chess-3d-hero` checkout and its unfinished plans. Use a separate checkout if necessary to keep that work intact.
3. Record the current behaviour under repeatable conditions: mobile and desktop viewport, same network profile, device pixel ratio, browser and cache state. Capture requested image URLs, transfer bytes, `currentSrc`, rendered width, gallery selection behaviour and LCP. Separate cold image-transform/cache requests from warm requests.
4. Use local or review-preview verification. The earlier production browser-access denial is still a constraint; permission changes to the filesystem do not authorize bypassing it.

## Commit 1 — Remove unnecessary downloads and correct image sizing

Suggested commit: `fix: remove redundant gallery downloads and correct image sizing`.

Files:

- `src/components/community-moments-section.tsx`
- `src/components/community-moments.module.css`
- `src/components/tournaments-section.tsx`
- `tests/http.mjs`

Changes:

1. Replace the gallery's full-photo CSS backlight with the existing ambient gold/cyan gradient. Remove only the obsolete image-backed layer and its unused styles. The selected photo, tilt, sheen and pan/zoom remain.
2. Remove `priority` from the below-the-fold gallery image. Keep its initial image and thumbnail loading lazy.
3. Match tournament `sizes` to the actual layouts: stacked photo at widths up to 768px, a 40% photo column in a single card at 769–1024px, and two cards with 42% photo columns above 1024px. Account for padding, gaps and maximum section width.
4. Check the gallery's `sizes` against its own 1024px grid change and 640px padding change; correct the hint if it differs from the measured stage width. Keep thumbnails sized for their small display slots.
5. Keep the current image quality initially. Remove duplicate and oversized work before considering compression changes that might reduce visible detail.
6. Extend the existing local HTTP checks to confirm the moments section does not contribute an image preload and its stage image retains lazy loading. Check the removed raw-photo backdrop in the rendered section without brittle generated-class assertions.

Acceptance:

- No original photograph is requested solely for decorative backlighting. The removed initial raw original is 348,194 bytes; this is a potential avoided request on a cold visit, not a promised total-page saving on every cache state.
- No gallery-stage preload is emitted in initial HTML.
- The tournament and gallery browser-selected variants fit their measured widths and DPR. Inspect actual `currentSrc`; do not infer a 3840px download from the fallback `src` when `srcset` is present.
- No cropping, layout-height or visible-sharpness regression at 390, 820, 1100 and 1440px, including DPR 2.

## Commit 2 — Wait for the replacement photograph before crossfading

Suggested commit: `fix: wait for gallery images before crossfading`.

Files:

- `src/components/community-moments-section.tsx`
- `src/components/community-moments.module.css`, only for the pending/error presentation if required
- A focused gallery interaction regression check using the existing test/browser tooling

Changes:

1. Distinguish the requested selection from the displayed photo. Keep the displayed photo visible while its replacement loads and decodes.
2. Mount the requested optimized stage image with the same responsive sizing and quality used for display. Start this user-requested load immediately; do not leave a pending hidden image waiting for native lazy-load visibility.
3. Trigger the current short crossfade only after replacement readiness. Update caption, counter, alt text and selected thumbnail together with the displayed photo.
4. Handle rapid next/previous/thumbnail interactions: navigation advances from the latest requested selection, and stale load/error callbacks cannot override a newer request. Bound pending state to the current request rather than accumulating every requested slide.
5. On failure, preserve the current photograph and its metadata. Give a concise accessible retry action. Reserve the existing stage footprint and handle initial-image failure as well.
6. Preserve keyboard, swipe and thumbnail controls, focus behaviour and reduced-motion handling. Reduced motion uses an immediate image swap once ready.
7. Do not preload the whole album. Start with this readiness fix and lazy initial loading. Only if measured click latency still warrants it, warm at most one adjacent optimized stage rendition after the section approaches view and the current image has loaded; avoid speculative warming on data-saving connections.

Acceptance:

- A replacement delayed by several seconds never causes the currently displayed photo to disappear prematurely.
- Caption, counter and selected thumbnail always match the visible image.
- Rapid navigation, including out-of-order completions, finishes on the latest user intent.
- A failed replacement retains the current photo and permits recovery without a page reload.
- Controls work with keyboard and touch, reduced motion is respected, and no stale update occurs after leaving the page.

## Commit 3 — Reduce hero bandwidth on mobile and data-saving paths

Suggested commit: `perf: reduce hero media bandwidth on mobile`.

This is a separate media pass after the confirmed gallery regressions. The current 8-second 1080p MP4 is 4,747,195 bytes and competes with image loading.

Files:

- `src/components/hero-section.tsx`
- `public/video/` for a compressed mobile rendition
- Hero-related local HTTP/browser checks

Changes:

1. Create a smaller mobile rendition from the current master with available media tools. Aim for approximately 1–1.5 MB, subject to visual review of the chess pieces and lighting; record actual resulting bytes. Preserve framing, duration, sound/replay/skip controls and the timing landmarks used by the current choreography.
2. Select the appropriate video source before attaching it so mobile does not download the desktop file first. Keep a static poster in the server-rendered page and avoid introducing a blank hero while client capabilities resolve.
3. For reduced motion and supported data-saving preferences, render the settled static presentation without attaching an autoplay video source. Pausing a video after setting its source, or only changing `preload` while retaining autoplay, is insufficient to guarantee avoided traffic.
4. Consolidate the redundant nested fallback image request using the existing poster/final-frame presentation. Preserve a reliable static result on video failure and autoplay rejection.
5. Maintain the existing homepage replay behaviour for normal-motion users. Account for any explicit replay action after capability-based fallback without silently enabling autoplay for reduced motion.

Acceptance:

- A mobile visit requests the mobile rendition, not both encodes.
- Reduced-motion/data-saving startup does not request the autoplay video where those preferences are available.
- Desktop cinematic appearance, mobile crop, static fallback, sound, replay and skip still work.
- No hero layout shift or blank first frame is introduced, and LCP does not regress under the same comparison conditions.

## Conditional follow-up — Portrait reveal pacing

If the client means Grandmaster portraits when describing slow images, adjust `src/components/players-section.tsx` and its CSS so each card reveals once when it approaches the viewport, using a short bounded transition rather than remaining hidden until section-wide scroll progress advances. Keep restrained parallax separately and respect reduced motion.

This addresses perceived visibility delay; it should not be reported as a reduction in download time. Verify all 14 portraits at two-, three-, four- and seven-column layouts. Do not make every portrait eager to mask animation delay.

## Verification and release

1. Run the existing typecheck, unit tests, production build and local fixture HTTP checks.
2. Exercise gallery selection with deliberately delayed and failing image responses, including rapid navigation and cached images. Use the actual rendered interaction rather than a test that merely mirrors the implementation.
3. Compare before/after cold-cache and warm-cache visits on the same device/profile. Record transferred image/video bytes, request duplication, chosen image widths, LCP and CLS. Use repeated runs, not a single curl duration, for any timing claim.
4. Confirm no original gallery backdrop requests and no below-the-fold gallery preload; then check media source selection and visual quality on the hero pass.
5. Review desktop and mobile screenshots and check navigation, captions, controls and fallbacks. If browser access or throttling is unavailable, label that verification incomplete rather than inventing measurements.
6. Commit each logical change separately and open a focused PR with the measured results and remaining limits. Verify the active GitHub account before pushing, as requested previously.

## Scope boundaries

Do not add an image framework, bulk-recompress the archive, eagerly fetch every gallery slide, remove cinematic motion globally, or alter AVIF/WebP configuration without new evidence. The existing draft live-3D work remains separate from this merged video implementation.

The core delivery and readiness fixes are implemented and checked. The mobile rendition is 1,617,256 bytes (65.9% smaller); visual review favoured this result over pushing compression further to the approximate 1–1.5 MB target. [PR #7](https://github.com/abhijith-ms/golden-aura/pull/7) contains the separate commits. The conditional portrait choreography change remains deferred until the client identifies that section as a problem. Overall loading-time savings and physical-device LCP remain unmeasured.

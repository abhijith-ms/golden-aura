# PR #6 image-loading review

Reviewed 2 November 2026 using ECC's PR review and React performance skills.

PR: [#6 — Redesign](https://github.com/abhijith-ms/golden-aura/pull/6).
Reviewed merge: `8bd207719d88d29fb8d1391dea251ef3b74f7c57` (`origin/main`), compared with its first parent. GitHub confirmed this is the latest merged PR and `abhijith-ms` is the active account. The older dirty local 3D checkout was preserved.

## Conclusion

The redesign introduces unnecessary image requests and a gallery transition that is not coordinated with image readiness. These are credible causes of the client's slow-image report. Ordinary photos already use Next Image; the new gallery adds a separate raw-source download outside that pipeline. Exact client-device loading times have not been measured.

Four findings meet the ECC confidence threshold of at least 80%. All are P2: normal-priority performance or visible interaction regressions.

## Findings

### 1. The gallery downloads a full original just for a blurred background

- Location: [community-moments-section.tsx:259–265](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/community-moments-section.tsx#L259-L265).
- The ambient layer sets `backgroundImage: url(activePhoto.src)`. The visible photograph separately uses a responsive optimized `/_next/image` URL at lines 365–373.
- The captured production HTML contains both the raw `/images/open-2025-players.webp` background and the optimized display image. The raw original is **348,194 bytes, 1800 × 1200**. Another gallery source, `coffee-community.webp`, is **430,086 bytes**.
- The original is blurred by **90px** ([CSS:240–248](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/community-moments.module.css#L240-L248)); those pixels add no useful background detail. The raw URL is distinct from the stage and thumbnail variants, so their caches cannot satisfy it.
- This layer did not exist in the previous PhotoCarousel.
- Smallest fix: use the existing ambient gradient. If photo-derived colour must be retained, use a deliberately tiny optimized rendition instead of the original.

### 2. A below-the-fold gallery photo is preloaded on homepage entry

- Location: [community-moments-section.tsx:365–372](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/community-moments-section.tsx#L365-L372), specifically `priority` at line 371.
- The gallery follows the hero, vision, tournaments, and Grandmasters sections. Its initial image is still emitted as an image preload in the captured production HTML.
- This starts offscreen photo work alongside the hero media instead of leaving bandwidth available for immediately visible content. The previous carousel did not use priority.
- Smallest fix: remove `priority` from this image and retain normal lazy loading. Do not make every image eager to compensate for slow transitions. Next documents preloading for critical above-the-fold images and provides lazy loading for other images: [Image API](https://nextjs.org/docs/app/api-reference/components/image#preload).

### 3. Selecting another gallery photo can expose a blank stage

- Location: [community-moments-section.tsx:323–344](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/community-moments-section.tsx#L323-L344), with the selected image at lines 365–373.
- Selection mounts the new keyed full-size image and starts removing the previous slide immediately. The outgoing slide finishes fading after **450ms**, regardless of whether its replacement has loaded or decoded.
- There is no image readiness/error gate. The small pre-mounted thumbnails use different widths and quality settings, so they do not warm the selected stage variant's cache.
- If a first-time request takes longer than the transition, the visitor sees the dark stage while the image arrives. The comment promising a transition with no black gap is therefore not guaranteed.
- The old carousel kept its full-stage image elements mounted; the new component mounts only the selected stage image.
- Smallest fix: keep the displayed image until its replacement loads/decodes, then crossfade. Retain the previous photo on failure. Optionally warm the next/previous display variants when the gallery approaches the viewport.

### 4. Tournament image size hints overstate the desktop photo width

- Location: [tournaments-section.tsx:113–119](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/tournaments-section.tsx#L113-L119).
- The declared `sizes` uses `50vw` at 769–1200px and `450px` above 1200px. The actual layout has two cards above 1024px, with each photo occupying 42% of a card ([CSS:186–208](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/tournaments.module.css#L186-L208)).
- Source-derived estimates, including section padding, grid gaps and card borders:

  | Viewport | Actual photo slot, approximately | Declared slot | Expected DPR 2 candidate from current hints |
  | --- | --- | --- | --- |
  | 1100px | 197px | 550px | 1200px instead of approximately 640px |
  | 1440px | 251px | 450px | 1080px instead of approximately 640px |

- Candidate selection is an estimate from source and generated sizes, not an observed `currentSrc` on a physical device. Browser choice can also depend on cache and network conditions.
- Smallest fix: align `sizes` with the photo column, including the 1024px single-card and 768px stacked-card breakpoints. Next confirms `sizes` controls the browser's responsive selection: [Image API](https://nextjs.org/docs/app/api-reference/components/image#sizes).

## Related contributors and perceived delay

- **Hero bandwidth:** [hero-section.tsx:569–574](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/hero-section.tsx#L569-L574) supplies an unconditional autoplay video with `preload="auto"`. The added MP4 is **4,747,195 bytes**, 8 seconds, H.264 1920 × 1080 at 24fps, with audio. This adds substantial bandwidth competition on slower connections. Use a smaller mobile encode and avoid attaching autoplay video for reduced-motion or data-saving paths. Changing only `preload` while keeping autoplay does not guarantee that the media download is avoided. Video metadata is already placed before media data; there is no fast-start placement defect.
- **Hidden hero fallback:** the raw `<img>` inside the video at line 582 appears as a separate React-generated image preload in the captured HTML. It is **49,292 bytes** and adds another early image alongside the video poster and final board frame. Consolidate fallback resources when revising the hero loading policy.
- **Grandmaster reveal:** [players-section.tsx:53–67](https://github.com/abhijith-ms/golden-aura/blob/8bd207719d88d29fb8d1391dea251ef3b74f7c57/src/components/players-section.tsx#L53-L67) ties card opacity, blur and movement to section-relative scroll progress. A downloaded portrait can remain faded/hidden until the visitor scrolls farther. This is deliberate choreography, not proof of a slow network request. If the complaint concerns portraits, use a short reveal triggered by each card entering view and keep parallax separate. The reveal indexing assumes seven columns while the CSS changes column count on smaller screens.
- **Hero timing:** UI is normally revealed at 5.2 seconds of video playback with a 7-second wall-clock fallback. Some perceived loading time is the entrance sequence itself.

## Evidence and exclusions

- Three independent ECC review passes covered image delivery/types, asset payload/tests, and visibility/failure behaviour; overlapping findings were deduplicated.
- Captured homepage response before browser denial: HTTP 200, 193,015 bytes. A single curl TTFB of approximately 1.66 seconds is not a representative user-performance benchmark.
- Captured HTML includes 86 image elements; 82 have native lazy loading. Image count is not the count of immediate downloads, and repeated partner images can share cached responses.
- Offline assertions confirmed the raw gallery backdrop plus optimized stage, gallery preload, fixed outgoing transition and absence of load/error coordination.
- Temporary evidence: `/tmp/golden-aura-live-review.html`, `/tmp/golden-aura-image-inventory.json`, `/tmp/pr6-image-performance-evidence.json`. Their contents may disappear after environment cleanup; the material findings and sizes are retained here.
- Unreferenced large files under `public/`, including new pillar JPGs and older hero PNGs, were excluded: merely existing in the repository does not make the browser request them.
- Quality 90 gallery images and AVIF-first configuration predate this PR; they are not newly introduced regressions. Cold optimization/cache latency remains unmeasured.
- Existing HTTP tests assert hero asset presence, not loading policy or readiness during transitions. After fixes, add a focused assertion excluding below-fold gallery preloads and a slow-image transition check that preserves the outgoing photo until replacement readiness.

## Recommended order

1. Remove gallery priority and the redundant original-image backdrop.
2. Coordinate gallery crossfade with image load/decode and failure handling.
3. Correct tournament image size hints.
4. Adjust portrait reveal pacing if that is the affected section, and introduce a lighter hero loading path for mobile/data-saving use.
5. Verify a cold-cache mobile waterfall and gallery navigation on a slow connection before claiming a measured speed improvement.

This pass changed no application code and ran no application build/tests. Production browser access was declined by the browser security check, so no alternate browser or network route was used to continue live inspection after that denial. Runtime reproduction, Lighthouse scores, and physical-device timings remain unverified.

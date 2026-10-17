# Tournament and photograph motion review

2026-10-17. Scope: [the agreed section-motion contract](../../../plans/chess-3d-hero/section-motion.md). Production build reviewed in the Codex in-app browser on localhost. The hero's accepted appearance/sequence is unchanged.

## Result

- Homepage tournament cards and the photograph stack/story/thumbnails enter individually over 560ms, with 65ms staggering. The containing section does not also animate. Ordinary section entrances keep their previous translation, without the new group scale.
- Photo selection reveals the incoming frame directionally while the previous frame recedes. No autoplay, new images, controls or extra scroll distance. Captions/selection update immediately, and rapid changes remain usable.
- Shared event cards respond to keyboard focus and fine-pointer hover. Gallery images have the same restrained zoom and a 240ms native-dialog opening; closing is immediate.
- Content is visible before JavaScript. Reduced motion bypasses the observer and cancels running entrances; CSS disables transitions/animations and hover transforms. Focus cancels an entrance on its card/control. These preference branches were tested with unit doubles, not a native browser preference change.

## Checks performed

- TypeScript, **41 tests**, production build and local HTTP checks pass. The first HTTP run used the project's non-local origin and rejected the test enquiry origin; restarting the local server with `SITE_URL=http://localhost:3000` resolved the fixture configuration. No enquiry was delivered.
- Tests exercise grouped staggering, skipping the parent/already-visible content, focus cancellation, completed-animation cleanup, reduced-motion cancellation and unavailable observation. No permanent inline styles or frame loop is introduced.
- **1440x900:** both tournament cards retain their compact dimensions; no document overflow. Carousel buttons, Home/End/Left/Right, rapid reversal and thumbnail jumps select the correct frame. One slide remains active and exposed to accessibility; captions match it.
- **390x844:** photo section remains 330px wide / 428.25px high, with 44px arrows and thumbnails at least 44px high. Horizontal pointer drag advances a photo; `pan-y pinch-zoom` remains allowed. No hero canvas on this narrow viewport.
- **320x740:** no document overflow; arrows and all five thumbnails remain at least 44px in both dimensions. The longer prize-presentation caption wraps inside its column.
- Gallery album filtering narrows to four Chess & Coffee photos. Enter opens the enlargement, Escape closes it and returns focus to its trigger. Loaded-image screenshots cover desktop and phone; an initial blank-but-stable image loading state was observed before the image completed.
- Keyboard activation of the homepage 2024 event opens the existing tournament detail. No console errors occurred during these journeys.
- Existing empty/single-photo guards, alt text, image bounds, swipe thresholds and pointer cancellation remain in the component; source reviewed. No new data, permission, network-error or form state is added by this change.

## Evidence

`browser-results.json` contains the read-only DOM observations and interaction assertions. `evidence.json` is the design-direction record. Screenshots:

- `cards-1440.jpg`, `cards-390.jpg`: compact cards, long titles and keyboard focus.
- `photos-1440.jpg`, `photos-390.jpg`, `photos-320.jpg`: settled carousel at the three widths.
- `photos-transition-1440.jpg`: real in-progress photo change, not a performance trace.
- `gallery-dialog-1440.jpg`, `gallery-dialog-390.jpg`: loaded enlargement and close control.

## Limits

These are local browser viewport checks, not real phone/Safari testing, native preference emulation, a full accessibility audit or field performance measurements. Empty/single-photo and deliberately broken-image fixtures were not rendered in this pass; their existing branches were retained. No new hero measurements were taken. The teammate's native reduced-motion and second-device/higher-DPR checks remain pending, so PR #5 stays draft. No production merge.

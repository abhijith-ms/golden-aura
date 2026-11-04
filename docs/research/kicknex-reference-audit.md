# Kicknex reference audit

Inspected: 31 October 2026. Reference: <https://www.kicknex.com/>.

Purpose: understand the client's reference and inform a later Golden Aura design decision. This is research, not an approved redesign or a replacement for the chess hero plans.

## Main finding

The delivered homepage gets its cinematic appearance from art direction and sequencing: video, a transparent mascot image, CSS layers and motion, and a small Canvas 2D smoke system. The inspected page does not contain a live Three.js scene. Its broader visual language is cyber-sport: warm dark backgrounds, oversized wide headings, neon edges, scanlines, and technical diagrams.

## Confirmed implementation

| Area | Evidence from the delivered homepage |
| --- | --- |
| Frontend | Plain HTML, one inline stylesheet, two inline JavaScript blocks. No external script tags or framework bundles in the capture. |
| Animation | CSS keyframes/transitions, IntersectionObserver, timers, requestAnimationFrame for smoke. No GSAP, Motion, Lenis, or Three.js references found in the captured code. |
| Hero imagery | `/assets/hero_section.mp4` plus `/assets/mascot_final_pose.png`; the settled character is a cutout image with drop shadows. |
| Secondary video | `/assets/section5.mp4`; script plays the opening eight seconds once when it enters view. |
| Graphics | Inline SVG diagrams/charts, CSS rings and glow effects; one canvas uses `getContext('2d')`. No GLB/GLTF references found. |
| Scrolling | Native `scroll-behavior: smooth`, with 76px anchor offset. Most reveals trigger once on entering view rather than scrubbing continuously with scroll. |
| Fonts | Self-hosted variable WOFF2: Archivo and Manrope, Latin subsets preloaded, `font-display: swap`. |
| Forms | Client JavaScript submits leads to a Supabase RPC. Submission and database configuration were not tested. |

These facts describe the public homepage capture. They do not establish the original authoring tool, complete backend, CMS, hosting provider, or build pipeline.

## Typography

| Role | Family and settings |
| --- | --- |
| Hero wordmark | Archivo 900, width/stretch 125%, uppercase, line-height .95, tracking -.04em. |
| Hero slogan | Archivo 900, width/stretch 125%, uppercase, line-height .9, tracking -.045em; alternating solid and outlined words. |
| Section headings | Archivo 880, width/stretch 120%, `clamp(34px, 4.6vw, 64px)`, line-height .94, tracking -.035em. |
| Body | Manrope, 17px / 1.6 on desktop. |
| Navigation | Manrope 700, 12.5px, uppercase, 2.5px letter spacing. |
| Main hero button | Manrope 800, 13.5px, uppercase, .16em letter spacing. |

Desktop computed styles at a 1280px viewport confirmed Archivo for visible display text: approximately 86.6px for the wordmark, 51.9px for the stacked hero slogan, and 58.9px for section headings. The semantic h1 is visually hidden; its computed Manrope style does not describe the visible slogan.

Archivo is declared at weights 500–900 and width 100–125%; Manrope at weights 400–800. The combination feels strong because of the expanded letterforms, size contrast, uppercase treatment, and short line lengths.

## Colour and composition

| Use | Colours |
| --- | --- |
| Main backgrounds | Warm charcoal `#1C1714`, near-black `#0E0A09`, raised brown `#221A16`. |
| Main text | Ivory `#FAF7F1`, with lower-opacity ivory for supporting copy. |
| Main accent | Burgundy `#7F011F`, hero disc `#680C20`, neon pink `#FF2A55`. |
| Secondary accents | Cyan `#19E3FF`, antique gold `#9C7630`, lighter gold `#C39A4A`. |

The hero uses three desktop zones: copy/HUD on the left, a dominant figure and circular backdrop in the middle, and stacked text/CTAs on the right. Later sections repeat a large heading plus short supporting paragraph above bordered visual panels. Thin rules, corner brackets, glow, and small uppercase labels connect the sections.

## Motion breakdown

| Element | Mechanism and timing |
| --- | --- |
| Opening curtain | Burgundy fullscreen overlay, circular logo reveal, underline growth, then upward clip-path wipe. Curtain starts lifting after 1.55s and takes 1s. Session storage suppresses it on subsequent visits within the same session. |
| Hero handoff | Video reaches 7s, then `.is-landed` starts the final composition. End/error/autoplay fallbacks also reveal it. |
| Hero backdrop | Circle clip-path contracts from beyond the screen to its final disc with a small overshoot, over 1.15s. |
| Character and copy | Mascot rises/scales in over 1s after a .75s delay; left/right copy slides from opposite sides over 1.05s after .9s. Supporting information and CTAs follow. |
| Atmosphere | Slow rotating dashed ring, moving scan band, periodic RGB text glitches, blinking cursor. |
| Pointer smoke | 58 soft gradient motes drawn in Canvas 2D; pointer repulsion; requestAnimationFrame loop and DPR capped at 2. Enabled only at desktop width and without reduced-motion preference. |
| Cards and section content | One-shot IntersectionObserver reveals: opacity and translation, usually .8–1.1s with approximately 90–140ms staggers. Common ease: `cubic-bezier(.22,.8,.2,1)`. |
| Small diagrams | SVG stroke drawing, chart fill, attendance blocks, progress bars, pins and ripple rings. These make cards explain the product rather than simply enter the screen. |
| Verification steps | Three states cycle every 1.5s while visible; timer pauses outside the viewport. |
| Athlete illustration | Record/read/next-step states hold for 4.2s, 3.2s, 4.6s; recording counter and progress bars change. Timers pause outside view. The script explicitly disables the older sticky/300svh presentation through `.d4-static`. |
| Orbit graphic | CSS rotating rings, counter-rotating labels, slow 70s/110s cycles; pauses on hover. |
| Marquee | Duplicated content translated to -50%, 40s linear loop. |
| Hover | Small card lifts, image changes, border/glow transitions. |
| FAQ | ARIA state drives a .55s CSS grid-row expansion and icon rotation. |
| Header | Transparent over the hero, then a blurred solid background with a .35s transition below it. |

Reduced-motion branches skip the intro/video choreography and disable many decorative loops. This was checked in source, not through a complete accessibility test.

## What to adapt for Golden Aura

1. **Use a consistent motion language.** Let the hero establish a visual motif that continues through subtle gold rules, borders, and short reveals. Animate a few meaningful elements per section rather than giving every heading an effect.
2. **Strengthen illustration inside compact cards.** Tournament cards could contain a restrained chessboard/path, event timeline, or prize detail reveal. Kicknex's animated diagrams are more useful as a reference than its continuous glitch layer.
3. **Use wide display typography selectively.** Archivo and Manrope are already available on Golden Aura's merged main branch. Short headings can use expanded Archivo; long tournament names need more generous leading and tracking because the client previously found the typography cramped.
4. **Retain the chess palette.** Charcoal, ivory, and champagne gold can produce the same depth and contrast. Burgundy/cyan glow, constant scanlines, and RGB glitch would materially change the trust's character.
5. **Keep useful content available during animation.** Kicknex's curtain plus video plus CTA reveal can create a long wait. Golden Aura's event/registration actions should remain reachable as the visual sequence plays.
6. **Use the existing stack.** Main already has Next.js/React, Motion and Lenis; the separate draft chess branch contains the live 3D work. Reference effects do not require another animation library or a framework switch. Decide the desired effect first, then use the existing appropriate tool.
7. **Bound decorative rendering.** Pause offscreen/hidden-tab loops and provide mobile/reduced-motion alternatives. The captured smoke code schedules frames continuously; it does not show an offscreen stop condition.
8. **Preserve replay expectations.** Golden Aura's requested homepage-reload replay differs from Kicknex's session-suppressed opening curtain. Do not adopt that storage behaviour by accident.

Suggested next design exercise: one compact section prototype pairing a wide but readable heading, an animated chess illustration, and photographic content. Review its visual direction before applying a new treatment to the whole homepage.

## Evidence and limits

- Live browser inspection: desktop hero, Platform, Verification, Athlete Development; computed font styles; one narrow 390 × 844 section/header view. A browser interruption prevented completing the mobile hero/menu interaction check. Browser inventory was empty afterward.
- Public HTML captured as text: 482,558 bytes. SHA-256: `522fef24c60af4266680bd541cba88801560eca0cded058493e48b91b910a6e8`.
- Extracted JavaScript: 2 files, 13,365 UTF-8 bytes total; REA parsed both without failure. Static analysis did not execute the scripts.
- Extracted stylesheet: 166,906 UTF-8 bytes. SHA-256: `a7b1bb80fdbf60e0c232ba7a69a295a70d009edddf48556d63855cfb57688c33`.
- REA retained analysis evidence: `ev_5cd315224a24fe42d8f7af0da7654d3892e456eb27e4751daeda8bcb91c52dc7`; summary: `ev_edb60bdb84bda2392948214402e802ab594e714e422c1dba32304fa877d4067a`.
- Session evidence export: `/tmp/kicknex-reference-evidence.json` (temporary, not committed). Source capture: `/tmp/kicknex-reference.html`; extracted CSS/JS: `/tmp/kicknex-reference-source/`.
- No forms were submitted, endpoints probed, or video/image assets downloaded. Physical-device performance, Lighthouse metrics, cross-browser behaviour, and original authoring/hosting tools remain unverified.

Golden Aura comparison uses local `origin/main` commit `8bd207719d88d29fb8d1391dea251ef3b74f7c57`, specifically its package manifest and root layout. This research does not change application code or reconcile the separate draft 3D branch with main.

# Partner and motion review — 15 October 2026

- Production build and TypeScript passed; all 16 unit tests passed.
- Existing HTTP checks passed against the isolated production preview on port 3002.
- Chromium desktop (1440 × 900) and narrow mobile (320 × 812): no page overflow.
- Home marquee: 19 source logos; duplicate group is inert and hidden from assistive technology. Pause stops the animation, and the running state was verified after navigation.
- Photo carousel: next and keyboard-operated direct controls work; final slide reports 03 / 03 and disables Next. Mobile controls fit within the content width.
- Partners: 11 combined official/corporate/institutional logos, 7 government/civic logos, 7 tournament-supporter logos. Both requested names absent. Source records and Home official logos retained.
- Home navigation returns to scroll position zero. No browser warnings or errors observed.
- CSS and the reveal controller respect reduced motion; system-level reduced-motion emulation and physical Safari devices were not tested.

The original partner categories remain available in Sanity. `partnerGroups` changes presentation on the Partners page without modifying source relationships or CMS records.

## Photo-stack revision

Replaced the horizontal photo rail with a layered five-photo gallery and thumbnail strip. Desktop uses an adjacent caption panel; mobile places captions and arrows below the image. Crossfades, directional movement, caption entrances and thumbnail lift use CSS and respect reduced motion.

Production build, TypeScript and 16 unit tests passed. Chromium checks at 1440 × 900 and 320 × 812 confirmed no horizontal page overflow, one active accessible slide, direct thumbnail selection, Next, Home/End keyboard boundaries and pointer drag from photo 3 to 4. These interactions included assert-based browser checks. Physical touch devices and Safari remain untested.

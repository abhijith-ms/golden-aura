# Interior-page visual review

2026-10-17. Scope: [tournament, Trust and committee contract](../../plans/interior-visual-polish.md). Visual changes only, reviewed in the production build through the Codex in-app browser.

## Presentation

- Tournament details use a title/image composition on desktop with natural title case and a smaller image on phone. Dates, venue and status share a quiet facts panel. The archive keeps its existing order; tablet cards put the image above the text so the longest venue label fits. Desktop/phone archive arrangements remain.
- The Trust uses a smaller framed emblem, framed community photograph and compact mission panels, with icons alongside titles.
- Committee introduction/emblem align left; complete support/organising-secretary messages use compact speaker cards and bounded desktop line length. Phone speaker cards are about 130px high. Actual members use ivory portrait frames, with six desktop/three tablet/two phone columns. D K Shivakumar remains solely in the support message, and Sowmya's message remains above the member groups.

## Rendered checks

- **16 page/viewport cases:** Trust, archive, 2025 event detail and committee, each at 1440x900, 834x1112, 390x844 and 320x740. Every case has one H1, fitting titles/body labels and no document horizontal overflow.
- Normalised main DOM text compared against the previous public preview matches in all 16 cases. The report records prior SHA-256 values and comparison outcomes. No names, roles, affiliations, paragraphs, messages, event data, actions or sources were changed.
- Desktop committee has all **24 profiles**. Its six core members fit in one row with 17px names/13px roles; all core portraits loaded. Every group anchor resolves and is 44px high. Phone cards preserve complete roles and affiliations. M Raju displays **MR**, with no fabricated portrait.
- The tablet archive check initially caught a venue label that did not fit the narrow side-by-side image/text cards. The final tablet-only vertical arrangement fixes it and aligns image/caption starts. The final 16-case review was repeated after this and typography adjustments.
- All reviewed assets retain stable image bounds. A few first-read lazy image observations occurred before decoding; the saved captures show loaded content. No deliberate image failures were injected.
- No console errors during these journeys. Typecheck, **41 existing tests**, and production build pass. Final CSS refinements were checked in the final production build, including its TypeScript step. No new logic or mirror tests were added for styling.

At 1440x900, local layout measurements were:

| Surface | Before | After |
| --- | ---: | ---: |
| Trust main content height | 1937.55px | 1854.52px |
| Archive main content height | 1534.69px | 1448.92px |
| 2025 event main content height | 4181.91px | 3809.91px |
| Committee main content height | 5399.39px | 3859.33px |
| 2025 event facts start | 1079.67px | 649.50px |
| Core committee section start | 1971.95px | 1448.30px |

The committee main area is about **28.5% shorter**, with identical text. These measurements describe one desktop layout, not device-wide scroll savings or performance benchmarks.

## Evidence and limits

`browser-results.json` contains the 16 cases, prior content hashes, layout measurements, initials/anchor checks and console observations. `evidence.json` is the design-direction record. `about-*`, `archive-*`, `event-*`, `committee-*` cover the final viewport matrix; profile/initials/mission captures cover the lower sections. `*-before-1440.jpg` captures the earlier preview.

These are browser viewport checks, not a real-device/Safari audit, native reduced-motion test, full screen-reader certification or 3D performance review. Empty/error fixtures, backend services and form submission were not exercised; their code is unchanged. No dependencies, assets, content, homepage/hero behavior, registration or payments were added. PR #5 remains draft; no production merge.

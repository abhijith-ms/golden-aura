# Deployed navigation and motion review

Reviewed 2026-10-17 on the public branch preview at commit `e41b5e3e3ccc7c2c477bc7639033b97a035a2f38`, using ECC Browser QA for a read-only browsing review. No UI or runtime changes were needed.

## Smoke and interaction checks

- All seven navbar destinations worked on desktop and mobile: Home, Trust, Committee, Events, Gallery, Partners and Contact. Each landed on the expected route and heading. The mobile drawer closed and restored body scrolling after navigation.
- Escape returned focus to Menu; forward Tab from Close menu reached Home. Shift+Tab from the first control left no DOM element focused in the in-app browser. Native-browser reverse wrapping was not established; no claim of a complete focus-trap or screen-reader audit is made.
- Returning Home after scrolling through the page settled at `scrollY=0` with the main/hero top at zero. The discovery anchor settled at 100px, below the 84px navbar bottom.
- In an 844x390 landscape viewport the drawer scrolled from its 390px viewport through 675px of content; the Contact link remained reachable and worked. Widening an open drawer to 1440px closed it and cleared the body scroll lock.
- Carousel End reached 5 of 5 and disabled Next. Home, two Right presses and Previous reached 2 of 5 after a rapid reversal. A phone thumbnail selection reached 5 of 5 with the corresponding caption. Existing directional transitions and photo layout remain unchanged.
- Keyboard focus paused the partner marquee. The three video elements retain native controls, `playsinline` and no enclosing outbound link. Playback/stream delivery was not exercised.
- No console errors were captured in the reviewed journeys. Route/heading checks establish navigation success; no complete network trace or new Web Vitals claim is made.

## Visual observations

Desktop 1440x900, tablet 834x1112 and phone 390x844 captures retain the accepted hero, compact copy/actions and floating navbar. The short landscape menu remains usable. Prior committed visual baselines remain in the homepage/interior/Gallery verification folders; this is a manual composition/interaction review, without a pixel-diff assertion.

`report.json` records the journeys and bounded observations. Screenshots cover the three Home sizes, mobile/landscape drawer and desktop/phone carousel. The DOM/geometry assertions and captures are evidence of those local browser states, not physical-device or field-performance certification.

## Limits and verdict

Reviewed browsing flows passed. **Overall launch verdict: INCONCLUSIVE**, pending the already deferred native browser/CSS reduced-motion changes and second-device/higher-DPR review. Full network inspection, axe, screen-reader checks, live enquiry delivery and new performance/resource measurements were outside this review. The prior 41-test/build verification remains unchanged because this turn modifies documentation only.

PR #5 stays draft. The next decision is client/teammate visual review of the preview, followed by the remaining device/preference checks; no production merge is authorised.

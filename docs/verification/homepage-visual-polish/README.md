# Players, feedback and partners: rendered review

2026-10-17. Visual-only scope: [design contract](../../plans/homepage-visual-polish.md). Reviewed the production build in the Codex in-app browser, using existing public content and media. No API, enquiry, CMS, registration, payment or hero changes.

## Changes

- Player-specific frames, consistent portrait inset/crop, compact portrait-corner title badges and aligned country labels. Desktop retains seven columns/two rows; narrower widths retain the existing two-row horizontal track. Name and country sizes remain 14px/11px in compact cards. Shared event attendee cards get the matching ivory treatment; generic committee cards are not restyled.
- Video and caption now form one quiet frame, with native 16:9 media bounds/controls and a small gold caption rule. Text quotes use light top dividers instead of filled panels.
- Partner marquee is one white ribbon with dividers. Its original timing, focus/hover pause and reduced-motion grid remain. Shared partner cards align logo boxes at their top, regardless of label length.

## Verification

- Typecheck, **41 existing tests**, and production build pass. Final review adjustments touched CSS only; the final build also completed its TypeScript check. No tests were added for these presentational changes.
- Screenshots reviewed at **1440x900, 834x1112, 390x844 and 320x740**. No document horizontal overflow; intended player/video/supporter tracks retain internal scrolling.
- All 14 homepage players remain in two rows at every reviewed width. Names and countries fit their cards, including the long names. All desktop portraits/flags loaded. At phone width, arrow-key input scrolled the player track 120px.
- The player section shrank from **828.53px to 795.81px** at 1440px. The partner section shrank from **391.30px to 362.80px**. Feedback is essentially the same height, **574.67px to 576.09px**. These are local layout measurements, not loading/performance benchmarks.
- All three feedback videos retain their original posters, inline attribute and native controls at exactly 16:9. The mobile track responds to arrow-key scrolling. Playback was not retested; the media sources/behavior are unchanged.
- Keyboard focus inside the logo region pauses its track. The duplicate group stays inert and hidden from accessibility. Visible logos loaded; some distant offscreen logos remained lazily unloaded, which is expected. All seven desktop chess-body logo boxes share the same top coordinate.
- Shared partner grids reviewed at 834px/390px and checked for overflow at 320px. Labels fit. Current data has no name-only partners; the existing text-only class is retained and source-reviewed.
- Tournament attendee cards reviewed on the 2024 detail page at 390px. The existing mobile collapsed row shows two attendees; See more expands to all 14 with names/countries fitting and no document overflow.
- No console errors during these local browser journeys. No public content or forms were submitted.

## Evidence and limits

`browser-results.json` records read-only DOM observations and assertions. `evidence.json` records the design checks. `players-before-1440.jpg` and `feedback-before-1440.jpg` capture the prior preview; the other images show this pass. Desktop, tablet, phone and narrow player captures cover every target; additional feedback/partner/event captures cover the shared surfaces.

This is a visual viewport review, not a real-phone/Safari audit, playback/network-error test, full accessibility certification or new 3D performance sign-off. Initials, empty data and image failures were not injected; the existing branches are unchanged. Reduced-motion CSS and existing observer tests were reviewed; native preference changes and second-device/higher-DPR hero checks remain pending with the teammate. PR #5 remains draft, with no production merge.

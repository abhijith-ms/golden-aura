# Players, feedback and partners: visual polish

Authorised 2026-10-17. The user explicitly limited this phase to visual changes, then approved the player/feedback/partner pass.

## Design contract

- Purpose: scan all 14 first-edition players, recognise their title/country, watch the existing participant videos and recognise the tournament's supporters.
- Tone: restrained editorial presentation matching the accepted charcoal, ivory and champagne-gold homepage. Use existing portraits, flags, posters, logos, typography and component patterns.
- Reference observations: the current player section shows seven portraits per row on desktop, but title/country metadata has little hierarchy. Video names sit outside the media treatment. The partner marquee repeats individually outlined cards. Group these surfaces more deliberately without adding copy or new controls.
- Players: keep all 14 and two desktop rows, plus the existing two-row horizontal layout at narrower widths. Add a subtle frame, consistent image inset, compact name panel and aligned flag/country. Place the compact card's title badge in the portrait corner to preserve readable 14px names and 11px country labels at narrow widths. Keep natural portrait colour and a very small fine-pointer image zoom. Retain readable long names and initials fallback. Apply the shared player treatment to tournament attendees; do not restyle committee cards through generic selectors.
- Feedback: retain all three inline videos, 16:9 bounds, native controls and posters. Give each video/caption a single quiet frame, align names/details and lighten the treatment of the two text quotes. Preserve mobile horizontal browsing.
- Partners: make the marquee read as one compact white logo ribbon with dividers. Keep original logo colours and labels, existing animation timing, hover/focus pause and reduced-motion grid. Refine the shared partner grid's image/label alignment, including the partners page and chess-body supporters.
- No additional sections, content changes, assets, dependencies, event handlers, business logic, APIs, form work, registration or payments. The hero and previous gallery/card choreography stay unchanged.
- Target review widths: 1440x900, 834x1112, 390x844 and 320x740. No document overflow; player rows, video track and logo ribbon may retain their intended internal overflow. No increase in the player section's desktop height.
- Accessibility: preserve title abbreviations and country text, video labels/controls, region/list labels, current focus outlines and reduced-motion behavior. Static cards must not gain fake button semantics or new focus stops. Existing mobile scroll regions stay keyboard-scrollable.

## States and scope

Touches `PlayerGallery`, `ParticipantFeedback`, homepage player-heading markup and shared module CSS; existing `CountryName`, `PartnerLogos`, marquee and native video controls are reused. No new loading/error/permission state is introduced. Existing fixed image/video bounds, initials fallback, name-only partners, empty-data guards and attendee expansion remain. Verify current loaded content through browser rendering; keep limitations explicit for source-reviewed fallbacks and unrendered image/media failures.

Run typecheck, existing tests and a production build sequentially. Review loaded portraits/flags/posters/logos at the target widths, long-name fit, two desktop rows, attendee expansion, native video appearance, marquee focus pause and partners-page consistency. The current partner data has no name-only entries; source-review that unchanged fallback rather than adding test data to the public site. Save screenshots and the design evidence record. Keep PR #5 draft and update only its review deployment; no production merge.

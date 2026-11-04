# Inner-page motion verification

Date: 4 November 2026. Branch: `codex/inner-page-motion`, based on image-loading PR #7 (`8652f0e`). The original 3D checkout is preserved.

## Delivered

- Explicit reveal targets/groups replace the broad section-wide blur. Entrances remain readable, play once, have bounded delays and finish on focus, preference changes or route cleanup. Local gallery/player controllers own their own dynamic nodes.
- Trust and event photographs use fixed frames, gold corners and loaded-image-only desktop parallax. Coarse/narrow screens retain the same crop without scroll drift.
- Committee messages/rows, archive cards, partner rows and contact methods receive coordinated entrances. Committee group links have an active location indicator.
- Shared intro rules, event fact separators, keyboard card feedback, chart-tab underlines and confirmed form feedback carry the same visual language.
- Gallery filters update immediately; only visible rows animate. The native viewer preserves the loaded thumbnail while decoding the larger photo, provides retry, and cancels obsolete work on close/unmount.
- Native menu/dialog semantics remain. Drawer navigation focuses the destination main landmark; ordinary dismissal restores the trigger. Lenis responds to live reduced-motion preference changes. Home still targets the body-level `#top`.

## Checks

- `npm test`: 29 passing tests. New reveal-controller coverage verifies bounded delay, local ownership, no repeated entry, focus completion, reduced-motion cancellation and cleanup.
- `npm run typecheck`: passed. The initially incomplete local Next installation was restored from the exact official `next@16.4.3` package, without changing the lockfile/dependency versions.
- `npm run build`: passed, including TypeScript and generation of all 15 static routes.
- `node tests/http.mjs http://localhost:3100`: passed against the production build, including routes, metadata, event actions, security headers and API boundaries.
- Rendered browser checks: Trust and Gallery on desktop; Trust, Events, event detail and Gallery at 390px; Committee, Partners, Contact and Privacy at 390px; Gallery/Partners/Contact/Committee at 320px; event detail at 834px; Trust at 1440px. Checked pages had no document horizontal overflow.
- Committee `#core-committee` settled about 116px below the viewport top, clear of the floating header, and selected the matching group indicator.
- Home from an event detail settled at `/` + `#top`, `scrollY=0`. Back from a committee visit restored the Trust's scrolled position (`scrollY=1612`, closing committee link within the viewport).
- Mobile drawer route selection was checked after the focus correction: Gallery's main landmark received focus, and the destination started at the top.
- Rapid Gallery selections (Coffee → 2024 → Coffee) resolved to the final pressed filter and four matching photographs.
- Native viewer: open, enlarged image, Escape, close-button dismissal, thumbnail focus restoration and body scroll restoration checked. A local fixture held the full image, then failed another full image once; the preview stayed visible, failure offered retry, and retry reached the decoded full image. Closing while the full image was held left the gallery usable.

Fixture reproduction, using a running local app:

```sh
node tests/fixtures/image-loading/server.mjs http://127.0.0.1:3100 3101 viewer
# Open http://localhost:3101/gallery, select Chess & Coffee.
# Open the community-gathering player: the q=95 image is held.
# Close the viewer while loading, then release through the fixture endpoint:
curl --request POST http://localhost:3101/__qa/release
# Open the Coffee community photograph: the first q=95 response fails.
# Click Try again, then run:
node tests/fixtures/image-loading/check.mjs http://localhost:3101 viewer
```

The fixture's original homepage mode is unchanged when the `viewer` argument is omitted. `viewer-requests.json` records the held/released request and 503 → 200 retry sequence. The raw logo request used by page metadata is expected; no duplicate raw photograph was requested.

## Evidence and remaining checks

- `trust-desktop.jpg`, `trust-mobile.jpg`: settled photographic layout.
- `events-mobile.jpg`, `event-tablet.jpg`, `committee-narrow.jpg`, `gallery-mobile.jpg`: responsive framing.
- `viewer-loading.jpg`, `viewer-failure.jpg`, `viewer-recovered.jpg`: readiness and recovery states.

These are still captures, not frame-rate measurements or a client animation sign-off. Native OS reduced-motion changes were checked through unit/source paths rather than browser preference emulation. Physical-phone touch/performance, Safari behaviour, controlled LCP/CLS comparisons and live SMTP success/error animation remain unverified. No real enquiry was submitted. No new models, videos or image assets were added.

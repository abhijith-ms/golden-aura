# Inner-page animation and effects plan

Date: 4 November 2026. Status: implemented on `codex/inner-page-motion`; visual review pending.

## Basis and direction

Extend the current homepage's dark surfaces, gold accents, photographic depth and deliberate sequencing through the public inner pages. Keep the current typography, content, compact layouts and navigation. Each page gets one recognisable visual moment, supported by quick interaction feedback. Most of a page should be still once it has arrived, so people can read and act comfortably.

This plan covers The Trust, Committee, Events, individual events, Gallery, Partners, Contact and Privacy, plus their shared navigation and closing contact banner. It does not redesign the homepage, registration/payment flows, CMS or administrative Studio.

Source reviewed: `origin/main` at `8bd2077` and image-loading branch `codex/image-loading-fixes` at `8652f0e`. PR #7 remains open on the review date. The Trust and Gallery were also inspected in that branch's browser preview. The original checkout is on an older, separately developed 3D branch: implement against refreshed main, preserving the image-loading fixes, rather than using that checkout's older components as the baseline. Historical ivory/GSAP plans describe an earlier direction; this proposal uses the current merged dark design and Motion stack.

## Shared visual language

- **Arrival:** a compact heading sequence—small label, whole heading lines, then supporting detail. Keep copy readable in the server-rendered state; initialise enhancements without a visible flash or a new waiting period. Do not animate long tournament names letter by letter.
- **Connection:** thin gold rules grow along existing section edges. Their geometry can suggest a move across a chessboard, contained inside existing whitespace. They never cross text or imply new factual relationships between organisations.
- **Depth:** photographs move slightly inside their fixed frames; outer frames and inner images have separate transform owners. Ambient light is a static gradient with a short opacity change, rather than a constantly moving blur.
- **Response:** buttons, image links, filters and tabs respond promptly. Use the same border, underline and arrow language everywhere. Passive portraits and logos should not behave like clickable controls.
- **Rhythm:** one signature sequence per page, smaller entrances elsewhere. No added full-height scenes, pinned sections, scroll snapping or stretched cards. Preserve the compactness requested in previous reviews.

Starting values for a prototype, subject to visual review:

| Motion | Starting range |
| --- | --- |
| Hover, focus and pressed feedback | 140–180ms; arrow travel 2px; clickable card lift at most 3px |
| Filter/tab change | 180–280ms, with selection state updated immediately |
| Content entrance | 350–500ms; travel 8–16px; no section-wide blur |
| Short group stagger | 40–60ms between visible items; total delay capped at 160ms |
| Signature decorative line/frame | 600–800ms, independent of content availability |
| Desktop photograph parallax | At most ±12px within an overscanned crop |

Use the homepage's established ease-out family. Put chosen values in one small shared token source when implementing, consumed by Motion and the existing reveal controller. One gentle spring is sufficient for direct interaction; avoid bouncy reading surfaces.

## Page storyboards

### The Trust — a framed story with depth

Current surfaces: `AboutPage`, `.trustIntro`, `.aboutStory`, `.missionGrid` and the closing community invitation.

1. The introduction and emblem arrive as a coordinated composition. The official emblem remains upright and still; a gold rule beside it completes the frame.
2. As the story photograph enters, a gold corner line draws around part of its existing frame. On a capable desktop the photograph drifts by a few pixels inside that frame while the adjacent narrative stays stationary. Start this only after the image is available.
3. The four mission panels enter by visible row. Their existing icons receive a single short accent, followed by a gold divider connecting the row visually. Descriptions remain normal readable text.
4. The community invitation gets a quiet closing rule; its committee link uses the shared arrow response.

**Signature:** the framed photograph and gold line feel connected to the homepage's lighting and depth. This requires no new photograph or model. On mobile, use a short frame entrance without scroll parallax.

### Committee — an editorial portrait presentation

Current surfaces: `.whoWeAreHero`, two `.leadershipRow` messages, `.committeeNav` and `.peopleGrid`.

1. Introduce the committee identity like a letterhead: title, emblem and description in two short beats.
2. Bring each speaker portrait and associated message into view together. A gold quotation rule draws once; complete message paragraphs remain still and readable. Preserve D K Shivakumar's **Message of support** and Sowmya's organising-secretary message as separate from committee membership.
3. Add a restrained active indicator to the existing group navigation. Clicking a group still navigates directly to its anchor; scrolling may update `aria-current="location"` without moving focus or rewriting browser history.
4. Member cards enter only when their own row approaches the viewport. The row finishes quickly, then all names, roles, affiliations and initials remain clear. Keep the M Raju initials fallback.

**Signature:** coordinated portrait/message compositions and an understated gold group marker. Avoid face tilt, animated signatures, portrait carousels or long stagger chains. On mobile, use the same reading order with shorter, vertical entrances.

### Events — an archive that opens in rows

Current surfaces: `EventsPage`, `PageIntro`, archive label and shared `EventCard`.

1. Introduce the page and draw the archive divider beneath its label.
2. Existing cards settle in pairs on desktop, one at a time on narrow screens. The edition badge receives a short accent after its card frame arrives.
3. Extend the existing image zoom/card lift to keyboard `:focus-within`, with a small arrow movement and border highlight. Keep titles, dates, venues, prize information and event actions visible throughout.
4. Preserve event ordering and upcoming/completed/cancelled behaviour. Do not add a tall timeline or introduce filters as part of this visual pass.

**Signature:** edition markers and the gold archive rule provide structure without increasing scrolling.

### Individual event — a photographic tournament dossier

Current surfaces: `events/[slug]/page.tsx`, `.eventDetailHero`, `.eventOverviewCol`, `.detailPanel`, `TournamentInfographic` and `PlayerGallery`.

1. Keep the heading, summary and event action immediately usable. Once loaded, the hero photograph settles gently from about 1.025 scale to its final crop. Optional desktop-only ±12px drift stays inside the current frame.
2. Draw fine separators through the existing date, venue, prize and status facts. Values stay exact and visible; cash prizes must not count up through misleading intermediate amounts.
3. The edition details receive a short opposing entrance, then remain still. Support all event types, including community gatherings without an infographic or attendees.
4. Retain the infographic's existing chart-drawing sequences. Improve its active-tab indicator and panel change rather than replaying another entrance over the charts. Labels and totals stay readable during the transition.
5. Attendee portraits use the same short row entrance as the Committee. Names and flags have no scroll-progress opacity/blur. Expanding/collapsing the player list must preserve focus and respect reduced motion.

**Signature:** loaded photograph depth, a precise facts panel and the existing animated impact graphics. The page should help visitors identify an edition quickly, including on direct `#attendees` navigation.

### Gallery — an animated contact sheet and polished viewer

Current surfaces: `Gallery`, existing album filter buttons, `.albumHeading`, `.galleryGrid` and native `<dialog>` viewer.

1. Give the selected album a smooth gold selection treatment. Within a filter row the indicator can slide; when controls wrap, use a short crossfade to avoid a long diagonal flight.
2. On first entry, the visible photo row settles with tiny differences in timing. Keep the present grid and image aspect ratios; no masonry rebuild or endless autoplay is needed.
3. On filter selection, update the pressed state/count promptly. Use a short outgoing/incoming transition and animate positions only for surviving visible items where useful. Do not animate the whole gallery height, clone all albums or queue obsolete filter choices. Rapid input always resolves to the latest selection.
4. Image links get a restrained zoom and arrow response on hover/focus. Captions remain stable.
5. The native viewer opens with a 180–220ms backdrop fade and a small frame settle. Keep its close control and caption available immediately. Reuse an already loaded thumbnail as a temporary preview where available, then crossfade to the larger decoded image. If loading fails, preserve the preview and show a clear retry/error state. Do not replace the usable picture with an empty black frame.
6. Close with a short coordinated fade before removing selected content. Escape, backdrop click, focus containment, focus return and dialog top-layer behaviour remain native. Reopening or closing during loading must ignore stale load callbacks.

**Signature:** a responsive photographic contact sheet and an elegant viewer. Follow the load/decode readiness semantics already fixed in the homepage's `CommunityMomentsSection`; do not replace that working homepage implementation during this task.

### Partners — a composed wall of support

Current surfaces: category sections from `partnerGroups`, `PartnerLogos`, opportunity cards and the partnership enquiry area.

1. Introduce each category heading with a thin gold line and a short visible-row entrance for logos. Logos then remain stationary and fully legible.
2. A small line detail connects category framing to the partnership invitation below. Keep organisations in their actual existing categories; no invented network diagram or hierarchy.
3. Opportunity cards receive a restrained border response. They do not acquire a fake click action or “Explore” label.
4. Reveal the partnership narrative and form frame together. The form then stays still while a visitor reads, types or submits. Replace perpetual decorative pulse/shimmer with a single accent or pause it outside view and in hidden tabs if retained.

**Signature:** repeated category framing makes a long supporter list feel intentional. Preserve the homepage marquee separately; the inner page remains the easy place to inspect every supporter.

### Contact — a calm, responsive conversation

Current surfaces: four contact-method cards and the shared `EnquiryForm`, also used on Partners.

1. Contact-method icons enter in a short sequence while the form frame receives one gold-edge accent. All labels and fields are available together.
2. Focus highlights a field's existing border/icon within 180ms. Do not float labels away, move controls toward the pointer or animate fields independently.
3. Sending, success and error feedback animate only when the existing submission status actually changes. A short checkmark accent follows confirmed success. Keep the current validation, consent, entered data on failure, feedback focus and live-region announcements.

**Signature:** precise feedback and an inviting form, with movement stopping as soon as someone starts interacting. No new map embed, network request or form/backend behaviour is required.

### Privacy and system pages

Privacy uses the shared compact introduction and an optional short heading rule. Its paragraphs remain fully readable. Error/not-found pages retain immediate recovery actions with at most the same brief introduction. Studio is excluded from the animation pass.

## Shared implementation and navigation

- Reuse installed `motion/react`, CSS and the existing Lenis instance. Motion supplies the interactive transitions and bounded parallax; the existing `ScrollReveals` controller can handle simple static page/group entrances. No additional animation dependency is necessary.
- Replace the controller's broad `main > section` targeting with explicit ownership for upgraded regions. It currently applies a 700ms translation/blur to entire sections, including regions with their own animations. Do not stack that pass over new motion, charts or existing homepage sequences. Remove responsive mount-time `arrive` animations from people rows when the new row entrance owns them.
- Keep server page components and data fetching intact. Add small client islands only where state, observation or pointer input is needed; do not turn all of `content-pages.tsx` or the root layout into a client animation tree.
- Separate transforms for entrance, crop/parallax and hover where two are actually required. Use motion values rather than React state for continuous position updates. Animate transforms/opacity; reveal lines with scale or SVG stroke rather than changing layout dimensions.
- Use a short **incoming introduction** on route changes. Keep the header persistent and new-page content reachable immediately. Do not put the App Router inside an exit-wait curtain that delays navigation or clears the page.
- Preserve Next/browser scroll restoration on Back/Forward. Do not unconditionally scroll to zero on every pathname change. Home must still land at `#top` without the section anchor offset; committee/mission/attendee anchors must clear the floating header. Choose one owner for same-page anchor smoothing after testing Next Link plus Lenis; do not subtract the header offset twice.
- Normalise the footer home link to the same client navigation pattern as the header during the shared pass. Keep native links, new-tab behaviour and browser history intact.
- Keep the current menu's native dialog semantics. If refining its motion, retain its side entrance, immediate dismissal, focus restoration and scroll isolation. Do not delay route navigation until the drawer's animation completes.
- Reserve the inner-page header's layout footprint while it condenses. Dismissing the menu returns focus to its trigger; following a menu link respects destination focus instead of forcing focus back to the old trigger.
- Give the existing closing contact banner one short divider/frame entrance and shared button feedback. Keep its present dimensions; the footer remains a stable destination.

## Image, accessibility and performance contract

- Keep correct responsive `sizes`, bounded image containers and lazy loading below the fold. Do not preload whole albums, duplicate original photographs in CSS backgrounds or give every inner-page image `priority`.
- Image readiness controls image transitions, not whether headings, names, contact details or actions can be used. A slow network must never leave the whole page hidden behind an entrance.
- One-time content entrances do not replay when scrolling a few pixels backward. Direct hashes and restored pages skip obstructive introductions. Focus entering a region finishes any entrance immediately.
- For touch/coarse pointers: native vertical scrolling, no hover-dependent information, no pointer tilt, reduced image movement and shorter transitions. Do not increase Lenis smoothing to make effects feel more cinematic.
- Reduced motion: final content and decorative lines immediately visible; disable transforms, parallax and loops. Any optional opacity fade is at most 200ms. Handle preference changes during the visit, including both the existing Lenis lifecycle and CSS animations; `MotionConfig` alone does not cover arbitrary CSS.
- No new continuous decorative loops by default. Any retained loop pauses offscreen and when the document is hidden. Keep cropped images from exposing edges, and avoid large animated blur/filter surfaces.
- Native dialog focus/Escape/close behaviour, at least 44px controls, meaningful alt text, complete headings and visible focus rings are requirements. Long messages and legal copy stay unsplit in the accessible reading tree.

## Delivery order and review

1. **Foundation plus two pilots:** agree tokens/ownership, then prototype The Trust's photo/line composition and one event detail. These establish narrative and information-heavy motion without touching every page at once. Capture a short scroll recording and still frames.
2. **People and archive:** apply the accepted rhythm to Committee, Events and attendee rows. Check long names/titles and anchor navigation. Keep logical page-sized commits.
3. **Gallery interactions:** implement filters and the viewer separately, including load/decode/error/close races. This is the most stateful part of the pass and merits its own commit and focused tests.
4. **Partners and Contact:** add category framing and shared form feedback, then finish Privacy, shared navigation and the closing banner. Review both callers of `EnquiryForm`.
5. **Combined validation:** inspect 1440×900, 1024×768, 834×1112, 390×844 and 320×740, plus a short landscape viewport. Check section heights/overflow against baseline, rapid forward/reverse scroll, keyboard/touch controls, Home, direct hashes, Back/Forward and live reduced-motion changes. Test slow/failed images and rapid filter/open/close actions. Mock enquiry outcomes locally; do not send real test enquiries.

Run typecheck, existing tests and the production build for implementation. Add focused checks for new stateful gallery or navigation logic, rather than tests that merely assert animation constants. Compare network requests, transferred image bytes, layout shift and responsiveness before/after on representative inner pages. Check that hidden/offscreen pages do no decorative work and navigation leaves no observers, listeners or animation frames behind. Actual phone performance and final pacing require prototype testing; this document does not claim measured results.

## References and scope limits

- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations): viewport-triggered entrances and scroll-linked motion are both available in the installed animation family. Our specific choreography is a project proposal, not a library guarantee.
- [Next Link documentation](https://nextjs.org/docs/app/api-reference/components/link): preserve framework navigation, hash and scroll behaviour while adding local animation.
- [Saved Kicknex audit](../research/kicknex-reference-audit.md): adapt coherent sequencing and animated detail inside compact sections to the current chess design.
- ECC guidance consulted: motion foundations, motion patterns and advanced motion. This plan uses existing project primitives and progressive enhancement rather than adding every pattern described by those skills.

No new WebGL scenes, models, videos, fonts or paid assets are required for this pass. Photographic depth, line drawing and responsive interaction provide the visual continuity. Separate live-3D hero plans remain separate. Implementation uses targeted WAAPI entrances and Motion photo depth. Gallery filter selection updates immediately, with visible-row entrances rather than a delayed whole-grid exit. This keeps rapid input responsive and avoids animating a large photo subtree. Verification is recorded in `docs/verification/inner-page-motion/README.md`.

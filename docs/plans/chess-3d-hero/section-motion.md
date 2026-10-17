# Tournament and photograph motion

Authorised on 2026-10-17 after the user deferred the teammate's remaining hero device checks and asked to move to the next item.

## Contract

- Surface: homepage tournament discovery and community photograph stack; shared tournament cards and gallery lightbox receive matching interaction polish.
- Job: scan the two international editions, open an event, and explore real community photographs. Links, dates, captions and controls stay immediately usable.
- Direction: restrained editorial movement using the existing ivory/charcoal/gold design. The accepted queen arrival remains the main visual moment.
- Local references: Astra's revised plan calls for compact staggered tournament cards and photographs settling into the existing stack. The current carousel already has directional crossfades, swipe/keyboard controls and thumbnails; preserve that structure.
- One-time short stagger on the two card and photograph groups below the fold, rather than animating both their section and children. No additional page height, pinning, autoplay, global scroll scheduler or new dependency.
- Directional photograph reveal with a receding outgoing frame. Retain rapid input, endpoint buttons, Home/End/arrow keys, vertical touch scrolling and current-photo announcements.
- Shared cards respond to keyboard focus as well as fine-pointer hover. Gallery enlargement gains a short opening transition; Escape and native dialog focus restoration remain intact.
- Reduced motion: content remains visible, entrance observers do not start, active entrances cancel on preference changes, and CSS movement is disabled. Focus cancels entrance effects on the focused card/control.
- Targets: 1440x900 desktop and 390x844 phone; also check the 320px narrow layout. Preserve existing card sizes and compact carousel height.

## Scope and states

Touches the existing reveal setup/caller, homepage group markers, carousel selection state, shared CSS, focused reveal tests, and verification evidence. No hero engine, asset, API, CMS, registration, or payment changes.

Loading uses existing fixed image bounds/backgrounds; the previous frame stays beneath the incoming photograph. Empty carousel/albums retain their existing messages. Broken images retain alt text and navigation. Partial photo sets must still render and single-photo controls stay absent. Success is an updated image/caption/thumbnail or opened event/dialog. Permission state does not apply to browsing this public content. JavaScript failure leaves the server-rendered content visible. Browser checks and their limits will be recorded separately.

The remaining native-preference and second-device hero checks stay pending; this work does not establish production sign-off for PR #5.

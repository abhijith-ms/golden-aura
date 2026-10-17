# Tournament, Trust and committee visual pass

Authorised 2026-10-17 after the homepage visual review. The user wants visual changes only.

## Contract

- Continue the existing ivory/charcoal/champagne design and approved Archivo/DM Sans type. Purpose: scan an event's identity/dates/venue, understand the Trust, and recognise committee members and their roles.
- Local observations: the 2025 detail's dates start at about 1080px on desktop, beneath a large uppercase title and 460px photograph. The committee's centred introduction/emblem and large message portraits put its core profiles about 1972px down. The Trust uses a large standalone emblem and vertically stacked mission icons. Improve this hierarchy without removing or rewriting content.
- Tournament details: put title/description beside the existing photograph on desktop; use natural title case, a smaller image on mobile, and quiet bordered facts alongside the existing edition details. Keep all event actions, archive content, rules, infographic, attendees and status logic intact.
- Tournament archive: match the interior heading scale and compact gaps while retaining the existing ordering and cards. At tablet widths (761–1100px), put each image above its card text so venue labels fit without splitting words; desktop and phone arrangements stay as before.
- Trust: smaller framed emblem, framed community photograph, readable story and compact mission panels with an icon beside each title. Keep all paragraphs, affiliations, mission/closing copy and links.
- Committee: left-aligned introduction with a smaller emblem, lighter message rows and compact speaker portraits. Limit desktop message line length for readability. At phone widths, speaker photo and identity share one row above each complete message. Preserve both messages in their current order and keep them separate from membership. Frame the actual member profiles consistently with the homepage players; six desktop columns fit the six core members in one row, with three tablet/two phone columns. Retain the M Raju initials fallback, names, roles, affiliations, groups and anchor navigation.
- Scope: presentational wrappers/classes in `content-pages.tsx`, event detail markup/image sizes, and shared module CSS. No data, new handlers, backend, forms, CMS, media sources, assets, dependencies, header, homepage or 3D engine changes.
- Targets: 1440x900 desktop, 834x1112 tablet, 390x844 phone and 320x740 narrow. No document overflow, clipped names or hidden paragraph content. Existing image bounds remain stable. Desktop event facts and committee profiles should start earlier; do not create extra scrolling or pinned motion.
- Accessibility: preserve the single H1 per page, semantic headings, native links/labels, all image alt text and at least 44px group anchors. Passive profiles/emblems remain noninteractive. Existing reduced-motion CSS remains authoritative.

## States and verification

No new async, permission or error states are introduced. Fixed image/portrait bounds and existing empty/failure handling stay in place. Review populated content plus the actual committee member without a portrait. Source-review unchanged empty/error branches; do not inject public fixtures.

Capture prior main text and compare normalised DOM text after the style changes, then review desktop/tablet/phone layouts, long titles, complete message paragraphs, group anchors, initials and event attendees. Run typecheck, existing tests and production build sequentially. Save rendered screenshots and the design evidence record. Commit logical changes and verify GitHub account `abhijith-ms` before pushing to draft PR #5. Review preview only; no production merge or new 3D sign-off.

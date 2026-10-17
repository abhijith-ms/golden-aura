# Golden Aura Trust

Next.js website with Sanity editing, curated event galleries, and a server-side enquiry form. This branch experiments with a cinematic desktop Three.js opening: a wooden queen passes through the bottom-left foreground and recedes onto the board, followed by a knight hop and camera arc. Scroll adds layered parallax, and other devices retain matching static opening artwork. It uses self-hosted Manrope headings and DM Sans body text. Manrope uses its bundled SIL Open Font License in `src/app/fonts/OFL.txt`. Registration and payments are later phases.

The [3D hero handoff and selected knight model](docs/plans/chess-3d-hero/README.md) preserve current decisions and both [Astra's original plan](docs/plans/chess-3d-hero/astra-plan.md) and [revised motion brief](docs/plans/chess-3d-hero/astra-revised-motion-plan.md). Read these before resuming the 3D phase. Three.js/Fiber own the scene; GSAP/ScrollTrigger coordinate hero-to-introduction motion. Lenis provides a light desktop wheel-smoothing trial.

## Local development

Use Node.js 24 (minimum 22.12).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Without a Sanity project ID, the site displays the bundled draft content. An unconfigured mailbox returns a delivery error and visitors can use the visible telephone/email links.

```bash
npm run typecheck
npm test
npm run build
npm start
```

## Connect the Trust's CMS

1. Create a Sanity project and `production` dataset under the Trust's account. Keep the dataset public for published website content; never store player records or enquiry messages there.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`. Create a temporary write token and set it as `SANITY_WRITE_TOKEN` (server-only).
3. Run `npm run seed:cms`. The import uploads the selected web images and creates settings, page introductions, events, albums, and affiliations. Existing documents are preserved. Remove/revoke the write token when finished.
4. Allow the website and local development origins in Sanity's CORS settings, with credentials allowed for the authenticated Studio. Invite the Trust's editors. Visit `/studio` and sign in to Sanity.
5. Create a Sanity webhook for create/update/delete of published `siteSettings`, `page`, `event`, `album`, `partner`, and `committeeMember` documents. Use `!(_id in path("drafts.**")) && _type in ["siteSettings", "page", "event", "album", "partner", "committeeMember"]` as the filter and `{ "_type": _type }` as the projection. Target `https://TRUST-DOMAIN/api/revalidate` and use the same secret as `SANITY_WEBHOOK_SECRET`.
6. Publish a change and confirm it appears publicly. Content is also refreshed every five minutes. Cached published data can continue serving when a refresh fails; an unavailable first fetch displays the error page.

The editor controls the homepage introduction, focus areas, organisation details, team, page introductions, events, gallery albums, and affiliations. The `2025 organising committee` documents also control the archived committee names, roles, groups, order and portraits. Leave a portrait empty to show initials. Event URLs should stay stable after publication. Mark past/cancelled events correctly and enable registration only with a confirmed HTTPS link.

## Enquiry delivery

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `ENQUIRY_TO`. The sender must be authorised for the mailbox. Port 465 uses implicit TLS; port 587 requires STARTTLS. Keep these settings in the hosting environment, never in source control. Send a real enquiry and check receipt in the Trust's mailbox before launch.

The endpoint validates origin, field lengths, topic, and consent; uses a honeypot and per-process quotas; and reports success only after SMTP accepts the message. It sends plain text, preserves inputs on errors, and does not log message contents. Use shared rate-limit storage before deploying multiple server workers.

## Assets

Originals remain in `refernce and guide/` and are ignored by Git. `scripts/assets.json` records the source and description of each selected asset. `public/images/` contains resized, orientation-corrected WebP copies without EXIF metadata. Next.js serves responsive sizes.

```bash
# Requires Python with Pillow; the Codex bundled Python runtime already includes it.
python3 scripts/prepare-assets.py
```

The sources include the 2024/2025 international editions, Karnataka amateur championship, Chess & Coffee, and the 2025 press launch. Only JPEG/PNG originals selected for this release are converted; HEIC files and videos remain archived. Logo permissions and photo publication permission were confirmed by the client.

Committee profiles come from the [original 2025 organising committee](https://nammabigchess.com/organizing-comittee/). Imported originals stay in the ignored `refernce and guide/website-import/` directory, with source URLs recorded in `scripts/assets.json`. Portraits are limited to 600 pixels and have EXIF metadata removed. M Raju has initials because the original page supplies a generic placeholder, as agreed with the client.

D K Shivakumar is shown only in a separate, dated message of support, as clarified by the client. He is excluded from the committee dataset. The Trust overview, four mission pillars and invitation come from the [original Trust page](https://nammabigchess.com/golden-aura/). Their copy is editable through the About page document; the message uses the `support-message` page document.

The [original tournament homepage](https://nammabigchess.com/) lists WestBridge Capital, Akshayakalpa Organic and Mysore Sandal Soap as official partners of the 2025 edition. These are labelled separately from KSCA/BUDCA community affiliations. Set the partner category in Sanity and retain the edition year in the relationship label.

Page 25 of the supplied `Golden_Aura_Trust_Impact_Assesment_Report (14).pdf` adds nine corporate/institutional partners and seven government/civic supporters. Together with the three official partners, all 19 report organisations are represented. The original hero also supplies FIDE, AICF, Government of Karnataka, Sports Authority of India and the Department of Youth Empowerment & Sports. Karnataka Olympic Association is acknowledged by name in the original overview; no emblem is assigned because the supplied yellow emblem belongs to the Youth and Sports Department. The Partners page combines official and corporate/institutional partners in one logo grid, keeps government/civic supporters separate, and groups the chess bodies with tournament supporters. Per the October review, Mysore Sandal Soap and Karnataka Olympic Association are omitted from that page; the source records remain intact. Home displays all 19 official, corporate/institutional and government/civic logos in a pausable marquee, alongside the separate chess-body strip. Original and extracted logo sources are recorded in `scripts/assets.json` and the new web copies total about 391 KiB.

The initial import preserves existing documents. For an already seeded Sanity dataset, update the About page with its `sections` and `closing` fields, add the `support-message` page, unpublish `committee-d-k-shivakumar`, and update both Open edition names. New supporter documents are appended after the five existing partner IDs, preserving their identities. Verify these editor changes before connecting that dataset to production.

The compact layout uses a light floating navbar with an explicit Home link. Home uses matching knight artwork with a deferred desktop 3D scene; mobile, reduced-motion and data-saving visitors retain the image. The Home photo gallery uses five selected moments in a layered photo stack, with adjacent captions, thumbnail selection, crossfade/slide transitions, and pointer-drag navigation. Arrow keys, Home/End and Previous/Next buttons provide keyboard access. It does not autoplay. CSS drives the logo marquee and photo transitions; IntersectionObserver and the Web Animations API provide one-time section reveals. Partner logos pause on hover or keyboard focus. Participant videos play inline with native controls and load only when requested. Native anchor scrolling is smooth. Reduced-motion preferences disable animation; the marquee becomes a static grid. The deferred desktop hero adds GSAP/ScrollTrigger parallax and a light Lenis wheel-smoothing trial; it leaves native anchors and keyboard/touch navigation available. Other homepage sections retain their existing motion. The homepage and event archive feature the 2024 Open followed by the 2025 Open. The Events page keeps actual upcoming events when available and omits the empty announcement card; its bottom contact band remains.

The 2024 event includes the 14 featured attendees from the same archive, with all 14 featured players shown in two compact homepage rows on a dark background. Smaller screens scroll the same two rows horizontally. These are attendees featured by the organiser, not a complete entry list or a claim that every guest competed. FIDE title abbreviations retain their distinct meanings. Janelle Mae Frayna's WGM and Diajeng Theresa Singgih's WIM are confirmed by their official FIDE profiles; FIDE records her WIM title in 2024, superseding the source homepage's WFM label. The import preserves existing documents: if the 2024 event was already imported, add its featured attendees in Studio rather than expecting the initial-import script to overwrite it.

## Vercel review deployment

Source repository: [abhijith-ms/golden-aura](https://github.com/abhijith-ms/golden-aura) (private). The `main` branch is connected to the `golden-aura` project in `abhijith-mss-projects`. Pushes to `main` deploy to [golden-aura-pi.vercel.app](https://golden-aura-pi.vercel.app); other branches receive preview deployments. Node.js 24 is configured in Vercel. Local credentials, original downloads, and generated builds are excluded from Git.

Current public review: [3D and visual refinement branch](https://golden-aura-git-codex-chess-3d-hero-abhijith-mss-projects.vercel.app/), tracked by [draft PR #5](https://github.com/abhijith-ms/golden-aura/pull/5). The [earlier redesign review](https://golden-aura-ajprmvlnh-abhijith-mss-projects.vercel.app) remains available for comparison. No Vercel login is required. The project is `golden-aura` under `abhijith-mss-projects`. Current visual evidence is in `docs/verification/homepage-visual-polish/`, `docs/verification/interior-visual-polish/` and `docs/verification/gallery-contact-visual-polish/`. The final deployed navigation/motion review is in `docs/verification/navigation-motion-review/`; it does not replace the remaining real-device/native-preference checks.

Run `npx vercel deploy --yes --target=preview` from this directory with the intended Vercel account signed in. The deployment URL is used automatically when `SITE_URL` is unset. Review builds remain noindex until an explicit production domain is configured. `.vercelignore` excludes the original asset archives, reference documents, local credentials and test fixtures. The bundled content is available without CMS credentials; enquiry delivery requires a configured mailbox.

## Hostinger deployment

Deploy as a Node.js application using Node 24, `npm run build`, and `npm start`. Install development dependencies during the build: Sanity Studio is compiled into client assets and its editor/CLI dependencies are build tools. The public server uses `@sanity/client` and the signed-webhook helper.

Before publication, set `SITE_URL` to the Trust's actual HTTPS origin, configure Sanity/mailbox variables, and rebuild. Localhost builds are marked noindex. Sanity project identifiers and analytics settings are public build-time values. Keep a backup of any replaced site and preserve Namma Big Chess as the tournament archive.

An existing cookieless Plausible account can be enabled with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; analytics is disabled until configured. The privacy page reflects the enabled integration.

## Content approval before launch

Confirm the public domain, office contact details, team/committee roles, affiliations, and government verification requirements. Registration information appears only when supplied in the CMS. No unique-player count or experience claim has been invented; the redesigned homepage presents real event and affiliation information instead of a decorative statistics strip. The ₹55 lakh and ₹4 lakh edition prize funds come from the supplied draft/press materials and should receive final client sign-off.

No registration database or payment checkout is included. The cinematic opening and section choreography, compact interior pages, Gallery and Contact presentation are implemented on `codex/chess-3d-hero`. Final client review, native browser/CSS motion-preference switching and representative-device performance sign-off remain pending. Keep PR #5 in draft and merge only when authorised. Retain ownership of hosting, CMS, source code, and future payment accounts with the Trust.

The October content review removes the Leadership group and Sowmya M U's committee card while retaining her organising-secretary message above the directory. The committee introduction omits the edition year and the external committee-archive link is removed. For an already seeded CMS, update the committee page introduction and unpublish `committee-sowmya-m-u`; the top message remains part of the page layout.

The 2024 event dates (18–26 January) and venue (Sri Kanteerava Indoor Stadium, Bengaluru) are verified against the organiser's original prospectus hosted by AICF: https://aicf.in/wp-content/uploads/2023/12/Bangalore-GM-final.pdf. Update the corresponding event document in an existing Sanity dataset.

Home participant feedback uses three real video files and two short attributed excerpts from the original tournament homepage. Videos stream from the original host inside native inline players; optimised poster images are served locally. Generic template testimonials from that page were excluded. Country flag icons use the original archive's images, with a St George's Cross SVG for England (the original incorrectly used the UK flag). New flags and video posters total about 128 KiB. Imported sources are recorded in `scripts/assets.json`.

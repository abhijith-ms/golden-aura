# Golden Aura Trust

Six-page Next.js website with Sanity editing, curated event galleries, and a server-side enquiry form. The redesigned release uses an original static perspective chessboard and typography hero, with Archivo headings and DM Sans body text. CSS handles the restrained motion; GSAP is reserved for the later 3D phase. Registration, payments, and live 3D are later phases.

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

The [original tournament homepage](https://nammabigchess.com/) lists WestBridge Capital, Akshayakalpa Organic and Mysore Sandal Soap as official partners of the 2025 edition. These are labelled separately from KSCA/BUDCA community affiliations. Set the partner category in Sanity and retain the edition year in the relationship label.

The 2024 event includes the 14 featured attendees from the same archive, with a short homepage preview linking to the complete list. These are attendees featured by the organiser, not a complete entry list or a claim that every guest competed. FIDE title abbreviations retain their distinct meanings. Janelle Mae Frayna's WGM and Diajeng Theresa Singgih's WIM are confirmed by their official FIDE profiles; FIDE records her WIM title in 2024, superseding the source homepage's WFM label. The import preserves existing documents: if the 2024 event was already imported, add its featured attendees in Studio rather than expecting the initial-import script to overwrite it.

## Vercel review deployment

Source repository: [abhijith-ms/golden-aura](https://github.com/abhijith-ms/golden-aura) (private). The `main` branch is connected to the `golden-aura` project in `abhijith-mss-projects`. Pushes to `main` deploy to [golden-aura-pi.vercel.app](https://golden-aura-pi.vercel.app); other branches receive preview deployments. Node.js 24 is configured in Vercel. Local credentials, original downloads, and generated builds are excluded from Git.

Current public review: [Golden Aura redesign](https://golden-aura-ajprmvlnh-abhijith-mss-projects.vercel.app). The [previous review](https://golden-aura-av2rqj62a-abhijith-mss-projects.vercel.app) remains available for comparison. No Vercel login is required. The project is `golden-aura` under `abhijith-mss-projects`; redesign checks are recorded in `docs/verification/redesign/report.json` and `docs/verification/redesign/vercel-review.json`. The latest Home, mobile drawer, and logo-only navbar checks are in `docs/verification/navigation-fixes/report.json`.

Run `npx vercel deploy --yes --target=preview` from this directory with the intended Vercel account signed in. The deployment URL is used automatically when `SITE_URL` is unset. Review builds remain noindex until an explicit production domain is configured. `.vercelignore` excludes the original asset archives, reference documents, local credentials and test fixtures. The bundled content is available without CMS credentials; enquiry delivery requires a configured mailbox.

## Hostinger deployment

Deploy as a Node.js application using Node 24, `npm run build`, and `npm start`. Install development dependencies during the build: Sanity Studio is compiled into client assets and its editor/CLI dependencies are build tools. The public server uses `@sanity/client` and the signed-webhook helper.

Before publication, set `SITE_URL` to the Trust's actual HTTPS origin, configure Sanity/mailbox variables, and rebuild. Localhost builds are marked noindex. Sanity project identifiers and analytics settings are public build-time values. Keep a backup of any replaced site and preserve Namma Big Chess as the tournament archive.

An existing cookieless Plausible account can be enabled with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`; analytics is disabled until configured. The privacy page reflects the enabled integration.

## Content approval before launch

Confirm the public domain, office contact details, team/committee roles, affiliations, and government verification requirements. Registration information appears only when supplied in the CMS. No unique-player count or experience claim has been invented; the redesigned homepage presents real event and affiliation information instead of a decorative statistics strip. The ₹55 lakh and ₹4 lakh edition prize funds come from the supplied draft/press materials and should receive final client sign-off.

No registration database, payment checkout, or live Three.js scene is included in this release. Retain ownership of hosting, CMS, source code, and future payment accounts with the Trust.

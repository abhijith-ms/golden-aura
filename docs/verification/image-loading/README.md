# Image-loading fixes — verification

3 November 2026. Branch: `codex/image-loading-fixes`. [PR #7](https://github.com/abhijith-ms/golden-aura/pull/7).

The original dirty `codex/chess-3d-hero` checkout was preserved. This change starts from the merged video redesign on `main`.

## Changes and measured payloads

- Removed the gallery's original-photo CSS backdrop. The first avoided original is 348,194 bytes; the same photograph still has an optimized stage image and a small thumbnail.
- Removed the below-fold gallery preload and aligned gallery, thumbnail and tournament `sizes` with their existing CSS layouts. Current photo quality settings were retained.
- Kept the displayed gallery layer until its replacement has decoded. Captions, counters and selected thumbnails follow the displayed image. Requested selections load eagerly after interaction; stale completions are ignored. Failures preserve the old frame and offer retry.
- Added a 1280 × 720 mobile hero rendition: **1,617,256 bytes**, versus **4,747,195 bytes** for desktop, a **65.9% reduction**. Both are 8.000 seconds, 24fps and 192 frames. Audio was copied unchanged and MP4 metadata precedes media data.
- Selected the hero source before attaching video. Mobile uses only the mobile source; reduced-motion and supported Save Data preferences select no autoplay source. Server-rendered HTML contains the static cover and no video source. Removed the redundant nested fallback image.

The mobile encode used existing ffmpeg with Lanczos scaling, libx264 `-preset slower -crf 28`, high profile/level 3.1, copied audio and `+faststart`. Frame comparisons at 0.5, 4.5 and 7.5 seconds retained clear piece silhouettes and lighting at mobile inspection size, with softer fine grain.

## Passed checks

| Check | Result |
| --- | --- |
| Unit tests, Node 24.22.1 | 28 passed, including gallery races/retries/cancellation and hero source/media budget. |
| Existing local HTTP fixture | Passed routes, headings, archive content, API boundaries, security headers and the added image loading assertions. No real enquiry was sent. |
| Vercel install/build | `npm ci` and `npm run build` passed for application commit `4750b68`; Next 16.4.3 completed TypeScript checking and all static pages. Build log explicitly records TypeScript finished at 05:57:16 UTC. Vercel selected Node 26 because of the existing broad engines range. |
| New branch preview | Desktop requested the desktop video; a fresh 390px reload requested the mobile video. Initial gallery image remained lazy with no gallery preload. |
| Responsive layouts | Inspected requested widths 390, 820, 1100 and 1440px. Tournament photo slots measured approximately 348, 285, 195 and 251px. The browser reused cached 384px variants after resizing; the fresh local desktop fixture requested 256px tournament variants. |
| Delayed image | Held the second gallery stage request beyond the previous 450ms exit. The first image remained loaded and visible; caption/selection stayed at photograph 1 with a loading status. |
| Rapid navigation and failure | While photo 2 was held, selected photo 3; the fixture returned HTTP 503 once. Photo 1 remained visible with retry feedback. |
| Retry and stale completion | Retry successfully displayed photo 3 with matching caption/thumbnail. Releasing the older photo-2 request did not override it. |
| Fixture request assertions | Verified deliberate failure plus successful retry and no raw original-photo backdrop requests. |

Browser evidence is in [browser-checks.json](browser-checks.json). Screenshots: [delayed](gallery-delayed.jpg), [failed](gallery-failed.jpg), [recovered](gallery-recovered.jpg).

## Reproduce the fault checks

Use a local application with bundled draft content and no SMTP/CMS credentials. With dependencies installed and Node 24:

```sh
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3031
node tests/http.mjs http://127.0.0.1:3031
node tests/fixtures/image-loading/server.mjs http://127.0.0.1:3031 3032
```

Open `http://127.0.0.1:3032/#moments` using the browser and allow hydration to finish. Click Next once: photo 2 is held while photo 1 remains visible. Click Next again: photo 3 fails once. Retry: photo 3 loads. Release the old response, then confirm photo 3 remains selected:

```sh
curl -X POST http://127.0.0.1:3032/__qa/release
node tests/fixtures/image-loading/check.mjs
```

The fixture is bound to loopback and only proxies a loopback application. It forwards dev-server WebSocket traffic so hydration can complete. Production browser access was not retried; the inspected remote page was the newly built branch preview.

## Limits

The local clean install downloaded remaining framework archives at approximately 6 KiB/s. It was stopped rather than leaving a long background download. Local standalone typecheck/build attempts could not finish with the partially downloaded Next declaration files; the Vercel production build supplied the completed TypeScript and build validation. Local runtime/HTTP/fault tests used Next 16.4.3. No dependency or lockfile changes were made.

There is no controlled before/after LCP or CLS benchmark, physical-phone test, DPR-2 browser emulation, or browser-level Save Data emulation. Source-policy combinations are covered by unit tests; payload reduction is not a measured page-load-time percentage. The portrait reveal choreography remains unchanged because that part of the plan was conditional on identifying it as the client's complaint.

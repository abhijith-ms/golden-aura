# User-selected wooden knight review

Contract recorded before implementation, 2026-10-16.

- Use the knight from the user's downloaded **Chessboard by Oleksandr Zymohliad**, CC BY 4.0. The two prior runtime models were rejected. Start with the source wood appearance and silhouette; preserve useful source geometry and UVs.
- Keep the compact homepage hero, existing typography, copy, floating navbar and both navigation actions. No added artwork row, card or hero height.
- Isolate the black knight head/body (mesh 5) and matching circular base (mesh 8), centred on the base and normalised to height 1. Preserve their relative position. Retain the source wood material and texture, with a modest texture re-encode to meet transfer limits.
- Targets: desktop 1440x900, tablet 834x1112 and phone 390x844. Desktop should show the whole knight below the navbar; narrow layouts retain the matching static render with no horizontal overflow.
- Loading/error/partial enhancement must keep artwork and HTML actions usable. Success replaces only the artwork after a real frame. Empty and permission states do not apply to this bundled decorative asset. Preserve the existing keyboard, reduced-motion and network policy.
- Export the new matching fallback from the actual browser scene. Keep the original hero background for rollback. Update attribution, asset preparation and contract checks with the new source.
- Scope: model, texture, matching fallback, attribution, asset checks and handoff. Existing native smooth anchor scrolling and section reveals stay in place. The approved 3D plan has no scroll-linked knight transform; pointer motion follows model review. No new animation dependency for this asset comparison.

Rendered results, measured asset sizes and verification will follow below. Untested states are not passes.

## Result and measurements

Adapted from [Chessboard by Oleksandr Zymohliad](https://sketchfab.com/3d-models/chessboard-3cee8ada5d99468cbc93ded83b3ca70a), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The following asset and render changes are adaptations; the creator does not endorse Golden Aura Trust.

The branch now uses the knight from the exact source selected and downloaded by the user. Both component meshes retain their complete geometry: **26,626 triangles / 13,477 vertices**. The source set's dark wood material is applied with the original UVs and wood image. The texture uses linear/mipmap filtering and a quality-90 JPEG re-encode at its original 512x1024 dimensions.

- Source download: 38,158,700 bytes, kept locally in the ignored `refernce and guide/3d-source/oleksandr-chessboard/source.glb` folder.
- Exported GLB: **765,460 bytes**, one mesh/material/primitive, one embedded **172,599-byte** JPEG, no external texture or compression decoder.
- Matching browser render: **31,968 bytes**, 1003x1003 transparent WebP. The original rollback background remains available.
- The full board, other pieces and unused images are not published with the site.

This is a visual review of the source model and its dark wood appearance, not client approval of the final sculpture, colour or motion. The light-wood source baseline is retained for comparison; the dark-wood finish was selected to match the user's reference more closely. No gold rings or substitute sculpture were added.

## Rendered evidence

- [Light wood baseline](light-wood-baseline.jpg): the same extracted geometry with the source upper piece's pale material.
- [Desktop](desktop.jpg): requested 1440x900 override; one ready canvas with the restored eight-second deadline and 1.5 DPR cap. Whole knight fits below the navbar; hero size and actions are unchanged.
- [Tablet](tablet.jpg): requested 834x1112 override; matching static artwork and zero canvases.
- [Phone](phone.jpg): requested 390x844 override; matching static artwork behind readable copy and both actions, zero canvases.
- [Keyboard focus](phone-focus.jpg): the capture shows a visible outline around the primary hero action. The DOM check after Tab confirmed focus on Meet the Trust, outside the artwork; no artwork focus targets were added.
- [Production](production.jpg): default 1280x720 view; a warm reload reaches one ready canvas. An initial local production visit stayed on the matching image; cold-start timing still needs profiling. Do not treat this as a measured cold-start performance pass.
- [Model failure](model-failure.jpg): temporarily unavailable model gives a non-success response; the eligible hero has zero canvases and retains the loaded wooden fallback and HTML actions. The original GLB was restored immediately and its URL verified as 200 / 765,460 bytes.
- [Creator credit](footer-credit.jpg): visible source title, creator, adaptation wording and CC BY 4.0 link.

The browser captures exclude its scrollbar/chrome, so their pixel dimensions differ from the requested outer viewport overrides. Measured document widths of 1425, 819 and 375 matched their scroll widths; no horizontal overflow was observed.

## Verification

Source-integrity/export assertions, TypeScript, all 20 unit tests, one production build and local HTTP checks passed. HTTP checks ran with `SITE_URL=http://localhost:3000`, only against the local fixture; no valid enquiries were submitted. The server HTML includes the wooden fallback and all content/links, with no canvas. The temporary capture route, elevated DPR and longer development deadline were removed before the build. The original full-board download is outside `public/` and ignored by Git.

Existing native smooth anchor scrolling and section reveals are preserved. This asset change adds no scroll-linked knight transforms or new animation package. Pointer response and adaptive DPR remain after still review.

Actual browser reduced-motion/network changes, shader/renderer/context-loss simulations, prolonged route/resource instrumentation and representative-device cold startup/frame/LCP/CLS measurements remain untested for this source. The capability policy is covered by unit tests; it does not replace those measurements. Production merge remains pending user review.

# Replacement knight review

Contract recorded before asset changes, 2026-10-16.

- Surface: the existing homepage hero; visitors must still see the tournament and Trust links immediately.
- Intent: a more defined carved knight, satin charcoal, restrained champagne gold, warm studio light. The rejected Poly Haven model and original `hero-knight-bg.webp` provide the local comparison.
- Keep hero height, typography, copy, navigation, camera and artwork position unchanged during model comparison. Compare the baseline and licensed replacement using the same lighting before tuning materials.
- Target views: desktop 1440x900, tablet 834x1112, phone 390x844. Desktop must show the whole piece below the navbar; narrow views retain the static rendering without a new artwork row.
- Preserve the existing decorative semantics, lazy loading, local failure fallback and reduced-motion/input policy. Loading, failure and partial enhancement retain the image and usable HTML. Success replaces only artwork. Empty/permission states do not apply to this decorative, bundled asset.
- Scope: asset preparation, required attribution, matching fallback, asset contract test and handoff. Motion follows the still review. No new dependencies or live production change.

Results and screenshots will be added after rendered inspection. An untested state is not a pass.

## Result

A replacement knight from **Wooden Chess Board by Bhargav Limje (CC BY 4.0)** is integrated for the still review. It has a more distinct brow, open jaw, eye, ears and carved neck than the rejected prototype. It is stylised and does not reproduce the original illustration's ornate mane. Client approval is still pending.

Only one replacement GLB was integrated after screening other models. The comparison is the original prototype versus this replacement, followed by a material refinement; it is not a claim that three different replacement GLBs were rendered.

- [Prototype baseline](prototype-baseline.jpg): matching image of the rejected Poly Haven scene in the same hero.
- [Replacement, same lighting](candidate-matched-lighting.jpg): shape comparison with the original material values and unchanged camera/lights.
- [Refined desktop](desktop-final.jpg): darker satin charcoal, thinner gold base bands and a thin gold mane edge.
- [Tablet](tablet-final.jpg) and [phone](phone-final.jpg): matching static render, unchanged hero height and no added artwork row.
- [Phone keyboard focus](phone-focus.jpg): Tab moves from Explore tournaments to Meet the Trust; the artwork receives no focus.
- [Production desktop](desktop-production.jpg): one ready canvas in the built application, without the development indicator.
- [Model unavailable](model-failure.jpg): production fixture returns a non-success model response; the canvas is removed and matching artwork/copy/actions remain. The GLB was restored immediately afterwards and its URL again returns 200 / 732,248 bytes. A failed enhancement remains static for that visit.
- [Visible attribution](footer-credit.jpg): creator, original title, adaptation notice and licence links appear in the footer.

The requested viewport overrides were 1440x900, 834x1112 and 390x844, plus the default 1280x720 production view. Browser captures exclude its scrollbar/viewport chrome; their pixel dimensions differ from the requested outer sizes. Measured document widths were 1425, 819 and 375 respectively, with matching scroll widths and no horizontal overflow.

## Checks

- `python3 scripts/prepare-knight.py`: source integrity, geometry/layout assertions and export budget passed. No external textures, rig, animations or decoder.
- `npm run typecheck`: passed.
- `npm test`: all 20 passed, including the updated geometry/licence/budget contract and existing capability policy.
- One production build: passed. Temporary capture code/API are absent from the build; eight-second deadline and 1.5 DPR cap are restored.
- `node tests/http.mjs http://localhost:3000`: passed against the local production fixture with `SITE_URL=http://localhost:3000`. An initial run without the explicit fixture origin correctly rejected its test request with 403; it did not require an application change. No valid enquiries were sent.
- Server HTML retains the new image and all copy/links, with no canvas. All existing route, archive, metadata, 404 and API-boundary checks passed.
- Production browser reaches one ready canvas. Events navigation has no canvas. Model failure keeps the matching image and removes the canvas. No keyboard target was added to the artwork.

GLB: 732,248 bytes / 39,040 triangles / 20,675 vertices / two materials. Matching WebP: 36,354 bytes / 1024x1024 / transparent. Fallback is exported from the actual browser scene, then converted to WebP; camera, lighting and layout are unchanged. No package changes.

## Limits

This is the asset/still review, not the completed 3D release gate. Actual browser changes to reduced-motion and connection settings, context-loss/shader/renderer failure, prolonged navigation/resource instrumentation and real-device startup/frame/LCP/CLS measurements remain untested for this replacement. The unchanged eligibility policy passes unit tests; that does not substitute for browser/device measurements. Pointer motion and adaptive DPR are not implemented yet. Production deployment/merge remain pending review.

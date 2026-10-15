# Chess 3D hero: handoff

Last updated: 2026-10-15. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim from the user's attachment. Its source SHA-256 is `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- The user authorised implementation on a new branch. Active branch: `codex/chess-3d-hero`, created from verified latest `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b` (merged PR #4). GitHub account verified as `abhijith-ms`.
- Initial still composition and deferred scene are implemented on this branch, with matching browser-rendered fallback artwork. Live production has not been changed. Astra's original wording about an unselected model and unstarted implementation describes the earlier planning state.
- Pointer motion and adaptive quality are pending the still-composition review in milestones 1–2. Do not report the full 3D phase complete. Next: review the still, then add bounded pointer response, quality regression, and the remaining resilience/performance QA. Review through a PR and Vercel preview before merging.

### Review feedback: replace the basic knight

The user reviewed the first composition and said the knight looks very basic. The Poly Haven knight is now a technical prototype, **not the approved final asset**. Replace the model before adding motion; preserve the existing loading, fallback and layout integration.

Target a refined carved Staunton knight: stronger muzzle and jaw, a defined brow and ears, deeper mane cuts, and a more deliberate neck profile. Use a satin charcoal surface, restrained champagne-gold accents and a warm rim light. Avoid the current soft/plastic appearance. The original `public/images/hero-knight-bg.webp` remains a useful visual reference for the sculpting and lighting direction, rather than a source of 3D geometry. Keep the hero compact.

Next deliverable: compare two or three licensed candidate models within the actual desktop hero, with a phone crop, using consistent camera and lighting. Inspect appearance before optimising: more triangles alone do not guarantee a better sculpture. Confirm source access and redistribution/modification rights before accepting a replacement. No replacement is selected yet; whether the shortlist may include paid assets has been asked, and no purchase is authorised.

Research so far: Trinh Hoang Hieu's [free knight](https://sketchfab.com/3d-models/free-3d-model-chess-knight-1ce4da41b0d442df9d9c88340f5c3075) and Jeyhun1985's [Staunton knight](https://sketchfab.com/3d-models/knight-staunton-full-size-chess-set-dffe461e0def4f0a84bfe8551e58105f) have been visually inspected. Both list CC BY, but their stylised shapes are not a convincing final improvement. The latter's listed 667.4k triangles also need substantial optimisation. [WChargin's sculpted knight](https://blendswap.com/blend/7722) is a further research lead only; its appearance and original Blender-file compatibility are not validated. Do not treat any of these as an approved replacement.

After model/material review, continue with the bounded pointer tilt, matching fallback regeneration, quality adjustment and remaining device/failure testing. The live site remains unchanged.

## Decisions to carry forward

Use one inward-facing charcoal knight with restrained champagne-gold details, warm studio lighting, and a soft contact shadow. Preserve the compact hero, floating navbar, Manrope/DM Sans typography, server-rendered copy, links, and existing section order.

Use Three.js and React Three Fiber behind a homepage-only lazy client boundary. Omit GSAP, Drei, controls, postprocessing, and additional pieces initially. CSS handles the 450ms image/scene crossfade; demand rendering and time-based damping handle subtle pointer response. Astra's package versions are a dated starting point: the selection review found Fiber 9.8.2 available after the plan's 9.8.1; recheck compatibility and pin stable versions when implementation begins. Do not upgrade the framework as part of this work.

Start enhancement only above 1040px with a fine pointer and hover capability, respecting reduced motion, connection hints where available, and renderer success. Phones and touch tablets retain a static image. Defer the engine/model until the image and initial page load finish, then use an idle opportunity. No scroll-driven movement or additional hero height.

Keep the image visible until a valid scene frame is ready. Use a local fallback for loading errors, an eight-second deadline, renderer failures, and context loss. Stop rendering when settled, offscreen, or hidden; clean up listeners, asynchronous work, and owned GPU resources. The canvas is decorative and cannot intercept input.

Export matching fallback WebPs from the final browser scene before release. Retain `public/images/hero-knight-bg.webp` as the original rollback asset. An unmatched old image must not be presented as the finished scene's matching fallback.

## Current prototype model — replacement required

**Knight from [Chess Set by Riley Queen, published by Poly Haven](https://polyhaven.com/a/chess_set).** Checked on 2026-10-15 using the publisher's preview/clay views and downloaded glTF geometry. The traditional horse silhouette and circular base suit the sculpture direction. Recreate its materials for this website; the publisher's marble appearance is not the intended final look.

[Poly Haven's asset licence](https://polyhaven.com/license) identifies this model as CC0, permitting commercial use, modification, and redistribution of the downloaded asset. Attribution is optional; retain this provenance anyway. Publisher preview renders, logos, and website text are separate from the CC0 model: do not copy those into the site. Select and document any environment asset separately.

| Source detail | Verified value |
|---|---|
| Asset identifier | `chess_set` |
| Chosen node | `piece_knight_black_01`, node index 22 |
| Mesh | Index 22, named `mesh.007` |
| Geometry | 2,662 triangles; 1,705 exported vertices; one triangle primitive |
| Original material | Index 2; replace with the planned charcoal/gold treatment |
| Local geometry bounds | X: -0.01940348 to 0.01939151; Y: approximately 0 to 0.07499858; Z: -0.02438492 to 0.02099723 |
| Geometry download | 53,740-byte glTF plus 1,732,220-byte binary for the complete source set |

The triangle count is below Astra's suggested range; that range is a budget, not a minimum. Inspect silhouette and shading at final hero size before deciding whether refinement is needed. Do not add geometry solely to reach the range. The source knight is one material: restrained gold accents still require material assignment or a small mesh edit. Production scale, forward direction, normals, and appearance remain to be validated.

Source geometry, the black-piece normal atlas and metadata are stored in `refernce and guide/3d-source/polyhaven-chess-set/`, ignored by Git. Original colour/roughness maps are omitted. The source glTF is not a complete standalone textured asset; do not serve or load it directly.

`scripts/prepare-knight.py` extracts the knight, normalises its height, assigns two gold base bands, preserves UVs, and embeds the original normal atlas resized to 1K with unused UV areas masked out. Run with Python and Pillow, as for the existing asset script. Source-integrity and output-size assertions fail on unexpected files. The resulting `public/models/knight.glb` is **295,208 bytes**, with two material primitives, 2,662 triangles, and no compression decoder. Forward is -Z, Y-up, base at Y=0, height 1; the circular base remains centred on its original origin. `public/models/knight.LICENSE.txt` accompanies the asset.

The scene uses Three's MIT-licensed `RoomEnvironment`, generated locally into a 256px PMREM, and a generated 64px contact-shadow texture. No environment/shadow download is needed. Camera: position `[0, 1.05, 2.7]`, target `[0, 0.46, 0]`, FOV 30°, model yaw 2.2 radians. Lighting is in `src/components/hero-scene.tsx`. Three 0.186.1, Fiber 9.8.2 and Three typings 0.186.0 are pinned; locked React remains 19.3.0.

`public/images/hero-knight.webp` is the matching **22,490-byte**, 1003×1003 transparent render, exported immediately after the actual browser scene rendered its resting pose and converted with Pillow at WebP quality 90. Image and canvas share a square frame for consistent responsive placement. The original `hero-knight-bg.webp` is retained for rollback. Temporary capture code/API and elevated capture DPR were removed after export; runtime DPR is capped at 1.5.

Official download/provenance endpoints:

- [Publisher file manifest](https://api.polyhaven.com/files/chess_set)
- [Source glTF](https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/chess_set/chess_set_1k.gltf)
- [Source geometry binary](https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/chess_set/chess_set.bin)
- [Source normal atlas](https://dl.polyhaven.org/file/ph-assets/Models/jpg/2k/chess_set/chess_set_pieces_black_nor_gl_2k.jpg)

Downloaded source integrity was checked against the publisher's manifest sizes and MD5 values. SHA-256 values for future verification:

```text
3e21ecd0c2ffb703dfdb3f3ea7a379c1dbd4ec513ba2cb8e6cb1e5f276d7eb91  chess_set_1k.gltf
c73476fd032a2cb4a9c256f70573eed260708132fdc42fec161c6216711560b3  chess_set.bin
0f34ac3bb06c64d3a6a8f8999b13612b2e299c5d9888ba7bd8fc4d9f2f0acc7e  chess_set_pieces_black_nor_gl_2k.jpg
```

## Implementation and verification sequence

1. Extract the knight, centre its base at Y=0, normalise its height, assign charcoal/gold, and frame a still scene within the existing hero. Check desktop, tablet, and phone crops. The still has been produced; client visual review is pending.
2. Add the deferred scene with a matching fallback. Target GLB at or below 1MB and total model/environment/shadow transfers at or below 1.3MB. File size is within the model budget; production transfers/performance require separate measurement.
3. Add pointer response (yaw at most ±4°, pitch ±1.5°), settling, visibility suspension, and one-way quality reduction from DPR 1.5 to 1.0 before falling back if necessary.
4. Verify local error recovery, reduced-motion changes, blocked/slow downloads, context loss, repeated route navigation, no-JavaScript output, and no Three/Fiber requests on unrelated routes.
5. Run typecheck, existing tests, one production build, and local HTTP checks sequentially. Verify browser behaviour and real-device performance separately. Preserve the HTTP contract: static hero in server HTML, no server-rendered canvas. Never run the API-containing HTTP script against production.

The development machine has limited memory/disk space. Avoid duplicate builds, large source texture archives, and concurrent development/build processes. Initial unit checks cover policy boundaries and the standalone GLB contract. Record final build/browser verification before handoff.

## Verification for the first review

Typecheck, all 20 unit tests, one production build and local HTTP checks passed. [Screenshots, results and remaining checks](../../verification/chess-3d-hero/README.md) are saved alongside this handoff. The production browser reaches one scene, removes it on event navigation and recreates only one scene on returning Home. Phone/tablet widths retain the matching image. Full performance and failure-scenario testing is still pending.

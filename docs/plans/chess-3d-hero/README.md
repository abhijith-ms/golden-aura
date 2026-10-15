# Chess 3D hero: handoff

Last updated: 2026-10-15. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim from the user's attachment. Its source SHA-256 is `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- The user authorised choosing the knight and saving the plan. The source model is now selected below; references in Astra's original text to an unselected model describe the earlier planning state.
- No 3D implementation, dependency installation, implementation branch, or deployment has started. The website still uses its static knight hero. Baseline: `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b` (merged PR #4).
- Next action when implementation is requested: check for newer merged work and local edits, then create `codex/chess-3d-hero` from the latest `main`. Start with the selected knight and a still composition. Review through a PR and Vercel preview before merging.

## Decisions to carry forward

Use one inward-facing charcoal knight with restrained champagne-gold details, warm studio lighting, and a soft contact shadow. Preserve the compact hero, floating navbar, Manrope/DM Sans typography, server-rendered copy, links, and existing section order.

Use Three.js and React Three Fiber behind a homepage-only lazy client boundary. Omit GSAP, Drei, controls, postprocessing, and additional pieces initially. CSS handles the 450ms image/scene crossfade; demand rendering and time-based damping handle subtle pointer response. Astra's package versions are a dated starting point: the selection review found Fiber 9.8.2 available after the plan's 9.8.1; recheck compatibility and pin stable versions when implementation begins. Do not upgrade the framework as part of this work.

Start enhancement only above 1040px with a fine pointer and hover capability, respecting reduced motion, connection hints where available, and renderer success. Phones and touch tablets retain a static image. Defer the engine/model until the image and initial page load finish, then use an idle opportunity. No scroll-driven movement or additional hero height.

Keep the image visible until a valid scene frame is ready. Use a local fallback for loading errors, an eight-second deadline, renderer failures, and context loss. Stop rendering when settled, offscreen, or hidden; clean up listeners, asynchronous work, and owned GPU resources. The canvas is decorative and cannot intercept input.

Export matching fallback WebPs from the final browser scene before release. Retain `public/images/hero-knight-bg.webp` as the original rollback asset. An unmatched old image must not be presented as the finished scene's matching fallback.

## Selected model

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

Only the source geometry and metadata are downloaded in `refernce and guide/3d-source/polyhaven-chess-set/`, which is ignored by Git. Original textures were intentionally omitted because the materials will be replaced. The glTF therefore is not a complete standalone textured asset. Do not serve the full chess set or load that source file directly in the website. Extract one knight and export a self-contained production GLB during implementation.

Official download/provenance endpoints:

- [Publisher file manifest](https://api.polyhaven.com/files/chess_set)
- [Source glTF](https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/chess_set/chess_set_1k.gltf)
- [Source geometry binary](https://dl.polyhaven.org/file/ph-assets/Models/gltf/8k/chess_set/chess_set.bin)

Downloaded source integrity was checked against the publisher's manifest sizes and MD5 values. SHA-256 values for future verification:

```text
3e21ecd0c2ffb703dfdb3f3ea7a379c1dbd4ec513ba2cb8e6cb1e5f276d7eb91  chess_set_1k.gltf
c73476fd032a2cb4a9c256f70573eed260708132fdc42fec161c6216711560b3  chess_set.bin
```

## Implementation and verification sequence

1. Extract the knight, centre its base at Y=0, normalise its height, assign charcoal/gold, and frame a still scene within the existing hero. Check desktop, tablet, and phone crops. A still composition has not yet been produced or reviewed.
2. Add the deferred scene with a matching fallback. Target GLB at or below 1MB and total model/environment/shadow transfers at or below 1.3MB. These are targets, not current measurements.
3. Add pointer response (yaw at most ±4°, pitch ±1.5°), settling, visibility suspension, and one-way quality reduction from DPR 1.5 to 1.0 before falling back if necessary.
4. Verify local error recovery, reduced-motion changes, blocked/slow downloads, context loss, repeated route navigation, no-JavaScript output, and no Three/Fiber requests on unrelated routes.
5. Run typecheck, existing tests, one production build, and local HTTP checks sequentially. Verify browser behaviour and real-device performance separately. Preserve the HTTP contract: static hero in server HTML, no server-rendered canvas. Never run the API-containing HTTP script against production.

The development machine has limited memory/disk space. Avoid duplicate builds, large source texture archives, and concurrent development/build processes. No application checks were rerun for this documentation and source-selection task.

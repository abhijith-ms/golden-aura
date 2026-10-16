# Chess 3D hero: handoff

Last updated: 2026-10-16. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim. Source SHA-256: `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- Work is on `codex/chess-3d-hero`, based on `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b`. Verify the active GitHub account is `abhijith-ms` before pushing.
- The user rejected both earlier knight models: Poly Haven / Riley Queen, then Wooden Chess Board by Bhargav Limje. Neither is an approved visual direction. Their source/review history remains in earlier commits and verification folders.
- The user supplied two alternatives and downloaded **Chessboard by Oleksandr Zymohliad**. Its knight is now extracted and integrated for review, with the set's dark wood finish. **This new composition still needs user review.**
- [Draft PR #5](https://github.com/abhijith-ms/golden-aura/pull/5) and [Vercel branch preview](https://golden-aura-git-codex-chess-3d-hero-abhijith-mss-projects.vercel.app/) are the review surfaces. No production merge is authorised.
- Pointer motion, adaptive DPR and remaining resilience/performance work follow still review. Do not report the entire 3D phase complete.

## Current source and licence

[Chessboard by Oleksandr Zymohliad](https://sketchfab.com/3d-models/chessboard-3cee8ada5d99468cbc93ded83b3ca70a), user link [skfb.ly/Ly8C](https://skfb.ly/Ly8C), is free under **CC BY 4.0**. The model page, download dialog, public Sketchfab API and supplied GLB metadata agree on the creator and licence. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) permits commercial use, modification and redistribution with attribution, a licence link and an indication of changes. Credit is included in the footer, GLB metadata and `public/models/knight.LICENSE.txt`. No paid, NC or ND asset is used.

The user placed the 1K-texture GLB at `public/models/chessboard.glb`. It was moved, without deleting the original data, to the ignored source folder:

```text
refernce and guide/3d-source/oleksandr-chessboard/source.glb
38,158,700 bytes
SHA-256: 2d5e463da58ae98cd9c7234c7dd17f1248c947100400419c057653f04963a92c
```

The full board is not committed or served as a website asset. The source publisher lists 639,918 triangles / 640,756 vertices; the downloaded converted GLB contains 1,278,356 triangle-mode faces. Use the extracted output's actual index counts for runtime budgets.

The other user link, [Chess Piece: Knight (Horse) by Tenebrius](https://sketchfab.com/3d-models/chess-piece-knight-horse-dd5c780cce3d46e4b34606e659f437e0) / [6XXpB](https://skfb.ly/6XXpB), is currently view-only: no Download button, API `isDownloadable: false`, empty licence. Its `free` tag does not establish reuse rights. Do not scrape viewer geometry. It needs an authorised source file and creator permission before integration.

## Current exported wooden knight

Run `scripts/prepare-knight.py` using Python with Pillow, as for the existing image pipeline. The script validates source integrity, licence/node identity, accessor layout, geometry counts and output budget. It extracts mesh 5 (upper knight, node 7) and matching mesh 8 (circular base, node 10), preserving their relationship. These are generic `Object_*` names in the source. No decimation is applied.

Source coordinates are Z-up with forward +X. The script centres on mesh 8's base, normalises height and transforms positions/normals to Y-up / forward -Z. It merges the two source meshes into one primitive with 16-bit indices, preserves UVs, and embeds the original wood JPEG re-encoded at quality 90.

The first test used the upper piece's source material 0, which renders pale wood. The selected comparison uses the set's **dark wood material 4** (`White` in the original file), with the same texture and smooth linear/mipmap sampling. Material labels are misleading: the source's `Black` material renders light wood. There are no invented gold rings or flat charcoal material overrides in this review. Keeping wood is an intentional source-appearance comparison after the previous two models were rejected; it is not approval of a final colour direction.

| Export detail | Current value |
|---|---|
| GLB | `public/models/knight.glb`, **765,460 bytes** |
| Geometry | **26,626 triangles**, **13,477 vertices**, no decimation |
| Organisation | One named root and mesh, one opaque PBR primitive |
| Coordinates | Y-up, base centre at origin, floor Y=0, height 1, forward -Z |
| Material | `DarkWood`; source dark-wood tint `[0.1, 0.1, 0.1, 1]`, metalness 0, roughness 0.15 |
| Wood texture | Embedded JPEG, **512x1024**, **172,599 bytes** (original 416,412 bytes) |
| Extra requests/decoders | No external texture or compression decoder |
| Matching fallback | `public/images/hero-knight-wood.webp`, **31,968 bytes**, **1003x1003**, transparent |

The fallback was exported immediately after the actual browser scene rendered its resting pose, using temporary capture DPR 2.5, then converted to WebP at quality 90. Temporary capture code/API and longer development deadline were removed; runtime settings are again **eight seconds** and **DPR <=1.5**. The previous rejected-model fallback was removed. `public/images/hero-knight-bg.webp` remains the original rollback artwork. The new fallback filename avoids stale optimised-image caches.

[Current wood comparison, screenshots and verification](../../verification/chess-3d-hero/oleksandr-review/README.md) record the source light-wood baseline and selected dark-wood desktop/tablet/phone views. Earlier [Bhargav review evidence](../../verification/chess-3d-hero/model-review/README.md) and [prototype evidence](../../verification/chess-3d-hero/README.md) are historical, not measurements or approval of this asset.

## Motion and scrolling clarification

The user asked whether smooth scroll animations are included in the 3D phase. The site **already has native smooth anchor scrolling** in `globals.css` and section entrance reveals in `scroll-reveals.tsx`. These are unchanged. Native wheel/touch scrolling is not replaced by a smoothing library.

Astra's current first phase specifies a **450ms image/canvas crossfade** and **bounded pointer response** after still review. It explicitly excludes scroll-linked knight transforms and pinned multi-screen hero sequences. Scroll currently only gates scene visibility. Do not silently add scroll rotation, parallax or GSAP/Lenis in response to the user's question; agree a specific additional motion scope if requested.

## Integration to preserve

Keep the compact hero, floating navbar, existing typography, HTML copy/actions and section order. No extra hero height or separate mobile artwork row. The canvas is decorative, adds no focus targets and cannot intercept input.

Three 0.186.1, Fiber 9.8.2 and Three typings 0.186.0 are pinned; React remains locked at 19.3.0. No new packages were needed for this model. Preserve the homepage-only lazy boundary and demand rendering. Omit GSAP, Drei, controls, physics and postprocessing initially.

Camera/lights/framing remain unchanged: position `[0, 1.05, 2.7]`, target `[0, 0.46, 0]`, FOV 30 degrees, model yaw 2.2 radians. Three's MIT-licensed RoomEnvironment generates a 256px PMREM; a local 64px texture provides the contact shadow. No environment download or real-time shadow pass is needed.

Enhance only above 1040px with a fine pointer/hover, unrestricted motion/data preferences and successful renderer creation. Phones and touch tablets retain the static image. Wait for initial page and hero-image loading, then idle time. Retain the image until a valid scene frame succeeds. Keep errors, deadline and context loss local to the artwork. Preserve asynchronous cancellation and owned-resource disposal.

## Next milestones and checks

1. Review the current source-selected wooden knight and matching phone/tablet crops with the user.
2. Implement pointer yaw <= +/-4 degrees and pitch <= +/-1.5 degrees, 150ms time-based damping, return to rest and no ongoing frames once settled. Keep the resting pose during crossfade; observe only the artwork region passively.
3. Add one-way DPR reduction from 1.5 to 1.0 during sustained poor active-motion performance, then static fallback if still poor. No continuous benchmark or oscillation.
4. Complete browser tests for reduced-motion changes, Save-Data, slow/blocked assets, context loss, shader/renderer failure, repeated route navigation and no scene requests on unrelated routes.
5. Measure production transfer totals, LCP/CLS, frame pacing, idle renders and resource behaviour on representative hardware. Model size/triangle limits alone do not prove runtime performance.
6. Review PR/Vercel preview and merge only when authorised.

Run typecheck, unit tests and one production build sequentially. Stop development before building, reuse one `.next` directory, then run `tests/http.mjs` against a local fixture with `SITE_URL=http://localhost:3000`. It includes API requests and must never target production. This workstation has previously exhausted RAM/swap: avoid duplicate servers/builds and simultaneous large render jobs.

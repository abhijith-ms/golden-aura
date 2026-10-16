# Chess 3D hero: handoff

Last updated: 2026-10-16. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim. Source SHA-256: `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- The user authorised implementation on `codex/chess-3d-hero`, based on `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b` (merged PR #4). The remote belongs to `abhijith-ms`; verify the active GitHub account before every push.
- The stationary, deferred desktop scene and matching static fallback are implemented. **Production has not changed. No merge is authorised by this still review.**
- The user rejected **both the Poly Haven and Bhargav Limje knights**. The Bhargav asset remains in the branch as a rejected prototype. Do not treat it as approved or continue polishing it. The user explicitly requires **free assets only** and has supplied two specific alternatives below.
- Draft [PR #5](https://github.com/abhijith-ms/golden-aura/pull/5) and its [Vercel review preview](https://golden-aura-git-codex-chess-3d-hero-abhijith-mss-projects.vercel.app/) contain the rejected Bhargav prototype. They have not been merged.
- Next: obtain and try the user's supplied model, review its still composition, then implement bounded pointer response and adaptive DPR followed by remaining failure/performance checks. Do not call the full 3D phase complete.

## User-supplied alternatives — current priority

Checked on 2026-10-16 through the actual model pages, the first model's download button and Sketchfab's public model metadata API. No new runtime asset was downloaded or substituted during this check.

| User link | Model and creator | Access and rights |
|---|---|---|
| [Ly8C](https://skfb.ly/Ly8C) | [Chessboard by Oleksandr Zymohliad](https://sketchfab.com/3d-models/chessboard-3cee8ada5d99468cbc93ded83b3ca70a) | Free download; CC BY 4.0 permits commercial reuse with attribution. Download button opens the Sketchfab login dialog in the current browser. Needs the downloadable glTF/GLB or original archive from a signed-in user. |
| [6XXpB](https://skfb.ly/6XXpB) | [Chess Piece: Knight (Horse) by Tenebrius](https://sketchfab.com/3d-models/chess-piece-knight-horse-dd5c780cce3d46e4b34606e659f437e0) | Public preview only: no Download button, API `isDownloadable: false`, empty licence object. Its `free` tag does not supply reuse rights. Requires an authorised source file and creator permission before integration. |

The first set has a traditional wooden knight with a curved neck and circular base; preserve its appearance for the initial comparison. Its 639,918 triangles / 640,756 vertices describe the entire board, not the isolated knight. Extract only the knight, inspect its actual geometry and textures, then optimise. Do not discard useful sculpting simply to hit an arbitrary triangle count or immediately replace all original materials.

The second has a more defined horse head and mane and a dark marble finish. Its listed geometry is 11,104 triangles / 5,554 vertices. It is promising visually, but public viewing and a `free` tag do not authorise extracting the viewer's geometry. Do not scrape its viewer resources or substitute an unverified lookalike.

Current blocker: source access. Request the first model's downloaded ZIP in `refernce and guide/3d-source/` (glTF with its `.bin` and texture files, GLB, or original Blender archive). Do not request passwords or API tokens. No new source files means no honest in-hero comparison yet. Keep the existing loading/fallback integration and production site intact while awaiting the source.

## Current branch asset — rejected, pending replacement

Knight from [Wooden Chess Board by Bhargav Limje](https://sketchfab.com/3d-models/wooden-chess-board-feca51cdf6114927abdb4b4dc538c2b7). The source GLB identifies the author as `bhargavslimjes24`, title `Wooden Chess Board`, source Sketchfab URL and **CC BY 4.0**. The publisher's model page also lists CC Attribution. [The licence](https://creativecommons.org/licenses/by/4.0/) allows commercial use, modification and redistribution with credit, a licence link and an indication of changes. These are supplied in the footer, GLB metadata and `public/models/knight.LICENSE.txt`. No paid, NC or ND asset is used.

The complete 25,396,616-byte source board is redistributed publicly by [Stefan Salewski](https://github.com/StefanSalewski/Bevy-3D-Chess/blob/b5edff7481f5d210b91bb80013bf90d3712fe6c2/assets/models/wooden_chess_board.glb), with the original creator/licence metadata embedded. This is **Bhargav Limje's asset**, not the Ronildo asset also mentioned in that repository's source comments. The local source stays ignored at `refernce and guide/3d-source/cc-by-chess-set/source.glb`.

Source SHA-256:

```text
d2cb8b2b21a69e998a8725f41c5da28390d1f0092ec82831d53e4b0854d49bfc  source.glb
```

To reproduce, download that pinned GitHub file into the ignored source path and run `python3 scripts/prepare-knight.py`. The script uses only Python's standard library and checks the source hash, node identity, licence metadata, accessor layout, geometry counts and output budget before writing the GLB. It isolates mesh 3, beneath `Black Knight _4` / node 10, discards board-placement transforms, converts 32-bit source indices to 16-bit, removes all textures/UV sets, normalises height and turns the original -X forward direction to -Z.

| Export detail | Current value |
|---|---|
| GLB | `public/models/knight.glb`, **732,248 bytes** |
| Geometry | **39,040 triangles**, 20,675 vertices; no decimation |
| Organisation | One named root/mesh, two opaque material primitives |
| Coordinates | Y-up, base centre at origin, floor Y=0, height 1, forward -Z |
| Charcoal | `#1a1e1c`, metalness 0.35, roughness 0.4 |
| Gold | `#c4af78`, metalness 1, roughness 0.28 |
| Accents | Existing narrow base mouldings and a thin central mane edge |
| Textures/decoders | None in the model; detail comes from geometry |
| Matching fallback | `public/images/hero-knight-sculpture.webp`, **36,354 bytes**, 1024x1024, transparent |

This geometry has an open jaw and carved neck, but the user rejected its appearance. Its larger triangle count did not solve the visual problem. Keep these asset details for reproducibility of the current branch, not as a recommendation.

[Replacement screenshots and comparison notes](../../verification/chess-3d-hero/model-review/README.md) include the rejected prototype baseline, the new model with unchanged lighting, the refined desktop treatment and tablet/phone crops. Only one accessible replacement was integrated after screening the other candidates; do not claim multiple replacement GLBs were tested.

The fallback was exported immediately after the **actual browser scene** rendered the resting pose, at temporary capture DPR 2.5, then downsampled to 1024 and converted to WebP at quality 90. The temporary capture route, code, longer development deadline and elevated DPR were removed. Normal settings are again **eight seconds** and **DPR <=1.5**. The old prototype fallback was removed; the original `public/images/hero-knight-bg.webp` remains for rollback. A distinct new fallback filename avoids stale optimised-image caches.

## Decisions to carry forward

Use one inward-facing charcoal knight, restrained champagne gold, warm studio lighting and a soft contact shadow. Keep the compact hero, floating navbar, existing typography, server-rendered content, links and section order.

Three.js 0.186.1, React Three Fiber 9.8.2 and Three typings 0.186.0 are pinned. React remains locked at 19.3.0. Do not upgrade the framework for this work. Omit GSAP, Drei, controls, physics and postprocessing; the current local integration is sufficient.

The camera, lights and framing are unchanged from the prototype: position `[0, 1.05, 2.7]`, target `[0, 0.46, 0]`, FOV 30 degrees, model yaw 2.2 radians. Three's MIT-licensed `RoomEnvironment` generates a local 256px PMREM; the 64px contact shadow is generated locally. No environment download is required.

Enhance only above 1040px with a fine pointer and hover, unrestricted motion/data preferences and successful renderer creation. Phones and touch tablets stay static. Wait for page and hero-image loading, then an idle opportunity. Keep the image until an actual scene frame succeeds; crossfade over 450ms. Keep loading errors, timeout, scene failure and context loss local to the artwork. No scroll movement or added hero height. The canvas is decorative, cannot intercept input and adds no keyboard stop.

Keep `hero-scene.tsx` behind the homepage-only lazy controller. Use demand rendering, visibility gating and owned-resource cleanup. Never replace the static HTML/copy with a canvas. Motion must stop when settled, hidden or offscreen, and reduced-motion changes must remove enhancement.

## Earlier candidate research

- Poly Haven / Riley Queen's CC0 Chess Set: rejected by the user as too basic. Original prototype is recoverable in commit `4358a7c`; source hashes and its preparation method are recorded in that commit's handoff. It is no longer the selected runtime asset.
- Trinh Hoang Hieu's Sketchfab knight and Jeyhun1985's Staunton knight: CC BY; visually screened, but shapes were still too soft/stylised. The latter also lists 667.4k triangles.
- WChargin's BlendSwap sculpt: visually screened and rejected for its crude rounded form and separate particle mane.
- Ronildo Facanha's [Realistic 3D Chess Pieces](https://sketchfab.com/3d-models/realistic-3d-chess-pieces-blender-fbb81d5dc8854f41b6e2db6673daefb3): CC BY, promising defined neck/mane; source download requires site access and was not obtained. Not integrated or cleared as a shipped source.
- MiriamAHoyt's [Staunton set](https://blendswap.com/blend/18589): CC0, but source download requires sign-in. Not downloaded or integrated.
- Moshe Caine's carved scan: no downloadable/clearly licensed source; excluded. Paid, NC and ND alternatives were excluded.

## Verification and next milestones

The initial prototype passed typecheck, 20 unit tests, a production build and local HTTP checks; its historical evidence remains in [the first verification record](../../verification/chess-3d-hero/README.md). The replacement has its own [current review record](../../verification/chess-3d-hero/model-review/README.md). Do not present historical prototype checks as replacement measurements.

1. Obtain and compare the user's supplied model(s), regenerate the matched fallback and review the replacement still and phone/tablet crops. Both earlier asset choices were rejected.
2. Implement pointer yaw <= +/-4 degrees and pitch <= +/-1.5 degrees, 150ms time-based damping, return to rest, and no frames while settled. Keep resting pose during crossfade; observe the hero passively only in its artwork region.
3. Add one-way DPR reduction from 1.5 to 1.0 on sustained poor performance during actual motion, then static fallback if still poor. No continuous benchmark or oscillation.
4. Complete browser tests for reduced-motion changes, Save-Data, slow/blocked downloads, context loss, shader/renderer failure and repeated route navigation. Verify no scene requests on unrelated routes.
5. Measure production transfer totals, LCP/CLS impact, active frame pacing, idle renders and GPU/resource behaviour on representative hardware. The triangle/download budgets alone do not establish performance.
6. Review via PR and Vercel preview, then merge only when authorised.

Run typecheck, unit tests and one production build sequentially. Stop the dev server before building and use one `.next` directory. Run `tests/http.mjs` only against the local fixture: it includes API requests and rejects remote hosts. The workstation has previously exhausted RAM and swap; avoid duplicate servers, builds or large simultaneous render jobs.

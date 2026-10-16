# Chess 3D hero: handoff

Last updated: 2026-10-16. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim. Source SHA-256: `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- Work is on `codex/chess-3d-hero`, based on `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b`. Verify the active GitHub account is `abhijith-ms` before pushing.
- The user rejected both earlier knight models: Poly Haven / Riley Queen, then Wooden Chess Board by Bhargav Limje. Neither is an approved visual direction. Their source/review history remains in earlier commits and verification folders.
- The user supplied two alternatives and downloaded **Chessboard by Oleksandr Zymohliad**. Its knight is now extracted and integrated with the set's dark wood finish, on a small procedural board. **The hero-to-introduction prototype needs visual review before extending effects to other sections.**
- [Draft PR #5](https://github.com/abhijith-ms/golden-aura/pull/5) and [Vercel branch preview](https://golden-aura-git-codex-chess-3d-hero-abhijith-mss-projects.vercel.app/) are the review surfaces. No production merge is authorised.
- **Current scope changed on 2026-10-16:** the user requested 3D/parallax and supplied [Astra's revised motion plan](astra-revised-motion-plan.md), saved verbatim (SHA-256 `251f627af8ca614e6ded848748870ef25b4753539539a97de68601b5b58e7111`). Build a reviewable **hero-to-introduction prototype first**. Its shallow board, 12–18-degree scroll turn, viewpoint shift, layered parallax and desktop smoothing trial supersede the original pointer-only/no-board/no-scroll constraints. Keep the technical foundation and compact layout. Hold gallery/card choreography until visual approval.
- Adaptive DPR and remaining resilience/performance checks are still pending; do not report the entire 3D phase complete.

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
| Current matching fallback | `public/images/hero-knight-board.webp`, **40,574 bytes**, **1003x1003**, transparent |

The board fallback was exported immediately after the actual browser scene rendered its resting pose, using temporary capture DPR 2.5, then converted to WebP at quality 90. Temporary capture code/API and frame counters were removed; runtime settings remain **eight seconds** and **DPR <=1.5**. `hero-knight-wood.webp` retains the prior knight-only comparison, and `hero-knight-bg.webp` remains the original rollback artwork. The new fallback filename avoids stale optimised-image caches.

[Current wood comparison, screenshots and verification](../../verification/chess-3d-hero/oleksandr-review/README.md) record the source light-wood baseline and selected dark-wood desktop/tablet/phone views. Earlier [Bhargav review evidence](../../verification/chess-3d-hero/model-review/README.md) and [prototype evidence](../../verification/chess-3d-hero/README.md) are historical, not measurements or approval of this asset.

## Motion and scrolling clarification

The user asked whether smooth scroll animations are included in the 3D phase. The site **already has native smooth anchor scrolling** in `globals.css` and section entrance reveals in `scroll-reveals.tsx`. These are unchanged. Native wheel/touch scrolling is not replaced by a smoothing library.

The original plan specified a **450ms image/canvas crossfade** and **bounded pointer response**. The user's subsequent 3D/parallax request and revised Astra plan explicitly expand this to a hero-to-introduction prototype with GSAP/ScrollTrigger and a light Lenis desktop trial. The complete revised plan is linked above. Do not add pinning, extra page length, more pieces or effects across the rest of the homepage before this prototype is reviewed.

## Integration to preserve

Keep the compact hero, floating navbar, existing typography, HTML copy/actions and section order. No extra hero height or separate mobile artwork row. The canvas is decorative, adds no focus targets and cannot intercept input.

Three 0.186.1, Fiber 9.8.2 and Three typings 0.186.0 are pinned; React remains locked at 19.3.0. The revised prototype adds GSAP 3.15.0, @gsap/react 2.1.2 and Lenis 1.3.27. Preserve the homepage-only lazy boundary and demand rendering. No Drei, controls, physics or postprocessing.

The prototype keeps camera position `[0, 1.05, 2.7]`, FOV 30 degrees and model yaw 2.2 radians. The resting target moves to `[0, 0.36, 0]` so the board fits with clear space below the navbar. The procedural 1.08-unit board has four-by-four muted charcoal/gold squares, a thin edge and dark sides: three additional drawable meshes, five total with knight and contact shadow. Its texture is a local 4x4 RGBA DataTexture, with no download. Three's MIT-licensed RoomEnvironment generates a 256px PMREM; the existing 64px texture provides the contact shadow. No full source board, environment download, real-time shadow or reflection pass is used.

After the 450ms matching handoff, one GSAP/ScrollTrigger timeline spans the existing hero height (no pin/spacer). It turns the outer scene group up to 16 degrees, tilts it by -0.045 radians and raises camera Y by up to 0.18 units. The artwork moves down up to 88px / scales to 1.035; copy moves 28px and fades only to 0.7; the introduction heading shifts up 18px. Scrub catch-up is 0.35s. A separate inner knight group handles passive pointer response, capped at +/-4 degrees yaw and +/-1.5 degrees pitch with 150ms damping and an exact resting snap. No input capture or touch gestures are added. Artwork has an 800ms first-paint entrance; content remains immediately usable.

Lenis uses lerp 0.12 and the same GSAP ticker, with native touch and anchors preserved. Keyboard navigation and clicks interrupt wheel inertia. It is scoped to the eligible deferred homepage scene and destroyed on unmount, failure or eligibility changes. The ticker callback is removed while the document is hidden. A Lenis callback is not a continuous WebGL render loop: Fiber remains demand-driven and only invalidates while scroll/pointer transforms change. All ScrollTriggers, inline transforms and listeners are reverted on cleanup.

[Prototype evidence, scroll demo and verification](../../verification/chess-3d-hero/motion-prototype/README.md) record the current motion and responsive review. Earlier still-review evidence above remains historical.

Enhance only above 1040px with a fine pointer/hover, unrestricted motion/data preferences and successful renderer creation. Phones and touch tablets retain the static image. Wait for initial page and hero-image loading, then idle time. Retain the image until a valid scene frame succeeds. Keep errors, deadline and context loss local to the artwork. Preserve asynchronous cancellation and owned-resource disposal.

## Next milestones and checks

1. Review the hero-to-introduction prototype, its short recording and phone/tablet composition with the user. Do not extend motion to tournament cards or the community gallery before visual approval.
2. Add one-way DPR reduction from 1.5 to 1.0 during sustained poor active-motion performance, then static fallback if still poor. No continuous benchmark or oscillation.
3. Complete browser tests for actual reduced-motion/network preference changes, context loss, shader/renderer failure, extended navigation/resource profiling and engine-request isolation. Policy unit tests, basic route cleanup and a missing-model browser check are covered; these are not the full resilience matrix.
4. Measure production transfer totals, LCP/CLS and frame pacing on representative hardware. Local temporary counters confirmed settling/offscreen cessation, not a 60fps performance sign-off or proof of total GPU memory.
5. Review PR/Vercel preview and merge only when authorised.

Run typecheck, unit tests and one production build sequentially. Stop development before building, reuse one `.next` directory, then run `tests/http.mjs` against a local fixture with `SITE_URL=http://localhost:3000`. It includes API requests and must never target production. This workstation has previously exhausted RAM/swap: avoid duplicate servers/builds and simultaneous large render jobs.

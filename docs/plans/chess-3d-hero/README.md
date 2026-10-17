# Chess 3D hero: handoff

Last updated: 2026-10-17. Read this file before resuming 3D hero work.

## Status and authority

- [Astra's complete plan](astra-plan.md) is preserved verbatim. Source SHA-256: `905c9eac7af4fef8b89caf988585b1116148682ab3dced430fc3f8eb3c65f287`.
- Work is on `codex/chess-3d-hero`, based on `main` at `54d08ae09161f1561ca6b275a028e65e2dafa75b`. Verify the active GitHub account is `abhijith-ms` before pushing.
- The user rejected both earlier knight models: Poly Haven / Riley Queen, then Wooden Chess Board by Bhargav Limje. Neither is an approved visual direction. Their source/review history remains in earlier commits and verification folders.
- The user supplied two alternatives and downloaded **Chessboard by Oleksandr Zymohliad**. Its knight is extracted with the set's dark wood finish. **Current review: a cinematic opening with board and proportion polish. The user said this looks far better and requested higher board quality and corrected piece sizes.**
- [Draft PR #5](https://github.com/abhijith-ms/golden-aura/pull/5) and [Vercel branch preview](https://golden-aura-git-codex-chess-3d-hero-abhijith-mss-projects.vercel.app/) are the review surfaces. No production merge is authorised.
- **Current scope changed on 2026-10-16:** the user requested 3D/parallax and supplied [Astra's revised motion plan](astra-revised-motion-plan.md), saved verbatim (SHA-256 `251f627af8ca614e6ded848748870ef25b4753539539a97de68601b5b58e7111`). Build a reviewable **hero-to-introduction prototype first**. Its shallow board, 12–18-degree scroll turn, viewpoint shift, layered parallax and desktop smoothing trial supersede the original pointer-only/no-board/no-scroll constraints. Keep the technical foundation and compact layout. Hold gallery/card choreography until visual approval.
- **Latest user direction:** after accepting the cinematic direction and requesting board/proportion polish, the user said “Proceed with next step.” This pass adds adaptive rendering quality. It preserves the board, pieces, motion and layout. Other homepage choreography remains unchanged.
- Adaptive DPR is implemented and its integration is verified with controlled synthetic frame samples. Representative-device calibration and the remaining resilience/performance checks are still pending; do not report the entire 3D phase complete.
- **New creative proposal, planning only:** the user suggested a queen entering from the viewer's side, briefly filling the viewport and then receding onto the board. [The saved queen fly-in proposal](queen-fly-in-plan.md) records the storyboard, model gate, fullscreen-to-hero projection problem, input/replay rules and performance checks. No queen asset is selected and no application code was changed for this proposal. The current hero remains the deployed review version until implementation is requested.

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
| Current opening fallback | `public/images/hero-tournament-board.webp`, **88,114 bytes**, **1648x1030**, transparent |

The current opening fallback was captured from the actual browser scene before its one-time move, at temporary DPR 2, and encoded as WebP quality 90. It matches the opening camera, polished board and corrected piece positions/scales. Once the story has advanced, an enhancement failure deliberately restores this initial composition. Temporary capture code/API are removed before production. Runtime remains **eight seconds** and **DPR <=1.5**. The earlier `hero-opening-move.webp`, `hero-knight-board.webp`, `hero-knight-wood.webp` and original `hero-knight-bg.webp` remain available for rollback.

[Current wood comparison, screenshots and verification](../../verification/chess-3d-hero/oleksandr-review/README.md) record the source light-wood baseline and selected dark-wood desktop/tablet/phone views. Earlier [Bhargav review evidence](../../verification/chess-3d-hero/model-review/README.md) and [prototype evidence](../../verification/chess-3d-hero/README.md) are historical, not measurements or approval of this asset.

## Motion and scrolling clarification

The user asked whether smooth scroll animations are included in the 3D phase. The site **already has native smooth anchor scrolling** in `globals.css` and section entrance reveals in `scroll-reveals.tsx`. These are unchanged. Touch and anchor scrolling remain native; eligible desktop wheel scrolling uses the Lenis trial described below.

The original plan specified a **450ms image/canvas crossfade** and **bounded pointer response**. The user's subsequent 3D/parallax request and revised Astra plan explicitly expand this to a hero-to-introduction prototype with GSAP/ScrollTrigger and a light Lenis desktop trial. The complete revised plan is linked above. Do not add pinning, extra page length or effects across the rest of the homepage before this prototype is reviewed. The latest user request explicitly allows experimentation with more pieces in the hero.

## Integration to preserve

Keep the compact hero, floating navbar, existing typography, HTML copy/actions and section order. No extra hero height or separate mobile artwork row. The canvas is decorative, adds no focus targets and cannot intercept input.

Three 0.186.1, Fiber 9.8.2 and Three typings 0.186.0 are pinned; React remains locked at 19.3.0. The revised prototype adds GSAP 3.15.0, @gsap/react 2.1.2 and Lenis 1.3.27. Preserve the homepage-only lazy boundary and demand rendering. No Drei, controls, physics or postprocessing.

The current cinematic experiment expands the artwork to a 1.6 aspect ratio, height `calc(100% - 70px)` capped at 560px, anchored at the hero bottom. Hero height, HTML copy/actions and navbar are unchanged. Tablet/phone crops use the opening fallback; there is no new mobile artwork row.

The polished board has a full **8x8** playing surface, 3.36 units across on the existing 0.42-unit grid, inside a 3.63-unit bevelled walnut frame. Two thin champagne inlays outline its frame and playing surface. Locally generated 1024px colour and bump textures add directional wood grain; mipmaps and anisotropy capped at 8 improve angled sampling. The two RGBA textures use about 10.7 MiB including mipmaps, with no extra texture downloads. Both are disposed on unmount. A left-edge CSS mask blends the larger board into the hero background.

The actual knight base diameter is about 0.5004 units before scaling. Its scale is now **0.68**, so the base occupies about 81% of one square instead of overhanging it at scale 1.12. Both lathed pawns use scale **0.8** and the rook **0.88**; their bases fit the same grid, and their heights remain below the knight. The knight's contact plane is correspondingly smaller. Gold pawn starts one rank farther forward for a separate opening silhouette. Two pawns and a rook remain procedural with no downloads; four local contact shadows remain. The earlier version measured **33,262 triangles / 18 draw calls**; those are historical complexity counts, not measurements of the polished board or representative-device performance approval.

Opening camera: `[2.8, 2.1, 3.8]`, target `[0.15, 0.35, 0]`, FOV 27 degrees. After the unchanged 450ms image/canvas handoff, a 2.1s GSAP sequence arcs camera X to 1.8 / Y to 2.25 / Z to 4.15. The knight, scaled 0.68, hops from `[-0.21, 0, 0.63]` to `[0.63, 0, 0.21]`, a two-file/one-rank move on 0.42-unit squares, with a 0.32-unit arc. Gold pawn moves from `[-0.63, 0, 1.05]` to `[-0.63, 0, 0.63]`; ivory rook slides one square with staggered timing. A muted landing-square highlight develops under the knight. The sequence runs once per scene mount, pauses offscreen/hidden, and does not replay when returning to the hero.

Scroll adds up to 0.48 radians of board yaw, 0.06 radians of tilt and a stronger camera reveal through the same pose calculation. Artwork parallax is up to 104px / scale 1.04; copy remains 28px / opacity >=0.7; introduction heading shifts -18px. There is no pinning or extra scroll distance. Pointer damping remains on its separate inner knight group, capped at +/-4 degrees yaw and +/-1.5 degrees pitch. The opening and scroll therefore cannot overwrite each other's camera state.

Three's RoomEnvironment and the existing local 64px contact texture remain; there are no real-time shadows, reflection passes, postprocessing, full-source-board downloads or new dependencies.

Lenis uses lerp 0.12 and the same GSAP ticker, with native touch and anchors preserved. Keyboard navigation and clicks interrupt wheel inertia. It is scoped to the eligible deferred homepage scene and destroyed on unmount, failure or eligibility changes. The ticker callback is removed while the document is hidden. A Lenis callback is not a continuous WebGL render loop: Fiber remains demand-driven and only invalidates while scroll/pointer transforms change. All ScrollTriggers, inline transforms and listeners are reverted on cleanup.

Adaptive quality samples existing `useFrame` intervals only while the opening timeline, ScrollTrigger's actual scrub tween or unsettled pointer damping is active. Preparation and the 450ms handoff are excluded. Each motion session skips its first delta (which may contain idle time), allows 250ms warm-up, then requires at least one second and 12 intervals. A window is poor when at least 60% of intervals exceed 30ms. One poor window lowers the DPR cap from 1.5 to 1; another poor window at low quality invokes the existing terminal image fallback. A scene starting at native DPR <=1 goes directly to fallback on sustained poor motion. These are initial responsiveness thresholds, not representative-device performance approval.

The cap belongs to `HeroArtwork`, so it survives temporary responsive/eligibility teardown and cannot rise again during that homepage visit. Sampling resets across pauses without raising the quality. The monitor adds no timer, benchmark loop, `requestAnimationFrame`, render invalidation or dependency. Static fallback removes the canvas, Lenis and GSAP transforms; resizing cannot restart a failed enhancement during that visit. A fresh homepage visit can enhance again.

[Adaptive-quality verification](../../verification/chess-3d-hero/adaptive-quality/README.md) records unit tests, controlled browser DPR/fallback transitions and limits. Temporary synthetic sample overrides and DOM counters were removed before production build.

[Current board/proportion polish and verification](../../verification/chess-3d-hero/board-polish/README.md) document the latest review. The [cinematic experiment](../../verification/chess-3d-hero/cinematic-experiment/README.md), [earlier motion prototype](../../verification/chess-3d-hero/motion-prototype/README.md) and still comparisons are historical.

Enhance only above 1040px with a fine pointer/hover, unrestricted motion/data preferences and successful renderer creation. Phones and touch tablets retain the static image. Wait for initial page and hero-image loading, then idle time. Retain the image until a valid scene frame succeeds. Keep errors, deadline and context loss local to the artwork. Preserve asynchronous cancellation and owned-resource disposal.

## Next milestones and checks

1. Complete browser tests for actual reduced-motion/network preference changes, context loss, shader/renderer failure, extended navigation/resource profiling and engine-request isolation. Policy unit tests, basic route cleanup, a missing-model check and synthetic adaptive-quality integration are covered; these are not the full resilience matrix.
2. Measure production transfer totals, LCP/CLS and frame pacing on representative hardware, and calibrate the adaptive thresholds. Local counters confirm settling and controlled DPR transitions, not a 60fps sign-off or proof of total GPU memory.
3. After this foundation is approved, refine tournament-card and community-gallery motion without extra scroll length or blocked actions.
4. Review PR/Vercel preview and merge only when authorised.

Run typecheck, unit tests and one production build sequentially. Stop development before building, reuse one `.next` directory, then run `tests/http.mjs` against a local fixture with `SITE_URL=http://localhost:3000`. It includes API requests and must never target production. This workstation has previously exhausted RAM/swap: avoid duplicate servers/builds and simultaneous large render jobs.

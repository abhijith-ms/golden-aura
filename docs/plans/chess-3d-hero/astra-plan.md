I recommend **one stationary charcoal-and-gold knight, with subtle pointer response on capable desktop devices and a matching static image everywhere else**. Use Three.js through React Three Fiber, preserve the current hero dimensions and HTML content, and omit GSAP from the initial implementation.

I inspected the repository and the [live website](https://golden-aura-pi.vercel.app/), including desktop, tablet, and narrow mobile layouts. No files, dependencies, branches, or deployments were changed.

The current implementation provides a good foundation:

- [Homepage](/home/abhijithms/Documents/Work/golden-aura/src/app/page.tsx) is server-rendered and separates decorative artwork from headings and links.
- [Hero CSS](/home/abhijithms/Documents/Work/golden-aura/src/components/site.module.css:28) uses `min-height: clamp(480px, 65vh, 640px)`, with responsive overrides. These are minimums; wrapped content can legitimately make the hero taller.
- The existing knight WebP is only **49,292 bytes**, before Next.js image optimisation. The enhancement must preserve that inexpensive initial presentation.
- [Package configuration](/home/abhijithms/Documents/Work/golden-aura/package.json) specifies Next.js **16.4.0**, React/React DOM **^19.2.3**, and TypeScript **^5.9.3**. The lockfile resolves React/React DOM to **19.3.0** and TypeScript to **5.9.3**.
- Three.js, Fiber, and GSAP are absent. Manrope and DM Sans are already implemented.
- The README’s opening chessboard description and closing external-video description are outdated; its compact-layout section agrees with the current knight hero and inline videos.

**The visual direction should resemble a carefully lit chess sculpture.** Use a detailed Staunton-style knight with a strong muzzle, readable mane, gently bevelled edges, and a circular chess-piece base. The silhouette should carry the detail at normal viewing size.

| Element | Recommended specification |
|---|---|
| Main material | Near-black charcoal, satin finish; starting roughness around 0.4–0.55. Avoid glossy black surfaces that disappear without strong reflections. |
| Gold | Muted champagne gold, close to the existing `#c4af78`; narrow base rings and selected mane/bridle detailing. Roughly 5–10% of visible surface area. |
| Surface detail | Fine normal-map detail and restrained roughness variation. Avoid scratches, excessive ornament, glowing eyes, or animated highlights. |
| Lighting | Broad warm key from upper front-left, weaker neutral fill, and a restrained rear-right rim. A small studio environment supplies readable metal reflections. |
| Background | Existing `#111312` family, with the existing dark gradients above the artwork. No particles or moving background. |
| Grounding | Soft baked contact shadow beneath the base. No real-time reflection or shadow pass initially. |
| Camera | Fixed perspective camera, approximately 30° vertical field of view, looking slightly downward at the piece’s midsection. Knight faces inward toward the copy in a three-quarter view. |
| Board/pedestal | Omit both. The knight’s own base and contact shadow provide sufficient grounding without extra visual weight. |

On desktop, keep the copy in its existing left-hand area. Centre the knight approximately 75–80% across the hero, occupying about 65–75% of its height. Its top must remain below the floating navbar, and its base must clear the bottom discovery link. Validate its entire permitted movement envelope against those boundaries.

On tablets, retain the existing stronger overlay and place the knight farther right, accepting modest cropping of its base. Touch tablets should receive the static rendering initially. On phones, retain the current background treatment behind the copy; do not add a separate artwork row or increase the hero height.

The final resting frame is the primary composition. Approve it as a still image before adding motion. Preserve the current typography, spacing, section sizes, tournament cards, and content order.

The motion should follow this sequence:

| Stage | Behaviour |
|---|---|
| First paint | Server-rendered heading, description, buttons, and existing knight image appear immediately. The current CSS text entrance remains independent of 3D. |
| Eligibility check | After hydration, check motion preferences, input capabilities, available layout space, and connection hints. Ineligible visitors remain on the image without downloading the engine or model. |
| Loading | On eligible devices, wait until the hero image has loaded and initial page loading has completed; schedule enhancement work during an idle opportunity. Keep the image visible with no spinner or progress indicator. |
| Preparation | Load the model and environment, establish final lighting, prepare shaders, and render a valid frame beneath the image. Successful download alone does not mean “ready.” |
| Handoff | Crossfade the image to the matching live frame over **450ms**, using `cubic-bezier(0.22, 1, 0.36, 1)`. Keep the model in its resting pose throughout the fade. |
| Interaction | After the fade, fine-pointer movement over the artwork region produces at most **±4° yaw and ±1.5° pitch**. Keep the camera fixed. |
| Settling | Use time-based damping with an approximately **150ms time constant**. On pointer exit, return to rest within roughly 600–800ms; snap to the final value below a small angular threshold. |
| Idle | Stop requesting frames once settled. Resume only for a relevant pointer change, resize, visibility transition, or asset/state change. |

Do not animate in response to hovering buttons or selecting text. Observe passive pointer movement on the hero container, restrict the response to the artwork region, and leave the canvas itself non-interactive.

There should be **no scroll-linked transformation** in this phase. Scroll only determines whether the scene is visible and allowed to render. Touch receives no drag, tilt, gyroscope, or gesture interaction. The polish comes from material quality, the matched handoff, and short, controlled responses.

The current image is suitable for development and fallback while the asset is being selected. However, an unrelated model cannot transition perfectly from it. **A matching render from the final scene is a release requirement**, with the current image retained as the original rollback asset.

For implementation, use this dependency selection:

| Option | Decision and reason |
|---|---|
| Direct Three.js | Viable, with fewer packages, but requires manual renderer, resize, scheduling, and React lifecycle integration. |
| Three.js + Fiber | **Preferred.** Declarative scene composition and demand rendering reduce the custom lifecycle code needed here. |
| GSAP | Omit initially. A native opacity transition plus Fiber damping covers the approved storyboard. |
| `@gsap/react` | Useful if GSAP is subsequently introduced: its scoped cleanup helps with unmounts and Strict Mode. It does not replace listener or observer cleanup. |
| Drei | Omit initially. Three’s `GLTFLoader`, a fixed camera, simple lights, and a baked shadow cover the requirements. |
| Other libraries | No controls, postprocessing, physics, global state, or animation framework. |

The verified stable starting versions are **`three@0.186.1` and `@react-three/fiber@9.8.1`**, with compatible `@types/three` development typings selected at implementation time. Fiber 9.8 added React 19.3 compatibility; 9.8.1 also fixes renderer disposal on unmount. Its declared React peer range includes the repository’s locked version. Fiber **10 is currently alpha** and should not be used for this phase. Recheck package metadata when implementation starts, pin the chosen versions, and avoid unrelated framework upgrades. [Fiber releases](https://github.com/pmndrs/react-three-fiber/releases), [Fiber peer dependencies](https://raw.githubusercontent.com/pmndrs/react-three-fiber/v9.8.1/packages/fiber/package.json), [Three package metadata](https://registry.npmjs.org/three/latest), [Fiber documentation](https://r3f.docs.pmnd.rs/getting-started/introduction).

If later art review requires a coordinated 3D entrance, GSAP’s current non-prerelease package version is **3.15.0**, with **`@gsap/react` 2.1.2** declaring React `>=17`. Assign GSAP an outer entrance group and Fiber an inner pointer-response group; never let both write the same rotation or position. GSAP updates must call Fiber’s `invalidate()`, with an initial frame scheduled before starting the tween and a final frame on completion. Kill the timeline when suspended or unmounted. [GSAP package](https://raw.githubusercontent.com/greensock/GSAP/master/package.json), [React integration package](https://raw.githubusercontent.com/greensock/react/main/package.json), [GSAP lifecycle guidance](https://gsap.com/resources/React/).

**Asset quality is the largest outstanding dependency.** The production handoff should include:

| Requirement | Initial target |
|---|---|
| Format | glTF 2.0 binary `.glb`, self-contained geometry and textures |
| Geometry | 20,000–40,000 rendered triangles; review anything above 50,000 |
| Materials | Two principal opaque PBR materials: charcoal and gold |
| Draw calls | At most six for the complete steady scene, including grounding |
| Textures | Prefer 1K maps; allow one 2K normal map only if close inspection demonstrates a useful improvement |
| Download | GLB at or below 1MB; model, environment, and shadow together at or below 1.3MB transferred |
| Organisation | One named root; a few meshes grouped by material, rather than separate meshes for every ornament |
| Coordinates | Y-up, base centre at origin, base resting on Y=0, normalised height of one unit; document the forward axis |
| Export hygiene | Applied transforms, correct normals, no rig, animation clips, hidden meshes, embedded lights, or unused textures |
| Source handoff | Editable source model, texture sources, export settings, material names, and licence evidence |

Essential assets are the GLB, its required textures, a small licensed studio environment, baked grounding, and matching fallback renders. Extra detail maps, larger textures, and additional chess pieces are optional and should remain outside the first delivery.

Start without Draco, Meshopt, or KTX2 decoding. Compare the exported asset against the transfer and memory budgets first. Compression is justified only if the measured download or GPU-memory savings outweigh decoder transfer, startup, and maintenance costs. A small model with two materials may meet the budget through ordinary geometry cleanup and modest textures.

Prefer sourcing an editable model whose silhouette already fits the approved reference, followed by material and geometry refinement. This is usually the shortest path. Commission a model if suitable candidates fail the silhouette, licence, or optimisation requirements. Commissioning offers greater control but introduces art iteration and delivery risk. The existing 2D image is a reference, not a production model source.

Before accepting any asset, retain evidence of commercial website use, modification rights, and permission to distribute it within a downloadable web asset. Check model, texture, and environment licences separately; record any attribution obligation and its required placement. No asset has yet been selected or cleared.

Produce the final fallback through the **actual browser scene**, using its camera, tone mapping, exposure, background, and resting pose. Export approved desktop and mobile crops as WebP. This avoids a Blender render looking materially different from the browser renderer.

The Next.js integration should stay local to the homepage:

| Proposed file or existing location | Responsibility |
|---|---|
| [Homepage](/home/abhijithms/Documents/Work/golden-aura/src/app/page.tsx) | Keep server-side content fetching and all HTML copy. Add the decorative enhancement beside the server-rendered image. |
| `src/components/hero-3d.tsx` — new | Small client controller: eligibility, loading/ready/fallback state, visibility, timeout, local error boundary, and lazy import. |
| `src/components/hero-scene.tsx` — new | Fiber canvas, asset loading, camera, lighting, pointer damping, readiness signal, and owned-resource cleanup. |
| [Site CSS module](/home/abhijithms/Documents/Work/golden-aura/src/components/site.module.css) | Canvas layer, crossfade, and responsive artwork framing. |
| `src/lib/hero-policy.ts` and `tests/hero-policy.test.ts` — new | Small, testable eligibility and quality decisions using the existing Node test runner. |
| `public/models/` and `public/images/` | Optimised model, lighting/shadow assets, and matching fallback renders. |
| [HTTP checks](/home/abhijithms/Documents/Work/golden-aura/tests/http.mjs), [README](/home/abhijithms/Documents/Work/golden-aura/README.md), package files | Update assertions, document behaviour/assets, and lock dependencies. |

The listed new paths are proposals, not created files.

Declare `next/dynamic(..., { ssr: false })` **inside the client controller**, and mount it only after eligibility succeeds. App Router does not permit that option in a Server Component. Keep all Three/Fiber imports behind this lazy boundary; avoid exporting the scene through the shared component barrel or importing it from the root layout. [Next.js lazy-loading guidance](https://nextjs.org/docs/app/guides/lazy-loading).

Use an absolutely positioned canvas with the hero’s established dimensions. Layer the image and canvas beneath the existing overlay, copy, and buttons. Neither layer participates in document sizing. Keep both decorative layers `aria-hidden`, with empty image alternative text and no canvas tab stop.

Loading, timeout, renderer failure, and scene errors must resolve locally to the image. The page-level error boundary should never become the normal response to a decorative asset failure.

**The following are proposed targets, not measured guarantees:**

| Measure | Target and validation |
|---|---|
| Initial artwork | No model/engine request before eligibility and deferred loading. Aim for a delivered fallback image under 100KB desktop and 60KB mobile. |
| Initial JavaScript | Controller/policy addition under 10KB compressed; no Three/Fiber code in the initial critical path. |
| Deferred JavaScript | Aim for no more than 300KB compressed for the engine, Fiber, loader, and scene; verify production output. |
| Layout stability | Zero layout shift attributable to artwork handoff; whole-page CLS below 0.1. |
| Loading impact | Median LCP regression under 100ms against the static baseline under identical conditions; target LCP below 2.5s on the agreed test profile. |
| Responsiveness | Target interaction latency below 200ms; investigate any enhancement-attributable main-thread task over 50ms. |
| Active animation | Aim for 60fps on the reference integrated-GPU laptop, with 95th-percentile frame intervals below 25ms during movement. |
| Pixel ratio | Start capped at 1.5; reduce to 1.0 on sustained poor performance. Never use unrestricted device pixel ratio. |
| Idle/background | Zero ongoing hero render calls after settling, while fully offscreen, or while the tab is hidden. |
| GPU assets | Aim for decoded textures and environment resources below 32MB, excluding framebuffer/driver overhead. |

Measure compressed transfers in the production preview’s Network panel, main-thread work and frame pacing in Performance traces, and scene counts through renderer diagnostics. Browser tooling cannot reliably prove total GPU memory; estimate texture allocations and supplement with real-device observation.

Prepare shaders while the static image remains visible. Three’s `compileAsync()` can reduce compilation stalls where supported, but parsing, texture upload, and first rendering still require measurement. [Three renderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html).

For the first release, enable enhancement only with sufficient composition space—initially above the existing 1040px hero breakpoint—plus a fine pointer and hover capability. These are presentation/input gates, not proof of a powerful GPU. Also respect reduced motion, Save-Data and slow-network hints where available, and actual renderer success. Missing network APIs must not cause an error.

Touch-first phones and tablets remain static. Mobile 3D should be a later decision based on representative iPhone/Safari and midrange Android measurements, including sustained interaction and thermal behaviour.

Use Fiber’s `frameloop="demand"`. Pointer events update target refs and request one frame. Each frame applies time-based damping and requests another only while the transform remains unsettled. Resize and readiness transitions also request frames. An `IntersectionObserver` and `visibilitychange` handler gate this work; CSS hiding alone is insufficient. On return to view, render the resting pose without replaying the entrance. Fiber documents that imperative mutations require explicit invalidation. [Demand-rendering guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

For poor performance, make one downward adjustment from DPR 1.5 to 1.0 after sustained frame overruns during actual motion. If performance remains poor at DPR 1.0, return to static for that page visit. Do not run a continuous benchmark or repeatedly oscillate quality.

Resilience should follow these rules:

| Condition | Behaviour |
|---|---|
| Reduced motion | Keep the image; do not download the scene. If the preference changes during use, stop and remove the enhancement. |
| No JavaScript | Server-rendered image, content, and ordinary links remain available. |
| Unsupported WebGL2 / renderer creation failure | Preserve the image and stop the enhancement attempt. |
| Loading error | Catch locally, retain the image, and avoid automatic retry loops. |
| Slow loading | After an initial eight-second enhancement deadline, settle on static for that visit. Abort supported requests and ignore/dispose late results. |
| WebGL context loss | Restore the image immediately, stop work, and tear down the scene. No automatic recreation loop in phase one. |
| Keyboard use | No additional focus targets or shortcuts. Existing navigation, focus outlines, and gallery controls remain intact. |
| Touch | Preserve native scrolling and tapping; no pointer capture or `preventDefault()` for the hero. |

Cleanup must remove listeners and observers, cancel idle callbacks/timeouts/animations, and prevent late asynchronous completions from setting state. Strict Mode’s setup–cleanup–setup cycle must leave only one active controller.

Let Fiber dispose resources it owns. Explicitly dispose manually loaded GLTF geometries, materials, textures, environment render targets, and other externally owned resources; a GLTF inserted as a `primitive` is not automatically fully disposed. Avoid mixing a persistent loader cache with unconditional disposal of its shared objects. [Fiber object and disposal guidance](https://r3f.docs.pmnd.rs/api/objects).

Implementation should proceed through these reviewable milestones:

1. **Approve the still composition and asset.**  
   Deliver desktop/tablet/mobile mockups, a licensed candidate model, asset measurements, and camera/material settings. Likely files: model/image assets and README asset notes. Acceptance: recognisable inward-facing knight, readable copy, clear buttons, unchanged hero spacing, and documented rights. Main dependency: finding or producing the model.

2. **Establish the static scene and fallback.**  
   Add the two client components, homepage integration, CSS layer, and dependencies. Keep motion disabled. Acceptance: HTML works without JavaScript; no blank frame during loading; matching final fallback; loading and renderer failures leave the image visible; unrelated routes do not load the scene engine. Main risk: camera and colour mismatch.

3. **Add restrained motion.**  
   Implement the crossfade and bounded pointer damping in the scene/controller. Acceptance: no visible jump, no interaction interception, stable stationary composition, and no render loop after settling. Main risk: accidental continuous invalidation.

4. **Complete device policy and resilience.**  
   Add the small policy helper/tests and lifecycle handling. Acceptance: static mobile/reduced-motion paths make no model requests; background/offscreen rendering stops; timeout, failed loading, context loss, and Strict Mode behave correctly. Main risk: resource ownership and asynchronous cleanup.

5. **Complete production-preview QA.**  
   Update HTTP assertions and README, record the device/performance results, and review the Vercel preview. Acceptance: functional regressions absent, agreed budgets met or explicitly resolved, and visual approval of the actual browser rendering. Main dependency: representative devices and the final production asset.

For two teammates, assign **model/art ownership** to one person and **frontend ownership** to the other. The artist owns model, textures, environment, licence records, and reference renders. The frontend developer owns TypeScript, CSS, package files, and tests. Agree the origin, scale, forward axis, material names, and filenames before either starts. The frontend developer should produce the final browser-rendered fallback with the artist’s review. This avoids both people repeatedly editing scene code or shared CSS.

When implementation is authorised, create **`codex/chess-3d-hero` from the latest `main`**, then review through a PR and Vercel preview. Verification should cover:

- Desktop at 1280/1440px, tablet at 834/1024px, and phones at 320/390px, including short landscape viewports and 200% zoom.
- Heading readability, text selection, both hero links, the discovery anchor, floating navbar, and mobile dialog focus/close behaviour.
- All 14 player cards, photo carousel buttons/keyboard/drag navigation, three inline videos, and marquee hover/focus/reduced-motion behaviour.
- Cold/warm loading, blocked model requests, failed imports, slow networking, disabled JavaScript, reduced-motion changes, and simulated context loss.
- Ten repeated homepage/other-route navigation cycles, checking for accumulating canvases, callbacks, renderer resources, or increasing memory.
- Direct navigation to unrelated routes, confirming no hero engine/model requests.
- Production-mode frame pacing, handoff screenshots, CLS, and before/after loading traces.

The existing HTTP test asserts that the server HTML contains the static hero and no `<canvas>`. **Keep that server-rendering contract**, update the fallback filename if necessary, and rename the assertion to describe progressive enhancement. HTTP checks cannot establish that client-side 3D works, so retain separate browser checks.

Run `npm run typecheck`, `npm test`, and one production build sequentially, then start that build and run `node tests/http.mjs` against the local fixture. The HTTP script deliberately rejects remote hosts and includes API requests; do not point it at production. Stop the development server before building, reuse one `.next` directory, and use the Vercel preview for external review rather than creating duplicate local builds.

Rollback should be one small revert removing the enhancement import/mount. The server-rendered fallback remains usable, and the original knight image stays available. No CMS migration or backend rollback is involved.

No question blocks this plan. Implementation’s first approval point is the actual model and still composition; a model purchase or commission budget is needed only if a suitable already-licensed asset cannot be found.

Skipped implementation, installations, builds, and exhaustive device testing, as requested.  
Main risks: model quality/licensing, mismatch between fallback and live rendering, and unmeasured startup/GPU cost on real devices.
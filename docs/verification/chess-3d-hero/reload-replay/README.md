# Queen replay on homepage reload

Requested and verified 2026-10-17. The user wants visitors to experience the queen again when reloading Home. A module flag now lasts only for the document, replacing the session-storage marker. It is still marked at actual flight start; reload resets it, while scene remounts retain it. Timing, lighting, model, projection and eligibility are unchanged.

## Regression checks

- Production build through the existing read-only localhost fixture. `qa-storage=seen` seeds the old `golden-aura:queen-intro-v1=seen` value before hydration, reproducing the previous reload-blocking condition.
- First load and two consecutive full reloads each reached `loading/true/true` → `ready/true/true` → `ready/true/false`. Each recorded 229 foreground frame intervals through the fixture's existing WebGL draw instrumentation. Assertions require more than ten samples, proving a rendered flight on every load rather than only a changed DOM flag. Counts are not a new performance benchmark.
- Resizing to 834px removes enhancement; returning to 1440px remounts it with `queenPending=false` and no additional flight samples. The document guard prevents a resize replay.
- With the session-storage getter throwing, the flight still starts. Scrolling during the foreground phase immediately settles it and restores layer z-index zero.
- Controlled application reduced-motion setup retains the static image with no WebGL contexts. A 390px phone viewport does the same. These are policy/viewport checks, not native CSS/browser preference or physical-device certification.
- No console errors in the final reviewed fixture journey. Existing 41 tests, typecheck, production build and read-only fixture checks pass.

`browser-results.json` records the states and regression assertions. Screenshots retain the tested composition; draw samples and state transitions establish repeated animation. All diagnostic setup remains in the localhost-only fixture, which blocks mutation methods and is excluded from deployment. No new production dependency or diagnostic import.

PR #5 remains draft. Production is unchanged; the prior native-preference and second-device/high-DPR review remains pending.

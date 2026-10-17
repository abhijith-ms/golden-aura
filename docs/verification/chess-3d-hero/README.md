# Stationary 3D knight review

This is the first composition review on `codex/chess-3d-hero`, before pointer motion. Production remains unchanged.

- [Production desktop screenshot](desktop-production.jpg): 1280×720, live scene ready.
- [Development desktop screenshot](desktop.jpg): 1440×900, live scene ready.
- [Tablet screenshot](tablet.jpg): 834×1112, matching static image.
- [Phone screenshot](phone-390.jpg): 390×844, matching static image.
- [Narrow phone screenshot](phone-320.jpg): 320×740, matching static image.
- [Verification results and remaining checks](report.json).
- [Current handoff and full plan](../../plans/chess-3d-hero/README.md).

Typecheck, all 20 unit tests, the production build and local route/API HTTP checks passed. Browser checks found no horizontal overflow; desktop reaches one live canvas, and tablet/phone widths retain the image with no canvas. Tournament navigation removes the hero canvas and returning Home creates one scene.

The screenshots validate the still composition, not production performance or all fallback scenarios. Pointer response, adaptive quality, fault simulations and real-device measurements remain pending. The measured 254,541-byte gzip engine-related chunk is not a measurement of the full deferred download.

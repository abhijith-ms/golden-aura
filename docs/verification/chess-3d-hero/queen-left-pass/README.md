# Slower queen pass from the bottom left

## Contract recorded before implementation

User feedback: the accepted queen movement is too fast. Bring the large piece from the bottom left, sweep it across the viewer's foreground and settle it on the existing board, with dramatic lighting.

Keep the immediate tournament/Trust actions, compact hero and accepted board composition. Use a roughly three-second arrival (previously 1.3s), an intentional left-to-right foreground path, warm rim and cooler fill lighting that fade before landing. Preserve the physical queen scale, safe lens clearance, projection continuity, once-per-tab behavior and input interruption. No new dependencies or postprocessing.

Local reference: the user's feedback and previous `queen-flight/` recording/stills. Check 1440x900, 1280x720, tall 1280x1000 and static phone 390x844. Capture actual motion plus left-entry, foreground and landed frames. The main action remains Explore tournaments. Navigation and keyboard input must still settle the foreground immediately.

States: loading retains the existing image/HTML; success is the slower lit queen settling before board movement; error/partial use the established static fallback. Empty and permission are inapplicable to the same bundled licensed decoration. Existing context-loss/model-error tests remain historical evidence unless repeated in this pass. Actual preference transitions and real-device calibration remain pending.

## Result and evidence

[Slower opening recording](slower-queen-pass.mp4) shows the queen coming from bottom left, crossing close to the lens and receding onto the same square. Queen travel is **3.2 seconds**, about 2.46 times the previous 1.3s. Including preparation handoff, board blend and the supporting-piece opening, choreography takes about **5.5s after readiness**. The recording preserves browser screenshot timestamps and is not a hardware FPS measurement.

- `left-entry-1440.jpg`: an actual recording frame at about 2.41s after reload, with the giant queen entering along the left edge. `left-entry-1280.jpg` checks the same composition at the smaller desktop size.
- `foreground-1440.jpg`: close pass across the viewer's foreground. Warm edge highlights and cooler fill follow the queen; lower studio/environment intensity gives the wood more contrast.
- `tall-recession.jpg`: 1280x1000, full queen silhouette becoming readable as it heads toward the board.
- `desktop-final.jpg` and `production.jpg`: original board composition and studio illumination restored, with the queen at the same landing. Lights fade completely by travel progress 0.94.
- `interrupted.jpg`: Tab settles the opening, returns the foreground layer to z-index 0 and visibly focuses Skip to content. Wheel scroll also settles the shot; Events removes canvas/Lenis, and Home returns at scroll zero with no foreground replay.
- `phone.jpg`: 390x844 still uses the loaded static image, zero canvases and no horizontal overflow (client/scroll width both 375px).

At 1280x720 the hero remains 561.47px tall and document height 5212px; 1440x900 document height remains 5253px. There is no new geometry, image, package, postprocessing or shadow pass. The two new point lights add lighting work during the same existing render passes; their intensity becomes zero before the board returns. Their actual device cost remains uncalibrated.

## Validation and limits

Typecheck, **37 tests**, one production build, local HTTP checks and whitespace checks pass. The path tests now assert bottom-left entry and horizontal travel at all three desktop aspect ratios, in addition to whole-model near-plane clearance, initial absence, exact landing and projection continuity. A new test checks the slower timing and a bounded, smoothly fading lighting envelope that is zero before landing. Temporary session/pose overrides and the pose readout were removed before production.

Production browser verification confirms one ready canvas, no diagnostic pose attributes and no console errors. Existing context-loss/missing-model evidence in `../queen-flight/` remains evidence for the unchanged fallback policy; those failures were not re-injected in this refinement. Actual browser preference transitions, motion-comfort review and representative-device performance/GPU-memory calibration remain pending. PR #5 remains a draft review surface.

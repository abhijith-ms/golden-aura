# Gallery, Contact and shared visual finish

Authorised 2026-10-17. Visual changes only, on the existing draft review branch.

## Contract

- Audience/job: visitors browse real tournament photographs, choose an album, enlarge a photograph, or find the Trust's contact details and write an enquiry.
- Direction: retain the existing ivory/charcoal/champagne palette and Manrope/DM Sans fonts. Match the compact interior pages already approved; use a quiet photographic contact sheet and a clear, readable enquiry layout.
- Local reference observations: Gallery still has a 60px uppercase introduction, 30px album headings and widely separated photographs. Contact has the same oversized introduction, a 64px column gap and a large form title. The approved archive/Trust/committee pages use natural-case 34–48px introductory titles and smaller gaps. Apply that existing scale to the shared PageIntro, keeping event-detail and Trust overrides.
- Gallery: small squared album controls with a visible selected state, 24px album headings, tighter group spacing and white photograph frames/captions matching the other photo surfaces. Keep every album, image, caption, filter, alt label and native dialog interaction. Correct image sizes to the existing responsive column counts; retain bounded images and existing hover/dialog motion. Cap the phone viewer by viewport width as well as height, avoiding a tall empty frame around landscape photographs.
- Contact: reduce the column gap and form heading, add quiet dividers between contact methods, and tighten the shared enquiry form's spacing. Keep 44px or larger fields/buttons and readable labels. Keep native validation, consent, error/success feedback, submission, links and content unchanged. The shared form also appears on Partners, so review that caller.
- Shared finish: consistent PageIntro typography, bounded footer content at wide sizes and 44px footer contact targets. Preserve the approved floating navbar, homepage hero, 3D, section motion, assets and all data. Add no dependency, new feature or handler.
- Reach: shared module CSS; Gallery image sizes; Gallery/Contact and Partners rendering; all PageIntro callers and the shared footer. No API, config, test fixture or content changes are required.
- Targets: 1440x900, 834x1112, 390x844 and 320x740. Check no document overflow, readable complete labels/captions, a single H1, stable photo bounds, album selection, keyboard dialog close/focus return, form labels/required fields, native invalid-form feedback and footer links. Spot-check the other public pages after shared changes.

## States and evidence

- Loading: existing fixed photo rectangles and lazy-loaded images; no new loading sequence.
- Empty/partial: preserve existing Gallery empty rendering and available albums. No new data path or fixtures; inspect the unchanged branches without inventing live content.
- Error/success: preserve the enquiry live regions and messages. Exercise native required-field feedback with an empty form, which cannot submit. Live delivery, SMTP and service failure/success testing are outside this visual-only pass; do not submit a real enquiry or claim those states were verified.
- Permission: no new account, upload or permission flow.
- Keep baseline main text/geometry and compare populated pages after edits. Save browser screenshots and honest evidence; check four viewports plus keyboard behavior. Reduced-motion rules remain authoritative; no native preference/device certification is claimed. Run existing typecheck/tests/build sequentially, commit logical code and verification changes, verify `abhijith-ms` before pushing, and inspect the branch deployment. Production and PR draft status stay unchanged.

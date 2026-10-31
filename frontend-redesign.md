# Project Plan: Golden Aura Trust — Visual Redesign & Animation Overhaul

**File:** `./frontend-redesign.md`  
**Status:** Ready for Review & Execution  
**Project Type:** WEB  
**Primary Agent:** `frontend-specialist`  
**Key Skills:** `clean-code`, `frontend-design`, `design-spec`, `nextjs-react-expert`, `tailwind-patterns`, `lint-and-validate`

---

## 1. Overview & Vision

Transform the Golden Aura Trust web presence from a clean but traditional editorial website into a modern, animation-heavy, visually breathtaking web experience. 

Golden Aura Trust is a Bengaluru-based chess trust organizing international FIDE-rated Grandmaster opens (e.g. Namma Bengaluru Open with 600+ players from 17 nations) and driving grassroots chess inclusivity for women, juniors, and emerging players. 

The redesign preserves 100% of the existing content, business logic, Sanity CMS schema compatibility, Nodemailer email workflows, and routing, while completely replacing the visual presentation with:
- **High-contrast dark obsidian & zinc materiality** (`#09090B` / `#121215`)
- **Regal Dual-Tone Accent Glow**: Radiant Championship Gold (`#F5BA42`) paired with Luminescent Cyan (`#06B6D4`)
- **Kinetic display typography** with tight letter-spacing and fluid `clamp()` responsive scaling
- **Glassmorphism**: Layered `backdrop-blur-md`, 1px 10% white borders, and subtle SVG noise texture
- **Physics-driven motion architecture**: Lenis smooth momentum scrolling, Motion (`motion/react`) spring entrance choreography, cursor-reactive magnetic micro-interactions, and card border-glow tracking
- **Dynamic Bento Grids & Asymmetric Layouts**: Breaking standard stacked column monotony

---

## 2. Technical Stack & Architecture

| Layer | Selection | Rationale |
|---|---|---|
| **Framework** | Next.js 16.4 (App Router) + React 19 | Existing foundational framework; leverage Server Components with isolated Client leaves for motion |
| **Motion Physics** | `motion` (`motion/react` v12) | Modern Framer Motion successor; native React 19 support, GPU-accelerated spring physics |
| **Smooth Momentum Scroll** | `lenis` (v1.1+) | High-performance virtual scroll with native wheel interpolation and zero-lag sticky tracking |
| **Animation Choreography** | `gsap` + `@gsap/shock` (ScrollTrigger) | Complex timeline scrubbing and coordinate pinning for hero parallax and sticky card stacks |
| **Styling & Tokens** | Tailwind CSS (or Tailwind v4 utility tokens + modular CSS) | Fast token utility classes + CSS custom properties defined in `DESIGN.md` |
| **Icons** | `@phosphor-icons/react` | Standardized 1.5 stroke-width glyph set with rich geometric precision |
| **Noise & Textures** | Inline SVG feTurbulence / Data-URI noise overlay | Hardware-accelerated, zero-bandwidth grain overlay preventing digital flatness |

---

## 3. Color Tokens & Design System Specification

### Color Palette Tokens
```css
:root {
  /* Surface Layers */
  --bg-obsidian: #09090b;        /* Primary background canvas */
  --surface-zinc: #121215;       /* Bento cards & elevated panels */
  --surface-elevated: #18181d;   /* Floating controls & hover state */
  --surface-highlight: #23232a;  /* Active items & modal surfaces */

  /* Borders & Glass */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-glass: rgba(255, 255, 255, 0.12);
  --border-glow: rgba(245, 186, 66, 0.28);
  --glass-bg: rgba(18, 18, 21, 0.65);

  /* Typography */
  --text-primary: #f4f4f5;      /* Crisp off-white headers & lead */
  --text-secondary: #a1a1aa;    /* Zinc-400 for descriptions & body */
  --text-muted: #71717a;        /* Zinc-500 for metadata & captions */

  /* Dual-Tone Accent Glow */
  --accent-gold: #f5ba42;       /* Championship Gold: Heritage & royalty */
  --accent-gold-glow: rgba(245, 186, 66, 0.22);
  --accent-cyan: #06b6d4;       /* Electric Energy Cyan: Modern competition */
  --accent-cyan-glow: rgba(6, 182, 212, 0.20);
  
  /* Status Colors */
  --status-live: #10b981;
  --status-upcoming: #f5ba42;
  --status-concluded: #71717a;
}
```

### Typography Hierarchy
- **Display Headlines**: Archivo / Manrope ExtraBold (`font-weight: 800`), tracking `-0.03em`, line-height `1.05`, fluid `clamp(2.75rem, 6.5vw, 5.5rem)`
- **Section Headers**: `clamp(2rem, 3.8vw, 3.25rem)`, tracking `-0.025em`, line-height `1.15`
- **Body Text**: DM Sans Variable (`font-weight: 400 & 500`), line-height `1.7`, `clamp(0.95rem, 1.1vw, 1.05rem)`, max line length `65ch`
- **Kickers / Metadata**: Monospace or geometric micro-caps (`text-[11px]`, tracking `0.15em`, uppercase)

---

## 4. Success Criteria

1. **60 FPS Animation Performance**: All entrance and scroll transforms animate exclusively via `transform` and `opacity` properties.
2. **Accessible by Default**: Full support for `prefers-reduced-motion: reduce` (instantly bypasses all heavy animations and momentum smoothing). WCAG AA contrast ratio (> 4.5:1) strictly maintained across all text.
3. **Responsive Continuity**: Mobile, tablet, and ultra-wide screens (up to 2560px) receive fluid layout collapses without horizontal overflow or address-bar jump (`min-h-[100dvh]`).
4. **Zero Content Regression**: Every attendee name, committee member, partner logo, video testimonial, infographic metric, and enquiry form field remains intact.
5. **Aesthetic Wow-Factor**: Floating condensed pill navigation, kinetic hero entrance, magnetic button physics, interactive spotlight border tracking, and smooth momentum scrolling.

---

## 5. Detailed Task Breakdown

### Phase 1: Foundation, Tokens & Smooth Scroll

#### Task 1.1: Dependency Installation & Package Alignment
- **Task ID:** `FE-01`
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P0
- **Dependencies:** None
- **INPUT:** `package.json`
- **OUTPUT:** Updated `package.json` with `lenis`, `motion`, `@phosphor-icons/react`, `clsx`
- **VERIFY:** Run `npm ls lenis motion @phosphor-icons/react` without peer dependency conflicts.

#### Task 1.2: Author Single Source of Truth Design Spec (`DESIGN.md`)
- **Task ID:** `FE-02`
- **Agent:** `frontend-specialist`
- **Skills:** `design-spec`, `frontend-design`
- **Priority:** P0
- **Dependencies:** `FE-01`
- **INPUT:** Project aesthetic guidelines, color hexes, typography rules
- **OUTPUT:** `DESIGN.md` in project root containing YAML token schema and design rationale
- **VERIFY:** `DESIGN.md` exists and contains `--bg-obsidian`, `--surface-zinc`, typography scales, and motion specifications.

#### Task 1.3: Global Stylesheet, CSS Variables & Noise Texture Overhaul
- **Task ID:** `FE-03`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `tailwind-patterns`
- **Priority:** P0
- **Dependencies:** `FE-02`
- **INPUT:** `src/app/globals.css`, `DESIGN.md`
- **OUTPUT:** Rewritten `globals.css` with dark obsidian base, fluid typography clamps, glassmorphic utilities, custom scrollbar, and SVG feTurbulence background grain overlay
- **VERIFY:** Background renders `#09090B`, noise overlay is visible and `pointer-events: none`, no scrollbar overflow.

#### Task 1.4: Smooth Momentum Scroll Provider (Lenis)
- **Task ID:** `FE-04`
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `clean-code`
- **Priority:** P0
- **Dependencies:** `FE-01`, `FE-03`
- **INPUT:** `src/components/lenis-provider.tsx`
- **OUTPUT:** Isolated client component wrapper integrating Lenis with RAF loop, reduced-motion bypass, and route change scroll reset
- **VERIFY:** Momentum scrolling active on wheel event; disabled when `prefers-reduced-motion: reduce` is enabled.

---

### Phase 2: Navigation & Global Layout Architecture

#### Task 2.1: Floating Glassmorphic Pill Navigation
- **Task ID:** `FE-05`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `nextjs-react-expert`
- **Priority:** P1
- **Dependencies:** `FE-03`, `FE-04`
- **INPUT:** `src/components/header.tsx`, `src/components/site.module.css`
- **OUTPUT:** Modern floating pill navbar with `backdrop-blur-md`, subtle 10% white border, dynamic scroll condensation (shrinks on scroll down, expands at top), animated active link indicator, and redesigned mobile glass drawer
- **VERIFY:** Navbar remains fixed/sticky with smooth size condensation on scroll; keyboard accessible (Escape key closes drawer; focus trap functional).

#### Task 2.2: Root Layout Integration & Obsidian Footer Redesign
- **Task ID:** `FE-06`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-architecture`, `clean-code`
- **Priority:** P1
- **Dependencies:** `FE-05`
- **INPUT:** `src/app/layout.tsx`, `src/components/shared.tsx` (Footer)
- **OUTPUT:** `RootLayout` wired with LenisProvider, Skip-to-content pill, floating Header, and redesigned obsidian/zinc Footer with dual-tone accent highlights and organized sitemap columns
- **VERIFY:** Layout renders cleanly across all routes with no hydration mismatches or layout shifts.

---

### Phase 3: The Showstopping Hero Experience

#### Task 3.1: Kinetic Parallax Hero Section
- **Task ID:** `FE-07`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `nextjs-react-expert`
- **Priority:** P1
- **Dependencies:** `FE-06`
- **INPUT:** `src/app/page.tsx` (Hero), assets in `/public/images/`
- **OUTPUT:** New `HeroSection` featuring:
  - Kinetic headline typography with staggered character/word reveals
  - Dual-tone radial gradient backdrop glow (Gold `#F5BA42` + Cyan `#06B6D4`)
  - Floating 3D layered chess visual elements with pointer-reactive parallax depth
  - Magnetic CTA button with dynamic spotlight glow and tactile click physics
  - Key impact counters (`2 International Editions`, `64 Squares`, `₹30L+ Prize Fund`)
- **VERIFY:** Hero fits initial viewport (`min-h-[100dvh]`), headline wraps gracefully at desktop/mobile, animations hit 60fps on GPU profile.

---

### Phase 4: Homepage Section-by-Section Rebuild

#### Task 4.1: Dynamic Bento Grid Focus Areas
- **Task ID:** `FE-08`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Priority:** P2
- **Dependencies:** `FE-07`
- **INPUT:** `FocusAreas` component in `src/components/shared.tsx`
- **OUTPUT:** Asymmetric Bento Grid for "Pillars of Impact" with cursor spotlight border tracking, custom Phosphor icons, subtle glass sheen, and staggered viewport reveals
- **VERIFY:** Bento cells adapt from 3-column asymmetric desktop grid to 1-column mobile flow; spotlight tracking calculates coordinates without React re-renders.

#### Task 4.2: Featured Tournament Showcase Cards
- **Task ID:** `FE-09`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-08`
- **INPUT:** `EventCard` in `src/components/shared.tsx`, `src/lib/events.ts`
- **OUTPUT:** Elevated tournament cards with 3D perspective tilt on hover, status badges (e.g. FIDE Rated, Prize Fund ₹35,00,000), date pill, and dynamic registration CTAs
- **VERIFY:** Cards display correct status and registration links; hover transforms use `transform: perspective(1000px) rotateX(...) rotateY(...)` smoothly.

#### Task 4.3: Participant Voices & Video Testimonials
- **Task ID:** `FE-10`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Priority:** P2
- **Dependencies:** `FE-09`
- **INPUT:** `src/components/participant-feedback.tsx`
- **OUTPUT:** Redesigned multimedia card grid with glass video players (Anand, Maldives delegation, Aradhya Garg), custom play controls, sound toggle indicators, and glowing quote callouts
- **VERIFY:** Videos load posters properly; playback controls accessible via keyboard; responsive audio feedback.

#### Task 4.4: Community Photo Journal & Interactive Carousel
- **Task ID:** `FE-11`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `nextjs-react-expert`
- **Priority:** P2
- **Dependencies:** `FE-10`
- **INPUT:** `src/components/photo-carousel.tsx`
- **OUTPUT:** Redesigned photo stage with smooth spring drag/swipe physics, numbered navigation pills, lightbox expand preview, and high-res image zoom
- **VERIFY:** Swipe gestures operate smoothly on touch devices; keyboard arrow keys navigate photos.

#### Task 4.5: Tournament Infographic & Data Visualization
- **Task ID:** `FE-12`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Priority:** P2
- **Dependencies:** `FE-11`
- **INPUT:** `src/components/tournament-infographic.tsx`
- **OUTPUT:** Modernized dark analytical dashboard:
  - Economic footprint & social value breakdown with glowing metrics
  - Animated SVG charts (Donut sector breakdown, attendance column growth, gauge indicators)
  - Interactive tab switches with layout-spring transitions
- **VERIFY:** Numbers animate up on scroll entry; all charts render crisp SVGs with high contrast tooltips.

#### Task 4.6: Grandmaster & Player Spotlight
- **Task ID:** `FE-13`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-12`
- **INPUT:** `src/components/player-gallery.tsx`, `src/components/country-name.tsx`
- **OUTPUT:** Grid of Grandmasters and international contenders with title badges (GM, IM, WGM), SVG flag emblems, smooth portrait scale on hover, and animated "Expand / Collapse" list transition
- **VERIFY:** Flag icons align properly; expansion triggers smooth height animation.

#### Task 4.7: Partner & Supporter Ribbon Marquee
- **Task ID:** `FE-14`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-13`
- **INPUT:** `src/components/partner-marquee.tsx`, `PartnerLogos` in `shared.tsx`
- **OUTPUT:** Seamless infinite marquee with CSS hardware acceleration, pause-on-hover, subtle glass backing, and filtered white/gold partner logos
- **VERIFY:** Marquee pauses on hover and focus; no visual stutter on infinite loop repeat.

#### Task 4.8: High-Impact Conversion Band (Contact Banner)
- **Task ID:** `FE-15`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-14`
- **INPUT:** `ContactBand` in `src/components/shared.tsx`
- **OUTPUT:** Glowing dual-tone card with radial mesh backdrop, bold typography ("Bring chess to your community or compete at the highest level"), and magnetic action button
- **VERIFY:** Renders flawlessly above footer with WCAG AA compliance.

---

### Phase 5: Subpages & Interactive Experiences

#### Task 5.1: About / The Trust Page Experience
- **Task ID:** `FE-16`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-15`
- **INPUT:** `src/app/about/page.tsx`, `src/components/content-pages.tsx`
- **OUTPUT:** Asymmetric storytelling layout with staggered archival photo reveals, timeline narrative, and governance statement cards
- **VERIFY:** All Sanity CMS page copy and default copy fallback render cleanly.

#### Task 5.2: Committee & Leadership Grid
- **Task ID:** `FE-17`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-16`
- **INPUT:** `src/app/committee/page.tsx`, `src/lib/committee.ts`
- **OUTPUT:** Group-filtered grid (Core Committee, Chief Arbiters, Advisory Board, Tournament Team) with portrait hover spotlights, affiliation chips, and smooth tab switching
- **VERIFY:** Quick anchor navigation and tab filters work smoothly.

#### Task 5.3: Events Hub & Dynamic Event Detail
- **Task ID:** `FE-18`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-17`
- **INPUT:** `src/app/events/page.tsx`, `src/app/events/[slug]/page.tsx`
- **OUTPUT:** Comprehensive event catalog with filterable status tabs, hero cover parallax, brochure download pills, regulations modal/accordion, and attendee rosters
- **VERIFY:** Slug routing functions for both `namma-bengaluru-open-2024` and `2025`; brochure and registration links work.

#### Task 5.4: Gallery & Lightbox Experience
- **Task ID:** `FE-19`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `nextjs-react-expert`
- **Priority:** P2
- **Dependencies:** `FE-18`
- **INPUT:** `src/app/gallery/page.tsx`, `src/components/gallery.tsx`
- **OUTPUT:** Masonry-style photo albums with category pill filters, spring entry animation, and a full-viewport modal lightbox with image zoom, keyboard navigation, and caption display
- **VERIFY:** Keyboard Left/Right and Escape operate lightbox; filter counter updates live.

#### Task 5.5: Partners & Supporters Directory
- **Task ID:** `FE-20`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`
- **Priority:** P2
- **Dependencies:** `FE-19`
- **INPUT:** `src/app/partners/page.tsx`, `src/lib/partners.ts`
- **OUTPUT:** Tiered partner grid (Official & Corporate, Government & Civic, Tournament Supporters) with glass cards, category badges, and sponsor descriptions
- **VERIFY:** Partner categorization intact; logos optimized for dark backgrounds.

#### Task 5.6: Glassmorphic Contact & Enquiry Form
- **Task ID:** `FE-21`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Priority:** P2
- **Dependencies:** `FE-20`
- **INPUT:** `src/app/contact/page.tsx`, `src/components/enquiry-form.tsx`
- **OUTPUT:** Polished contact terminal with elevated glass inputs, focus glow rings, floating label transitions, Honeypot spam defense, and feedback state alerts
- **VERIFY:** Test form submission against `/api/enquiry`; check success and error states.

#### Task 5.7: Auxiliary Pages (Privacy, 404, Error Boundaries)
- **Task ID:** `FE-22`
- **Agent:** `frontend-specialist`
- **Skills:** `clean-code`
- **Priority:** P3
- **Dependencies:** `FE-21`
- **INPUT:** `src/app/privacy/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`
- **OUTPUT:** Stylized legal document container with sticky table-of-contents, kinetic 404 "Checkmate: Move not found" interactive page, and graceful error boundary fallbacks
- **VERIFY:** Navigating to an invalid route renders the custom 404 page with home CTA.

---

### Phase X: Final Verification & Performance Gate

#### Task X.1: Complete Quality & Performance Audit
- **Task ID:** `FE-23`
- **Agent:** `frontend-specialist`
- **Skills:** `lint-and-validate`, `clean-code`
- **Priority:** P0 (Gatekeeper)
- **Dependencies:** All previous tasks
- **Verification Commands:**
  ```bash
  # 1. Typecheck & lint validation
  npm run typecheck
  
  # 2. Production build verification
  npm run build
  
  # 3. Unit & integration tests
  npm test
  ```
- **Manual Checklist:**
  - [ ] No purple/violet AI cliché colors (strictly Obsidian, Zinc, Gold, Cyan)
  - [ ] Zero em-dashes (`—`) in visible typography
  - [ ] All animations respect `prefers-reduced-motion`
  - [ ] Lighthouse Performance score > 90, 60fps frame rate
  - [ ] Single line navbar on desktop (<= 80px)
  - [ ] Mobile drawer operates with focus trap and body scroll lock
- **OUTPUT:** Phase X Completion confirmation in `frontend-redesign.md`

---

## 6. Execution Command

To begin executing this plan step-by-step, start with Phase 1:
1. Install dependencies (`motion`, `lenis`, `@phosphor-icons/react`)
2. Create `DESIGN.md` specification
3. Overhaul `src/app/globals.css` with dark tokens and noise texture
4. Implement `LenisProvider` and proceed to floating navigation

---
name: Golden Aura Obsidian & Glow
description: High-contrast modern dark-tech design system for Golden Aura Trust chess platform with dual-tone accent glow.
colors:
  background: "#09090b"
  surface: "#121215"
  surface-elevated: "#18181d"
  surface-highlight: "#23232a"
  text-primary: "#f4f4f5"
  text-secondary: "#a1a1aa"
  text-muted: "#71717a"
  accent-gold: "#f5ba42"
  accent-gold-glow: "rgba(245, 186, 66, 0.22)"
  accent-cyan: "#06b6d4"
  accent-cyan-glow: "rgba(6, 182, 212, 0.20)"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-glass: "rgba(255, 255, 255, 0.12)"
  border-glow: "rgba(245, 186, 66, 0.35)"
typography:
  display: "'Archivo Variable', var(--font-heading), sans-serif"
  body: "'DM Sans Variable', sans-serif"
  mono: "ui-monospace, monospace"
---

# Golden Aura Trust — Visual Design System

## Overview
Golden Aura Trust is a premier chess trust hosting international Grandmaster opens (Namma Bengaluru Open) and driving grassroots chess inclusivity across Karnataka and India. 

This design system establishes a high-contrast obsidian aesthetic with physical depth, glassmorphic refraction, and dual-tone radiance (Championship Gold + Electric Cyan). It communicates both the intellectual heritage of chess and the high-voltage atmosphere of modern international competition.

## Colors & Surfaces
- **Obsidian Canvas (`#09090B`)**: Deepest background tone providing boundless contrast.
- **Zinc Surfaces (`#121215`, `#18181D`, `#23232A`)**: Elevated surface hierarchy for Bento grid cards, floating dialogs, and interactive elements.
- **Crisp Off-White Typography (`#F4F4F5`)**: High-legibility headline copy with zero glare.
- **Muted Zinc (`#A1A1AA`, `#71717A`)**: Balanced secondary typography maintaining WCAG AA contrast.
- **Dual-Tone Radiance**:
  - **Championship Gold (`#F5BA42`)**: Royalty, prestige, trophies, and tournament pedigree.
  - **Electric Cyan (`#06B6D4`)**: Strategic clarity, energy, and digital precision.
  - **NO AI-Purple**: Violet, magenta, and indigo are strictly forbidden.

## Typography
- **Display Headlines**: Archivo / Manrope ExtraBold (`font-weight: 800`), tracking `-0.03em`, line-height `1.05 - 1.15`, fluid `clamp(2.75rem, 6.5vw, 5.5rem)`.
- **Section Headers**: `clamp(2rem, 4vw, 3.25rem)`, tracking `-0.025em`, line-height `1.2`.
- **Body Text**: DM Sans Variable (`font-weight: 400` / `500`), line-height `1.7`, `clamp(0.95rem, 1.1vw, 1.05rem)`, max line length `65ch`.
- **Labels & Micro-Kickers**: Monospace or geometric micro-caps (`text-[11px]`, tracking `0.16em`, uppercase).

## Elevation & Depth (Glassmorphism)
- **Base Glass**: `backdrop-filter: blur(16px) saturate(140%)`, `background: rgba(18, 18, 21, 0.75)`, `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Inner Rim Lighting**: `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 12px 40px rgba(0, 0, 0, 0.5)`.
- **Subtle Texture**: Pointer-events-none SVG noise grain overlay with 3.5% opacity across the viewport.

## Motion & Interaction Architecture
- **Smooth Momentum Scrolling**: Powered by Lenis for buttery fluid inertia.
- **Spring Physics**: Organic spring curves (`stiffness: 120`, `damping: 20`, `mass: 1`).
- **Interactive Cursor Spotlights**: Dynamic mouse coordinate tracking illuminating card borders on hover.
- **Magnetic Physics**: Primary CTA buttons pull slightly toward cursor position on proximity.
- **Accessibility**: Immediate full bypass for `prefers-reduced-motion: reduce`.

## Do's and Don'ts
- **DO** use CSS Grid and asymmetric Bento compositions.
- **DO** animate strictly using GPU-accelerated `transform` and `opacity`.
- **DO** ensure all text passes WCAG AA 4.5:1 contrast against dark backgrounds.
- **DON'T** use purple or neon magenta gradients.
- **DON'T** use centered generic 3-column equal boxes.
- **DON'T** allow CTA text to wrap on desktop viewports.

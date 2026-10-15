"use client";

import { useEffect, useRef } from "react";
import styles from "./site.module.css";

// Official Staunton Chess Vectors styled in luxury Gold & Ivory
const GOLD_SVGS = [
  // Pawn
  `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><path fill="rgba(196,175,120,0.32)" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,
  // Rook
  `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><g fill="rgba(196,175,120,0.32)" fill-rule="evenodd" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="m34 14-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="m31 29.5 1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g></svg>`,
  // Knight
  `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path fill="rgba(196,175,120,0.32)" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="rgba(196,175,120,0.32)" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#faecc8" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"/></g></svg>`,
  // Bishop
  `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="rgba(196,175,120,0.32)" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
  // Queen
  `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><g fill="rgba(196,175,120,0.32)" fill-rule="evenodd" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g></svg>`,
  // King
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="45" height="45"><g fill="none" fill-rule="evenodd" stroke="#faecc8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="rgba(196,175,120,0.32)" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="rgba(196,175,120,0.32)" d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
];

// Silver / Ivory pieces for subtle variety and contrast
const SILVER_SVGS = GOLD_SVGS.map((svg) =>
  svg
    .replace(/stroke="#faecc8"/g, 'stroke="#e8eef2"')
    .replace(/fill="rgba\(196,175,120,0\.32\)"/g, 'fill="rgba(235,242,248,0.22)"')
    .replace(/fill="#faecc8"/g, 'fill="#e8eef2"')
);

interface PieceNode {
  imageIndex: number;
  isGold: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  depth: number; // 0.2 (far) to 1.0 (near)
  phase: number;
  pulseSpeed: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  phase: number;
  opacity: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Preload SVG images
    const goldImages: HTMLImageElement[] = [];
    const silverImages: HTMLImageElement[] = [];

    GOLD_SVGS.forEach((svg) => {
      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      goldImages.push(img);
    });

    SILVER_SVGS.forEach((svg) => {
      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      silverImages.push(img);
    });

    // Pointer state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      active: false,
      radius: 200,
    };

    let pieces: PieceNode[] = [];
    let stars: StarNode[] = [];
    const sparkles: Sparkle[] = [];
    const ripples: Ripple[] = [];

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function initEntities() {
      pieces = [];
      stars = [];
      const isMobile = width < 768;

      // MUCH DENSER: 48 pieces on desktop, 22 on mobile
      const pieceCount = isMobile ? 22 : 48;
      // 180 stars on desktop, 70 on mobile
      const starCount = isMobile ? 70 : 180;

      // Initialize Pieces across three distinct depth layers
      for (let i = 0; i < pieceCount; i++) {
        // Multi-depth stratification
        let depth: number;
        let size: number;
        let baseOpacity: number;

        if (i < pieceCount * 0.25) {
          // Foreground: sharp, prominent, parallax-reactive
          depth = 0.8 + Math.random() * 0.2;
          size = isMobile ? 36 + Math.random() * 14 : 52 + Math.random() * 20;
          baseOpacity = 0.55 + Math.random() * 0.35;
        } else if (i < pieceCount * 0.65) {
          // Midground: golden floating field
          depth = 0.45 + Math.random() * 0.35;
          size = isMobile ? 26 + Math.random() * 10 : 34 + Math.random() * 16;
          baseOpacity = 0.3 + Math.random() * 0.25;
        } else {
          // Background: deep cosmic chess drift
          depth = 0.15 + Math.random() * 0.3;
          size = isMobile ? 18 + Math.random() * 8 : 22 + Math.random() * 10;
          baseOpacity = 0.12 + Math.random() * 0.18;
        }

        // Distribute pieces across the full screen to beautifully frame the centered hero
        const xRatio = isMobile
          ? 0.05 + Math.random() * 0.9
          : 0.04 + Math.random() * 0.92;
        const yRatio = 0.06 + Math.random() * 0.88;

        const x = xRatio * width;
        const y = yRatio * height;

        pieces.push({
          imageIndex: Math.floor(Math.random() * GOLD_SVGS.length),
          isGold: Math.random() > 0.28, // 72% Gold, 28% Ivory/Silver
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25 * depth,
          vy: (Math.random() - 0.5) * 0.25 * depth,
          size,
          depth,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.006 + Math.random() * 0.012,
          rotation: (Math.random() - 0.5) * 0.25,
          rotSpeed: (Math.random() - 0.5) * 0.003,
          opacity: baseOpacity,
        });
      }

      // Initialize Star Nodes
      for (let i = 0; i < starCount; i++) {
        const depth = 0.15 + Math.random() * 0.85;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18 * depth,
          vy: (Math.random() - 0.5) * 0.18 * depth,
          size: 0.8 + depth * 2.2,
          depth,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.15 + depth * 0.5,
        });
      }
    }

    function handleResize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx?.scale(dpr, dpr);

      initEntities();
      if (reducedMotionQuery.matches) {
        renderFrame(0);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Pointer events
    function onPointerMove(e: MouseEvent | TouchEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const curX = clientX - rect.left;
      const curY = clientY - rect.top;

      mouse.targetX = curX;
      mouse.targetY = curY;
      mouse.active = true;

      // Spawn stardust sparkle wake
      if (Math.hypot(curX - mouse.prevX, curY - mouse.prevY) > 12) {
        mouse.prevX = curX;
        mouse.prevY = curY;

        for (let i = 0; i < 2; i++) {
          sparkles.push({
            x: curX + (Math.random() - 0.5) * 20,
            y: curY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.2,
            size: 1.2 + Math.random() * 2.4,
            alpha: 0.7 + Math.random() * 0.3,
            decay: 0.015 + Math.random() * 0.02,
            color: Math.random() > 0.3 ? "#faecc8" : "#ffffff",
          });
        }
      }
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    }

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rx = clientX - rect.left;
      const ry = clientY - rect.top;

      ripples.push({
        x: rx,
        y: ry,
        radius: 12,
        maxRadius: Math.max(width, height) * 0.55,
        alpha: 0.6,
      });

      // Deflect pieces
      for (const piece of pieces) {
        const dx = piece.x - rx;
        const dy = piece.y - ry;
        const dist = Math.hypot(dx, dy);
        if (dist < 300 && dist > 0) {
          const force = (1 - dist / 300) * 14 * piece.depth;
          piece.vx += (dx / dist) * force;
          piece.vy += (dy / dist) * force;
        }
      }

      // Burst of sparkles
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        sparkles.push({
          x: rx,
          y: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02,
          color: Math.random() > 0.4 ? "#faecc8" : "#ffffff",
        });
      }
    }

    const parentSection = canvas.closest("section") || canvas;
    parentSection.addEventListener("mousemove", onPointerMove as EventListener, { passive: true });
    parentSection.addEventListener("touchstart", onPointerMove as EventListener, { passive: true });
    parentSection.addEventListener("touchmove", onPointerMove as EventListener, { passive: true });
    parentSection.addEventListener("mouseleave", onPointerLeave as EventListener, { passive: true });
    parentSection.addEventListener("touchend", onPointerLeave as EventListener, { passive: true });
    parentSection.addEventListener("mousedown", onPointerDown as EventListener, { passive: true });

    let isRunning = false;
    let lastTime = performance.now();

    function startLoop() {
      if (isRunning || reducedMotionQuery.matches || !isVisible) return;
      isRunning = true;
      lastTime = performance.now();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    function stopLoop() {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    }

    // IntersectionObserver to pause loop when scrolled out of view and resume when back
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    function onVisibilityChange() {
      if (document.hidden) {
        stopLoop();
      } else if (isVisible) {
        startLoop();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    function renderFrame(now: number) {
      if (!ctx || width === 0 || height === 0) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Mouse lerp
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.09;
        mouse.y += (mouse.targetY - mouse.y) * 0.09;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.05;
        mouse.y += (-1000 - mouse.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle, velvety background nebula lights (warm gold & amber)
      const t = now * 0.0003;
      const neb1X = width * 0.75 + Math.sin(t) * 80;
      const neb1Y = height * 0.35 + Math.cos(t * 1.2) * 60;
      const g1 = ctx.createRadialGradient(neb1X, neb1Y, 0, neb1X, neb1Y, width * 0.55);
      g1.addColorStop(0, "rgba(196, 175, 120, 0.075)");
      g1.addColorStop(0.5, "rgba(165, 138, 85, 0.025)");
      g1.addColorStop(1, "rgba(17, 19, 18, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const neb2X = width * 0.45 + Math.cos(t * 0.8) * 100;
      const neb2Y = height * 0.7 + Math.sin(t * 1.1) * 70;
      const g2 = ctx.createRadialGradient(neb2X, neb2Y, 0, neb2X, neb2Y, width * 0.45);
      g2.addColorStop(0, "rgba(196, 175, 120, 0.05)");
      g2.addColorStop(1, "rgba(17, 19, 18, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 2. Cursor spotlight (interactive gold illumination)
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const spot = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 2
        );
        spot.addColorStop(0, "rgba(225, 205, 150, 0.16)");
        spot.addColorStop(0.4, "rgba(196, 175, 120, 0.05)");
        spot.addColorStop(1, "rgba(17, 19, 18, 0)");
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 260 * delta;
        r.alpha -= 0.65 * delta;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 205, 150, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Update Stardust Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.shadowColor = "#faecc8";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // 5. Update Star Nodes
      for (const s of stars) {
        s.phase += 0.015;
        if (!reducedMotionQuery.matches) {
          s.x += s.vx;
          s.y += s.vy;

          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }
      }

      // 6. Update Pieces
      for (const p of pieces) {
        p.phase += p.pulseSpeed;
        p.rotation += p.rotSpeed;

        if (!reducedMotionQuery.matches) {
          p.x += p.vx + Math.cos(p.phase) * 0.22 * p.depth;
          p.y += p.vy + Math.sin(p.phase) * 0.28 * p.depth;

          // Drag / damping
          p.vx *= 0.96;
          p.vy *= 0.96;

          // Interactive mouse deflection / spring
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouse.radius && dist > 0) {
              const force = (1 - dist / mouse.radius) * 1.5 * p.depth;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Gentle pull to origin
          const offX = p.x - p.baseX;
          const offY = p.y - p.baseY;
          p.vx -= offX * 0.00025;
          p.vy -= offY * 0.00025;

          const pad = p.size;
          if (p.x < -pad) p.x = width + pad;
          if (p.x > width + pad) p.x = -pad;
          if (p.y < -pad) p.y = height + pad;
          if (p.y > height + pad) p.y = -pad;
        }
      }

      // 7. Constellation Connections (Stars & Pieces)
      const maxDist = width < 768 ? 105 : 135;
      const maxDistSq = maxDist * maxDist;

      // Star-to-star connections
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < Math.min(i + 14, stars.length); j++) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            let lineAlpha = (1 - dist / maxDist) * 0.18 * Math.min(a.depth, b.depth);

            // Enhance brightness if near cursor spotlight
            if (mouse.active) {
              const midX = (a.x + b.x) * 0.5;
              const midY = (a.y + b.y) * 0.5;
              const dMouse = Math.hypot(midX - mouse.x, midY - mouse.y);
              if (dMouse < mouse.radius) {
                lineAlpha *= 1 + (1 - dMouse / mouse.radius) * 1.5;
              }
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(196, 175, 120, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Piece-to-star constellation links (anchoring pieces to the constellation)
      for (const p of pieces) {
        if (p.depth < 0.3) continue;
        for (let i = 0; i < Math.min(stars.length, 30); i++) {
          const s = stars[i];
          const dx = p.x - s.x;
          const dy = p.y - s.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.16 * p.depth;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = `rgba(216, 195, 140, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 8. Draw Star Nodes
      for (const s of stars) {
        const twinkle = Math.sin(s.phase) * 0.2;
        const alpha = Math.max(0.08, Math.min(0.9, s.opacity + twinkle));

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 215, 165, ${alpha.toFixed(3)})`;

        if (s.depth > 0.6) {
          ctx.shadowColor = "#faecc8";
          ctx.shadowBlur = 5;
        }
        ctx.fill();
        ctx.restore();
      }

      // 9. Draw Chess Pieces (Sorted by depth for realistic layering)
      const sortedPieces = [...pieces].sort((a, b) => a.depth - b.depth);

      for (const p of sortedPieces) {
        const imgList = p.isGold ? goldImages : silverImages;
        const img = imgList[p.imageIndex];
        if (!img || !img.complete) continue;

        const pulse = Math.sin(p.phase) * 0.1;
        let alpha = Math.max(0.06, Math.min(1, p.opacity + pulse));

        // Proximity to cursor brings foreground pieces into radiant focus
        if (mouse.active) {
          const dMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dMouse < mouse.radius) {
            const boost = (1 - dMouse / mouse.radius) * 0.35;
            alpha = Math.min(1, alpha + boost);
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft gold bloom under prominent pieces
        if (p.depth > 0.6) {
          ctx.shadowColor = p.isGold ? "rgba(196, 175, 120, 0.45)" : "rgba(220, 235, 245, 0.45)";
          ctx.shadowBlur = p.depth * 16;
        }

        ctx.globalAlpha = alpha;
        ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (!reducedMotionQuery.matches && isVisible) {
        animationFrameId = requestAnimationFrame(renderFrame);
      } else {
        isRunning = false;
      }
    }

    startLoop();

    const onMotionChange = () => {
      stopLoop();
      if (!reducedMotionQuery.matches && isVisible) {
        startLoop();
      } else {
        renderFrame(0);
      }
    };
    reducedMotionQuery.addEventListener("change", onMotionChange);

    return () => {
      stopLoop();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
      parentSection.removeEventListener("mousemove", onPointerMove as EventListener);
      parentSection.removeEventListener("touchstart", onPointerMove as EventListener);
      parentSection.removeEventListener("touchmove", onPointerMove as EventListener);
      parentSection.removeEventListener("mouseleave", onPointerLeave as EventListener);
      parentSection.removeEventListener("touchend", onPointerLeave as EventListener);
      parentSection.removeEventListener("mousedown", onPointerDown as EventListener);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.heroCanvas}
      aria-hidden="true"
    />
  );
}

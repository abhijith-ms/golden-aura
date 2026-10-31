"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  useInView,
} from "motion/react";
import {
  ArrowUpRight,
  Trophy,
  CaretDown,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  SkipForward,
} from "@phosphor-icons/react";
import styles from "./hero.module.css";
import type { Event } from "@/lib/types";
import { eventStatus } from "@/lib/events";

interface HeroSectionProps {
  heroTitle: string;
  heroIntro: string;
  archiveEvent?: Event;
}

type HeroPlaybackState = "PLAYING_INTRO" | "REVEALING_UI" | "SETTLED";

/**
 * High-performance animated counter for tournament statistics
 */
function AnimatedCounter({
  target,
  duration = 1.2,
  prefix = "",
  suffix = "",
  formatIndian = false,
  start = false,
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatIndian?: boolean;
  start: boolean;
}) {
  const [count, setCount] = useState(target);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    if (shouldReduceMotion) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Custom easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start, shouldReduceMotion]);

  const formatted = formatIndian
    ? count.toLocaleString("en-IN")
    : count.toLocaleString("en-US");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * Lightweight volumetric golden dust motes particle overlay
 * Matches the warm champagne ambiance and light rays from the overhead video
 */
function DustMotesCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active || !inView) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.5,
      vx: (Math.random() - 0.45) * 0.18,
      vy: -(0.12 + Math.random() * 0.28),
      alpha: 0.1 + Math.random() * 0.4,
      alphaSpeed: 0.004 + Math.random() * 0.008,
      alphaDirection: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.35 ? "212, 175, 106" : "250, 248, 245",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        p.alpha += p.alphaSpeed * p.alphaDirection;
        if (p.alpha >= 0.45) {
          p.alpha = 0.45;
          p.alphaDirection = -1;
        } else if (p.alpha <= 0.08) {
          p.alpha = 0.08;
          p.alphaDirection = 1;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${p.color}, 0.35)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, inView]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.dustCanvas}
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 1.8s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

export function HeroSection({ heroTitle, heroIntro, archiveEvent }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Playback State Management: PLAYING_INTRO (0.0s–5.2s), REVEALING_UI (5.2s–7.0s), SETTLED (7.0s+)
  const [heroState, setHeroState] = useState<HeroPlaybackState>("PLAYING_INTRO");
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  const isRevealed = heroState !== "PLAYING_INTRO";

  // Dispatch state change events to synchronize the top floating navbar and external observers
  const broadcastHeroState = useCallback(
    (state: HeroPlaybackState) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("hero-state", {
            detail: { state, inspecting: false },
          })
        );
      }
    },
    []
  );

  useEffect(() => {
    broadcastHeroState(heroState);
  }, [heroState, broadcastHeroState]);

  // Magnetic button physics for the primary CTA
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const smoothBtnX = useSpring(btnX, { damping: 15, stiffness: 150 });
  const smoothBtnY = useSpring(btnY, { damping: 15, stiffness: 150 });

  function handleBtnMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.28);
    btnY.set(y * 0.28);
  }

  function handleBtnLeave() {
    btnX.set(0);
    btnY.set(0);
  }

  // Cursor Parallax & 3D Tilt Physics for the Settled Chessboard
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for camera tilt & shift (cinematic weighted physics)
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3.5, -3.5]), {
    damping: 24,
    stiffness: 90,
    mass: 0.8,
  });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.5, 3.5]), {
    damping: 24,
    stiffness: 90,
    mass: 0.8,
  });
  const shiftX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), {
    damping: 24,
    stiffness: 90,
    mass: 0.8,
  });
  const shiftY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    damping: 24,
    stiffness: 90,
    mass: 0.8,
  });

  // Dynamic Specular Light Glint: follows cursor over marble and gold tiles
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);
  const smoothSheenX = useSpring(sheenX, { damping: 20, stiffness: 100 });
  const smoothSheenY = useSpring(sheenY, { damping: 20, stiffness: 100 });
  const sheenBackground = useMotionTemplate`radial-gradient(circle 500px at ${smoothSheenX}% ${smoothSheenY}%, rgba(255, 235, 195, 0.12) 0%, rgba(212, 175, 106, 0.04) 40%, transparent 75%)`;

  // Track mouse coordinates over the hero section when settled
  useEffect(() => {
    if (!hasEnded || shouldReduceMotion) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      // Only track if cursor is within or directly near the hero section
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        mouseX.set(0);
        mouseY.set(0);
        return;
      }

      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.set(normX);
      mouseY.set(normY);

      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      sheenX.set(pctX);
      sheenY.set(pctY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", handleMouseLeave);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleMouseLeave);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasEnded, shouldReduceMotion, mouseX, mouseY, sheenX, sheenY]);

  // Handle immediate reveal on reduced motion
  useEffect(() => {
    if (shouldReduceMotion) {
      setHeroState("SETTLED");
      setHasEnded(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 7.95;
      }
    }
  }, [shouldReduceMotion]);

  // Handle video autoplay with graceful fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldReduceMotion) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setHeroState("SETTLED");
        setHasEnded(true);
      });
    }
  }, [shouldReduceMotion]);

  // Auto-reveal if the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40 && heroState === "PLAYING_INTRO") {
        setHeroState("REVEALING_UI");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroState]);

  // Fallback safeguard: guarantee reveal if video stalls or takes too long to load
  useEffect(() => {
    if (heroState !== "PLAYING_INTRO" || shouldReduceMotion) return;
    const timer = setTimeout(() => {
      setHeroState("REVEALING_UI");
    }, 7000);
    return () => clearTimeout(timer);
  }, [heroState, shouldReduceMotion]);

  // Time-Synced Camera Choreography:
  // 0.0s – 5.2s: PLAYING_INTRO (unobstructed cinematic intro)
  // At 5.2s: REVEALING_UI (crane pull-up triggers multi-layer scrim and UI reveal)
  // At 7.0s+: SETTLED (high-angle top-down chessboard view settles into place)
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;

    if (current >= 5.2 && heroState === "PLAYING_INTRO") {
      setHeroState("REVEALING_UI");
    }
    if (current >= 7.0 && heroState === "REVEALING_UI") {
      setHeroState("SETTLED");
      setHasEnded(true);
    }
  }, [heroState]);

  // Video end: pause at final frame and set SETTLED state
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration || 7.95;
    }
    setHasEnded(true);
    setHeroState("SETTLED");
  }, []);

  // Skip reveal: jumps video directly to 6.8s and immediately triggers REVEALING_UI
  const handleSkip = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 6.8;
      video.play().catch(() => {});
    }
    setHeroState("REVEALING_UI");
  }, []);

  // Toggle audio
  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (video) {
      video.muted = nextMuted;
    }
  }, [isMuted]);

  // Headline line separation: "CHESS FOR" and "EVERYONE."
  const lines = (heroTitle || "Chess for\neveryone.").split("\n");
  const firstLine = lines.length > 1 ? lines.slice(0, -1).join(" ") : lines[0] || "CHESS FOR";
  const lastLine = lines.length > 1 ? lines[lines.length - 1] : "EVERYONE.";

  // Choreography Variants with Custom Cubic Bezier [0.16, 1, 0.3, 1]
  // 5.2s: Master trigger (0.00s offset)
  // 5.4s: Eyebrow pill (0.20s offset)
  const eyebrowVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
      scale: shouldReduceMotion ? 1 : 0.96,
      filter: shouldReduceMotion ? "none" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: shouldReduceMotion ? 0 : 0.2, // 5.4s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // 5.55s: Headline masked line rise (0.35s offset)
  const headlineMaskVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
      filter: shouldReduceMotion ? "none" : "blur(8px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay: shouldReduceMotion ? 0 : 0.35, // 5.55s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // 5.75s: Subheadline paragraph (0.55s offset)
  const subheadlineVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: shouldReduceMotion ? 0 : 0.55, // 5.75s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // 5.9s: Dual CTA row (0.70s offset)
  const ctaRowVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: shouldReduceMotion ? 0 : 0.7, // 5.9s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // 5.8s: Tournament Bento Dock (0.55s - 0.60s offset)
  const bentoDockVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay: shouldReduceMotion ? 0 : 0.55, // 5.75s - 5.8s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // 5.9s: Bottom Utility & Interactive Cinema Bar (0.70s offset)
  const bottomUtilityVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: shouldReduceMotion ? 0 : 0.7, // 5.9s
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      aria-label="Golden Aura Trust Hero"
    >
      {/* 1. Full-Height Cinematic Video Canvas with Dynamic Filter Transition */}
      <div className={styles.heroVideoWrap} aria-hidden="true">
        <motion.div
          className={styles.videoDriftWrap}
          style={{
            rotateX: hasEnded && !shouldReduceMotion ? tiltX : 0,
            rotateY: hasEnded && !shouldReduceMotion ? tiltY : 0,
            x: hasEnded && !shouldReduceMotion ? shiftX : 0,
            y: hasEnded && !shouldReduceMotion ? shiftY : 0,
            scale: isRevealed ? 1.05 : 1,
          }}
          transition={{
            scale: { duration: 2.2, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <video
            ref={videoRef}
            className={styles.heroVideo}
            style={{
              filter: isRevealed
                ? "brightness(0.75) contrast(1.06)"
                : "brightness(1) contrast(1) saturate(1)",
              transform: isRevealed ? "scale(1.02)" : "scale(1)",
            }}
            src="/video/hero_video.mp4"
            poster="/images/hero-intro-poster.webp"
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={() => {
              setHeroState("SETTLED");
              setHasEnded(true);
            }}
          >
            <img src="/images/hero-knight-bg.webp" alt="Golden Aura Chess" />
          </video>

          {/* Crisp freeze-frame backplate to eliminate transition flicker */}
          <Image
            src="/images/hero-board-final.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`${styles.heroPosterFallback} ${hasEnded ? styles.posterActive : ""}`}
            style={{
              filter: isRevealed
                ? "brightness(0.75) contrast(1.06)"
                : "brightness(1) contrast(1) saturate(1)",
              transform: isRevealed ? "scale(1.02)" : "scale(1)",
            }}
          />
        </motion.div>

        {/* Interactive Specular Light Glint: Reacts to cursor over the luxury marble & gold pieces */}
        {hasEnded && !shouldReduceMotion && (
          <motion.div
            className={styles.cursorSpecularSheen}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              background: sheenBackground,
            }}
          />
        )}

        {/* Base Cinema Perimeter Vignette: Active from 0.0s from the start to frame the 3D lens */}
        <div className={styles.baseCinemaVignette} aria-hidden="true" />

        {/* Volumetric Golden Dust Motes Particle Overlay */}
        <DustMotesCanvas active={isRevealed && !shouldReduceMotion} />

        {/* Multi-Layer Atmospheric Scrim (Left Text Shield, Bottom Vignette, Gold Glow) */}
        <div
          className={styles.scrimContainer}
          style={{
            opacity: isRevealed ? 1 : 0,
          }}
        >
          <div className={styles.scrimLeftTextShield} />
          <div className={styles.scrimBottomVignette} />
          <div className={styles.scrimGoldDustGlow} />
          <div className={styles.scrimTopGrounding} />
        </div>
      </div>

      {/* Floating Skip & Audio Controller during Intro Mode (0.0s – 5.0s) */}
      <AnimatePresence>
        {!isRevealed && !shouldReduceMotion && (
          <motion.div
            className={styles.introControlsWrap}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={handleSkip}
              className={styles.skipPillBtn}
              aria-label="Skip video reveal directly to chessboard"
            >
              <span>Skip Reveal</span>
              <SkipForward size={13} weight="fill" />
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={styles.introSoundBtn}
              aria-label={isMuted ? "Unmute intro video audio" : "Mute intro video audio"}
            >
              {isMuted ? (
                <SpeakerSimpleSlash size={14} weight="bold" />
              ) : (
                <SpeakerSimpleHigh size={14} weight="bold" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open-Center Cinema Frame Container (Center stays open for overhead chessboard) */}
      <div className={styles.heroLayoutContainer}>
        {/* Cleared Middle Zone: Unoccluded center viewport */}
        <div className={styles.openCenterZone} aria-hidden="true" />

        {/* Bottom-Anchored Split Dock: Bottom-Left Editorial Stage & Bottom-Right Tournament Bento Dock */}
        <div className={styles.bottomDockWrapper}>
          {/* Bottom-Left Editorial Stage (z-20) */}
          <div className={styles.editorialStage} inert={!isRevealed}>
            {/* 3.1 Eyebrow Badge (Reveals at 5.4s) */}
            <motion.div
              variants={eyebrowVariants}
              initial="hidden"
              animate={isRevealed ? "visible" : "hidden"}
              className={styles.kickerBadge}
            >
              <span className={styles.statusPulse}>
                <span className={styles.statusDot} />
                <span className={styles.statusPing} />
              </span>
              <span className={styles.kickerText}>
                NAMMA BENGALURU GRANDMASTERS OPEN
              </span>
              <span className={styles.kickerDivider} aria-hidden="true" />
              <span className={styles.kickerSub}>FIDE RATED</span>
            </motion.div>

            {/* 3.2 Display Headline (Reveals at 5.55s via masked line-by-line slide-up) */}
            <h1 className={styles.heroTitle}>
              <div className={styles.headlineMask}>
                <motion.span
                  variants={headlineMaskVariants}
                  initial="hidden"
                  animate={isRevealed ? "visible" : "hidden"}
                  className={styles.titleLineIvory}
                >
                  {firstLine.toUpperCase()}
                </motion.span>
              </div>
              <div className={styles.headlineMask}>
                <motion.span
                  variants={headlineMaskVariants}
                  initial="hidden"
                  animate={isRevealed ? "visible" : "hidden"}
                  className={styles.titleLineGold}
                >
                  {lastLine ? lastLine.toUpperCase() : "EVERYONE."}
                </motion.span>
              </div>
            </h1>

            {/* 3.3 Subheadline Paragraph & Dual CTA Row */}
            <div className={styles.editorialSubWrap}>
              <motion.p
                variants={subheadlineVariants}
                initial="hidden"
                animate={isRevealed ? "visible" : "hidden"}
                className={styles.heroDescription}
              >
                {heroIntro ||
                  "International tournaments. Local communities. Golden Aura Trust brings people together through chess — wherever your journey begins."}
              </motion.p>

              {/* 3.4 Dual CTA Row (Reveals at 5.9s) */}
              <motion.div
                variants={ctaRowVariants}
                initial="hidden"
                animate={isRevealed ? "visible" : "hidden"}
                className={styles.heroActions}
              >
                <motion.div
                  style={shouldReduceMotion ? {} : { x: smoothBtnX, y: smoothBtnY }}
                  className={styles.magneticWrap}
                >
                  <Link
                    href="/events"
                    className={styles.primaryButton}
                    onMouseMove={handleBtnMove}
                    onMouseLeave={handleBtnLeave}
                  >
                    <span>Explore Tournaments</span>
                    <span className={styles.btnIconCircle}>
                      <ArrowUpRight size={15} weight="bold" />
                    </span>
                    <div className={styles.buttonShine} />
                  </Link>
                </motion.div>

                <Link href="/about" className={styles.secondaryButton}>
                  <span>Meet the Trust</span>
                  <ArrowUpRight size={15} weight="bold" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* 4. Bottom-Right Tournament Bento Dock (Reveals at 5.8s, z-20) */}
          <motion.div
            className={styles.telemetryDock}
            inert={!isRevealed}
            variants={bentoDockVariants}
            initial="hidden"
            animate={isRevealed ? "visible" : "hidden"}
          >
            {/* Subtle Perimeter Gold Border Beam SVG */}
            <svg className={styles.borderBeamSvg} aria-hidden="true">
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="17"
                pathLength="100"
                className={`${styles.borderBeamRect} ${isRevealed ? styles.borderBeamActive : ""}`}
              />
            </svg>

            {/* Column 1: Next Edition Block */}
            <div className={styles.telemetryColEvent}>
              <div className={styles.trophyBadge}>
                <Trophy size={20} weight="fill" className={styles.trophyIcon} />
              </div>
              <div className={styles.eventInfo}>
                <span className={styles.eventKicker}>{archiveEvent ? `${archiveEvent.year} ${eventStatus(archiveEvent) === "upcoming" ? "EDITION" : "ARCHIVE"}` : "OUR TOURNAMENTS"}</span>
                <h3 className={styles.eventTitle}>Namma Bengaluru Open</h3>
                <span className={styles.eventLocation}>
                  <span className={styles.liveDot} /> Bengaluru, Karnataka
                </span>
              </div>
            </div>

            <div className={styles.telemetryDivider} aria-hidden="true" />

            {/* Column 2: Contenders Stat */}
            <div className={styles.telemetryColStat}>
              <strong className={styles.statNumber}>
                <AnimatedCounter
                  target={2}
                  start={isRevealed}
                  duration={1.2}
                />
              </strong>
              <span className={styles.statLabel}>INTERNATIONAL EDITIONS</span>
            </div>

            <div className={styles.telemetryDivider} aria-hidden="true" />

            {/* Column 3: Nations Stat */}
            <div className={styles.telemetryColStat}>
              <strong className={styles.statNumber}>
                <AnimatedCounter
                  target={64}
                  start={isRevealed}
                  duration={1.2}
                />
              </strong>
              <span className={styles.statLabel}>SQUARES. ONE GAME.</span>
            </div>

            <div className={styles.telemetryDivider} aria-hidden="true" />

            {/* Column 4: Prize Pool & Action */}
            <div className={styles.telemetryColPrize}>
              <div className={styles.prizeTopRow}>
                <span className={styles.prizeLabel}>TOTAL PRIZE POOL</span>
                <Link
                  href={archiveEvent ? `/events/${archiveEvent.slug}` : "/events"}
                  className={styles.archiveMicroBtn}
                  title="View tournament archive"
                >
                  <span>View Archive</span>
                  <ArrowUpRight size={11} weight="bold" />
                </Link>
              </div>
              <span className={styles.prizeAmount}>
                {archiveEvent?.prizeFund || "See archive"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 5. Bottom Utility & Interactive Cinema Bar (Reveals at 5.9s, z-20) */}
        <motion.div
          className={styles.bottomStatusStrip}
          variants={bottomUtilityVariants}
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
        >
          <div className={styles.statusStripLeft}>
            <span className={styles.taglineSegment}>ONE BOARD. EVERY POSSIBILITY.</span>
            <span className={styles.taglineDivider} aria-hidden="true">
              ·
            </span>
            <span className={styles.taglineSub}>EQUALITY ON 64 SQUARES</span>
          </div>

          <div className={styles.statusStripRight}>
            <a
              href="#about"
              className={styles.scrollIndicator}
              aria-label="Discover the Vision"
            >
              <span>Discover the Vision</span>
              <CaretDown size={14} weight="bold" className={styles.bounceIcon} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

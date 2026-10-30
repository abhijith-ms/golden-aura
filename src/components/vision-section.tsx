"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  Trophy,
  UsersThree,
  Sparkle,
  Compass,
} from "@phosphor-icons/react";
import styles from "./vision.module.css";

interface FocusArea {
  title: string;
  description: string;
  label: string;
}

interface VisionSectionProps {
  aboutIntro: string;
  focusAreas: FocusArea[];
}

const QUOTE_TEXT =
  "On sixty-four squares, everyone begins as equals. What matters is the courage to take your next move.";

/**
 * Word component for scroll-scrubbed opacity reveal
 */
function ScrollWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const textShadow = useTransform(progress, [start, end], [
    "0 0 0px rgba(245, 186, 66, 0)",
    "0 0 16px rgba(245, 186, 66, 0.45)",
  ]);
  const color = useTransform(progress, [start, end], ["#71717a", "#ffffff"]);

  return (
    <motion.span
      style={{ opacity, textShadow, color }}
      className={styles.quoteWord}
    >
      {word}{" "}
    </motion.span>
  );
}

/**
 * Single 3D Spotlight Tilt Card
 */
function SpotlightPillarCard({
  area,
  index,
  globalMouseX,
  globalMouseY,
  shouldReduceMotion,
}: {
  area: FocusArea;
  index: number;
  globalMouseX: MotionValue<number>;
  globalMouseY: MotionValue<number>;
  shouldReduceMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Local card tilt motion values
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  const springTiltConfig = { damping: 20, stiffness: 140, mass: 0.6 };
  const smoothLocalX = useSpring(localX, springTiltConfig);
  const smoothLocalY = useSpring(localY, springTiltConfig);

  const rotateX = useTransform(smoothLocalY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothLocalX, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    localX.set(x);
    localY.set(y);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    localX.set(0);
    localY.set(0);
  }

  // Card icons based on index
  const pillarIcons = [
    <UsersThree key="users" size={28} weight="duotone" className={styles.pillarIconGlyph} />,
    <Trophy key="trophy" size={28} weight="duotone" className={styles.pillarIconGlyph} />,
    <Sparkle key="sparkle" size={28} weight="duotone" className={styles.pillarIconGlyph} />,
  ];

  // Default progress widths based on pillar number
  const defaultProgressWidths = ["33%", "66%", "100%"];

  return (
    <motion.article
      ref={cardRef}
      className={styles.pillarSpotlightCard}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        shouldReduceMotion
          ? {}
          : {
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }
      }
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div className={styles.cardSpotlightSurface} />
      <div className={styles.cardBorderGlow} />

      {/* Ambient Corner Spotlight Glow behind Top-Right Icon */}
      <div className={styles.cardCornerSpotlight} aria-hidden="true" />

      {/* Minimalist Architectural Ghost Numeral Watermark */}
      <div className={styles.ghostNumeralWrap} aria-hidden="true">
        <span className={styles.ghostNumeralText}>0{index + 1}</span>
      </div>

      {/* Unified Content Flex Column (relative z-10) */}
      <div className={styles.cardContentWrapper}>
        {/* Top Header Row: Category Pill Left, Icon Right */}
        <div className={styles.cardTopRow}>
          <span className={styles.pillarTagBadge}>{area.label}</span>
          <div className={styles.iconContainer}>
            {index === 0 && <span className={styles.radarRippleRing} />}
            {index === 1 && <span className={styles.shimmerEffect} />}
            {pillarIcons[index] ?? pillarIcons[0]}
          </div>
        </div>

        {/* Bottom Group: Headline, Paragraph, Progress Footer */}
        <div className={styles.cardBottomGroup}>
          <div className={styles.cardTextBlock}>
            <h3 className={styles.cardHeadline}>{area.title}</h3>
            <p className={styles.cardParagraph}>{area.description}</p>
          </div>

          {/* Interactive Bottom Progress Bar & Explore Micro-Label */}
          <div className={styles.cardBottomBar}>
            <div className={styles.pillarNumberGroup}>
              <span className={styles.pillarIndexCode}>PILLAR 0{index + 1}</span>
              <motion.span
                className={styles.exploreRevealPill}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -6,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <span>Explore</span>
                <ArrowUpRight size={13} weight="bold" />
              </motion.span>
            </div>

            {/* Animated Progress Line: 33%, 66%, 100% resting -> 100% on hover */}
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{
                  width: isHovered ? "100%" : defaultProgressWidths[index] ?? "33%",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function VisionSection({ aboutIntro, focusAreas }: VisionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse tracking across the 3-card grid for cursor spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleGridMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    // Propagate CSS variables for smooth spotlight rendering
    gridRef.current.style.setProperty("--mouse-x", `${x}px`);
    gridRef.current.style.setProperty("--mouse-y", `${y}px`);
  }

  // Scroll-linked scrub reveal for blockquote
  const { scrollYProgress: quoteScrollProgress } = useScroll({
    target: quoteRef,
    offset: ["start 88%", "center 52%"],
  });

  // Vertical laser accent line progress
  const laserScaleY = useTransform(quoteScrollProgress, [0, 1], [0.08, 1]);

  const words = QUOTE_TEXT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.visionSection}
      aria-label="The Golden Aura Vision"
    >
      {/* Ambient Radial Mesh Lighting (Gold + Cyan Nebula) */}
      <div className={styles.ambientNebulaGold} aria-hidden="true" />
      <div className={styles.ambientNebulaCyan} aria-hidden="true" />

      {/* Perspective Chessboard Grid Fade at Bottom */}
      <div className={styles.perspectiveChessboardGrid} aria-hidden="true" />

      {/* Section Header Row */}
      <div className={styles.visionHeaderRow}>
        <div className={styles.visionPillBadge}>
          <span className={styles.radarRadarWrap}>
            <span className={styles.radarCoreDot} />
            <span className={styles.radarPulseWave} />
          </span>
          <span className={styles.badgeLabel}>THE GOLDEN AURA VISION</span>
        </div>
        <span className={styles.locationKicker}>ROOTED IN BENGALURU</span>
      </div>

      {/* Editorial Split Grid */}
      <div className={styles.editorialSplitGrid}>
        {/* Left Column: Bold Headline with Metallic Liquid Gold Gradient */}
        <div className={styles.headlineCol}>
          <h2 className={styles.mainHeadline}>
            <span className={styles.whiteHeadlineLine}>A game for everyone.</span>
            <span className={styles.liquidGoldLine}>A community in motion.</span>
          </h2>
        </div>

        {/* Right Column: Scroll-Scrubbed Quote + Narrative + High-Visibility CTA */}
        <div ref={quoteRef} className={styles.storyCol}>
          {/* Quote Block with Laser Progress Line */}
          <div className={styles.quoteBlockWrap}>
            <div className={styles.laserTrackWrap} aria-hidden="true">
              <motion.div
                className={styles.laserFillBar}
                style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: laserScaleY }}
              />
            </div>

            <blockquote className={styles.scrubBlockquote}>
              {shouldReduceMotion ? (
                <span className={styles.staticQuoteText}>{QUOTE_TEXT}</span>
              ) : (
                words.map((word, i) => {
                  const start = i / words.length;
                  const end = start + 1 / words.length;
                  return (
                    <ScrollWord
                      key={i}
                      word={word}
                      progress={quoteScrollProgress}
                      start={start}
                      end={end}
                    />
                  );
                })
              )}
            </blockquote>
          </div>

          <p className={styles.storyNarrativeText}>{aboutIntro}</p>

          {/* CRITICAL BUG FIX: High-Visibility Glassmorphic Pill Button */}
          <div className={styles.ctaWrapper}>
            <Link href="/about" className={styles.highVisibilityCtaBtn}>
              <span className={styles.btnTextGlow}>Get to know the Trust</span>
              <span className={styles.arrowIconBubble}>
                <ArrowUpRight size={15} weight="bold" className={styles.diagonalArrow} />
              </span>
              <span className={styles.ctaAuraGlow} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Spotlight Pillars of Impact Grid */}
      <motion.div
        ref={gridRef}
        className={styles.pillars3DGrid}
        onMouseMove={handleGridMouseMove}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {focusAreas.map((area, i) => (
          <SpotlightPillarCard
            key={area.label}
            area={area}
            index={i}
            globalMouseX={mouseX}
            globalMouseY={mouseY}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </section>
  );
}

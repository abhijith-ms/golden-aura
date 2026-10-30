"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { EventAttendee } from "@/lib/types";
import { countryFlags } from "@/lib/countries";
import styles from "./players.module.css";

const titles: Record<string, string> = {
  GM: "Grandmaster",
  IM: "International Master",
  WGM: "Woman Grandmaster",
  WIM: "Woman International Master",
  WFM: "Woman FIDE Master",
};

interface PlayersSectionProps {
  players: EventAttendee[];
  firstEditionSlug?: string;
}

/**
 * Individual Grandmaster Collector Card
 * Features scroll-driven 3D unroll, opposing row parallax drift,
 * editorial monochrome-to-color transition, floating prestige badge,
 * diagonal metallic sheen, and deep typography scrim.
 */
export function PlayerCollectorCard({
  player,
  index,
  scrollProgress,
  sectionProgress,
  shouldReduceMotion,
}: {
  player: EventAttendee;
  index: number;
  scrollProgress: MotionValue<number>;
  sectionProgress: MotionValue<number>;
  shouldReduceMotion: boolean | null;
}) {
  const flagSrc = countryFlags[player.country];
  const fullTitle = titles[player.title] ?? player.title;

  const colIndex = index % 7;
  const rowIndex = Math.floor(index / 7);

  // Staggered reveal window mapped to scroll progression into section
  const revealStart = 0.04 + colIndex * 0.08 + rowIndex * 0.04;
  const revealEnd = Math.min(revealStart + 0.22, 1);

  const cardY = useTransform(scrollProgress, [revealStart, revealEnd], [80, 0]);
  const cardOpacity = useTransform(scrollProgress, [revealStart, revealEnd], [0, 1]);
  const cardScale = useTransform(scrollProgress, [revealStart, revealEnd], [0.92, 1]);
  const cardRotateX = useTransform(scrollProgress, [revealStart, revealEnd], [20, 0]);
  const cardBlur = useTransform(
    scrollProgress,
    [revealStart, revealEnd],
    ["blur(8px)", "blur(0px)"]
  );

  // Continuous opposing horizontal parallax drift while scrolling past section
  const driftX = useTransform(
    sectionProgress,
    [0, 1],
    rowIndex === 0 ? [32, -32] : [-32, 32]
  );

  const motionStyle = shouldReduceMotion
    ? {}
    : {
        y: cardY,
        opacity: cardOpacity,
        scale: cardScale,
        rotateX: cardRotateX,
        filter: cardBlur,
        x: driftX,
        transformPerspective: 1000,
      };

  return (
    <motion.article
      className={styles.playerCard}
      style={motionStyle}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.04, zIndex: 20 }}
      tabIndex={0}
      aria-label={`${fullTitle} ${player.name}, ${player.country}`}
    >
      {/* Photo Wrapper with Monochrome Filter Grade */}
      <div className={styles.photoWrapper}>
        {player.photo ? (
          <Image
            src={player.photo.src}
            alt={player.photo.alt || `Portrait of ${player.name}`}
            fill
            sizes="(max-width: 560px) 46vw, (max-width: 820px) 30vw, (max-width: 1180px) 23vw, 185px"
            className={styles.playerImage}
            quality={90}
          />
        ) : (
          <div className={styles.fallbackPortrait} aria-hidden="true">
            {player.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
      </div>

      {/* Warm Gold / Obsidian Tint Overlay */}
      <div className={styles.tintOverlay} aria-hidden="true" />

      {/* Diagonal Metallic Sheen Sweep */}
      <div className={styles.lightSheen} aria-hidden="true" />

      {/* Floating Prestige Title Badge (Top-Left) */}
      <div className={styles.titleBadge}>
        <abbr title={fullTitle} className={styles.titleAbbr}>
          {player.title}
        </abbr>
      </div>

      {/* Deep Bottom Gradient Scrim for Legibility */}
      <div className={styles.bottomScrim} aria-hidden="true" />

      {/* Bottom Content / Typography Overlay */}
      <div className={styles.cardInfo}>
        <h3 className={styles.playerName}>{player.name}</h3>
        <div className={styles.playerCountry}>
          {flagSrc && (
            <Image
              src={flagSrc}
              alt=""
              width={16}
              height={11}
              className={styles.countryFlag}
              aria-hidden="true"
            />
          )}
          <span className={styles.countryLabel}>{player.country}</span>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * 03 / THE FIRST INTERNATIONAL EDITION Showcase
 * Awwwards-level interactive scroll-driven player showcase preserving all 14 players, titles, and countries.
 */
export function PlayersSection({
  players,
  firstEditionSlug = "namma-bengaluru-open-2024",
}: PlayersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress 1: Entry Window for Card Reveal Wave
  const { scrollYProgress: revealProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "center 45%"],
  });

  // Scroll Progress 2: Full Section Window for Opposing Parallax Drift
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={sectionRef} id="first-edition" className={styles.playersSection}>
      {/* Ambient Lighting Nebulas */}
      <div className={styles.ambientNebulaGold} aria-hidden="true" />
      <div className={styles.ambientNebulaAmber} aria-hidden="true" />

      {/* Header Choreography */}
      <div className={styles.headerRow}>
        <div className={styles.eyebrowRow}>
          <span className={styles.glowingDot} aria-hidden="true" />
          <span className={styles.eyebrowText}>THE FIRST INTERNATIONAL EDITION · 2024</span>
        </div>

        <div className={styles.headlineFlex}>
          <h2 className={styles.sectionTitle}>
            Grandmasters &<br />
            <span className={styles.goldShimmerText}>titled players.</span>
          </h2>

          <Link
            href={`/events/${firstEditionSlug}#attendees`}
            className={styles.archiveHeaderLink}
          >
            <span>Meet the first-edition players</span>
            <ArrowUpRight size={17} weight="bold" className={styles.archiveLinkArrow} />
          </Link>
        </div>

        <p className={styles.subtitle}>
          A look at the Indian and international names featured in the first-edition tournament archive.
        </p>
      </div>

      {/* 14 Collector Cards Grid with Scroll-Driven Reveal */}
      <div className={styles.playersGrid}>
        {players.map((player, index) => (
          <PlayerCollectorCard
            key={player.name}
            player={player}
            index={index}
            scrollProgress={revealProgress}
            sectionProgress={sectionProgress}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </section>
  );
}

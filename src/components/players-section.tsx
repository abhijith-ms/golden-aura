"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
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
 * Features editorial monochrome-to-color transition, floating prestige badge,
 * diagonal metallic sheen, and deep typography scrim.
 */
export function PlayerCollectorCard({
  player,
  variants,
}: {
  player: EventAttendee;
  variants?: any;
}) {
  const flagSrc = countryFlags[player.country];
  const fullTitle = titles[player.title] ?? player.title;

  return (
    <motion.article
      className={styles.playerCard}
      variants={variants}
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
 * Awwwards-level interactive player showcase preserving all 14 players, titles, and countries.
 */
export function PlayersSection({
  players,
  firstEditionSlug = "namma-bengaluru-open-2024",
}: PlayersSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="first-edition" className={styles.playersSection}>
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

      {/* 14 Collector Cards Grid */}
      <motion.div
        className={styles.playersGrid}
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.08 }}
      >
        {players.map((player) => (
          <PlayerCollectorCard
            key={player.name}
            player={player}
            variants={cardVariants}
          />
        ))}
      </motion.div>
    </section>
  );
}

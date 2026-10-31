"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  CalendarBlank,
  MapPin,
  Trophy,
  Crown,
} from "@phosphor-icons/react";
import type { Event } from "@/lib/types";
import styles from "./tournaments.module.css";

interface TournamentsSectionProps {
  featured: Event[];
}

/**
 * Individual 3D Spotlight Tournament Dossier Card
 */
function TournamentCard({
  event,
  shouldReduceMotion,
}: {
  event: Event;
  shouldReduceMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Local card tilt motion values
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  const springTiltConfig = { damping: 20, stiffness: 140, mass: 0.6 };
  const smoothLocalX = useSpring(localX, springTiltConfig);
  const smoothLocalY = useSpring(localY, springTiltConfig);

  const rotateX = useTransform(smoothLocalY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothLocalX, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    localX.set(x);
    localY.set(y);
  }

  function handleMouseLeave() {
    localX.set(0);
    localY.set(0);
  }

  const isCompleted = event.status === "completed";
  const statusLabel = isCompleted
    ? "COMPLETED"
    : event.status === "cancelled"
      ? "CANCELLED"
      : "UPCOMING";

  return (
    <motion.article
      ref={cardRef}
      className={styles.tournamentCard}
      onMouseMove={handleMouseMove}
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
        hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
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
      {/* Dynamic Cursor Spotlight Layers */}
      <div className={styles.cardSpotlightSurface} />
      <div className={styles.cardBorderGlow} />

      {/* Left: Cinematic Photo Stage with Smoked Glass Year Badge & Edge Bleed */}
      <div className={styles.photoStageCol}>
        {/* Floating Frosted Smoked-Glass Year Badge */}
        <div className={styles.smokedYearBadge}>
          <span className={styles.yearPulsingDot} aria-hidden="true" />
          <span>{event.year}</span>
        </div>

        {/* Photo Container with Parallax Zoom */}
        <div className={styles.photoImageWrap}>
          <Image
            src={event.image.src}
            alt={event.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
            quality={90}
            className={styles.photoImage}
          />
        </div>

        {/* Cinematic Edge Bleed to eliminate harsh stadium light clash */}
        <div className={styles.cinematicEdgeBleed} aria-hidden="true" />
      </div>

      {/* Right: Technical Grandmaster Dossier Details */}
      <div className={styles.dossierContentCol}>
        <div className={styles.dossierHeaderGroup}>
          {/* Status Badge with Championship Crown */}
          <span className={styles.statusPillBadge}>
            <Crown size={12} weight="fill" className={styles.statusCrownIcon} />
            <span>
              {statusLabel} · {event.format}
            </span>
          </span>

          {/* Tournament Title */}
          <h3 className={styles.dossierTitle}>
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
        </div>

        {/* Metadata Facts Grid (horizontally aligned across both cards) */}
        <div className={styles.metadataBlock}>
          <div className={styles.metadataRow}>
            {/* Date */}
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabelRow}>
                <CalendarBlank size={13} weight="bold" className={styles.metadataLabelIcon} />
                <span>WHEN</span>
              </div>
              <span className={styles.metadataValue}>{event.dateLabel}</span>
            </div>

            {/* Venue */}
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabelRow}>
                <MapPin size={13} weight="bold" className={styles.metadataLabelIcon} />
                <span>WHERE</span>
              </div>
              <span className={styles.metadataValue}>{event.venue}</span>
            </div>
          </div>

          {/* Standout Prize Fund (highlighted on 2025 edition) */}
          {event.prizeFund && (
            <div className={styles.metadataItem}>
              <div className={styles.metadataLabelRow}>
                <Trophy size={13} weight="bold" className={styles.metadataLabelIcon} />
                <span>PRIZE FUND</span>
              </div>
              <span className={styles.prizeFundBadge}>
                <Trophy size={13} weight="fill" />
                <span>{event.prizeFund}</span>
              </span>
            </div>
          )}
        </div>

        {/* Full-Width Interactive Footer Bar CTA */}
        <Link href={`/events/${event.slug}`} className={styles.cardFooterBar}>
          <span className={styles.footerBarLabel}>Explore tournament archive</span>
          <span className={styles.footerBarArrowBubble}>
            <ArrowUpRight size={14} weight="bold" />
          </span>
        </Link>
      </div>
    </motion.article>
  );
}

export function TournamentsSection({ featured }: TournamentsSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleGridMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridRef.current.style.setProperty("--mouse-x", `${x}px`);
    gridRef.current.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <section
      id="tournaments"
      className={styles.tournamentsSection}
      aria-label="Tournament Archive"
    >
      {/* Ambient Lighting Nebulae */}
      <div className={styles.ambientNebulaGold} aria-hidden="true" />
      <div className={styles.ambientNebulaCyan} aria-hidden="true" />

      {/* Technical HUD Eyebrow Bar with Animated Connecting Hairline Divider */}
      <div className={styles.hudEyebrowRow}>
        <span className={styles.hudKickerLeft}>02 / AT THE BOARD</span>
        <motion.div
          className={styles.hudHairlineDivider}
          initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className={styles.hudKickerRight}>THE TOURNAMENT ARCHIVE</span>
      </div>

      {/* Section Headline with Mask Reveal & Archive Link */}
      <div className={styles.sectionHeadingBar}>
        <div className={styles.headlineMaskWrap}>
          <motion.h2
            className={styles.mainHeadline}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Find your <span className={styles.liquidGoldText}>next move.</span>
          </motion.h2>
        </div>

        {/* Archive CTA with Dual-Layer Sliding Gold Underline */}
        <Link href="/events" className={styles.archiveLink}>
          <span>All tournaments & gatherings</span>
          <ArrowUpRight size={15} weight="bold" className={styles.archiveArrow} />
          <span className={styles.archiveUnderlineTrack} aria-hidden="true" />
          <span className={styles.archiveUnderlineFill} aria-hidden="true" />
        </Link>
      </div>

      {/* Interactive Grandmaster Dossier Grid */}
      {featured.length > 0 ? (
        <motion.div
          ref={gridRef}
          className={styles.dossierGrid}
          onMouseMove={handleGridMouseMove}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {featured.map((event) => (
            <TournamentCard
              key={event.slug}
              event={event}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      ) : (
        <div className={styles.emptyState}>
          <h3>A new chapter is coming.</h3>
          <p>Get in touch for event announcements.</p>
          <Link href="/contact" className={styles.archiveLink}>
            <span>Talk to the Trust</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      )}
    </section>
  );
}

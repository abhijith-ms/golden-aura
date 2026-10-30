"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { ArrowUpRight, Trophy, Users, Globe, CaretDown } from "@phosphor-icons/react";
import styles from "./hero.module.css";

interface HeroSectionProps {
  heroTitle: string;
  heroIntro: string;
}

export function HeroSection({ heroTitle, heroIntro }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse coordinate tracking for 3D parallax depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms for floating elements
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const cardTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-18, 18]);
  const cardTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-18, 18]);
  const bgTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [12, -12]);
  const bgTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12]);

  // Magnetic button physics
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const smoothBtnX = useSpring(btnX, { damping: 15, stiffness: 150 });
  const smoothBtnY = useSpring(btnY, { damping: 15, stiffness: 150 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

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

  // Kinetic typography variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 36,
      filter: shouldReduceMotion ? "none" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Splitting hero lines
  const lines = heroTitle.split("\n");

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Golden Aura Trust Hero"
    >
      {/* Dynamic Background Mesh & Parallax Layer */}
      <motion.div
        className={styles.heroBackdrop}
        style={shouldReduceMotion ? {} : { x: bgTranslateX, y: bgTranslateY }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero-knight-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        {/* Layered Obsidian Vignettes */}
        <div className={styles.heroVignetteRight} />
        <div className={styles.heroVignetteBottom} />
        <div className={styles.heroGlowGold} />
        <div className={styles.heroGlowCyan} />
      </motion.div>

      {/* Main Content Container with Asymmetrical Split */}
      <div className={styles.heroInner}>
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Kicker Badge */}
          <motion.div variants={itemVariants} className={styles.kickerBadge}>
            <span className={styles.statusPulse}>
              <span className={styles.statusDot} />
              <span className={styles.statusPing} />
            </span>
            <span className={styles.kickerText}>
              NAMMA BENGALURU GRANDMASTERS OPEN
            </span>
            <span className={styles.kickerSeparator} aria-hidden="true">
              /
            </span>
            <span className={styles.kickerSub}>FIDE RATED</span>
          </motion.div>

          {/* Kinetic Headline */}
          <motion.h1 variants={itemVariants} className={styles.heroTitle}>
            {lines.map((line, idx) => (
              <span key={idx} className={styles.titleLine}>
                {idx === lines.length - 1 ? (
                  <span className={styles.goldGlowText}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </motion.h1>

          {/* Subtext Paragraph */}
          <motion.p variants={itemVariants} className={styles.heroDescription}>
            {heroIntro}
          </motion.p>

          {/* Call to Actions with Magnetic Physics */}
          <motion.div variants={itemVariants} className={styles.heroActions}>
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
                  <ArrowUpRight size={16} weight="bold" />
                </span>
                <div className={styles.buttonShine} />
              </Link>
            </motion.div>

            <Link href="/about" className={styles.secondaryButton}>
              <span>Meet the Trust</span>
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Floating Interactive Tournament Badge */}
        <motion.div
          className={styles.heroVisualCol}
          style={
            shouldReduceMotion
              ? {}
              : {
                  rotateX,
                  rotateY,
                  x: cardTranslateX,
                  y: cardTranslateY,
                  transformPerspective: 1200,
                }
          }
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.floatingCard}>
            <div className={styles.cardGlowBorder} />
            <div className={styles.cardHeader}>
              <div className={styles.trophyIconWrap}>
                <Trophy size={26} weight="duotone" className={styles.trophyIcon} />
              </div>
              <div>
                <span className={styles.cardKicker}>NEXT EDITION</span>
                <h3 className={styles.cardTitle}>Namma Bengaluru Open</h3>
              </div>
            </div>

            <div className={styles.cardStatsGrid}>
              <div className={styles.statPill}>
                <Users size={18} className={styles.statIcon} />
                <div>
                  <strong className={styles.statNumber}>600+</strong>
                  <span className={styles.statLabel}>Contenders</span>
                </div>
              </div>
              <div className={styles.statPill}>
                <Globe size={18} className={styles.statIcon} />
                <div>
                  <strong className={styles.statNumber}>17</strong>
                  <span className={styles.statLabel}>Nations</span>
                </div>
              </div>
            </div>

            <div className={styles.prizeStrip}>
              <span className={styles.prizeLabel}>TOTAL PRIZE POOL</span>
              <span className={styles.prizeAmount}>₹35,00,000</span>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.liveIndicator}>
                <span className={styles.miniDot} /> Bengaluru, Karnataka
              </span>
              <Link href="/events/namma-bengaluru-open-2025" className={styles.cardLink}>
                View Archive <ArrowUpRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Bottom Momentum Bar */}
      <motion.div
        className={styles.heroBottomBar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className={styles.bottomBarLeft}>
          <span className={styles.taglineSegment}>ONE BOARD. EVERY POSSIBILITY.</span>
          <span className={styles.taglineDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.taglineSub}>EQUALITY ON 64 SQUARES</span>
        </div>

        <a href="#about" className={styles.scrollIndicator} aria-label="Scroll to discover">
          <span>Discover the Vision</span>
          <CaretDown size={14} weight="bold" className={styles.bounceIcon} />
        </a>
      </motion.div>
    </section>
  );
}

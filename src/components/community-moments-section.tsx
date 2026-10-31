"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Camera,
} from "@phosphor-icons/react";
import type { Photo } from "@/lib/types";
import styles from "./community-moments.module.css";

interface CommunityMomentsSectionProps {
  photos: Photo[];
}

/**
 * Magnetic button wrapper with soft cursor physics
 */
function MagneticButton({
  children,
  onClick,
  disabled,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 180 });
  const springY = useSpring(y, { damping: 15, stiffness: 180 });

  function handleMouseMove(e: React.MouseEvent) {
    if (shouldReduceMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.28);
    y.set((e.clientY - centerY) * 0.28);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduceMotion ? {} : { x: springX, y: springY }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
}

/**
 * Magnetic CTA link wrapper with soft cursor pull
 */
function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, stiffness: 160 });
  const springY = useSpring(y, { damping: 18, stiffness: 160 });

  function handleMouseMove(e: React.MouseEvent) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={shouldReduceMotion ? {} : { x: springX, y: springY }}
      className={styles.magneticWrapper}
    >
      <Link
        ref={ref}
        href={href}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/**
 * 03 / THE PEOPLE MAKE THE GAME — Community Moments
 * Smooth, continuous, and interactive showcase with living backlight,
 * Ken Burns pan-and-zoom, 3D tilt, and dynamic thumbnail filmstrip.
 */
export function CommunityMomentsSection({ photos }: CommunityMomentsSectionProps) {
  const [active, setActive] = useState(0);

  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  // 3D Tilt motion values for main stage
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { damping: 22, stiffness: 140 });
  const springMouseY = useSpring(mouseY, { damping: 22, stiffness: 140 });

  const rotateX = useTransform(springMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springMouseX, [-0.5, 0.5], [-6, 6]);
  const sheenOpacity = useTransform(springMouseX, [-0.5, 0.5], [0.15, 0.45]);

  const total = photos.length;
  const activePhoto = photos[active] || photos[0];

  const select = useCallback(
    (index: number) => {
      const next = (index + total) % total;
      setActive(next);
    },
    [total]
  );

  // 3D Tilt handlers
  function handleStageMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
    const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xNorm);
    mouseY.set(yNorm);
  }

  function handleStageMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section id="moments" className={styles.momentsSection}>
      {/* Ambient Radial Mesh Lighting */}
      <div className={styles.ambientNebulaGold} aria-hidden="true" />
      <div className={styles.ambientNebulaCyan} aria-hidden="true" />

      {/* 2. Header & Eyebrow HUD Choreography */}
      <div className={styles.hudEyebrowRow}>
        <div className={styles.hudKickerLeft}>
          <span className={styles.kickerDot} aria-hidden="true" />
          <span>03 / THE PEOPLE MAKE THE GAME</span>
        </div>

        <motion.span
          className={styles.hudHairlineDivider}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />

        <div className={styles.hudKickerRight}>
          <span>COMMUNITY MOMENTS</span>
        </div>
      </div>

      {/* Headline & Magnetic Action Link */}
      <div className={styles.sectionHeading}>
        <h2 className={styles.sectionTitle}>
          <motion.span
            className={styles.titleWord}
            initial={{ y: 35, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Life
          </motion.span>
          <motion.span
            className={styles.titleWord}
            initial={{ y: 35, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            around
          </motion.span>
          <motion.span
            className={`${styles.titleWord} ${styles.goldShimmerText}`}
            initial={{ y: 35, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            the board.
          </motion.span>
        </h2>

        <MagneticLink href="/gallery" className={styles.archiveHeaderLink}>
          <span>All moments</span>
          <ArrowUpRight size={17} weight="bold" className={styles.archiveLinkArrow} />
          <span className={styles.archiveLinkUnderline} />
        </MagneticLink>
      </div>

      {/* Main Gallery Stage Card */}
      <div
        className={styles.galleryCard}
      >
        {/* 1. Ambient Dynamic Backlight (Living Background) */}
        <div className={styles.livingBacklightWrapper} aria-hidden="true">
          <AnimatePresence>
            <motion.div
              key={activePhoto.src}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 0.38, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={styles.livingBacklightImage}
              style={{ backgroundImage: `url(${activePhoto.src})` }}
            />
          </AnimatePresence>
        </div>

        {/* 3. Main Stage Image (Ken Burns + 3D Tilt + Transitions) */}
        <div className={styles.photoStack}>
          <motion.div
            ref={stageRef}
            className={styles.photoStage}
            tabIndex={0}
            aria-label="Featured photograph. Use left and right arrow keys to explore."
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
            style={
              shouldReduceMotion
                ? {}
                : {
                    rotateX,
                    rotateY,
                    transformPerspective: 1000,
                  }
            }
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                select(active + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                select(active - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                select(0);
              } else if (e.key === "End") {
                e.preventDefault();
                select(total - 1);
              }
            }}
            onPointerDown={(e) => {
              if (!e.isPrimary || e.button !== 0) return;
              pointerStart.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              const start = pointerStart.current;
              pointerStart.current = null;
              if (!start) return;
              const dx = e.clientX - start.x;
              const dy = e.clientY - start.y;
              if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                select(active + (dx < 0 ? 1 : -1));
              }
            }}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            {/* Seamless Overlapping Slide Transitions with Zero Black Gap */}
            <AnimatePresence initial={false}>
              <motion.div
                key={activePhoto.src}
                className={styles.slideTransitionLayer}
                initial={{
                  opacity: 0,
                  scale: 1.04,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  zIndex: 2,
                }}
                exit={{
                  opacity: 0,
                  zIndex: 1,
                  transition: { duration: 0.45, ease: "easeOut" },
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Continuous Slow Ken Burns Pan-and-Zoom */}
                <motion.div
                  className={styles.kenBurnsMotion}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: [1, 1.06, 1],
                          x: [0, -6, 0],
                          y: [0, -4, 0],
                        }
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    fill
                    sizes="(max-width: 760px) 92vw, (max-width: 1400px) 58vw, 840px"
                    className={styles.stageImage}
                    priority
                    quality={90}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Moving Glassmorphic Sheen Reflection */}
            <motion.div
              className={styles.glassSheen}
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 65%)",
                opacity: sheenOpacity,
              }}
              aria-hidden="true"
            />

            {/* Floating Frosted Glass Stamp */}
            <div className={styles.floatingStamp} aria-hidden="true">
              <Camera size={14} weight="bold" className={styles.stampIcon} />
              <span>THE GOLDEN AURA ALBUM</span>
            </div>
          </motion.div>
        </div>

        {/* 4. Right-Side Storytelling Column */}
        <div className={styles.photoStory}>
          <motion.span
            className={styles.storyEyebrow}
            initial={{ letterSpacing: "0.08em", opacity: 0.7 }}
            whileInView={{ letterSpacing: "0.14em", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            BEYOND THE SIXTY-FOUR SQUARES
          </motion.span>

          <h3 className={styles.storyTitle}>
            Every game.<br />
            <span className={styles.platinumGoldText}>A human story.</span>
          </h3>

          {/* Rolling Odometer Counter */}
          <div className={styles.odometerRow}>
            <div className={styles.odometerBox}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  className={styles.odometerDigit}
                  initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {String(active + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className={styles.odometerTotal}>
              / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Dynamic Caption Reveal */}
          <div className={styles.photoCaption} aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.p
                key={activePhoto.src}
                className={styles.captionText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activePhoto.alt.split(" ").map((word, wIdx) => (
                  <motion.span
                    key={wIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: wIdx * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={styles.captionWord}
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Auto-Advance Controls Row */}
          <div className={styles.controlsRow}>
            <div className={styles.arrowGroup}>
              <MagneticButton
                onClick={() => select(active - 1)}
                ariaLabel="Previous photograph"
                className={styles.circleButton}
              >
                <ArrowLeft size={16} weight="bold" />
              </MagneticButton>

              <MagneticButton
                onClick={() => select(active + 1)}
                ariaLabel="Next photograph"
                className={styles.circleButton}
              >
                <ArrowRight size={16} weight="bold" />
              </MagneticButton>
            </div>

            <div className={styles.timerIndicator} aria-hidden="true">
              <span className={styles.timerLabel}>Choose a moment</span>
            </div>
          </div>
        </div>

        {/* 5. Interactive Filmstrip Dock (Bottom 5 Thumbnails 01–05) */}
        <div className={styles.dockGrid} role="group" aria-label="Choose a photograph">
          {photos.map((photo, i) => {
            const isSelected = i === active;
            return (
              <motion.button
                key={photo.src}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Show photograph ${i + 1}: ${photo.alt}`}
                onClick={() => select(i)}
                className={styles.dockItem}
                whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.08 }}
                transition={{ type: "spring", damping: 18, stiffness: 220 }}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 20vw, 120px"
                  className={styles.dockThumbImage}
                  draggable={false}
                />

                <span className={styles.dockNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Sliding Golden Frame with layoutId */}
                {isSelected && (
                  <motion.div
                    layoutId="activeMomentGlow"
                    className={styles.activeDockGlow}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className={styles.activeSpotlightTop} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

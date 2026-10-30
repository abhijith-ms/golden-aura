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
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  Trophy,
  Users,
  Globe,
  CaretDown,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  ArrowClockwise,
  SkipForward,
} from "@phosphor-icons/react";
import styles from "./hero.module.css";

interface HeroSectionProps {
  heroTitle: string;
  heroIntro: string;
}

export function HeroSection({ heroTitle, heroIntro }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Video playback & reveal states
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  // Mouse coordinate tracking for 3D parallax depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms for floating elements
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const cardTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14]);
  const cardTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-14, 14]);

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

  // Handle immediate reveal on reduced motion
  useEffect(() => {
    if (shouldReduceMotion) {
      setIsRevealed(true);
      setHasEnded(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 7.95;
      }
    }
  }, [shouldReduceMotion]);

  // Handle video autoplay with fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldReduceMotion) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback; reveal contents immediately
        setIsRevealed(true);
      });
    }
  }, [shouldReduceMotion]);

  // Auto-reveal if the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40 && !isRevealed) {
        setIsRevealed(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRevealed]);

  // Video time update: triggers reveal as the camera pulls back revealing the full chessboard (~6.8s)
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;
    const dur = video.duration || 8;
    setVideoProgress(Math.min(1, current / dur));

    // When chessboard is fully revealed (~6.8s into 8.0s video)
    if (current >= 6.8 && !isRevealed) {
      setIsRevealed(true);
    }
  }, [isRevealed]);

  // Video end: freeze on the final frame (full chessboard revealed)
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration || 7.95;
    }
    setHasEnded(true);
    setIsRevealed(true);
  }, []);

  // Skip video directly to full chessboard reveal
  const handleSkip = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 7.95;
      video.pause();
    }
    setHasEnded(true);
    setIsRevealed(true);
  }, []);

  // Replay video sequence
  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    setHasEnded(false);
    setIsRevealed(false);
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (video) {
      video.muted = nextMuted;
    }
  }, [isMuted]);

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
      y: shouldReduceMotion ? 0 : 32,
      filter: shouldReduceMotion ? "none" : "blur(8px)",
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

  const lines = heroTitle.split("\n");

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Golden Aura Trust Hero"
    >
      {/* Full-Height Cinematic Video Canvas */}
      <div className={styles.heroVideoWrap} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.heroVideo}
          src="/video/hero_video.mp4"
          poster="/images/hero-board-final.jpg"
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        {/* Fallback & freeze-frame backplate to eliminate any transition flicker */}
        <Image
          src="/images/hero-board-final.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.heroPosterFallback} ${hasEnded ? styles.posterActive : ""}`}
        />

        {/* Cinematic Lighting Overlays Aligned with the Video: Theatrical atmosphere active from frame 0 */}
        <div className={styles.vignettesWrap} aria-hidden="true">
          <div className={styles.heroLeftVignette} />
          <div className={styles.heroRightVignette} />
          <div className={styles.heroTopVignette} />
          <div className={styles.heroBottomVignette} />
          <div className={styles.heroGlowGold} />
        </div>
      </div>

      {/* Floating Skip Controller during video playback */}
      <AnimatePresence>
        {!isRevealed && !shouldReduceMotion && (
          <motion.div
            className={styles.skipControllerWrap}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={handleSkip}
              className={styles.skipButton}
              aria-label="Skip to revealed board"
            >
              <span className={styles.skipProgressRing}>
                <svg viewBox="0 0 36 36" className={styles.skipSvg}>
                  <path
                    className={styles.skipCircleBg}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.skipCircleProgress}
                    strokeDasharray={`${videoProgress * 100}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <SkipForward size={14} weight="fill" className={styles.skipIcon} />
              </span>
              <span className={styles.skipLabel}>Skip to Board</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={styles.soundButton}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            >
              {isMuted ? (
                <SpeakerSimpleSlash size={16} weight="bold" />
              ) : (
                <SpeakerSimpleHigh size={16} weight="bold" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content: Revealed after Video Ends / Chessboard Emerges */}
      <div className={styles.heroInner}>
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
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
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={
            isRevealed
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.92, y: 30 }
          }
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Hero Bottom Momentum Bar & Video Controls */}
      <motion.div
        className={styles.heroBottomBar}
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        <div className={styles.bottomBarLeft}>
          <span className={styles.taglineSegment}>ONE BOARD. EVERY POSSIBILITY.</span>
          <span className={styles.taglineDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.taglineSub}>EQUALITY ON 64 SQUARES</span>
        </div>

        <div className={styles.bottomBarRight}>
          <a href="#about" className={styles.scrollIndicator} aria-label="Scroll to discover">
            <span>Discover the Vision</span>
            <CaretDown size={14} weight="bold" className={styles.bounceIcon} />
          </a>

          <div className={styles.videoControlsCluster}>
            <button
              type="button"
              onClick={handleReplay}
              className={styles.miniControlButton}
              title="Replay chessboard reveal video"
              aria-label="Replay chessboard reveal video"
            >
              <ArrowClockwise size={15} weight="bold" />
              <span className={styles.controlText}>Replay Reveal</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={styles.miniControlButton}
              title={isMuted ? "Unmute audio" : "Mute audio"}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <SpeakerSimpleSlash size={15} weight="bold" />
              ) : (
                <SpeakerSimpleHigh size={15} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

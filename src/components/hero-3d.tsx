"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { canEnhanceHero } from "@/lib/hero-policy";
import styles from "./site.module.css";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroArtwork({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const failed = useRef(false);
  const queenSeen = useRef(false);
  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [dprCap, setDprCap] = useState(1.5);
  const [playQueen, setPlayQueen] = useState(false);
  const [queenPending, setQueenPending] = useState(false);
  const reduceQuality = useCallback(() => setDprCap(1), []);
  const queenStarted = useCallback(() => {
    queenSeen.current = true;
    try { sessionStorage.setItem("golden-aura:queen-intro-v1", "seen"); } catch { /* Page-local guard still prevents replays. */ }
  }, []);
  const queenComplete = useCallback(() => { setQueenPending(false); }, []);

  const fallback = useCallback(() => {
    failed.current = true;
    setReady(false);
    setMounted(false);
    setQueenPending(false);
  }, []);
  const reveal = useCallback(() => { if (!failed.current) setReady(true); }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(pointer: fine)");
    const hover = matchMedia("(hover: hover)");
    const wide = matchMedia("(min-width: 1041px)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => {
      const eligible = canEnhanceHero({ width: window.innerWidth, reducedMotion: motion.matches, finePointer: pointer.matches, hover: hover.matches, saveData: connection?.saveData, effectiveType: connection?.effectiveType });
      setAllowed(eligible);
      if (!eligible) {
        setMounted(false);
        setReady(false);
        setQueenPending(false);
      }
    };
    const media = [motion, pointer, hover, wide];
    media.forEach((query) => query.addEventListener("change", update));
    connection?.addEventListener("change", update);
    update();
    return () => {
      media.forEach((query) => query.removeEventListener("change", update));
      connection?.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const hero = frame.current?.closest("section");
    if (!hero || !("IntersectionObserver" in window)) return;
    let inView = hero.getBoundingClientRect().bottom > 0;
    const update = () => setVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(hero);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!allowed || !visible || mounted || failed.current) return;
    const image = frame.current?.querySelector("img");
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let scheduled = false;
    const schedule = () => {
      if (scheduled || document.readyState !== "complete" || !image?.complete || !image.naturalWidth) return;
      scheduled = true;
      const start = () => {
        if (failed.current) return;
        let seen = queenSeen.current;
        try { seen ||= sessionStorage.getItem("golden-aura:queen-intro-v1") === "seen"; } catch { /* Storage is optional. */ }
        const play = !seen && (frame.current?.closest("section")?.getBoundingClientRect().top ?? -1) >= -2;
        setPlayQueen(play);
        setQueenPending(play);
        setMounted(true);
      };
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: 2000 });
      else timer = setTimeout(start, 200);
    };
    window.addEventListener("load", schedule);
    image?.addEventListener("load", schedule);
    schedule();
    return () => {
      window.removeEventListener("load", schedule);
      image?.removeEventListener("load", schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [allowed, visible, mounted]);

  useEffect(() => {
    if (!mounted || ready) return;
    const timer = setTimeout(fallback, 8000);
    return () => clearTimeout(timer);
  }, [mounted, ready, fallback]);

  return (
    <div ref={frame} className={styles.heroArtwork} aria-hidden="true" data-scene={ready ? "ready" : mounted ? "loading" : "static"} data-eligible={allowed} data-visible={visible} data-queen-pending={queenPending}>
      {mounted && <SceneBoundary onFailure={fallback}><HeroScene frame={frame} active={visible && allowed} dprCap={dprCap} playQueen={playQueen} onQueenStart={queenStarted} onQueenComplete={queenComplete} onReduceQuality={reduceQuality} onReady={reveal} onFailure={fallback} /></SceneBoundary>}
      {children}
    </div>
  );
}

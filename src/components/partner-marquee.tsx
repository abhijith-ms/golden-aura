"use client";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./site.module.css";

export function PartnerMarquee({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeViewport}>
        <div className={styles.marqueeTrack} data-paused={!ready || paused}>
          <div className={styles.marqueeGroup}>{children}</div>
          <div className={styles.marqueeGroup} aria-hidden="true" inert>{children}</div>
        </div>
      </div>
      <button className={styles.marqueeToggle} type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Resume logo motion" : "Pause logo motion"}
      </button>
    </div>
  );
}

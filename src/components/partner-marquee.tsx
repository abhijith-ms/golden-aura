import type { ReactNode } from "react";
import styles from "./site.module.css";

export function PartnerMarquee({ children }: { children: ReactNode }) {
  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeViewport} tabIndex={0} role="region" aria-label="Partner and supporter logos. Focus to pause scrolling.">
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>{children}</div>
          <div className={styles.marqueeGroup} aria-hidden="true" inert>{children}</div>
        </div>
      </div>
    </div>
  );
}

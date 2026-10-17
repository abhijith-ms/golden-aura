"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { EventAttendee, Photo } from "@/lib/types";
import styles from "./site.module.css";
import { CountryName } from "./country-name";

const titles: Record<string, string> = {
  GM: "Grandmaster",
  IM: "International Master",
  WGM: "Woman Grandmaster",
  WIM: "Woman International Master",
  WFM: "Woman FIDE Master",
};

function Portrait({ name, photo, compact }: { name: string; photo?: Photo; compact: boolean }) {
  return (
    <div className={styles.portrait}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={compact ? "(max-width: 760px) 42vw, (max-width: 1100px) 21vw, 160px" : "(max-width: 760px) 44vw, (max-width: 1100px) 29vw, 300px"}
          quality={90}
        />
      ) : (
        <span aria-hidden="true">
          {name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
      )}
    </div>
  );
}

export function PlayerGallery({
  players,
  actionLink,
  compact = false,
}: {
  players: EventAttendee[];
  actionLink?: React.ReactNode;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canExpand = !compact && players.length > 5;

  const handleToggle = () => {
    if (expanded && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={styles.playerGalleryWrapper}>
      <div
        id="player-gallery-grid"
        tabIndex={compact ? 0 : undefined}
        aria-label={compact ? "First-edition players" : undefined}
        className={`${styles.peopleGrid} ${compact ? styles.compactPlayers : ""} ${!expanded && canExpand ? styles.peopleGridCollapsed : ""}`}
      >
        {players.map((player) => (
          <article key={player.name} className={`${styles.personCard} ${styles.playerCard}`}>
            <Portrait name={player.name} photo={player.photo} compact={compact} />
            <div className={styles.playerDetails}>
              <h3>{player.name}</h3>
              <p className={styles.playerMeta}>
                <abbr title={titles[player.title] ?? player.title}>
                  {player.title}
                </abbr>
                <CountryName country={player.country} />
              </p>
            </div>
          </article>
        ))}
      </div>
      {(canExpand || actionLink) && (
        <div className={styles.galleryActions}>
          {canExpand && (
            <button
              type="button"
              className={styles.seeMoreButton}
              onClick={handleToggle}
              aria-expanded={expanded}
              aria-controls="player-gallery-grid"
            >
              <span>{expanded ? "Show less" : "See more"}</span>
              <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
            </button>
          )}
          {actionLink}
        </div>
      )}
    </div>
  );
}

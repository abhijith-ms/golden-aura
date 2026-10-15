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

function Portrait({ name, photo }: { name: string; photo?: Photo }) {
  return (
    <div className={styles.portrait}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 760px) 44vw, (max-width: 1100px) 29vw, 300px"
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
}: {
  players: EventAttendee[];
  actionLink?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canExpand = players.length > 5;

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
        className={`${styles.peopleGrid} ${!expanded && canExpand ? styles.peopleGridCollapsed : ""}`}
      >
        {players.map((player) => (
          <article key={player.name} className={styles.personCard}>
            <Portrait name={player.name} photo={player.photo} />
            <h3>{player.name}</h3>
            <p>
              <abbr title={titles[player.title] ?? player.title}>
                {player.title}
              </abbr>{" "}
              · <CountryName country={player.country} />
            </p>
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

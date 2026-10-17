"use client";
import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import type { Photo } from "@/lib/types";
import styles from "./site.module.css";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const [selection, setSelection] = useState({ index: 0, previous: -1, direction: 1 });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const active = Math.min(selection.index, Math.max(0, photos.length - 1));
  function select(index: number) {
    const next = Math.max(0, Math.min(index, photos.length - 1));
    if (next === active) return;
    setSelection({ index: next, previous: active, direction: next > active ? 1 : -1 });
  }
  if (!photos.length) return <p>More photographs will be shared soon.</p>;
  return (
    <div className={styles.photoJournal} role="region" aria-label="Community photographs" aria-roledescription="carousel" data-direction={selection.direction} data-reveal-group style={{ "--photo-direction": selection.direction } as CSSProperties}>
      <div className={styles.photoStack}>
        <div
          className={styles.photoStage}
          tabIndex={photos.length > 1 ? 0 : undefined}
          aria-label="Featured photograph. Use left and right arrow keys to explore."
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") {
              event.preventDefault();
              select(event.key === "Home" ? 0 : event.key === "End" ? photos.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            pointerStart.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            const start = pointerStart.current;
            pointerStart.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) select(active + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => { pointerStart.current = null; }}
        >
          {photos.map((photo, i) => (
            <figure key={photo.src} data-active={i === active} data-previous={i === selection.previous} aria-hidden={i !== active} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${photos.length}`}>
              <Image src={photo.src} alt={photo.alt} fill draggable={false} sizes="(max-width: 760px) 88vw, (max-width: 1440px) 58vw, 820px" quality={90} />
            </figure>
          ))}
          <span className={styles.photoStamp} aria-hidden="true">THE GOLDEN AURA ALBUM</span>
        </div>
      </div>
      <div className={styles.photoStory}>
        <span className={styles.eyebrow}>BEYOND THE SIXTY-FOUR SQUARES</span>
        <h3>Every game.<br /><span>A human story.</span></h3>
        <div className={styles.photoCaption} aria-live="polite" aria-atomic="true">
          <span>{String(active + 1).padStart(2, "0")} <span>/ {String(photos.length).padStart(2, "0")}</span></span>
          <p key={photos[active].src}>{photos[active].alt}</p>
        </div>
        {photos.length > 1 && <div className={styles.photoArrows}>
          <button type="button" aria-label="Previous photograph" disabled={active === 0} onClick={() => select(active - 1)}>←</button>
          <button type="button" aria-label="Next photograph" disabled={active === photos.length - 1} onClick={() => select(active + 1)}>→</button>
          <span>Choose a moment</span>
        </div>}
      </div>
      {photos.length > 1 && <div className={styles.photoThumbnails} aria-label="Choose a photograph">
        {photos.map((photo, i) => <button key={photo.src} type="button" aria-label={`Show photograph ${i + 1}: ${photo.alt}`} aria-current={active === i ? "true" : undefined} onClick={() => select(i)}>
          <Image src={photo.src} alt="" fill sizes="(max-width: 760px) 16vw, 110px" draggable={false} />
          <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        </button>)}
      </div>}
    </div>
  );
}

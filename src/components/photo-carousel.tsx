"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/types";
import styles from "./site.module.css";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [active, setActive] = useState(0);
  function updateEdges() {
    const element = track.current;
    if (!element) return;
    const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
    setEdges({ start: element.scrollLeft <= 1, end });
    const step = (element.firstElementChild?.clientWidth || element.clientWidth) + 16;
    setActive(end ? Math.max(0, photos.length - 1) : Math.min(photos.length - 1, Math.round(element.scrollLeft / step)));
  }
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, [photos.length]);
  function moveTo(index: number) {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: index * ((element.firstElementChild?.clientWidth || element.clientWidth) + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  if (!photos.length) return <p>More photographs will be shared soon.</p>;
  return (
    <div className={styles.carousel} role="region" aria-label="Community photographs" aria-roledescription="carousel">
      <div ref={track} className={styles.carouselTrack} tabIndex={0} aria-label="Scrollable photographs" onScroll={updateEdges}>
        {photos.map((photo, i) => (
          <figure key={photo.src} data-active={i === active} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${photos.length}`}>
            <div><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 80vw, (max-width: 1440px) 64vw, 900px" /></div>
            <figcaption><span>AT THE BOARD / {String(i + 1).padStart(2, "0")}</span>{photo.alt}</figcaption>
          </figure>
        ))}
      </div>
      {photos.length > 1 && (
        <div className={styles.carouselControls}>
          <span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
          <div className={styles.carouselProgress} aria-label="Choose a photograph">
            {photos.map((photo, i) => <button key={photo.src} type="button" aria-label={`Show photograph ${i + 1}`} aria-current={active === i ? "true" : undefined} onClick={() => moveTo(i)}><span /></button>)}
          </div>
          <button type="button" aria-label="Previous photograph" disabled={edges.start} onClick={() => moveTo(active - 1)}>←</button>
          <button type="button" aria-label="Next photograph" disabled={edges.end} onClick={() => moveTo(active + 1)}>→</button>
        </div>
      )}
    </div>
  );
}

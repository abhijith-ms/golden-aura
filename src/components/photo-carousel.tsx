"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/types";
import styles from "./site.module.css";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  function updateEdges() {
    const element = track.current;
    if (element) setEdges({ start: element.scrollLeft <= 1, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1 });
  }
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, [photos.length]);
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({ left: direction * ((element.firstElementChild?.clientWidth || element.clientWidth) + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  if (!photos.length) return <p>More photographs will be shared soon.</p>;
  return (
    <div className={styles.carousel} role="region" aria-label="Community photographs" aria-roledescription="carousel">
      <div ref={track} className={styles.carouselTrack} tabIndex={0} aria-label="Scrollable photographs" onScroll={updateEdges}>
        {photos.map((photo, i) => (
          <figure key={photo.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${photos.length}`}>
            <div><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 80vw, 44vw" /></div>
            <figcaption>{photo.alt}</figcaption>
          </figure>
        ))}
      </div>
      {photos.length > 1 && (
        <div className={styles.carouselControls}>
          <span>Explore the moments</span>
          <button type="button" aria-label="Previous photograph" disabled={edges.start} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label="Next photograph" disabled={edges.end} onClick={() => move(1)}>→</button>
        </div>
      )}
    </div>
  );
}

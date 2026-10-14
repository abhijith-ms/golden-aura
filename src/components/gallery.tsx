"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Album, Photo } from "@/lib/types";
import styles from "./site.module.css";

export function Gallery({ albums }: { albums: Album[] }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Photo | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  const visible =
    filter === "all" ? albums : albums.filter((a) => a.slug === filter);
  return (
    <>
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter photo albums"
      >
        <button
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All moments
        </button>
        {albums.map((a) => (
          <button
            key={a.slug}
            aria-pressed={filter === a.slug}
            onClick={() => setFilter(a.slug)}
          >
            {a.title}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.visuallyHidden}>
        {visible.reduce((count, a) => count + a.photos.length, 0)} photographs
        shown
      </div>
      {visible.length ? (
        visible.map((album) => (
          <section key={album.slug} className={styles.album}>
            <div className={styles.albumHeading}>
              <h2>{album.title}</h2>
              <p>{album.description}</p>
            </div>
            <div className={styles.galleryGrid}>
              {album.photos.map((photo) => (
                <figure key={photo.src}>
                  <button
                    className={styles.photoButton}
                    onClick={() => setSelected(photo)}
                    aria-label={`Enlarge: ${photo.alt}`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    />
                    <span aria-hidden="true">↗</span>
                  </button>
                  <figcaption>{photo.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className={styles.emptyState}>
          <h2>More moments to come.</h2>
          <p>New photographs will appear here as our community grows.</p>
        </div>
      )}
      <dialog
        ref={dialog}
        className={styles.lightbox}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) {
            const rect = dialog.current!.getBoundingClientRect();
            if (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            )
              setSelected(null);
          }
        }}
        aria-label="Enlarged photograph"
      >
        <button
          className={styles.closeButton}
          onClick={() => setSelected(null)}
          aria-label="Close photograph"
        >
          ×
        </button>
        {selected && (
          <>
            <div className={styles.lightboxImage}>
              <Image src={selected.src} alt={selected.alt} fill sizes="90vw" />
            </div>
            <p>{selected.alt}</p>
          </>
        )}
      </dialog>
    </>
  );
}

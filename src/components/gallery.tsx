"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Album, Photo } from "@/lib/types";
import { startReveals } from "@/lib/reveal-motion";
import { motionTokens as tokens } from "@/lib/motion-tokens";
import styles from "./site.module.css";

function PhotoViewer({ photo, preview, onDismiss }: { photo: Photo; preview: string; onDismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const alive = useRef(true);
  const closing = useRef(false);
  const version = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  function finishClose() { dialog.current?.close(); onDismiss(); }
  function close() {
    const node = dialog.current;
    if (!node || closing.current) return;
    closing.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finishClose(); return; }
    node.getAnimations().forEach((animation) => animation.cancel());
    const animation = node.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: `scale(${tokens.scale.dialog})` }], {
      duration: tokens.duration.fast * 1000, easing: tokens.easing.css, fill: "forwards",
    });
    animation.finished.then(finishClose).catch(() => {});
  }

  useEffect(() => {
    alive.current = true;
    const node = dialog.current!;
    node.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      node.getAnimations().forEach((animation) => animation.cancel());
      if (closing.current) { node.close(); onDismiss(); }
    };
    preference.addEventListener("change", stop);
    return () => {
      alive.current = false;
      node.getAnimations().forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
      document.body.style.overflow = previousOverflow;
      if (node.open) node.close();
    };
  }, [onDismiss]);

  return (
    <dialog ref={dialog} className={styles.lightbox} aria-label="Enlarged photograph" aria-modal="true"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => {
        if (event.target !== dialog.current) return;
        const rect = dialog.current.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}>
      <button className={styles.closeButton} onClick={close} aria-label="Close photograph" autoFocus>×</button>
      <div className={styles.lightboxImage} data-ready={ready}>
        {/* Reuse the browser's loaded thumbnail URL; never fetch a second raw original. */}
        {preview && <img className={styles.viewerPreview} src={preview} alt="" aria-hidden="true" />}
        <Image key={attempt} className={styles.viewerFull} src={photo.src} alt={photo.alt} fill sizes="95vw" quality={95} priority
          onLoad={async (event) => {
            const image = event.currentTarget;
            const request = attempt;
            try {
              await image.decode();
              if (alive.current && request === version.current) setReady(true);
            } catch {
              if (alive.current && request === version.current) setFailed(true);
            }
          }}
          onError={() => { if (alive.current && attempt === version.current) setFailed(true); }} />
        {!ready && <div className={styles.viewerStatus} role="status">
          {failed ? <>The larger photograph could not load. <button onClick={() => { version.current++; setFailed(false); setAttempt((value) => value + 1); }}>Try again</button></> : "Loading larger photograph…"}
        </div>}
      </div>
      <p>{photo.alt}</p>
    </dialog>
  );
}

export function Gallery({ albums }: { albums: Album[] }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<{ photo: Photo; preview: string } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const visible = filter === "all" ? albums : albums.filter((album) => album.slug === filter);
  // This island owns inserted album nodes; the global observer must not animate them twice.
  useEffect(() => {
    if (!root.current) return;
    const clean = startReveals(root.current);
    const animations: Animation[] = [];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Array.from(root.current.querySelectorAll<HTMLElement>("[data-motion-group] > figure"))
        .filter((node) => { const rect = node.getBoundingClientRect(); return rect.top < window.innerHeight && rect.bottom > 0; })
        .slice(0, 6).forEach((node, index) => animations.push(node.animate([
          { opacity: 0.65, transform: `translateY(${tokens.distance.mobile}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: tokens.duration.normal * 1000, delay: Math.min(index * tokens.stagger, tokens.maxDelay) * 1000, easing: tokens.easing.css, fill: "backwards" })));
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => animations.forEach((animation) => animation.cancel());
    preference.addEventListener("change", stop);
    return () => { clean(); stop(); preference.removeEventListener("change", stop); };
  }, [filter]);

  // Keep dismissal stable so unrelated renders do not reopen the native dialog.
  const dismiss = useRef(() => setSelected(null)).current;
  return (
    <div ref={root} data-motion-local>
      <div className={styles.filters} role="group" aria-label="Filter photo albums">
        <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All moments</button>
        {albums.map((album) => <button key={album.slug} aria-pressed={filter === album.slug} onClick={() => setFilter(album.slug)}>{album.title}</button>)}
      </div>
      <div aria-live="polite" className={styles.visuallyHidden}>{visible.reduce((count, album) => count + album.photos.length, 0)} photographs shown</div>
      {visible.length ? visible.map((album) => (
        <section key={album.slug} className={styles.album}>
          <div className={styles.albumHeading}><h2>{album.title}</h2><p>{album.description}</p></div>
          <div className={styles.galleryGrid} data-motion-group>
            {album.photos.map((photo) => <figure key={photo.src}>
              <button className={styles.photoButton} aria-label={`Enlarge: ${photo.alt}`} onClick={(event) => {
                const image = event.currentTarget.querySelector("img");
                setSelected({ photo, preview: image?.complete && image.naturalWidth ? image.currentSrc : "" });
              }}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 450px" quality={90} />
                <span aria-hidden="true">↗</span>
              </button>
              <figcaption>{photo.alt}</figcaption>
            </figure>)}
          </div>
        </section>
      )) : <div className={styles.emptyState}><h2>More moments to come.</h2><p>New photographs will appear here as our community grows.</p></div>}
      {selected && <PhotoViewer key={selected.photo.src} photo={selected.photo} preview={selected.preview} onDismiss={dismiss} />}
    </div>
  );
}

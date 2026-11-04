"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { motionTokens as tokens } from "@/lib/motion-tokens";
import styles from "./site.module.css";

export function PhotoDepth({ children, className }: { children: ReactNode; className: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-tokens.distance.parallax, tokens.distance.parallax]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1001px) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    const image = frame.current?.querySelector("img");
    const loaded = () => setReady(true);
    if (image?.complete && image.naturalWidth) loaded();
    image?.addEventListener("load", loaded);
    return () => { query.removeEventListener("change", update); image?.removeEventListener("load", loaded); };
  }, []);
  return (
    <div ref={frame} className={`${className} ${styles.depthFrame}`} data-ready={ready}>
      <motion.div className={styles.depthImage} style={{ y: !reduce && finePointer && ready ? y : 0 }}
        initial={false} animate={{ scale: reduce || ready ? 1 : tokens.scale.photo }}
        transition={{ duration: reduce ? tokens.duration.fast : tokens.duration.slow, ease: tokens.easing.smooth }}>
        {children}
      </motion.div>
      <span className={styles.photoCorner} aria-hidden="true" />
    </div>
  );
}

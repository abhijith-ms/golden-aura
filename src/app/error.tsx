"use client";
import Link from "next/link";
import styles from "@/components/site.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className={styles.pageIntro}>
      <span className={styles.eyebrow}>A MOMENTARY PAUSE</span>
      <h1>This page couldn’t load.</h1>
      <p>
        Please try again. You can still contact the Trust directly if you need
        help.
      </p>
      <div className={styles.detailLinks}>
        <button className={styles.buttonDark} onClick={reset}>
          Try again ↗
        </button>
        <Link className={styles.textLink} href="/contact">
          Contact us ↗
        </Link>
      </div>
    </section>
  );
}

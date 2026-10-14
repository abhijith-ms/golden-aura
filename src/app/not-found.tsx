import Link from "next/link";
import styles from "@/components/site.module.css";
export default function NotFound() {
  return (
    <section className={styles.pageIntro}>
      <span className={styles.eyebrow}>404 / THAT MOVE IS OFF THE BOARD</span>
      <h1>
        Let’s find
        <br />
        your next move.
      </h1>
      <p>
        The page you’re looking for isn’t here. Explore our events or return to
        the homepage.
      </p>
      <div className={styles.detailLinks}>
        <a className={styles.buttonDark} href="/#top">
          Back to home ↗
        </a>
        <Link className={styles.textLink} href="/events">
          Explore events ↗
        </Link>
      </div>
    </section>
  );
}

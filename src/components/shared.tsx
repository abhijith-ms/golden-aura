import Image from "next/image";
import Link from "next/link";
import type { Event, PageCopy, SiteSettings } from "@/lib/types";
import styles from "./site.module.css";

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={i ? styles.softLine : undefined}>
          {line}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
export function PageIntro({ copy }: { copy: PageCopy }) {
  return (
    <section className={styles.pageIntro}>
      <div className={styles.eyebrow}>{copy.eyebrow}</div>
      <h1>
        <Lines text={copy.title} />
      </h1>
      <p>{copy.intro}</p>
    </section>
  );
}
export function FocusAreas({
  site,
  variant = "cards",
}: {
  site: SiteSettings;
  variant?: "cards" | "values" | "pillars";
}) {
  if (variant === "pillars") {
    const symbols = ["♟", "♞", "♛"];
    return (
      <div className={styles.pillarGrid} id="mission">
        {site.focusAreas.map((area, i) => (
          <article key={area.label} className={styles.pillarCard}>
            <div className={styles.pillarCardTop}>
              <span className={styles.pillarBadge}>{area.label}</span>
              <span className={styles.pillarIcon} aria-hidden="true">
                {symbols[i] ?? "♞"}
              </span>
            </div>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
            <div className={styles.pillarFooter}>
              <span className={styles.pillarIndex}>{`PILLAR 0${i + 1}`}</span>
              <span className={styles.pillarPillMarker} aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    );
  }
  if (variant === "values") {
    return (
      <div className={styles.valuesGrid} id="mission">
        {site.focusAreas.map((area, i) => (
          <article key={area.label}>
            <span className={styles.valueNum}>{`0${i + 1}`}</span>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
            <span className={styles.tag}>{area.label}</span>
          </article>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.focusGrid}>
      {site.focusAreas.map((area, i) => (
        <article key={area.label}>
          <span className={styles.focusIcon} aria-hidden="true">{["◎", "↗", "✳"][i]}</span>
          <h3>{area.title}</h3>
          <p>{area.description}</p>
          <span className={styles.tag}>{area.label}</span>
        </article>
      ))}
    </div>
  );
}
export function EventCard({
  event,
  featured = false,
}: {
  event: Event;
  featured?: boolean;
}) {
  const Heading = featured ? "h3" : "h2";
  return (
    <article className={styles.eventCard}>
      <Link
        href={`/events/${event.slug}`}
        className={styles.eventImage}
        aria-label={`Explore ${event.title}`}
      >
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes={
            featured
              ? "(max-width: 760px) 100vw, 55vw"
              : "(max-width: 760px) 100vw, 50vw"
          }
        />
        <span className={styles.imageYear}>{event.year}</span>
      </Link>
      <div className={styles.eventCopy}>
        <span className={styles.tag}>
          {event.status === "completed"
            ? "COMPLETED"
            : event.status === "cancelled"
              ? "CANCELLED"
              : "UPCOMING"}{" "}
          · {event.format}
        </span>
        <Heading className={styles.eventTitle}>
          <Link href={`/events/${event.slug}`}>{event.shortTitle}</Link>
        </Heading>
        <p>{event.description}</p>
        <dl className={styles.eventFacts}>
          <div>
            <dt>WHEN</dt>
            <dd>{event.dateLabel}</dd>
          </div>
          <div>
            <dt>WHERE</dt>
            <dd>{event.venue}</dd>
          </div>
          {event.prizeFund && (
            <div>
              <dt>PRIZE FUND</dt>
              <dd>{event.prizeFund}</dd>
            </div>
          )}
        </dl>
        <Link href={`/events/${event.slug}`} className={styles.textLink}>
          Explore the event <Arrow />
        </Link>
      </div>
    </article>
  );
}
export function ContactBand() {
  return (
    <section className={styles.contactBand}>
      <div>
        <span className={styles.eyebrow}>
          THERE’S A PLACE FOR YOU AT THE BOARD
        </span>
        <h2>
          Your next move
          <br />
          <span>starts here.</span>
        </h2>
      </div>
      <Link className={styles.buttonDark} href="/contact">
        Let’s talk chess <Arrow />
      </Link>
    </section>
  );
}
export function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <a href="/#top" className={styles.brand}>
            GOLDEN AURA<small>CHESS IS FOR EVERYONE.</small>
          </a>
          <p>{site.legalName}</p>
        </div>
        <p className={styles.address}>{site.address}</p>
        <div>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <div>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram ↗
          </a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

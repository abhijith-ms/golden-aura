import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { eventAction, safeLink } from "@/lib/events";
import { Arrow, ContactBand, PageIntro } from "@/components/shared";
import styles from "@/components/site.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { events } = await getContent();
  const event = events.find((e) => e.slug === slug);
  return {
    title: event?.shortTitle || "Event not found",
    description: event?.description,
    alternates: { canonical: `/events/${slug}` },
  };
}
export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { events } = await getContent();
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();
  const action = eventAction(event);
  return (
    <>
      <PageIntro
        copy={{
          slug,
          eyebrow: `${event.status.toUpperCase()} · ${event.format}`,
          title: event.title,
          intro: event.description,
        }}
      />
      <div className={styles.eventDetailHero}>
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          priority
          sizes="90vw"
        />
      </div>
      <section className={`${styles.section} ${styles.eventDetailGrid}`}>
        <div>
          <span className={styles.eyebrow}>AT A GLANCE</span>
          <dl className={styles.eventFacts}>
            <div>
              <dt>DATES</dt>
              <dd>{event.dateLabel}</dd>
            </div>
            <div>
              <dt>VENUE</dt>
              <dd>{event.venue}</dd>
            </div>
            {event.prizeFund && (
              <div>
                <dt>PRIZE FUND</dt>
                <dd>{event.prizeFund}</dd>
              </div>
            )}
            <div>
              <dt>EVENT STATUS</dt>
              <dd>
                {event.status === "completed"
                  ? "Completed · registration closed"
                  : event.status === "cancelled"
                    ? "Cancelled"
                    : event.registrationOpen &&
                        action.label.startsWith("Register")
                      ? "Registration open"
                      : "Registration not open yet"}
              </dd>
            </div>
          </dl>
          <Link className={styles.buttonDark} href={action.href}>
            {action.label} <Arrow />
          </Link>
          <div className={styles.detailLinks}>
            {safeLink(event.brochureUrl) && (
              <a className={styles.textLink} href={safeLink(event.brochureUrl)}>
                View the brochure <Arrow />
              </a>
            )}
            {safeLink(event.resultsUrl) && (
              <a className={styles.textLink} href={safeLink(event.resultsUrl)}>
                View results <Arrow />
              </a>
            )}
          </div>
        </div>
        <div className={styles.detailPanel}>
          <h2>
            {event.status === "completed"
              ? "About this edition"
              : "Entry details & regulations"}
          </h2>
          <p>
            {event.rules ||
              (event.status === "completed"
                ? "This event has concluded. For information about this edition, contact the Trust or explore the available tournament archive."
                : "Contact the Trust for the event’s eligibility, entry details, and regulations.")}
          </p>
          <p>
            Have a question about playing, travel, or future editions? The Trust
            can help you find the right information.
          </p>
          <Link className={styles.textLink} href="/contact">
            Talk to the organisers <Arrow />
          </Link>
          <div className={styles.detailLinks}>
            <Link className={styles.textLink} href="/events">
              All events <Arrow />
            </Link>
            <Link className={styles.textLink} href="/gallery">
              Browse photographs <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

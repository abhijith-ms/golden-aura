import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { eventAction, safeLink } from "@/lib/events";
import { Arrow, ContactBand, PageIntro, PlayerGallery } from "@/components/shared";
import { TournamentInfographic } from "@/components/tournament-infographic";
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
      <div className={styles.eventMasthead}>
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
            sizes="(max-width: 760px) 88vw, (max-width: 1440px) 42vw, 540px"
            quality={90}
          />
        </div>
      </div>
      <section className={`${styles.section} ${styles.eventDetailGrid}`}>
        <div className={styles.eventOverviewCol}>
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
          </div>
          <div className={styles.eventActionsGroup}>
            <Link className={styles.buttonDark} href={action.href}>
              {action.label} <Arrow />
            </Link>
            {(safeLink(event.brochureUrl) || safeLink(event.resultsUrl)) && (
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
            )}
          </div>
        </div>
        <div className={styles.detailPanel}>
          <div>
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
          </div>
          <div className={styles.detailLinks}>
            <Link className={styles.textLink} href="/contact">
              Talk to the organisers <Arrow />
            </Link>
            <Link className={styles.textLink} href="/events">
              All events <Arrow />
            </Link>
            <Link className={styles.textLink} href="/gallery">
              Browse photographs <Arrow />
            </Link>
          </div>
        </div>
        {(event.slug === "namma-bengaluru-open-2024" ||
          event.slug === "namma-bengaluru-open-2025") && (
          <div className={styles.infographicGridSpan}>
            <TournamentInfographic edition={event.year} />
          </div>
        )}
      </section>
      {event.attendees && event.attendees.length > 0 && (
        <section
          id="attendees"
          className={`${styles.section} ${styles.softSection} ${styles.attendeesSection}`}
        >
          <span className={styles.eyebrow}>FEATURED IN THE {event.year} EDITION ARCHIVE</span>
          <h2>Grandmasters &<br /><span>titled players.</span></h2>
          <p>This edition welcomed grandmasters and titled players from India and around the world. These are the names featured in the official tournament archive.</p>
          <PlayerGallery
            players={event.attendees}
            actionLink={
              safeLink(event.archiveUrl) ? (
                <a className={styles.textLink} href={safeLink(event.archiveUrl)}>
                  View the tournament archive <Arrow />
                </a>
              ) : undefined
            }
          />
        </section>
      )}
      <ContactBand />
    </>
  );
}

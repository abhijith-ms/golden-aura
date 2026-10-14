import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { defaultContent } from "@/lib/default-content";
import { safeLink } from "@/lib/events";
import { Arrow, ContactBand, EventCard, FocusAreas, PageIntro } from "./shared";
import { Gallery } from "./gallery";
import { EnquiryForm } from "./enquiry-form";
import styles from "./site.module.css";
import type { Content } from "@/lib/types";

function copy(content: Content, slug: string) {
  return (
    content.pages.find((page) => page.slug === slug) ||
    defaultContent.pages.find((page) => page.slug === slug)!
  );
}

export async function AboutPage() {
  const content = await getContent();
  const page = copy(content, "about");
  const { site } = content;
  return (
    <>
      <div className={styles.trustIntro}>
        <PageIntro copy={page} />
        <Image
          className={styles.trustLogo}
          src="/images/golden-aura-logo.webp"
          alt="The Golden Aura Trust official emblem"
          width={480}
          height={373}
          sizes="(max-width: 760px) 180px, (max-width: 1100px) 22vw, 280px"
          priority
        />
      </div>
      <section className={`${styles.section} ${styles.aboutStory}`}>
        <div className={styles.storyPhoto}>
          <Image
            src="/images/women-at-board.webp"
            alt="A player concentrating at a Chess and Coffee gathering"
            fill
            sizes="(max-width:760px) 100vw, 50vw"
          />
        </div>
        <div>
          <span className={styles.eyebrow}>THE PURPOSE BEHIND THE PLAY</span>
          <h2>
            Opportunity,
            <br />
            <span>one move at a time.</span>
          </h2>
          {page.body?.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionLabel}>OUR VISION IN ACTION</div>
        <h2>
          Three areas of focus.
          <br />
          <span>One shared purpose.</span>
        </h2>
        <FocusAreas site={site} />
      </section>
      <section className={styles.section}>
        <div className={styles.introGrid}>
          <div>
            <span className={styles.eyebrow}>THE PEOPLE BEHIND THE MOVES</span>
            <h2>
              A shared passion.
              <br />
              <span>A collective effort.</span>
            </h2>
          </div>
          <div>
            <p>
              Experience in chess, tournament organisation, and community
              building connects the people behind the Trust.
            </p>
            <ul className={styles.team}>
              {site.team.map((person) => (
                <li key={person.name}>
                  <span>{person.name}</span>
                  <small>{person.role}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.governance}>
          <div>
            <span className={styles.eyebrow}>ORGANISATION DETAILS</span>
            <h3>{site.legalName}</h3>
            <p>{site.address}</p>
            {site.registrationDetails && <p>{site.registrationDetails}</p>}
            <a className={styles.textLink} href={`mailto:${site.email}`}>
              Contact the Trust <Arrow />
            </a>
          </div>
          <div>
            <span className={styles.eyebrow}>
              CONNECTED TO THE CHESS COMMUNITY
            </span>
            <p>Karnataka State Chess Association</p>
            <p>Bengaluru Urban District Chess Association</p>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

export async function EventsPage() {
  const content = await getContent();
  const upcoming = content.events.filter((e) => e.status === "upcoming");
  const past = content.events.filter((e) => e.status !== "upcoming");
  return (
    <>
      <PageIntro copy={copy(content, "events")} />
      <section className={styles.sectionCompact}>
        <div className={styles.sectionLabel}>THE NEXT MOVE</div>
        {upcoming.length ? (
          <div className={styles.eventGrid}>
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        ) : (
          <div className={styles.announcement}>
            <div className={styles.announcementIcon} aria-hidden="true">
              ♞
            </div>
            <div>
              <span className={styles.eyebrow}>UPCOMING EVENTS</span>
              <h2>Our next chapter is taking shape.</h2>
              <p>
                Next tournament dates will be announced. Talk to the Trust about
                upcoming events and opportunities to play.
              </p>
            </div>
            <Link className={styles.buttonDark} href="/contact">
              Get in touch <Arrow />
            </Link>
          </div>
        )}
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionLabel}>
          <span>THE EVENT ARCHIVE</span>
          <span>PAST EDITIONS & COMMUNITY GATHERINGS</span>
        </div>
        <div className={styles.eventGrid}>
          {past.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
        {!past.length && <p>Past event highlights will appear here.</p>}
      </section>
      <ContactBand />
    </>
  );
}
export async function GalleryPage() {
  const content = await getContent();
  return (
    <>
      <PageIntro copy={copy(content, "gallery")} />
      <section className={styles.sectionCompact}>
        <Gallery albums={content.albums} />
      </section>
      <ContactBand />
    </>
  );
}

export async function PartnersPage() {
  const content = await getContent();
  return (
    <>
      <PageIntro copy={copy(content, "partners")} />
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.introGrid}>
          <div>
            <span className={styles.eyebrow}>
              MORE ACCESS. MORE OPPORTUNITY.
            </span>
            <h2>
              Good things happen
              <br />
              <span>when we play together.</span>
            </h2>
          </div>
          <div>
            <p className={styles.lead}>
              Support a tournament. Bring chess into a community. Create
              opportunities for the next generation.
            </p>
            <p>
              We welcome conversations with sponsors, CSR teams, schools,
              academies, and organisations that share our belief in wider access
              to chess.
            </p>
          </div>
        </div>
        <div className={styles.focusGrid}>
          {[
            {
              title: "Tournament partnerships",
              description:
                "Support meaningful competition and a welcoming experience for players.",
              label: "AT THE BOARD",
            },
            {
              title: "Community initiatives",
              description:
                "Help bring chess to neighbourhoods, schools, and new audiences.",
              label: "BEYOND THE BOARD",
            },
            {
              title: "Women in chess",
              description:
                "Create visibility and opportunities for women and girls to participate.",
              label: "A MORE INCLUSIVE GAME",
            },
          ].map((item, i) => (
            <article key={item.title}>
              <span className={styles.focusIcon} aria-hidden="true">{["↗", "◎", "✳"][i]}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={styles.tag}>{item.label}</span>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionLabel}>OUR CHESS COMMUNITY</div>
        <div className={styles.partnerGrid}>
          {content.partners.map((partner) => (
            <article key={partner.name}>
              {partner.image && (
                <div className={styles.partnerLogo}>
                  <Image
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="180px"
                  />
                </div>
              )}
              <span className={styles.tag}>{partner.event}</span>
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.contactGrid}>
          <div>
            <span className={styles.eyebrow}>START A CONVERSATION</span>
            <h2>
              A partnership
              <br />
              <span>with purpose.</span>
            </h2>
            <p>
              Tell us about your organisation and what you would like to
              support. We will help you find a meaningful way to get involved.
            </p>
          </div>
          <EnquiryForm partner email={content.site.email} />
        </div>
      </section>
    </>
  );
}

export async function ContactPage() {
  const content = await getContent();
  const { site } = content;
  return (
    <>
      <PageIntro copy={copy(content, "contact")} />
      <section className={`${styles.sectionCompact} ${styles.contactGrid}`}>
        <div>
          <span className={styles.eyebrow}>LET’S TALK CHESS</span>
          <div className={styles.contactDetails}>
            <div>
              <h2>Email us</h2>
              <a href={`mailto:${site.email}`}>{site.email} ↗</a>
            </div>
            <div>
              <h2>Call us</h2>
              {site.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                  {phone}
                </a>
              ))}
            </div>
            <div>
              <h2>Find us</h2>
              <p>{site.address}</p>
              <a
                className={styles.textLink}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps <Arrow />
              </a>
            </div>
            <div>
              <h2>Follow the community</h2>
              <a
                href={safeLink(site.instagram)}
                target="_blank"
                rel="noopener noreferrer"
              >
                @goldenaura_chess ↗
              </a>
            </div>
          </div>
        </div>
        <div>
          <h2 className={styles.formTitle}>Send a little hello.</h2>
          <EnquiryForm email={site.email} />
        </div>
      </section>
    </>
  );
}

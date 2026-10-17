import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { defaultContent } from "@/lib/default-content";
import { orderEvents, safeLink } from "@/lib/events";
import { Arrow, ContactBand, EventCard, PageIntro, PartnerLogos, Portrait } from "./shared";
import { partnerGroups } from "@/lib/partners";
import { Gallery } from "./gallery";
import { EnquiryForm } from "./enquiry-form";
import styles from "./site.module.css";
import type { Content } from "@/lib/types";
import { committeeGroups } from "@/lib/types";

function copy(content: Content, slug: string) {
  return (
    content.pages.find((page) => page.slug === slug) ||
    defaultContent.pages.find((page) => page.slug === slug)!
  );
}

const MISSION_ICONS: Record<string, React.ReactNode> = {
  "Inclusivity & Engagement": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "Strengthening the Chess Ecosystem": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  "Chess Beyond the Board": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  "Fostering a Lasting Impact": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  ),
};

const DEFAULT_MISSION_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m12 8 4 4-4 4M8 12h8" />
  </svg>
);

export async function AboutPage() {
  const content = await getContent();
  const page = copy(content, "about");
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
          sizes="(max-width: 760px) 86px, 220px"
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
            Chess across Karnataka and India.
          </h2>
          {page.body?.split("\n").map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <h2>Mission of The Golden Aura Trust.</h2>
        <div className={styles.missionGrid}>
          {page.sections?.map((section) => (
            <article key={section.title} className={styles.missionArticle}>
              <div className={styles.missionIcon}>
                {MISSION_ICONS[section.title] ?? DEFAULT_MISSION_ICON}
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.introGrid}>
          <div>
            <span className={styles.eyebrow}>BE A PART OF THE MOVEMENT</span>
            <h2>Join the chess community.</h2>
          </div>
          <div>
            {page.closing?.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <Link className={styles.textLink} href="/committee">Meet the organising committee <Arrow /></Link>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

export async function CommitteePage() {
  const content = await getContent();
  const { committee } = content;
  return (
    <>
      <section className={styles.whoWeAreHero}>
        <h2 className={styles.whoWeAreTitle}>WHO WE ARE</h2>
        <div className={styles.whoWeAreLogoWrap}>
          <Image
            src="/images/blrgmc-logo.png"
            alt="Bangalore International Grandmasters Tournament Organizing Committee (BLRGMC)"
            width={140}
            height={140}
            priority
            className={styles.whoWeAreLogo}
          />
        </div>
        <p className={styles.whoWeAreLead}>
          Formed under The Golden Aura Trust, the Bangalore International Grandmasters Tournament Organizing Committee is dedicated to planning and executing world-class chess events in Bengaluru. The Committee consists of chess experts from different avenues – organizers, chess association members, senior government officers, former and current top players, arbiters and patrons.
        </p>
      </section>

      <section id="message-of-support" className={styles.leadershipGrid}>
        <article className={styles.leadershipRow}>
          <div className={styles.leaderCard}>
            <div className={styles.leaderCardPhoto}>
              <Image
                src="/images/D_K_Shivakumar.avif"
                alt="Shri D K Shivakumar"
                fill
                sizes="(max-width: 760px) 92px, (max-width: 960px) 180px, 220px"
                quality={90}
                priority
              />
            </div>
            <div className={styles.leaderCardBody}>
              <span className={styles.leaderSignature}>DK Shivakumar</span>
              <h3 className={styles.leaderName}>SHRI D K SHIVAKUMAR</h3>
              <p className={styles.leaderRole}>Deputy Chief Minister of Karnataka (2025)</p>
              <p className={styles.leaderSubRole}>A message for the 2025 tournament</p>
              <div className={styles.leaderCardPattern} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.leaderMessage}>
            <h2>MESSAGE OF SUPPORT</h2>
            <p className={styles.leaderSalutation}>Dear Friends of Chess,</p>
            <blockquote className={styles.leaderQuote}>
              <p>
                Chess has the unique ability to nurture intellect and foster holistic development, qualities that are essential for our youth in today&apos;s dynamic world. I have always believed in the power of chess as a tool for education and cultural enrichment, and I am delighted to be a part of an event that reflects this vision. The 2nd Namma Bengaluru International Grandmasters Tournament is a testament to our commitment to shaping a vibrant chess ecosystem, positioning Bengaluru as a global hub for the sport. I am confident that this tournament will inspire and empower our young talents, paving the way for a future where chess plays a central role in our educational and cultural landscape.
              </p>
            </blockquote>
          </div>
        </article>

        <article className={`${styles.leadershipRow} ${styles.leadershipRowReverse}`}>
          <div className={styles.leaderMessage}>
            <h2>MESSAGE FROM THE ORGANIZING SECRETARY</h2>
            <p className={styles.leaderSalutation}>Dear Chess Enthusiasts,</p>
            <blockquote className={styles.leaderQuote}>
              <p>
                The world is waking up to the power of chess. The game is experiencing a renaissance, and nowhere is this more evident than in India. Now is the time to celebrate this momentum and be part of chess&apos;s exciting future.
              </p>
              <p>
                We are thrilled to announce the 2nd Namma Bengaluru International Grandmasters Open Chess Tournament – 2025. Building on the success of our inaugural event, we are preparing to host an unforgettable experience—featuring world-class players, passionate fans, and a vibrant chess community coming together to take the game to new heights.
              </p>
              <p>
                Whether you are a player, a fan, or simply someone who appreciates the beauty of chess, we invite you to join us in this journey. This is more than just a tournament—it&apos;s an opportunity to witness brilliance, engage with the chess fraternity, and celebrate a sport that challenges the mind and unites people across all walks of life. Be part of the excitement and help us make this a landmark event that leaves a lasting impact.
              </p>
            </blockquote>
          </div>
          <div className={styles.leaderCard}>
            <div className={styles.leaderCardPhoto}>
              <Image
                src="/images/committee-sowmya-m-u.webp"
                alt="Sowmya M U, President, BUDCA"
                fill
                sizes="(max-width: 760px) 92px, (max-width: 960px) 180px, 220px"
                quality={90}
              />
            </div>
            <div className={styles.leaderCardBody}>
              <span className={styles.leaderSignature}>Sowmya M U</span>
              <h3 className={styles.leaderName}>SOWMYA M U, PRESIDENT, BUDCA</h3>
              <p className={styles.leaderRole}>Organizing Secretary,</p>
              <p className={styles.leaderSubRole}>2nd Namma BIG Chess – 2025</p>
              <div className={styles.leaderCardPattern} aria-hidden="true" />
            </div>
          </div>
        </article>
      </section>

      <div className={styles.committeeIntro}><PageIntro copy={copy(content, "committee")} /></div>
      {committee.length ? (
        <>
          <nav className={`${styles.sectionCompact} ${styles.committeeNav}`} aria-label="Committee groups">
            {committeeGroups.filter((group) => committee.some((member) => member.group === group)).map((group) => (
              <a key={group} href={`#${group.toLowerCase().replaceAll(" ", "-")}`}>{group}</a>
            ))}
          </nav>
          {committeeGroups.map((group, i) => {
            const members = committee.filter((member) => member.group === group);
            if (!members.length) return null;
            return (
              <section id={group.toLowerCase().replaceAll(" ", "-")} key={group} className={`${styles.section} ${styles.committeeSection} ${i % 2 ? styles.softSection : ""}`}>
                <span className={styles.eyebrow}>NAMMA BENGALURU OPEN · 2025</span>
                <h2>{group}</h2>
                <div className={styles.peopleGrid}>
                  {members.map((member) => (
                    <article className={`${styles.personCard} ${styles.committeeCard}`} key={member.slug}>
                      <Portrait name={member.name} photo={member.photo} />
                      <div className={styles.committeeDetails}>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                        {member.affiliation && <p className={styles.personAffiliation}>{member.affiliation}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      ) : (
        <section className={styles.sectionCompact}><p>Committee profiles will be published here. Contact the Trust for organising information.</p></section>
      )}
      <ContactBand />
    </>
  );
}

export async function EventsPage() {
  const content = await getContent();
  const upcoming = content.events.filter((e) => e.status === "upcoming");
  const past = orderEvents(content.events.filter((e) => e.status !== "upcoming"));
  return (
    <>
      <div className={styles.archiveIntro}><PageIntro copy={copy(content, "events")} /></div>
      {upcoming.length > 0 && <section className={styles.sectionCompact}>
        <div className={styles.sectionLabel}>THE NEXT MOVE</div>
          <div className={styles.eventGrid}>
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
      </section>}
      <section className={`${styles.section} ${styles.softSection} ${styles.archiveSection}`}>
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
      {partnerGroups(content.partners).map(({ title, description, partners }) => {
        return partners.length ? <section className={styles.sectionCompact} key={title}>
          <span className={styles.eyebrow}>THE 2025 INTERNATIONAL OPEN</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <PartnerLogos partners={partners} />
        </section> : null;
      })}
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

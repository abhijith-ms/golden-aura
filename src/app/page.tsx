import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Arrow, ContactBand, EventCard, FocusAreas, Lines, PartnerLogos, PlayerGallery } from "@/components/shared";
import { PhotoCarousel } from "@/components/photo-carousel";
import { PartnerMarquee } from "@/components/partner-marquee";
import { orderEvents } from "@/lib/events";
import styles from "@/components/site.module.css";

export default async function Home() {
  const { site, events, albums, partners } = await getContent();
  const featuredPartners = partners.filter((partner) => partner.category === "official" || partner.category === "institutional" || partner.category === "government");
  const connectedPartners = partners.filter((partner) => partner.image && (!partner.category || partner.category === "community" || partner.category === "support"));
  const firstEdition = events.find((event) => event.slug === "namma-bengaluru-open-2024");
  const firstEditionPlayers = firstEdition?.attendees || [];
  const featured = orderEvents(events).slice(0, 2);
  const community = albums.find((a) => a.slug === "community");
  const photos = [albums[0]?.photos[1], community?.photos[3], community?.photos[0]].filter((p) => p !== undefined);
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} aria-hidden="true">
          <Image
            src="/images/hero-knight-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroCopy}>
          <span className={styles.heroKicker}>GOLDEN AURA TRUST <span aria-hidden="true">/</span> BENGALURU</span>
          <h1><Lines text={site.heroTitle} /></h1>
          <p>{site.heroIntro}</p>
          <div className={styles.actions}>
            <Link className={styles.buttonGold} href="/events">Explore tournaments <Arrow /></Link>
            <Link className={styles.heroLink} href="/about">Meet the Trust <Arrow /></Link>
          </div>
        </div>
        <div className={styles.heroBottom}>
          <span>ONE BOARD. EVERY POSSIBILITY.</span>
          <a href="#about">Discover the game <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section id="about" className={styles.section}>
        <div className={styles.sectionHeaderCustom}>
          <span className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} /> THE GOLDEN AURA VISION
          </span>
          <span className={styles.eyebrowMeta}>ROOTED IN BENGALURU</span>
        </div>
        <div className={styles.introGrid}>
          <div>
            <h2>
              A game for everyone.
              <br />
              <span>A community in motion.</span>
            </h2>
          </div>
          <div className={styles.storyBlock}>
            <blockquote className={styles.pullQuote}>
              “On sixty-four squares, everyone begins as equals. What matters is
              the courage to take your next move.”
            </blockquote>
            <p className={styles.storyLead}>{site.aboutIntro}</p>
            <div className={styles.storyCta}>
              <Link className={styles.buttonDark} href="/about">
                Get to know the Trust <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <FocusAreas site={site} variant="pillars" />
      </section>
      <section id="tournaments" className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionLabel}>
          <span>02 / AT THE BOARD</span>
          <span>THE TOURNAMENT ARCHIVE</span>
        </div>
        <div className={styles.sectionHeading}>
          <div>
            <h2>
              Find your <span>next move.</span>
            </h2>
          </div>
          <Link className={styles.textLink} href="/events">
            All tournaments & gatherings <Arrow />
          </Link>
        </div>
        {featured.length ? (
          <div className={styles.eventGrid}>
            {featured.map((e) => (
              <EventCard key={e.slug} event={e} featured />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>A new chapter is coming.</h3>
            <p>Get in touch for event announcements.</p>
            <Link href="/contact" className={styles.textLink}>
              Talk to the Trust <Arrow />
            </Link>
          </div>
        )}
        <div className={styles.nextEventNote}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>
            {events.some((e) => e.status === "upcoming")
              ? "Explore upcoming events and entry details."
              : "Next tournament dates will be announced."}
          </span>
          <Link href="/contact">
            Ask the organisers <Arrow />
          </Link>
        </div>
      </section>
      {firstEdition && firstEditionPlayers.length > 0 && (
        <section id="first-edition" className={styles.section}>
          <span className={styles.eyebrow}>THE FIRST INTERNATIONAL EDITION · 2024</span>
          <div className={styles.sectionHeading}>
            <h2>Grandmasters &<br /><span>titled players.</span></h2>
            <Link className={styles.textLink} href={`/events/${firstEdition.slug}#attendees`}>Meet the first-edition players <Arrow /></Link>
          </div>
          <p>A look at the Indian and international names featured in the first-edition tournament archive.</p>
          <PlayerGallery players={firstEditionPlayers.slice(0, 4)} />
        </section>
      )}
      <section id="moments" className={styles.section}>
        <div className={styles.sectionLabel}>
          <span>03 / THE PEOPLE MAKE THE GAME</span>
          <span>COMMUNITY MOMENTS</span>
        </div>
        <div className={styles.sectionHeading}>
          <div>
            <h2>
              Life around <span>the board.</span>
            </h2>
          </div>
          <Link href="/gallery" className={styles.textLink}>
            All moments <Arrow />
          </Link>
        </div>
        <PhotoCarousel photos={photos} />
      </section>
      {featuredPartners.length > 0 && (
        <section id="partners" className={styles.sectionCompact}>
          <span className={styles.eyebrow}>SUPPORT BEHIND THE TOURNAMENT</span>
          <div className={styles.sectionHeading}>
            <h2>Partners & <span>supporters.</span></h2>
            <Link className={styles.textLink} href="/partners">Partnerships & community <Arrow /></Link>
          </div>
          <p>Official partners, corporate & institutional partners, and government & civic supporters · 2025</p>
          <PartnerMarquee><PartnerLogos partners={featuredPartners} /></PartnerMarquee>
        </section>
      )}
      <section className={`${styles.sectionCompact} ${styles.homeSupporters}`}>
        <span className={styles.eyebrow}>CONNECTED THROUGH CHESS</span>
        <p>Chess bodies and tournament supporters · 2025</p>
        <PartnerLogos partners={connectedPartners} />
        <Link className={styles.textLink} href="/partners">All partners & supporters <Arrow /></Link>
      </section>
      <ContactBand />
    </>
  );
}

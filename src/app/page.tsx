import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Arrow, ContactBand, EventCard, FocusAreas, Lines } from "@/components/shared";
import styles from "@/components/site.module.css";

export default async function Home() {
  const { site, events, albums, partners } = await getContent();
  const featured = [...events.filter((e) => e.status === "upcoming"), ...events.filter((e) => e.status !== "upcoming")].slice(0, 2);
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
              Find your
              <br />
              <span>next move.</span>
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
      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          <span>03 / THE PEOPLE MAKE THE GAME</span>
          <span>COMMUNITY MOMENTS</span>
        </div>
        <div className={styles.sectionHeading}>
          <div>
            <h2>
              Life around
              <br />
              <span>the board.</span>
            </h2>
          </div>
          <Link href="/gallery" className={styles.textLink}>
            All moments <Arrow />
          </Link>
        </div>
        <div className={styles.homePhotos}>{photos.map((photo, i) => <figure key={photo.src}><div><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 60vw" /></div><figcaption>{["A world of competition", "Room to grow", "A shared love of the game"][i]}</figcaption></figure>)}</div>
      </section>
      <section className={`${styles.sectionCompact} ${styles.affiliations}`}>
        <span className={styles.eyebrow}>CONNECTED THROUGH CHESS</span>
        <div>{partners.map((partner) => <Link key={partner.name} href="/partners">{partner.image && <Image src={partner.image} alt="" width={90} height={70} sizes="90px" />}<span>{partner.name}</span><Arrow /></Link>)}</div>
      </section>
      <ContactBand />
    </>
  );
}

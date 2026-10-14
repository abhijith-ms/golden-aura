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
        <div className={styles.heroCopy}>
          <span className={styles.heroKicker}>GOLDEN AURA TRUST <span aria-hidden="true">/</span> BENGALURU</span>
          <h1><Lines text={site.heroTitle} /></h1>
          <p>{site.heroIntro}</p>
          <div className={styles.actions}>
            <Link className={styles.buttonGold} href="/events">Explore tournaments <Arrow /></Link>
            <Link className={styles.heroLink} href="/about">Meet the Trust <Arrow /></Link>
          </div>
        </div>
        <div className={styles.boardStage} aria-hidden="true"><div className={styles.boardPlane} /></div>
        <div className={styles.heroBottom}>
          <span>ONE BOARD. EVERY POSSIBILITY.</span>
          <a href="#tournaments">Discover the game <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section id="tournaments" className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>FROM BENGALURU TO THE WORLD</span><h2>Find your<br /><span>next move.</span></h2></div>
          <Link className={styles.textLink} href="/events">All tournaments & gatherings <Arrow /></Link>
        </div>
        {featured.length ? <div className={styles.eventGrid}>{featured.map((e) => <EventCard key={e.slug} event={e} featured />)}</div> : <div className={styles.emptyState}><h3>A new chapter is coming.</h3><p>Get in touch for event announcements.</p><Link href="/contact" className={styles.textLink}>Talk to the Trust <Arrow /></Link></div>}
        <div className={styles.nextEventNote}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>{events.some((e) => e.status === "upcoming") ? "Explore upcoming events and entry details." : "Next tournament dates will be announced."}</span>
          <Link href="/contact">Ask the organisers <Arrow /></Link>
        </div>
      </section>
      <section id="purpose" className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.introGrid}>
          <div><span className={styles.eyebrow}>THE PURPOSE BEHIND THE PLAY</span><h2>A game.<br /><span>A community.</span></h2></div>
          <div><p className={styles.lead}>{site.aboutIntro}</p><Link className={styles.textLink} href="/about">Get to know the Trust <Arrow /></Link></div>
        </div>
        <FocusAreas site={site} />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>THE PEOPLE MAKE THE GAME</span><h2>Life around<br /><span>the board.</span></h2></div>
          <Link href="/gallery" className={styles.textLink}>All moments <Arrow /></Link>
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

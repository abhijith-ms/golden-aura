import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Arrow, ContactBand, Lines, PartnerLogos } from "@/components/shared";
import { PartnerMarquee } from "@/components/partner-marquee";
import { ParticipantFeedback } from "@/components/participant-feedback";
import { HeroSection } from "@/components/hero-section";
import { VisionSection } from "@/components/vision-section";
import { TournamentsSection } from "@/components/tournaments-section";
import { PlayersSection } from "@/components/players-section";
import { CommunityMomentsSection } from "@/components/community-moments-section";
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
  const photos = [albums[0]?.photos[1], community?.photos[3], community?.photos[0], albums.find((a) => a.slug === "open-2024")?.photos[1], albums.find((a) => a.slug === "amateurs")?.photos[0]].filter((p) => p !== undefined);
  return (
    <>
      <HeroSection heroTitle={site.heroTitle} heroIntro={site.heroIntro} />
      <VisionSection aboutIntro={site.aboutIntro} focusAreas={site.focusAreas} />
      <TournamentsSection featured={featured} />
      {firstEdition && firstEditionPlayers.length > 0 && (
        <PlayersSection
          players={firstEditionPlayers}
          firstEditionSlug={firstEdition.slug}
        />
      )}
      <CommunityMomentsSection photos={photos} />
      <ParticipantFeedback />
      {featuredPartners.length > 0 && (
        <section id="partners" className={styles.sectionCompact}>
          <span className={styles.eyebrow}>SUPPORT BEHIND THE TOURNAMENT</span>
          <div className={styles.sectionHeading}>
            <h2>Partners & <span>supporters.</span></h2>
            <Link className={styles.textLink} href="/partners">Partnerships & community <Arrow /></Link>
          </div>
          <p>Official partners, corporate & institutional partners, and government & civic supporters</p>
          <PartnerMarquee><PartnerLogos partners={featuredPartners} /></PartnerMarquee>
        </section>
      )}
      <section className={`${styles.sectionCompact} ${styles.homeSupporters}`}>
        <span className={styles.eyebrow}>CONNECTED THROUGH CHESS</span>
        <p>Chess bodies and tournament supporters</p>
        <PartnerLogos partners={connectedPartners} />
        <Link className={styles.textLink} href="/partners">All partners & supporters <Arrow /></Link>
      </section>
      <ContactBand />
    </>
  );
}

import Link from "next/link";
import { getContent } from "@/lib/content";
import { PageIntro } from "@/components/shared";
import styles from "@/components/site.module.css";
export const metadata = {
  title: "Privacy notice",
  alternates: { canonical: "/privacy" },
};
export default async function Privacy() {
  const { site } = await getContent();
  return (
    <>
      <PageIntro
        copy={{
          slug: "privacy",
          eyebrow: "YOUR INFORMATION",
          title: "Privacy notice",
          intro:
            "How Golden Aura Trust uses information shared through this website.",
        }}
      />
      <section className={`${styles.sectionCompact} ${styles.prose}`}>
        <h2>Enquiries</h2>
        <p>
          When you contact us, we receive your name, email address, enquiry
          topic, and message. We use these details to respond to your enquiry
          and coordinate any activity you ask about. Please avoid including
          identity documents, financial information, or other sensitive details
          in the form.
        </p>
        <h2>Where your message goes</h2>
        <p>
          Enquiries are delivered to the Trust’s mailbox through its email
          provider. This website does not keep a separate database of enquiry
          messages. Email services may retain messages and delivery records. The
          Trust keeps correspondence only as long as needed to handle the
          enquiry and meet applicable obligations.
        </p>
        <h2>Website services</h2>
        <p>
          Hosting services process technical information such as IP addresses
          and request logs to serve and protect the website. Published content
          and images may be served through Sanity’s content delivery service.
          The administrative editing area is intended for authorised Trust
          staff.
        </p>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <>
            <h2>Website analytics</h2>
            <p>
              We use Plausible to understand aggregate website visits. This
              integration does not use advertising cookies. You can contact the
              Trust with questions about its analytics.
            </p>
          </>
        )}
        <h2>Your choices</h2>
        <p>
          You can ask about, correct, or request deletion of information you
          have shared by emailing{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. You can also
          contact us directly by telephone or email instead of using the form.
        </p>
        <h2>Registration and payments</h2>
        <p>
          This release does not collect player registrations or payment details.
          A separate notice will explain how that information is handled when
          those services are introduced.
        </p>
        <Link className={styles.textLink} href="/contact">
          Contact the Trust ↗
        </Link>
      </section>
    </>
  );
}

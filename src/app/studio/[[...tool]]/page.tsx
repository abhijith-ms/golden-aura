import Studio from "@/components/studio-loader";
import styles from "@/components/site.module.css";
export const metadata = {
  title: "Trust content studio",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    return (
      <section className={styles.pageIntro}>
        <span className={styles.eyebrow}>TRUST STAFF</span>
        <h1>
          The editing workspace
          <br />
          is ready to connect.
        </h1>
        <p>
          Create the Trust-owned Sanity project, add its public project ID and
          dataset to the environment configuration, and run the documented
          content import. See the project README for setup and publishing
          instructions.
        </p>
      </section>
    );
  return <Studio />;
}

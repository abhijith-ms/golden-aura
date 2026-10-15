import Image from "next/image";
import { Arrow } from "./shared";
import { CountryName } from "./country-name";
import styles from "./site.module.css";

const videos = [
  { name: "Viswanathan Anand", detail: "Five-time World Champion", file: "vishwa.mp4", poster: "feedback-anand.webp" },
  { name: "Players from the Maldives", detail: "Participant voices", file: "Video-306.mp4", poster: "feedback-maldives.webp" },
  { name: "Aradhya Garg", detail: "FIDE Master", file: "Video-127.mp4", poster: "feedback-aradhya-garg.webp" },
];

export function ParticipantFeedback() {
  return <section id="participant-feedback" className={styles.sectionCompact}>
    <div className={styles.sectionHeading}>
      <div><span className={styles.eyebrow}>VOICES FROM THE TOURNAMENT</span><h2>Feedback from <span>past participants.</span></h2></div>
      <a className={styles.textLink} href="https://nammabigchess.com/" target="_blank" rel="noopener noreferrer">From the original tournament archive <Arrow /></a>
    </div>
    <ul className={styles.feedbackGrid} tabIndex={0} aria-label="Participant video feedback">
      {videos.map((video) => <li key={video.file}>
        <a className={styles.feedbackVideo} href={`https://nammabigchess.com/wp-content/uploads/2025/03/${video.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch feedback from ${video.name} (opens in a new tab)`}>
          <Image src={`/images/${video.poster}`} alt="" fill sizes="(max-width: 760px) 80vw, 360px" />
          <span className={styles.feedbackPlay} aria-hidden="true">▶</span>
          <span className={styles.feedbackWatch}>Watch video <Arrow /></span>
        </a>
        <h3>{video.name}</h3><p>{video.detail}</p>
      </li>)}
    </ul>
    <figure className={styles.participantQuote}>
      <blockquote>“I’m happy with my performance in this tough tournament…”</blockquote>
      <figcaption>Diajeng Theresa Singgih <span aria-hidden="true">·</span> <CountryName country="Indonesia" /></figcaption>
    </figure>
  </section>;
}

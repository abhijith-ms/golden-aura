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
    </div>
    <ul className={styles.feedbackGrid} tabIndex={0} aria-label="Participant video feedback">
      {videos.map((video) => <li key={video.file}>
        <video className={styles.feedbackVideo} controls playsInline preload="none" poster={`/images/${video.poster}`} aria-label={`Feedback from ${video.name}`}>
          <source src={`https://nammabigchess.com/wp-content/uploads/2025/03/${video.file}`} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <h3>{video.name}</h3><p>{video.detail}</p>
      </li>)}
    </ul>
    <div className={styles.feedbackQuotes}>
    <figure className={styles.participantQuote}>
      <blockquote>“I’m happy with my performance in this tough tournament…”</blockquote>
      <figcaption>Diajeng Theresa Singgih <span aria-hidden="true">·</span> <CountryName country="Indonesia" /></figcaption>
    </figure>
    <figure className={styles.participantQuote}>
      <blockquote>“They have made all efforts in making this tournament a grand success.”</blockquote>
      <figcaption>Dr Naga Subramaniyam <span aria-hidden="true">·</span> Fortis Hospital</figcaption>
    </figure>
    </div>
  </section>;
}

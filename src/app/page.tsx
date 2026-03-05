import Link from "next/link";
import styles from "./HomePage.module.css";
import ui from "../styles/ui.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${ui.card}`}>
        <div className={styles.hero}>
          <div className={styles.badge}>Audio • Progress • Library</div>

          <h1 className={styles.title}>Summarist</h1>

          <p className={styles.subtitle}>
            Bite-sized book insights with audio playback and progress tracking.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/for-you" className={ui.button}>
            Go to For You
          </Link>

          <Link href="/library" className={ui.button}>
            View Library
          </Link>

          <Link href="/choose-plan" className={ui.button}>
            Choose Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

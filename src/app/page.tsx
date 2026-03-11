"use client";

import { useDispatch } from "react-redux";
import { openLogin } from "../store/uiSlice";
import styles from "./HomePage.module.css";

function ReadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.featureIconSvg}
      aria-hidden="true"
    >
      <path
        d="M6 4.5A2.5 2.5 0 0 1 8.5 2H19v16H8.5A2.5 2.5 0 0 0 6 20.5V4.5Zm2.5-.5A1.5 1.5 0 0 0 7 5.5v12.04c.42-.34.94-.54 1.5-.54H18V4H8.5Zm-4 2h1v14.5C5.5 21.88 6.62 23 8 23h11v-2H8a1 1 0 0 1-1-1V6H4.5V4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.featureIconSvg}
      aria-hidden="true"
    >
      <path
        d="M10.5 4a6.5 6.5 0 1 0 4.06 11.58l4.43 4.43 1.41-1.41-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.featureIconSvg}
      aria-hidden="true"
    >
      <path
        d="M9 3.5A2.5 2.5 0 0 1 11.5 1h1A2.5 2.5 0 0 1 15 3.5V5h4A2 2 0 0 1 21 7v9a2 2 0 0 1-2 2h-4.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4V3.5Zm2.5-1.5A1.5 1.5 0 0 0 10 3.5V5h4V3.5A1.5 1.5 0 0 0 12.5 2h-1ZM5 7v2.5h14V7H5Zm14 4.5H5V16h14v-4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();

 function handleOpenLogin() {
  console.log("LOGIN CLICKED");
  dispatch(openLogin());
}

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <div className={styles.brandMarkWrap}>
              <div className={styles.brandMarkMain} />
              <div className={styles.brandMarkLabel}>SUM</div>
            </div>
            <span className={styles.brandText}>Summarist</span>
          </div>

          <nav className={styles.navLinks}>
            <button
              type="button"
              className={styles.navLinkButton}
              onClick={handleOpenLogin}
            >
              Login
            </button>
            <a className={styles.navLink} href="#features">
              About
            </a>
            <a className={styles.navLink} href="#features">
              Contact
            </a>
            <a className={styles.navLink} href="#features">
              Help
            </a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Gain more knowledge in less time
            </h1>
            <p className={styles.heroText}>
              Great summaries for busy people, individuals who barely have time
              to read, and even people who don&apos;t like to read.
            </p>
            <button
              type="button"
              className={styles.loginButton}
              onClick={handleOpenLogin}
            >
              Login
            </button>
          </div>

          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.heroDots}>
              <span />
              <span />
              <span />
            </div>

            <div className={styles.heroCode}>&lt;/&gt;</div>
            <div className={styles.heroMiniLine} />
            <div className={styles.heroMiniSquares}>
              <span />
              <span />
              <span />
            </div>

            <div className={styles.illustrationCard}>
              <div className={styles.illustrationLineGreen} />
              <div className={styles.illustrationLine} />
              <div className={styles.illustrationLine} />
              <div className={styles.illustrationLine} />
              <div className={styles.illustrationLineShort} />

              <div className={styles.illustrationPerson}>
                <div className={styles.personHead} />
                <div className={styles.personHair} />
                <div className={styles.personBody} />
                <div className={styles.personArmLeft} />
                <div className={styles.personArmRight} />
                <div className={styles.personLegLeft} />
                <div className={styles.personLegRight} />
                <div className={styles.personFootLeft} />
                <div className={styles.personFootRight} />
              </div>

              <div className={styles.illustrationCheck}>
                <div className={styles.checkArrow} />
              </div>
            </div>

            <div className={styles.floorLine} />
          </div>
        </section>

        <section id="features" className={styles.featuresSection}>
          <h2 className={styles.featuresTitle}>
            Understand books in few minutes
          </h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ReadIcon />
              </div>
              <h3 className={styles.featureHeading}>Read or listen</h3>
              <p className={styles.featureText}>
                Save time by getting the core ideas from the best books.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FindIcon />
              </div>
              <h3 className={styles.featureHeading}>Find your next read</h3>
              <p className={styles.featureText}>
                Explore book lists and personalized recommendations.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BriefcaseIcon />
              </div>
              <h3 className={styles.featureHeading}>Briefcasts</h3>
              <p className={styles.featureText}>
                Gain valuable insights from briefcasts.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

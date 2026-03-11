"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";

import summaristLogo from "../public/summarist-logo.webp";
import { auth } from "../firebase/auth";
import { openAuth } from "../store/uiSlice";
import { setPremium, setUser } from "../store/authSlice";
import type { RootState } from "../store/store";
import styles from "./Sidebar.module.css";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M6.75 19.25h10.5V10.6L12 6.4 6.75 10.6v8.65Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 11.1 12 5.25l7.25 5.85"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M7 4.75h10a.75.75 0 0 1 .75.75v13.55l-5.75-3.2-5.75 3.2V5.5A.75.75 0 0 1 7 4.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M7 16.8 16.8 7M6.2 17.6l-1 3 3-1 9.8-9.8-2-2L6.2 17.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M16 16l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M12 8.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 0 0 12 8.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M19 12a7.8 7.8 0 0 0-.07-1l1.72-1.34-1.6-2.76-2.08.58a7.82 7.82 0 0 0-1.74-1l-.3-2.14h-3.2l-.3 2.14c-.61.22-1.2.55-1.74 1l-2.08-.58-1.6 2.76L5.07 11a8.83 8.83 0 0 0 0 2l-1.72 1.34 1.6 2.76 2.08-.58c.54.45 1.13.78 1.74 1l.3 2.14h3.2l.3-2.14c.61-.22 1.2-.55 1.74-1l2.08.58 1.6-2.76L18.93 13c.05-.33.07-.66.07-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M9.9 9.35a2.45 2.45 0 1 1 3.58 2.18c-.96.5-1.48 1-1.48 2.02"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.9" r="1" fill="currentColor" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M10 6H6.75a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8.25 17.75 12 13 15.75M17.25 12H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const isPlayerPage = pathname.startsWith("/player/");
  const isForYou = pathname === "/for-you";
  const isLibrary = pathname === "/library";
  const isSettings = pathname === "/settings";

  async function handleAuthClick() {
    if (!user) {
      dispatch(openAuth());
      return;
    }

    await signOut(auth);
    dispatch(setUser(null));
    dispatch(setPremium(false));
    window.location.assign("/");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Link href="/for-you" className={styles.brand} aria-label="Summarist">
            <Image
              src={summaristLogo}
              alt="Summarist"
              width={220}
              height={56}
              priority
              className={styles.logo}
            />
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/for-you"
              className={`${styles.navLink} ${isForYou ? styles.active : ""}`}
            >
              <span className={styles.iconWrap}>
                <HomeIcon />
              </span>
              <span className={styles.label}>For you</span>
            </Link>

            <Link
              href="/library"
              className={`${styles.navLink} ${isLibrary ? styles.active : ""}`}
            >
              <span className={styles.iconWrap}>
                <LibraryIcon />
              </span>
              <span className={styles.label}>My Library</span>
            </Link>

            <button
              type="button"
              className={`${styles.navStatic} ${styles.disabledItem} ${styles.hoverCircle} ${styles.hoverStrike}`}
            >
              <span className={styles.iconWrap}>
                <HighlightIcon />
              </span>
              <span className={styles.label}>Highlights</span>
            </button>

            <button
              type="button"
              className={`${styles.navStatic} ${styles.disabledItem} ${styles.hoverCircle} ${styles.hoverStrike}`}
            >
              <span className={styles.iconWrap}>
                <SearchIcon />
              </span>
              <span className={styles.label}>Search</span>
            </button>

            {isPlayerPage ? (
              <div className={styles.fontControls} aria-label="Font size controls">
                <button type="button" className={`${styles.fontButton} ${styles.fontActive}`}>
                  Aa
                </button>
                <button type="button" className={styles.fontButton}>
                  Aa
                </button>
                <button type="button" className={styles.fontButton}>
                  Aa
                </button>
                <button type="button" className={styles.fontButton}>
                  Aa
                </button>
              </div>
            ) : null}
          </nav>
        </div>

        <div className={styles.bottom}>
          <Link
            href="/settings"
            className={`${styles.navLink} ${isSettings ? styles.active : ""}`}
          >
            <span className={styles.iconWrap}>
              <SettingsIcon />
            </span>
            <span className={styles.label}>Settings</span>
          </Link>

          <button
            type="button"
            className={`${styles.navStatic} ${styles.disabledItem} ${styles.hoverCircle} ${styles.hoverStrike}`}
          >
            <span className={styles.iconWrap}>
              <HelpIcon />
            </span>
            <span className={styles.helpLabel}>Help &amp; Support</span>
          </button>

          <button
            type="button"
            className={styles.navButton}
            onClick={handleAuthClick}
          >
            <span className={styles.iconWrap}>
              <LogoutIcon />
            </span>
            <span className={styles.label}>{user ? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
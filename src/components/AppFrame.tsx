"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import styles from "./AppFrame.module.css";
import logo from "../public/summarist-logo.webp";

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.logoIcon} aria-hidden="true">
      <rect
        x="4"
        y="5"
        width="14"
        height="16"
        rx="2"
        transform="rotate(-18 4 5)"
        fill="#0F5D75"
      />
      <rect
        x="7"
        y="7"
        width="8"
        height="1.5"
        transform="rotate(-18 7 7)"
        fill="#ffffff"
        opacity="0.9"
      />
      <rect
        x="7"
        y="10"
        width="8"
        height="1.5"
        transform="rotate(-18 7 10)"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
}

function ForYouIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11Zm2 .5v10h10V7H7Zm2 2h6v2H9V9Zm0 4h6v2H9v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M6 4h3a1 1 0 0 1 1 1v14H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Zm5 0h6a2 2 0 0 1 2 2v13h-8V4Zm2 3v2h4V7h-4Zm0 4v2h4v-2h-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M14.7 4.3a1 1 0 0 1 1.4 0l3.6 3.6a1 1 0 0 1 0 1.4l-8.9 8.9L6 19l.8-4.8 7.9-7.9ZM5 20h14v-2H5v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 0 4.06 11.58l4.43 4.43 1.41-1.41-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M19.14 12.94a7.96 7.96 0 0 0 .06-.94 7.96 7.96 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.53-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94L2.83 14.16a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.51.41 1.05.72 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.53 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M12 2.75A9.25 9.25 0 1 0 21.25 12 9.26 9.26 0 0 0 12 2.75Zm0 15.5a1.15 1.15 0 1 1 1.15-1.15A1.15 1.15 0 0 1 12 18.25Zm1.4-5.56-.53.3a1.37 1.37 0 0 0-.69 1.19v.32h-1.9v-.42a2.93 2.93 0 0 1 1.47-2.55l.74-.42a1.58 1.58 0 1 0-2.37-1.37H8.22a3.48 3.48 0 1 1 5.18 3.01Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
      <path
        d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v-2H6V6h4V4Zm5.59 3.59L14.17 9l2.58 2.5H9v2h7.75l-2.58 2.5 1.42 1.41L20.59 12l-5-4.41Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TopSearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.topSearchIcon}
      aria-hidden="true"
    >
      <path
        d="M10.5 4a6.5 6.5 0 1 0 4.06 11.58l4.43 4.43 1.41-1.41-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  if (isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/for-you" className={styles.logo}>
            <img src={logo.src} className={styles.logoIcon} />
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/for-you"
              className={`${styles.navItem} ${
                pathname === "/for-you" ? styles.active : ""
              }`}
            >
              <ForYouIcon />
              <span>For you</span>
            </Link>

            <Link
              href="/library"
              className={`${styles.navItem} ${
                pathname === "/library" ? styles.active : ""
              }`}
            >
              <LibraryIcon />
              <span>My Library</span>
            </Link>

            <Link href="/highlights" className={styles.navItem}>
              <HighlightIcon />
              <span>Highlights</span>
            </Link>

            <Link href="/search" className={styles.navItem}>
              <SearchIcon />
              <span>Search</span>
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <Link href="/settings" className={styles.navItem}>
            <SettingsIcon />
            <span>Settings</span>
          </Link>

          <Link href="/help" className={styles.navItem}>
            <HelpIcon />
            <span>Help &amp; Support</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.navItemButton}
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className={styles.mainShell}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.searchWrap}>
              <input
                type="text"
                placeholder="Search for books"
                className={styles.searchInput}
              />
              <span className={styles.searchIconWrap}>
                <TopSearchIcon />
              </span>
            </div>
          </div>
        </header>

        <div className={styles.topbarDivider} />

        <main className={styles.mainContent}>
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}

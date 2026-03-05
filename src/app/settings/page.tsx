"use client";

import { useEffect, useState } from "react";
import ui from "../../styles/ui.module.css";
import styles from "./SettingsPage.module.css";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { setUser, setPremium } from "../../store/authSlice";

const PLAYBACK_RATE_KEY = "summarist_playbackRate";

function readPlaybackRate(): number {
  try {
    const raw = localStorage.getItem(PLAYBACK_RATE_KEY);
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  } catch {
    return 1;
  }
}

function writePlaybackRate(rate: number) {
  try {
    localStorage.setItem(PLAYBACK_RATE_KEY, String(rate));
  } catch {}
}

function clearListeningProgress() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("summarist_progress_")) keysToRemove.push(k);
      if (k.startsWith("summarist_duration_")) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const isPremium = useSelector((state: RootState) => state.auth.isPremium);

  const [rate, setRate] = useState<number>(1);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setRate(readPlaybackRate());
  }, []);

  function handleRate(next: number) {
    setRate(next);
    writePlaybackRate(next);
  }

  async function handleLogout() {
    await signOut(auth);
    dispatch(setUser(null));
    dispatch(setPremium(false));

    window.location.assign("/login");
  }

  function handleClear() {
    clearListeningProgress();
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  }

  return (
    <div className={ui.page}>
      <div className={`${ui.card} ${ui.pageCard}`}>
        <div className={ui.hero}>
          <div className={styles.topRow}>
            <h1 className={ui.h1}>Settings</h1>

            <span
              className={`${styles.planPill} ${
                isPremium ? styles.premium : styles.free
              }`}
            >
              {isPremium ? "Premium" : "Free"}
            </span>
          </div>

          <p className={ui.muted}>
            Manage your account, plan, and playback preferences.
          </p>
        </div>

        <div className={ui.section}>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Account</h3>
            <div className={styles.kv}>
              <span className={styles.k}>Email</span>
              <span className={styles.v}>{user?.email ?? "Unknown"}</span>
            </div>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Playback</h3>
            <div className={styles.kv}>
              <span className={styles.k}>Default speed</span>
              <span className={styles.v}>{rate}x</span>
            </div>

            <div className={styles.rateRow}>
              {[1, 1.25, 1.5, 2].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.rateBtn} ${
                    rate === n ? styles.activeRate : ""
                  }`}
                  onClick={() => handleRate(n)}
                >
                  {n}x
                </button>
              ))}
            </div>

            <p className={styles.hint}>
              This becomes the default speed when you open a player.
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Listening data</h3>
            <p className={styles.hint}>
              Clears your saved progress and durations (Continue Listening).
            </p>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={`${ui.button} ${styles.dangerBtn}`}
                onClick={handleClear}
              >
                Clear listening progress
              </button>

              {cleared && <span className={styles.toast}>Cleared ✅</span>}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.actionRow}>
            <button className={ui.button} onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

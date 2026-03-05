"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ui from "../../../styles/ui.module.css";
import styles from "./PlayerPage.module.css";

type Book = {
  id: string;
  title: string;
  author: string;
  summary?: string;
  bookDescription?: string;
  audioLink?: string;
  imageLink?: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const PROGRESS_KEY = `summarist_progress_${id}`;
  const DURATION_KEY = `summarist_duration_${id}`;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [rate, setRate] = useState<number>(1);

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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(
            id,
          )}`,
        );
        const data = await res.json();

        setBook({
          id: data?.id ?? id,
          title: data?.title ?? "Untitled",
          author: data?.author ?? "",
          summary: data?.summary,
          bookDescription: data?.bookDescription,
          audioLink: data?.audioLink,
          imageLink: data?.imageLink,
        });

        const saved = Number(localStorage.getItem(PROGRESS_KEY) || 0);
        if (Number.isFinite(saved) && saved > 0) setCurrent(saved);

        const savedDur = Number(localStorage.getItem(DURATION_KEY) || 0);
        if (Number.isFinite(savedDur) && savedDur > 0) setDuration(savedDur);
      } catch (e) {
        console.error("Failed to load book", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  useEffect(() => {
    const r = readPlaybackRate();
    setRate(r);

    if (audioRef.current) {
      audioRef.current.playbackRate = r;
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, String(current));
    } catch {}
  }, [current]);

  const remaining = useMemo(() => {
    if (!duration) return 0;
    return Math.max(0, duration - current);
  }, [duration, current]);

  function seekBy(delta: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(
      0,
      Math.min(a.duration || 0, a.currentTime + delta),
    );
  }

  if (loading) {
    return (
      <div className={ui.page}>
        <div className={`${ui.card} ${ui.pageCard}`}>
          <div className={ui.hero}>
            <h1 className={ui.h1}>Loading…</h1>
            <p className={ui.muted}>Preparing your player.</p>
          </div>
          <div className={ui.section}>
            <p className={ui.muted}>Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={ui.page}>
        <div className={`${ui.card} ${ui.pageCard}`}>
          <div className={ui.hero}>
            <h1 className={ui.h1}>Not found</h1>
            <p className={ui.muted}>We couldn’t load this book.</p>
          </div>
          <div className={ui.section}>
            <button
              className={ui.button}
              onClick={() => router.push("/for-you")}
            >
              Back to For You
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={`${ui.card} ${ui.pageCard}`}>
        <div className={ui.hero}>
          <div className={styles.headerRow}>
            <img
              src={book.imageLink || ""}
              alt={book.title}
              className={styles.smallCover}
            />
            <div>
              <h1 className={ui.h1} style={{ marginBottom: 6 }}>
                {book.title}
              </h1>
              <p className={ui.muted} style={{ margin: 0 }}>
                {book.author}
              </p>
              <p className={ui.muted}>Playback speed: {rate}x</p>
            </div>
          </div>
        </div>

        <div className={ui.section}>
          <div className={styles.playerCard}>
            <audio
              ref={audioRef}
              controls
              src={book.audioLink}
              onLoadedMetadata={(e) => {
                const a = e.currentTarget;
                const d = Number(a.duration || 0);
                if (Number.isFinite(d) && d > 0) {
                  setDuration(d);
                  try {
                    localStorage.setItem(DURATION_KEY, String(d));
                  } catch {}
                }

                // resume playback
                const saved = Number(localStorage.getItem(PROGRESS_KEY) || 0);
                if (Number.isFinite(saved) && saved > 0) {
                  a.currentTime = Math.min(saved, a.duration || saved);
                }
              }}
              onTimeUpdate={(e) => {
                const a = e.currentTarget;
                setCurrent(a.currentTime || 0);
              }}
            />

            <div className={styles.controlsRow}>
              <button className={ui.button} onClick={() => seekBy(-15)}>
                -15s
              </button>
              <button className={ui.button} onClick={() => seekBy(15)}>
                +15s
              </button>

              <div className={styles.time}>
                <span>{formatTime(current)}</span>
                <span className={ui.muted}>-{formatTime(remaining)}</span>
              </div>
            </div>

            <input
              className={styles.slider}
              type="range"
              min={0}
              max={duration || 1}
              step={0.5}
              value={Math.min(current, duration || current)}
              onChange={(e) => {
                const next = Number(e.target.value);
                setCurrent(next);
                const a = audioRef.current;
                if (a) a.currentTime = next;
              }}
            />
          </div>

          <div className={styles.summaryBlock}>
            <h2 className={ui.h2}>Summary</h2>
            <p className={styles.summaryText}>
              {book.summary || book.bookDescription || "No summary available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

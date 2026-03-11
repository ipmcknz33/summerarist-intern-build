"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { openAuth } from "../../../store/uiSlice";
import styles from "./PlayerPage.module.css";

type Book = {
  id: string;
  title: string;
  author: string;
  summary?: string;
  bookDescription?: string;
  authorDescription?: string;
  audioLink?: string;
  imageLink?: string;
  subscriptionRequired?: boolean;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.controlIcon} aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.controlIcon} aria-hidden="true">
      <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" fill="currentColor" />
    </svg>
  );
}

function BackTenIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.controlIcon} aria-hidden="true">
      <path
        d="M12.8 6.3a6.6 6.6 0 1 1-5.66 10.02.75.75 0 0 1 1.29-.76A5.1 5.1 0 1 0 12.8 7.8h-.56l1.16 1.16a.75.75 0 1 1-1.06 1.06L9.9 7.58l2.44-2.44a.75.75 0 0 1 1.06 1.06L12.24 6.3h.56Z"
        fill="currentColor"
      />
      <text x="12" y="16.15" textAnchor="middle" className={styles.skipText}>
        10
      </text>
    </svg>
  );
}

function ForwardTenIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.controlIcon} aria-hidden="true">
      <path
        d="M11.2 6.3a6.6 6.6 0 1 0 5.66 10.02.75.75 0 1 0-1.29-.76A5.1 5.1 0 1 1 11.2 7.8h.56l-1.16 1.16a.75.75 0 0 0 1.06 1.06l2.44-2.44-2.44-2.44a.75.75 0 0 0-1.06 1.06l1.16 1.1h-.56Z"
        fill="currentColor"
      />
      <text x="12" y="16.15" textAnchor="middle" className={styles.skipText}>
        10
      </text>
    </svg>
  );
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isPremium = useSelector((state: RootState) => state.auth.isPremium);

  const id = params.id;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const PROGRESS_KEY = `summarist_progress_${id}`;
  const DURATION_KEY = `summarist_duration_${id}`;
  const PLAYBACK_RATE_KEY = "summarist_playbackRate";

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function readSavedProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      const parsed = raw ? Number(raw) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  function readSavedDuration() {
    try {
      const raw = localStorage.getItem(DURATION_KEY);
      const parsed = raw ? Number(raw) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  function readPlaybackRate() {
    try {
      const raw = localStorage.getItem(PLAYBACK_RATE_KEY);
      const parsed = raw ? Number(raw) : 1;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    } catch {
      return 1;
    }
  }

  useEffect(() => {
    let alive = true;

    async function loadBook() {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(
            id,
          )}`,
        );

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!alive) return;

        if (!user) {
          dispatch(openAuth());
          router.replace(`/book/${id}`);
          return;
        }

        const isLockedPremiumBook = data?.subscriptionRequired === true;

        if (isLockedPremiumBook && !isPremium) {
          router.replace("/choose-plan");
          return;
        }

        setBook({
          id: data?.id ?? id,
          title: data?.title ?? "Untitled",
          author: data?.author ?? "",
          summary: data?.summary ?? "",
          bookDescription: data?.bookDescription ?? "",
          authorDescription: data?.authorDescription ?? "",
          audioLink: data?.audioLink ?? "",
          imageLink: data?.imageLink ?? "",
          subscriptionRequired: isLockedPremiumBook,
        });

        const savedProgress = readSavedProgress();
        const savedDuration = readSavedDuration();

        if (savedProgress > 0) {
          setCurrentTime(savedProgress);
        }

        if (savedDuration > 0) {
          setDuration(savedDuration);
        }
      } catch {
        if (alive) {
          setBook(null);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      alive = false;
    };
  }, [dispatch, id, isPremium, router, user]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, String(currentTime));
    } catch {}
  }, [PROGRESS_KEY, currentTime]);

  const displayedTime = dragTime ?? currentTime;

  const progressPercent = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return (displayedTime / duration) * 100;
  }, [displayedTime, duration]);

  function commitSeek(nextTime: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    setDragTime(null);
    setIsDragging(false);
  }

  function handleLoadedMetadata(event: React.SyntheticEvent<HTMLAudioElement>) {
    const audio = event.currentTarget;
    const loadedDuration = Number(audio.duration || 0);

    if (Number.isFinite(loadedDuration) && loadedDuration > 0) {
      setDuration(loadedDuration);

      try {
        localStorage.setItem(DURATION_KEY, String(loadedDuration));
      } catch {}
    }

    const savedProgress = readSavedProgress();
    if (savedProgress > 0) {
      const safeTime = clamp(savedProgress, 0, loadedDuration || savedProgress);
      audio.currentTime = safeTime;
      setCurrentTime(safeTime);
    }

    audio.playbackRate = readPlaybackRate();
  }

  function handleTimeUpdate(event: React.SyntheticEvent<HTMLAudioElement>) {
    if (isDragging) return;
    setCurrentTime(event.currentTarget.currentTime || 0);
  }

  async function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  }

  function handleSeekBy(amount: number) {
    const audio = audioRef.current;
    if (!audio) return;

    const max = Number.isFinite(audio.duration) ? audio.duration : duration;
    const nextTime = clamp(audio.currentTime + amount, 0, max || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  const aboutText =
    book?.summary ||
    book?.bookDescription ||
    "No summary available for this title yet.";

  const aboutAuthorText =
    book?.authorDescription ||
    `${book?.author ?? "This author"} is featured in Summarist's library. Additional author details are not available in the API response for this title.`;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.contentWrap}>
          <div className={styles.titleSkeleton} />
          <div className={styles.authorSkeleton} />
          <div className={styles.sectionSkeleton} />
          <div className={styles.sectionSkeletonTall} />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.page}>
        <div className={styles.contentWrap}>
          <h1 className={styles.emptyTitle}>
            We couldn&apos;t load this book.
          </h1>
          <p className={styles.emptyText}>Try another title from For You.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.contentWrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>{book.author}</p>
        </header>

        <section className={styles.textSection}>
          <h2 className={styles.sectionTitle}>What&apos;s it about?</h2>
          <p className={styles.sectionBody}>{aboutText}</p>
        </section>

        <section className={styles.textSection}>
          <h2 className={styles.sectionTitle}>About the author</h2>
          <p className={styles.sectionBody}>{aboutAuthorText}</p>
        </section>
      </div>

      <div className={styles.bottomPlayer}>
        <div className={styles.playerInner}>
          <div className={styles.bookMeta}>
            {book.imageLink ? (
              <img
                src={book.imageLink}
                alt={book.title}
                className={styles.thumb}
              />
            ) : (
              <div className={styles.thumbFallback} />
            )}

            <div className={styles.bookMetaText}>
              <p className={styles.barTitle}>{book.title}</p>
              <p className={styles.barAuthor}>{book.author}</p>
            </div>
          </div>

          <div className={styles.controlsWrap}>
            <button
              type="button"
              className={styles.ghostControl}
              onClick={() => handleSeekBy(-10)}
              aria-label="Back 10 seconds"
            >
              <BackTenIcon />
            </button>

            <button
              type="button"
              className={styles.playControl}
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              type="button"
              className={styles.ghostControl}
              onClick={() => handleSeekBy(10)}
              aria-label="Forward 10 seconds"
            >
              <ForwardTenIcon />
            </button>
          </div>

          <div className={styles.rightPlayer}>
            <div className={styles.timeMeta}>
              <span>{formatTime(displayedTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className={styles.progressRow}>
              <div className={styles.progressTrack} />
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={Math.min(displayedTime, duration || displayedTime)}
                className={styles.slider}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  setIsDragging(true);
                  setDragTime(nextTime);
                }}
                onMouseUp={(event) => {
                  const nextTime = Number(
                    (event.target as HTMLInputElement).value,
                  );
                  commitSeek(nextTime);
                }}
                onTouchEnd={(event) => {
                  const nextTime = Number(
                    (event.target as HTMLInputElement).value,
                  );
                  commitSeek(nextTime);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={book.audioLink}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setDragTime(null);

          const audio = audioRef.current;
          const finalDuration =
            audio && Number.isFinite(audio.duration)
              ? audio.duration
              : duration;

          setCurrentTime(finalDuration);

          try {
            localStorage.setItem(PROGRESS_KEY, String(finalDuration));
            localStorage.setItem(DURATION_KEY, String(finalDuration));
          } catch {}
        }}
        preload="metadata"
        className={styles.hiddenAudio}
      />
    </div>
  );
}

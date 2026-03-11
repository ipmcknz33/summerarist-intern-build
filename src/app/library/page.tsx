"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import styles from "./LibraryPage.module.css";

type LibBook = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

type ProgressMap = Record<
  string,
  {
    duration: number;
    progress: number;
  }
>;

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function LibraryPage() {
  const router = useRouter();
  const items = useSelector(
    (state: RootState) => state.library.items,
  ) as LibBook[];

  const [mounted, setMounted] = useState(false);
  const [progressMap, setProgressMap] = useState<ProgressMap>({});

  useEffect(() => {
    setMounted(true);

    const nextMap: ProgressMap = {};

    for (const book of items) {
      let duration = 0;
      let progress = 0;

      try {
        const rawDuration = localStorage.getItem(
          `summarist_duration_${book.id}`,
        );
        const rawProgress = localStorage.getItem(
          `summarist_progress_${book.id}`,
        );

        const parsedDuration = rawDuration ? Number(rawDuration) : 0;
        const parsedProgress = rawProgress ? Number(rawProgress) : 0;

        duration = Number.isFinite(parsedDuration) ? parsedDuration : 0;
        progress = Number.isFinite(parsedProgress) ? parsedProgress : 0;
      } catch {
        duration = 0;
        progress = 0;
      }

      nextMap[book.id] = { duration, progress };
    }

    setProgressMap(nextMap);
  }, [items]);

  const { saved, finished } = useMemo(() => {
    const savedItems: LibBook[] = [];
    const finishedItems: LibBook[] = [];

    for (const book of items) {
      const stats = progressMap[book.id] ?? { duration: 0, progress: 0 };
      const isFinished =
        stats.duration > 0 && stats.progress / stats.duration >= 0.98;

      if (isFinished) {
        finishedItems.push(book);
      } else {
        savedItems.push(book);
      }
    }

    return { saved: savedItems, finished: finishedItems };
  }, [items, progressMap]);

  if (!mounted) {
    return <div className={styles.page} />;
  }

  return (
    <div className={styles.page}>
      {items.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>Save books to your library</h2>
          <p className={styles.emptyText}>
            Books you save will appear here so you can pick up where you left
            off.
          </p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/for-you")}
          >
            Browse books
          </button>
        </section>
      ) : (
        <>
          {saved.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Saved Books</h2>
                <p className={styles.sectionSubtitle}>{saved.length} items</p>
              </div>

              <div className={styles.grid}>
                {saved.map((book) => {
                  const stats = progressMap[book.id] ?? {
                    duration: 0,
                    progress: 0,
                  };
                  const percent = stats.duration
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          (stats.progress / Math.max(1, stats.duration)) * 100,
                        ),
                      )
                    : 0;

                  return (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className={styles.card}
                    >
                      <div className={styles.coverWrap}>
                        <img
                          src={book.imageLink}
                          alt={book.title}
                          className={styles.cover}
                        />
                      </div>

                      <h3 className={styles.cardTitle}>{book.title}</h3>
                      <p className={styles.cardAuthor}>{book.author}</p>

                      <div className={styles.progressWrap}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className={styles.cardMeta}>
                        {stats.duration
                          ? `${formatTime(Math.max(0, stats.duration - stats.progress))} left`
                          : stats.progress > 0
                            ? `Saved at ${formatTime(stats.progress)}`
                            : "Ready to start"}
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={(event) => {
                            event.preventDefault();
                            router.push(`/player/${book.id}`);
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          {finished.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Finished</h2>
                <p className={styles.sectionSubtitle}>
                  {finished.length} items
                </p>
              </div>

              <div className={styles.grid}>
                {finished.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className={styles.card}
                  >
                    <div className={styles.coverWrap}>
                      <img
                        src={book.imageLink}
                        alt={book.title}
                        className={styles.cover}
                      />
                    </div>

                    <h3 className={styles.cardTitle}>{book.title}</h3>
                    <p className={styles.cardAuthor}>{book.author}</p>

                    <div className={styles.finishedPill}>Finished</div>

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={(event) => {
                          event.preventDefault();
                          router.push(`/player/${book.id}`);
                        }}
                      >
                        Re-listen
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

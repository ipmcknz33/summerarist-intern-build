"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import ui from "../../styles/ui.module.css";
import styles from "./LibraryPage.module.css";

type LibBook = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

function getSavedDurationSeconds(bookId: string) {
  try {
    const raw = localStorage.getItem(`summarist_duration_${bookId}`);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function getSavedProgressSeconds(bookId: string) {
  try {
    const raw = localStorage.getItem(`summarist_progress_${bookId}`);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function LibraryPage() {
  const router = useRouter();

  const items = useSelector(
    (state: RootState) => state.library.items,
  ) as LibBook[];

  const { saved, finished } = useMemo(() => {
    const finished: LibBook[] = [];
    const saved: LibBook[] = [];

    for (const b of items) {
      const dur = getSavedDurationSeconds(b.id);
      const prog = getSavedProgressSeconds(b.id);

      
      const isFinished = dur > 0 && prog / dur >= 0.98;

      if (isFinished) finished.push(b);
      else saved.push(b);
    }

    return { saved, finished };
  }, [items]);

  return (
    <div className={ui.page}>
      <div className={`${ui.card} ${ui.pageCard}`}>
        <div className={ui.hero}>
          <h1 className={ui.h1}>Your Library</h1>
          <p className={ui.muted}>Saved books you can return to anytime.</p>
        </div>

        <div className={ui.section}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>
                Want to explore summaries?
              </div>
              <div className={styles.emptyText}>
                Save a title to your library and it will appear here.
              </div>

              <button
                className={`${ui.button} ${styles.browseBtn}`}
                onClick={() => router.push("/for-you")}
              >
                Browse books
              </button>
            </div>
          ) : (
            <>
              {saved.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Saved</h2>

                  <div className={styles.grid}>
                    {saved.map((book) => {
                      const dur = getSavedDurationSeconds(book.id);
                      const prog = getSavedProgressSeconds(book.id);
                      const pct = dur
                        ? Math.min(
                            100,
                            Math.max(0, (prog / Math.max(1, dur)) * 100),
                          )
                        : 0;

                      return (
                        <Link
                          key={book.id}
                          href={`/book/${book.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className={`${styles.card} ${ui.card}`}>
                            <img src={book.imageLink} alt={book.title} />

                            <div className={styles.title}>{book.title}</div>
                            <div className={styles.meta}>{book.author}</div>

                            <div className={styles.progressWrap}>
                              <div
                                className={styles.progressBar}
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            <div className={styles.smallMeta}>
                              {dur
                                ? `${formatTime(Math.max(0, dur - prog))} left`
                                : prog
                                  ? `Saved at ${formatTime(prog)}`
                                  : ""}
                            </div>

                            <div className={styles.actions}>
                              <button
                                className={ui.button}
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push(`/player/${book.id}`);
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {finished.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Finished</h2>

                  <div className={styles.grid}>
                    {finished.map((book) => (
                      <Link
                        key={book.id}
                        href={`/book/${book.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className={`${styles.card} ${ui.card}`}>
                          <img src={book.imageLink} alt={book.title} />

                          <div className={styles.title}>{book.title}</div>
                          <div className={styles.meta}>{book.author}</div>

                          <div className={styles.finishedPill}>Finished ✅</div>

                          <div className={styles.actions}>
                            <button
                              className={ui.button}
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/player/${book.id}`);
                              }}
                            >
                              Re-listen
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

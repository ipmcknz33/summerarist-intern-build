"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import pageStyles from "./ForYouPage.module.css";
import ui from "../../styles/ui.module.css";
import BookCardSkeleton from "../../components/BookCardSkeleton";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

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

export default function ForYouPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const selectedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
        );
        const selectedData = await selectedRes.json();

        const recommendedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
        );
        const recommendedData = await recommendedRes.json();

        const suggestedRes = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
        );
        const suggestedData = await suggestedRes.json();

        const selectedBook =
          selectedData && selectedData.id
            ? selectedData
            : Array.isArray(recommendedData) && recommendedData.length > 0
              ? recommendedData[0]
              : null;

        setSelected(selectedBook);
        setRecommended(Array.isArray(recommendedData) ? recommendedData : []);
        setSuggested(Array.isArray(suggestedData) ? suggestedData : []);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const continueListening = useMemo(() => {
    const all: Book[] = [
      ...(selected ? [selected] : []),
      ...recommended,
      ...suggested,
    ];

    const map = new Map<string, Book>();
    for (const b of all) map.set(b.id, b);

    const unique = Array.from(map.values());

    return unique
      .map((b) => ({ book: b, seconds: getSavedProgressSeconds(b.id) }))
      .filter((x) => x.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 6);
  }, [selected, recommended, suggested]);

  return (
    <div className={ui.page}>
      <div className={`${ui.card} ${ui.pageCard}`}>
        <div className={ui.hero}>
          <h1 className={ui.h1}>For You</h1>
          <p className={ui.muted}>Recommended summaries and books.</p>
        </div>

        <div className={ui.section}>
          {/* Continue Listening */}
          {continueListening.length > 0 && (
            <section className={pageStyles.section}>
              <h2 className={ui.h2}>Continue Listening</h2>

              <div className={`${ui.grid} ${ui.bookGrid}`}>
                {continueListening.map(({ book, seconds }) => {
                  const dur = getSavedDurationSeconds(book.id);
                  const left = dur ? Math.max(0, dur - seconds) : 0;
                  const pct = dur
                    ? Math.min(
                        100,
                        Math.max(0, (seconds / Math.max(dur, 1)) * 100),
                      )
                    : 0;

                  return (
                    <div
                      key={book.id}
                      className={`${pageStyles.card} ${ui.card}`}
                    >
                      <img
                        src={book.imageLink}
                        className={pageStyles.cover}
                        alt={book.title}
                      />

                      <div className={pageStyles.progressWrap}>
                        <div
                          className={pageStyles.progressBar}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className={pageStyles.title}>{book.title}</div>
                      <div className={pageStyles.meta}>{book.author}</div>

                      <div className={pageStyles.meta}>
                        {dur
                          ? `${formatTime(left)} left`
                          : `Saved at ${formatTime(seconds)}`}
                      </div>

                      <button
                        className={ui.button}
                        onClick={() => router.push(`/player/${book.id}`)}
                      >
                        Resume
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Selected Book */}
          {selected && (
            <section className={pageStyles.section}>
              <h2 className={ui.h2}>Selected Book</h2>

              <Link
                href={`/book/${selected.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={`${pageStyles.selected} ${ui.card}`}>
                  <img
                    src={selected.imageLink}
                    className={pageStyles.selectedCover}
                    alt={selected.title}
                  />
                  <div>
                    <p className={pageStyles.selectedTitle}>{selected.title}</p>
                    <div className={pageStyles.selectedMeta}>
                      {selected.author}
                    </div>
                    <div className={pageStyles.selectedMeta}>
                      Tap to view details
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Recommended */}
          <section className={pageStyles.section}>
            <h2 className={ui.h2}>Recommended</h2>

            <div className={`${ui.grid} ${ui.bookGrid}`}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                : recommended.slice(0, 8).map((book) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className={`${pageStyles.card} ${ui.card}`}>
                        <img
                          src={book.imageLink}
                          className={pageStyles.cover}
                          alt={book.title}
                        />
                        <div className={pageStyles.title}>{book.title}</div>
                        <div className={pageStyles.meta}>{book.author}</div>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>

          {/* Suggested */}
          <section className={pageStyles.section}>
            <h2 className={ui.h2}>Suggested</h2>

            <div className={`${ui.grid} ${ui.bookGrid}`}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                : suggested.map((book) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className={`${pageStyles.card} ${ui.card}`}>
                        <img
                          src={book.imageLink}
                          className={pageStyles.cover}
                          alt={book.title}
                        />
                        <div className={pageStyles.title}>{book.title}</div>
                        <div className={pageStyles.meta}>{book.author}</div>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

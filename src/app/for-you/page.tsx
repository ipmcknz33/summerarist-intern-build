"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink?: string;
  bookDescription?: string;
  summary?: string;
  averageRating?: number;
  subscriptionRequired?: boolean;
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.metaIcon}>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7.5V12L15 13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.metaIcon}>
      <path
        d="M12 3.8l2.45 4.97 5.49.8-3.97 3.87.94 5.47L12 16.34 7.09 18.91l.94-5.47-3.97-3.87 5.49-.8L12 3.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.playIcon}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="currentColor" />
    </svg>
  );
}

function getDescription(book: Book) {
  return (
    book.summary ||
    book.bookDescription ||
    "A concise summary of the book’s most useful ideas."
  );
}

function PremiumPill() {
  return (
    <span
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 3,
        background: "#032b41",
        color: "#fff",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "6px 10px",
        borderRadius: "999px",
        lineHeight: 1,
      }}
    >
      Premium
    </span>
  );
}

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchBooks() {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
          ),
        ]);

        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        if (!mounted) return;

        const safeRecommended = Array.isArray(recommendedData)
          ? recommendedData.slice(0, 5)
          : [];
        const safeSuggested = Array.isArray(suggestedData)
          ? suggestedData.slice(0, 5)
          : [];

        const selectedBook =
          selectedData && !Array.isArray(selectedData) && selectedData.id
            ? selectedData
            : safeRecommended[0] ?? null;

        setSelected(selectedBook);
        setRecommended(safeRecommended);
        setSuggested(safeSuggested);
      } catch {
        if (!mounted) return;
        setSelected(null);
        setRecommended([]);
        setSuggested([]);
      }
    }

    fetchBooks();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <section className={styles.selectedSection}>
          <h1 className={styles.selectedSectionTitle}>Selected just for you</h1>

          {selected ? (
            <Link href={`/book/${selected.id}`} className={styles.selectedCard}>
              <div className={styles.selectedLeft}>
                <p className={styles.selectedEyebrow}>Suggested For You</p>
                <h2 className={styles.selectedTitle}>{selected.title}</h2>
                <p className={styles.selectedAuthor}>{selected.author}</p>
              </div>

              <div
                className={styles.selectedCoverWrap}
                style={{ position: "relative" }}
              >
                {selected.subscriptionRequired ? <PremiumPill /> : null}

                {selected.imageLink ? (
                  <img
                    src={selected.imageLink}
                    alt={selected.title}
                    className={styles.selectedCover}
                  />
                ) : (
                  <div className={styles.selectedCoverFallback} />
                )}
              </div>

              <div className={styles.selectedRight}>
                <PlayIcon />
                <span className={styles.selectedDuration}>3 mins 23 secs</span>
              </div>
            </Link>
          ) : null}
        </section>

        <section className={styles.booksSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recommended For You</h2>
            <p className={styles.sectionSubtitle}>We think you&apos;ll like these</p>
          </div>

          <div className={styles.bookGrid}>
            {recommended.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className={styles.bookCard}>
                <div className={styles.coverWrap} style={{ position: "relative" }}>
                  {book.subscriptionRequired ? <PremiumPill /> : null}

                  <div className={styles.coverArc} />
                  {book.imageLink ? (
                    <img
                      src={book.imageLink}
                      alt={book.title}
                      className={styles.cover}
                    />
                  ) : (
                    <div className={styles.coverFallback} />
                  )}
                </div>

                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
                <p className={styles.bookDescription}>{getDescription(book)}</p>

                <div className={styles.bookMeta}>
                  <span className={styles.bookMetaItem}>
                    <ClockIcon />
                    3 mins 23 secs
                  </span>
                  <span className={styles.bookMetaItem}>
                    <StarIcon />
                    {typeof book.averageRating === "number"
                      ? book.averageRating.toFixed(1)
                      : "4.4"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.booksSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Suggested Books</h2>
            <p className={styles.sectionSubtitle}>Browse those books</p>
          </div>

          <div className={styles.bookGrid}>
            {suggested.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className={styles.bookCard}>
                <div className={styles.coverWrap} style={{ position: "relative" }}>
                  {book.subscriptionRequired ? <PremiumPill /> : null}

                  <div className={styles.coverArc} />
                  {book.imageLink ? (
                    <img
                      src={book.imageLink}
                      alt={book.title}
                      className={styles.cover}
                    />
                  ) : (
                    <div className={styles.coverFallback} />
                  )}
                </div>

                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
                <p className={styles.bookDescription}>{getDescription(book)}</p>

                <div className={styles.bookMeta}>
                  <span className={styles.bookMetaItem}>
                    <ClockIcon />
                    3 mins 23 secs
                  </span>
                  <span className={styles.bookMetaItem}>
                    <StarIcon />
                    {typeof book.averageRating === "number"
                      ? book.averageRating.toFixed(1)
                      : "4.4"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
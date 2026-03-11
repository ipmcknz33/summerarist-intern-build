"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { openAuth } from "../../../store/uiSlice";
import { addToLibrary, removeFromLibrary } from "../../../store/librarySlice";
import styles from "./BookPage.module.css";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink?: string;
  bookDescription?: string;
  summary?: string;
  subscriptionRequired?: boolean;
  audioLink?: string;
  duration?: number;
  totalRating?: number;
  averageRating?: number;
  numberOfSubtitles?: number;
  subtitle?: string;
  subTitle?: string;
  authorDescription?: string;
  authorBio?: string;
};

function formatDuration(book: Book) {
  if (typeof book.duration === "number" && Number.isFinite(book.duration)) {
    const totalMinutes = Math.max(1, Math.round(book.duration / 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }

    return `00:${String(mins).padStart(2, "0")}`;
  }

  return "04:52";
}

function formatRating(book: Book) {
  if (
    typeof book.averageRating === "number" &&
    Number.isFinite(book.averageRating)
  ) {
    return book.averageRating.toFixed(1);
  }
  return "4.2";
}

function formatRatingsCount(book: Book) {
  if (
    typeof book.totalRating === "number" &&
    Number.isFinite(book.totalRating)
  ) {
    return `${book.totalRating.toLocaleString()} ratings`;
  }
  return "726 ratings";
}

function formatKeyIdeas(book: Book) {
  if (
    typeof book.numberOfSubtitles === "number" &&
    Number.isFinite(book.numberOfSubtitles)
  ) {
    return `${book.numberOfSubtitles} Key ideas`;
  }
  return "6 Key ideas";
}

function getSubtitle(book: Book) {
  const subtitle = book.subtitle || book.subTitle;
  if (subtitle && subtitle.trim()) return subtitle.trim();
  return "Master Your Mind and Defy the Odds";
}

function getDescription(book: Book) {
  return book.summary?.trim() || book.bookDescription?.trim() || "";
}

function getAuthorText(book: Book) {
  return book.authorDescription?.trim() || book.authorBio?.trim() || "";
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.metaIcon} aria-hidden="true">
      <path
        d="M12 3.7l2.45 4.97 5.49.8-3.97 3.87.94 5.46L12 16.23 7.09 18.8l.94-5.46-3.97-3.87 5.49-.8L12 3.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.metaIcon} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M12 7.5v5l3.2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.metaIcon} aria-hidden="true">
      <path
        d="M12 15.15A3.15 3.15 0 0 0 15.15 12V7.8a3.15 3.15 0 1 0-6.3 0V12A3.15 3.15 0 0 0 12 15.15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M6.95 11.9a5.05 5.05 0 0 0 10.1 0M12 16.95v3.05M9.4 20h5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.metaIcon} aria-hidden="true">
      <path
        d="M12 3.8a6.15 6.15 0 0 0-3.84 10.96c.56.46.92 1.04 1.07 1.72h5.54c.15-.68.51-1.26 1.07-1.72A6.15 6.15 0 0 0 12 3.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.2h4M10.5 20.2h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="9.2" r="0.95" fill="currentColor" />
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.buttonIcon} aria-hidden="true">
      <path
        d="M4.5 6.2c0-.72.58-1.3 1.3-1.3h4.9c1.03 0 2.03.28 2.9.81.87-.53 1.87-.81 2.9-.81h1.7c.72 0 1.3.58 1.3 1.3v11.1c0 .4-.32.72-.72.72h-2.28c-.95 0-1.88.24-2.7.7l-.2.11-.2-.11a5.52 5.52 0 0 0-2.7-.7H5.22a.72.72 0 0 1-.72-.72V6.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5.7v12.55M7.1 8.3h2.8M15.1 8.3h2.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ListenIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.buttonIcon} aria-hidden="true">
      <path
        d="M12 15.15A3.15 3.15 0 0 0 15.15 12V7.8a3.15 3.15 0 1 0-6.3 0V12A3.15 3.15 0 0 0 12 15.15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.95 11.9a5.05 5.05 0 0 0 10.1 0M12 16.95v3.05M9.4 20h5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.libraryIcon} aria-hidden="true">
      <path
        d="M7 4.75h10a.75.75 0 0 1 .75.75v13.55l-5.75-3.2-5.75 3.2V5.5A.75.75 0 0 1 7 4.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isPremium = useSelector((state: RootState) => state.auth.isPremium);
  const libraryItems = useSelector((state: RootState) => state.library.items);

  const id = params.id;

  const isInLibrary = useMemo(
    () => libraryItems.some((item) => item.id === id),
    [libraryItems, id],
  );

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(id)}`,
        );
        const data = await res.json();

        if (!mounted) return;

        setBook({
          ...data,
          subscriptionRequired: data?.subscriptionRequired === true,
        });
      } catch {
        if (!mounted) return;
        setBook(null);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  function requireAuth() {
    if (!user) {
      dispatch(openAuth());
      return true;
    }
    return false;
  }

  function handleOpenPlayer() {
    if (!book) return;
    if (requireAuth()) return;

    const isLockedPremiumBook = book.subscriptionRequired === true;

    if (isLockedPremiumBook && !isPremium) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  }

  function handleLibraryToggle() {
    if (!book) return;
    if (requireAuth()) return;

    if (isInLibrary) {
      dispatch(removeFromLibrary(book.id));
      return;
    }

    dispatch(
      addToLibrary({
        id: book.id,
        title: book.title,
        author: book.author,
        imageLink: book.imageLink ?? "",
      }),
    );
  }

  if (!book) {
    return null;
  }

  const description = getDescription(book);
  const authorText = getAuthorText(book);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.leftColumn}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>{book.author}</p>
          <p className={styles.subtitle}>{getSubtitle(book)}</p>

          <div className={styles.metaWrap}>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <StarIcon />
                <span>
                  {formatRating(book)} ({formatRatingsCount(book)})
                </span>
              </div>

              <div className={styles.metaItem}>
                <ClockIcon />
                <span>{formatDuration(book)}</span>
              </div>

              <div className={styles.metaItem}>
                <MicIcon />
                <span>Audio &amp; Text</span>
              </div>

              <div className={styles.metaItem}>
                <BulbIcon />
                <span>{formatKeyIdeas(book)}</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleOpenPlayer} className={styles.primaryButton}>
              <ReadIcon />
              <span>Read</span>
            </button>

            <button onClick={handleOpenPlayer} className={styles.primaryButton}>
              <ListenIcon />
              <span>Listen</span>
            </button>
          </div>

          <button onClick={handleLibraryToggle} className={styles.libraryLink}>
            <BookmarkIcon />
            <span>
              {isInLibrary
                ? "Remove title from My Library"
                : "Add title to My Library"}
            </span>
          </button>

          {description && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>What&apos;s it about?</h2>
              <p className={styles.bodyText}>{description}</p>
            </section>
          )}

          {authorText && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>About the author</h2>
              <p className={styles.bodyText}>{authorText}</p>
            </section>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.coverDisplay}>
            <div className={styles.coverArch} />
            {book.imageLink ? (
              <img
                src={book.imageLink}
                alt={book.title}
                className={styles.coverImage}
              />
            ) : (
              <div className={styles.coverFallback}>{book.title}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

type SearchBook = {
  id: string;
  title: string;
  author: string;
  imageLink?: string;
  subscriptionRequired?: boolean;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.searchIcon} aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 16l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PremiumPill() {
  return <span className={styles.premiumPill}>Premium</span>;
}

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [results, setResults] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    async function searchBooks() {
      if (!debouncedValue) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            debouncedValue,
          )}`,
        );

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchBooks();
  }, [debouncedValue]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showDropdown = useMemo(() => {
    return open && (loading || value.trim().length > 0);
  }, [loading, open, value]);

  return (
    <div className={styles.searchWrap} ref={wrapRef}>
      <form
        className={styles.searchShell}
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <input
          className={styles.searchInput}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for books"
          aria-label="Search for books"
        />

        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </form>

      {showDropdown ? (
        <div className={styles.resultsDropdown}>
          {loading ? (
            <div className={styles.stateRow}>Searching...</div>
          ) : results.length > 0 ? (
            results.slice(0, 8).map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className={styles.resultItem}
                onClick={() => {
                  setOpen(false);
                  setValue("");
                  setResults([]);
                }}
              >
                <div className={styles.resultImageWrap}>
                  {book.imageLink ? (
                    <img
                      src={book.imageLink}
                      alt={book.title}
                      className={styles.resultImage}
                    />
                  ) : (
                    <div className={styles.resultImageFallback} />
                  )}
                </div>

                <div className={styles.resultText}>
                  <div className={styles.resultTopRow}>
                    <p className={styles.resultTitle}>{book.title}</p>
                    {book.subscriptionRequired ? <PremiumPill /> : null}
                  </div>
                  <p className={styles.resultAuthor}>{book.author}</p>
                </div>
              </Link>
            ))
          ) : debouncedValue ? (
            <div className={styles.stateRow}>No books found.</div>
          ) : (
            <div className={styles.stateRow}>Start typing to search.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

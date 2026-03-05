"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink?: string;
  subscriptionRequired?: boolean;
};

export default function SearchBar() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);

  // Debounce 300ms
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Fetch results
  useEffect(() => {
    const search = debounced;
    if (!search) {
      setResults([]);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    async function run() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            search,
          )}`,
          { signal: ctrl.signal },
        );

        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
        setOpen(true);
      } catch (err) {
        // ignore abort
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => ctrl.abort();
  }, [debounced]);

  function goToBook(id: string) {
    setOpen(false);
    setQ("");
    router.push(`/book/${id}`);
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.inputRow}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          className={styles.input}
          placeholder="Search by title or author…"
        />
        {loading && <div className={styles.spinner} aria-label="Loading" />}
      </div>

      {open && (results.length > 0 || (debounced && !loading)) && (
        <div className={styles.dropdown}>
          {results.length === 0 && !loading ? (
            <div className={styles.empty}>No results for “{debounced}”</div>
          ) : (
            results.map((b) => (
              <button
                key={b.id}
                type="button"
                className={styles.item}
                onClick={() => goToBook(b.id)}
              >
                <div className={styles.left}>
                  {b.imageLink ? (
                    <img className={styles.cover} src={b.imageLink} alt="" />
                  ) : (
                    <div className={styles.coverFallback} />
                  )}
                </div>

                <div className={styles.mid}>
                  <div className={styles.titleRow}>
                    <span className={styles.title}>{b.title}</span>
                    {b.subscriptionRequired && (
                      <span className={styles.pill}>Premium</span>
                    )}
                  </div>
                  <div className={styles.meta}>{b.author}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
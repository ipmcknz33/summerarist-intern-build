"use client";

import { useEffect, useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink?: string;
};

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            query
          )}`
        );
        const data = (await res.json()) as Book[];
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => window.clearTimeout(t);
  }, [q]);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, padding: "12px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or author..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            outline: "none",
            fontSize: 14,
            background: "#fff",
          }}
        />

        {open && results.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
            }}
          >
            {results.slice(0, 8).map((b) => (
              <a
                key={b.id}
                href={`/book/${b.id}`}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  textDecoration: "none",
                  color: "#111",
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontWeight: 700 }}>{b.title}</div>
                <div style={{ fontSize: 13, opacity: 0.75 }}>{b.author}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
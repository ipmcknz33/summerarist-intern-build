"use client";

import { useEffect, useState } from "react";
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
  imageLink: string;
  bookDescription?: string;
  summary?: string;
  subscriptionRequired?: boolean;
  audioLink?: string;
  type?: string;
};

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isPremium = useSelector((state: RootState) => state.auth.isPremium);
  const libraryItems = useSelector((state: RootState) => state.library.items);

  const id = params.id;
  const isInLibrary = libraryItems.some((b) => b.id === id);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(id)}`,
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        if (!text) throw new Error("Empty response body");

        const data = JSON.parse(text) as Book;

        if (alive) setBook(data);
      } catch (err) {
        console.error("Failed to load book", err);
        if (alive) setBook(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchBook();
    return () => {
      alive = false;
    };
  }, [id]);

  function handleStart() {
    // must have loaded
    if (!book) return;

    // not logged in -> auth modal
    if (!user) {
      dispatch(openAuth());
      return;
    }

    // premium gate -> send to choose-plan with "next"
    if (book.subscriptionRequired === true && !isPremium) {
      router.replace(`/choose-plan?next=/player/${id}`);
      return;
    }

    // allowed -> player
    router.push(`/player/${id}`);
  }

  function handleAddToLibrary() {
    if (!user) {
      dispatch(openAuth());
      return;
    }
    if (!book) return;

    if (isInLibrary) {
      dispatch(removeFromLibrary(book.id));
      return;
    }

    dispatch(
      addToLibrary({
        id: book.id,
        title: book.title,
        author: book.author,
        imageLink: book.imageLink,
      }),
    );
  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!book) {
    return <div className={styles.container}>Book not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.coverWrapper}>
          <img src={book.imageLink} alt={book.title} className={styles.cover} />
          {book.subscriptionRequired && (
            <div className={styles.premiumPill}>Premium</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{book.title}</h1>
          <div className={styles.author}>{book.author}</div>

          <p className={styles.description}>
            {book.bookDescription ?? book.summary}
          </p>

          <div className={styles.buttons}>
            <button onClick={handleStart} className={styles.primaryButton}>
              Read / Listen
            </button>

            <button
              onClick={handleAddToLibrary}
              className={styles.secondaryButton}
            >
              {isInLibrary ? "Remove from Library" : "Add to My Library"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

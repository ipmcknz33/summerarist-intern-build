"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import ui from "../../styles/ui.module.css";
import styles from "./LoginPage.module.css";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { setUser } from "../../store/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useDispatch();

  const returnTo = search.get("returnTo") || "/for-you";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      dispatch(
        setUser({
          uid: cred.user.uid,
          email: cred.user.email,
        }),
      );

      router.replace(returnTo);
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGuestLogin() {
    setError("");
    setSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        "guest@gmail.com",
        "guest123",
      );

      dispatch(
        setUser({
          uid: cred.user.uid,
          email: cred.user.email,
        }),
      );

      router.replace("/for-you");
    } catch (err: any) {
      setError(err?.message || "Guest login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={`${ui.card} ${ui.pageCard}`}>
        <div className={ui.hero}>
          <h1 className={ui.h1}>Sign in</h1>
          <p className={ui.muted}>
            Log in to save books, sync your Library, and continue listening.
          </p>
        </div>

        <div className={ui.section}>
          <div className={styles.formWrap}>
            <form className={styles.form} onSubmit={onSubmit}>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
              />

              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              {error && <div className={styles.error}>{error}</div>}

              <button className={ui.button} type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* ✅ Guest login as its own row so it’s always visible */}
            <div className={styles.guestRow}>
              <button
                type="button"
                className={ui.button}
                onClick={handleGuestLogin}
                disabled={submitting}
              >
                Continue as Guest
              </button>
            </div>

            <div className={styles.help}>
              Don’t have an account?{" "}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => router.push("/signup")}
              >
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

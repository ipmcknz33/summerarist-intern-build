"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import LoadingScreen from "../../components/LoadingScreen";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";

export default function SignupPage() {
  const router = useRouter();
  const { user, status } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (user) router.replace("/library");
  }, [user, status, router]);

  if (status === "loading") return <LoadingScreen label="Checking session..." />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/library");
    } catch (err: any) {
      setError(toAuthErrorMessage(err?.code, err?.message));
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 360 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Sign up</h1>

        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          required
          style={{ width: "100%", padding: 12, marginBottom: 12 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          required
          style={{ width: "100%", padding: 12, marginBottom: 12 }}
        />

        {error && (
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.06)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: 12, cursor: submitting ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <div style={{ marginTop: 12, fontSize: 14, opacity: 0.8 }}>
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "underline" }}>
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}

function toAuthErrorMessage(code?: string, fallback?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already in use. Try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return fallback || "Something went wrong. Please try again.";
  }
}
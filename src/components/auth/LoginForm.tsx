"use client";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label style={{ display: "block", marginBottom: 6 }}>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      <label style={{ display: "block", marginBottom: 6 }}>Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      {error && <div style={{ marginBottom: 12 }}>{error}</div>}

      <button type="submit" disabled={submitting} style={{ width: "100%", padding: 12 }}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
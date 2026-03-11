"use client";

import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="signup-email" style={labelStyle}>
          Email
        </label>
        <input
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="signup-password" style={labelStyle}>
          Password
        </label>
        <input
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="new-password"
          placeholder="Create a password"
          style={inputStyle}
        />
      </div>

      {error ? <div style={errorStyle}>{error}</div> : null}

      <button type="submit" disabled={submitting} style={submitButtonStyle(submitting)}>
        {submitting ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  color: "#032b41",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.2,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  borderRadius: 12,
  border: "1px solid #d7dde3",
  background: "#ffffff",
  padding: "0 14px",
  outline: "none",
  color: "#032b41",
  fontSize: 14,
  fontWeight: 500,
};

const errorStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  background: "#fff4f4",
  border: "1px solid #f2c7c7",
  color: "#9b1c1c",
  fontSize: 14,
  lineHeight: 1.5,
};

const submitButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%",
  height: 48,
  border: 0,
  borderRadius: 12,
  background: "#032b41",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.65 : 1,
});
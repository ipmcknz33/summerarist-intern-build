"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { RootState } from "../../store/store";
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
    if (user) router.replace("/for-you");
  }, [user, status, router]);

  if (status === "loading") {
    return <div style={loadingStyle}>Checking session...</div>;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/for-you");
    } catch (err: any) {
      setError(toAuthErrorMessage(err?.code, err?.message));
      setSubmitting(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={heroStyle}>
          <p style={eyebrowStyle}>Get started</p>
          <h1 style={titleStyle}>Create your account</h1>
          <p style={subtitleStyle}>
            Join Summarist to save your library, track your listening progress,
            and unlock premium summaries.
          </p>
        </div>

        <div style={contentStyle}>
          <form onSubmit={onSubmit} style={formStyle}>
            <div style={fieldStyle}>
              <label htmlFor="signup-email" style={labelStyle}>
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="signup-password" style={labelStyle}>
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                required
                style={inputStyle}
              />
            </div>

            {error ? <div style={errorStyle}>{error}</div> : null}

            <button type="submit" disabled={submitting} style={primaryButtonStyle(submitting)}>
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={footerTextStyle}>
            Already have an account?{" "}
            <Link href="/login" style={linkStyle}>
              Log in
            </Link>
          </p>
        </div>
      </div>
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

const loadingStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "#f7f8fa",
  color: "#032b41",
  fontSize: 15,
  fontWeight: 600,
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "#f7f8fa",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 560,
  background: "#ffffff",
  border: "1px solid #e7edf2",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(3, 43, 65, 0.06)",
};

const heroStyle: React.CSSProperties = {
  padding: 28,
  borderBottom: "1px solid #e7edf2",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: "#116be9",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.2,
};

const titleStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#032b41",
  fontSize: 34,
  fontWeight: 700,
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  margin: "14px 0 0",
  color: "#5b6b73",
  fontSize: 15,
  lineHeight: 1.6,
};

const contentStyle: React.CSSProperties = {
  padding: 28,
};

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

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
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

const footerTextStyle: React.CSSProperties = {
  margin: "18px 0 0",
  color: "#5b6b73",
  fontSize: 14,
  lineHeight: 1.5,
  textAlign: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#116be9",
  fontWeight: 700,
  textDecoration: "none",
};
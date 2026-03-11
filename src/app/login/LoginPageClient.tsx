"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { setUser } from "../../store/authSlice";

export default function LoginPageClient() {
  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useDispatch();

  const returnTo = search.get("returnTo") || "/for-you";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      setSubmitting(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={heroStyle}>
          <p style={eyebrowStyle}>Welcome back</p>
          <h1 style={titleStyle}>Log in to Summarist</h1>
          <p style={subtitleStyle}>
            Continue learning with your saved library, audio progress, and
            premium summaries.
          </p>
        </div>

        <div style={contentStyle}>
          <form onSubmit={onSubmit} style={formStyle}>
            <div style={fieldStyle}>
              <label htmlFor="login-email" style={labelStyle}>
                Email
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" style={labelStyle}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                style={inputStyle}
              />
            </div>

            {error ? <div style={errorStyle}>{error}</div> : null}

            <button
              type="submit"
              disabled={submitting}
              style={primaryButtonStyle(submitting)}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={dividerRowStyle}>
            <span style={dividerStyle} />
            <span style={dividerTextStyle}>or</span>
            <span style={dividerStyle} />
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={submitting}
            style={secondaryButtonStyle(submitting)}
          >
            {submitting ? "Please wait..." : "Continue as Guest"}
          </button>

          <p style={footerTextStyle}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={linkStyle}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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

const secondaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%",
  height: 48,
  border: "1px solid #d7dde3",
  borderRadius: 12,
  background: "#ffffff",
  color: "#032b41",
  fontSize: 14,
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.65 : 1,
});

const dividerRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  margin: "18px 0",
};

const dividerStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "#e7edf2",
};

const dividerTextStyle: React.CSSProperties = {
  color: "#7b8891",
  fontSize: 13,
  fontWeight: 600,
};

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

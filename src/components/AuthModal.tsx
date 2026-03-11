"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { auth } from "../firebase/auth";
import { closeAuth, openSignup } from "../store/uiSlice";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.ui.isAuthOpen);
  console.log("AUTH MODAL STATE:", isOpen);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleClose() {
    dispatch(closeAuth());
    setError(null);
    setGuestLoading(false);
    setSubmitting(false);
  }

  async function handleGuestLogin() {
    setGuestLoading(true);
    setSubmitting(false);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
      handleClose();
      router.push("/for-you");
    } catch {
      setError(
        "Guest login failed. Create guest@gmail.com in Firebase with password guest123.",
      );
      setGuestLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setGuestLoading(false);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleClose();
      router.push("/for-you");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleClose}
          style={closeButtonStyle}
          aria-label="Close"
        >
          ×
        </button>

        <h2 style={titleStyle}>Log in to Summarist</h2>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={guestLoading || submitting}
          style={guestButtonStyle(guestLoading || submitting)}
        >
          <span style={guestIconBoxStyle}>
            <span style={guestIconCircleStyle} />
            <span style={guestIconBodyStyle} />
          </span>
          <span style={guestButtonTextStyle}>
            {guestLoading ? "Logging in..." : "Login as a Guest"}
          </span>
        </button>

        <div style={dividerRowStyle}>
          <span style={dividerLineStyle} />
          <span style={dividerTextStyle}>or</span>
          <span style={dividerLineStyle} />
        </div>

        <button type="button" style={googleButtonStyle}>
          <span style={googleIconWrapStyle}>
            <span style={googleGStyle}>G</span>
          </span>
          <span style={googleTextStyle}>Login with Google</span>
        </button>

        <div style={dividerRowStyle}>
          <span style={dividerLineStyle} />
          <span style={dividerTextStyle}>or</span>
          <span style={dividerLineStyle} />
        </div>

        <form onSubmit={handleEmailLogin} style={formStyle}>
          <input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={submitting || guestLoading}
            style={loginButtonStyle(submitting || guestLoading)}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <button type="button" style={forgotStyle}>
          Forgot your password?
        </button>

        {error ? <div style={errorStyle}>{error}</div> : null}

        <div style={bottomBarStyle}>
          <button
            type="button"
            onClick={() => dispatch(openSignup())}
            style={signupLinkStyle}
          >
            Don&apos;t have an account?
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(0, 0, 0, 0.55)",
  display: "grid",
  placeItems: "center",
  padding: 16,
};

const modalStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 360,
  background: "#ffffff",
  borderRadius: 4,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  padding: "26px 26px 0",
  overflow: "hidden",
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 12,
  border: "none",
  background: "transparent",
  color: "#111111",
  fontSize: 22,
  lineHeight: 1,
  cursor: "pointer",
  padding: 0,
};

const titleStyle: React.CSSProperties = {
  margin: "12px 0 22px",
  textAlign: "center",
  color: "#15354a",
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.2,
};

const guestButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%",
  height: 39,
  border: "none",
  borderRadius: 2,
  background: "#4a63ad",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.7 : 1,
});

const guestIconBoxStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  position: "relative",
  marginRight: 10,
  flexShrink: 0,
};

const guestIconCircleStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 4,
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "#ffffff",
};

const guestIconBodyStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 1,
  width: 16,
  height: 9,
  borderRadius: "8px 8px 2px 2px",
  background: "#ffffff",
};

const guestButtonTextStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 500,
  transform: "translateX(-10px)",
};

const dividerRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  margin: "14px 0",
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: "#cfd5da",
};

const dividerTextStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: 12,
  lineHeight: 1,
};

const googleButtonStyle: React.CSSProperties = {
  width: "100%",
  height: 39,
  border: "none",
  borderRadius: 2,
  background: "#4d8bf7",
  display: "flex",
  alignItems: "center",
  padding: "0 10px",
  cursor: "pointer",
};

const googleIconWrapStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 2,
  background: "#ffffff",
  display: "grid",
  placeItems: "center",
  marginLeft: 4,
  flexShrink: 0,
};

const googleGStyle: React.CSSProperties = {
  color: "#4285f4",
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const googleTextStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 500,
  transform: "translateX(-18px)",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  border: "1px solid #bfc7cc",
  borderRadius: 2,
  padding: "0 11px",
  fontSize: 12,
  color: "#222222",
  outline: "none",
};

const loginButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%",
  height: 32,
  border: "none",
  borderRadius: 2,
  background: "#2ecc71",
  color: "#08321a",
  fontSize: 12,
  fontWeight: 500,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.7 : 1,
});

const forgotStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#4d8bf7",
  fontSize: 11,
  padding: "16px 0 12px",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 10,
  color: "#b42318",
  fontSize: 11,
  textAlign: "center",
  lineHeight: 1.35,
};

const bottomBarStyle: React.CSSProperties = {
  margin: "0 -26px",
  background: "#eceff0",
  borderTop: "1px solid #e2e6e8",
  textAlign: "center",
  padding: "11px 12px",
};

const signupLinkStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#4d8bf7",
  fontSize: 11,
  cursor: "pointer",
  padding: 0,
};

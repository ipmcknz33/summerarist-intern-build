"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { closeAuth } from "../store/uiSlice";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();

  const isOpen = useSelector((state: RootState) => state.ui.isAuthOpen);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  if (!isOpen) return null;

  const onSuccess = () => {
    dispatch(closeAuth());
    router.push("/for-you");
  };

  async function guestLogin() {
    setGuestLoading(true);
    setGuestError(null);

    try {
      await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
      onSuccess();
    } catch (err) {
      setGuestError(
        "Guest login failed. Create guest@gmail.com in Firebase (password: guest123).",
      );
      setGuestLoading(false);
    }
  }

  return (
    <div
      onClick={() => dispatch(closeAuth())}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{tab === "login" ? "Login" : "Sign up"}</h3>
          <button
            onClick={() => dispatch(closeAuth())}
            style={{ cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => setTab("login")}
            style={tabButtonStyle(tab === "login")}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            style={tabButtonStyle(tab === "signup")}
          >
            Sign up
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={guestLogin}
            disabled={guestLoading}
            style={guestButtonStyle(guestLoading)}
          >
            {guestLoading ? "Guest..." : "Guest"}
          </button>
        </div>

        {guestError && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: "rgba(0,0,0,0.06)",
            }}
          >
            {guestError}
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          {tab === "login" ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <SignupForm onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.14)",
  background: active ? "rgba(0,0,0,0.06)" : "transparent",
  cursor: "pointer",
});

const guestButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.14)",
  background: "transparent",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

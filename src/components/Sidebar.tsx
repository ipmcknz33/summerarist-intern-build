"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { openAuth } from "../store/uiSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, status } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleLogin = () => {
    dispatch(openAuth());
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.logo}>Summarist</h2>

      <div className={styles.session}>
        {status === "loading" ? (
          <div className={styles.muted}>Checking session…</div>
        ) : user ? (
          <>
            <div className={styles.small}>Signed in as:</div>
            <div className={styles.email}>{user.email}</div>
            <button className={styles.smallBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className={styles.smallBtn} onClick={handleLogin}>
            Login
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/for-you">For You</Link>
        <Link href="/library">Library</Link>
        <Link href="/choose-plan">Choose Plan</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </div>
  );
}
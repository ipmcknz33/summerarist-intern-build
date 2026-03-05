"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import Sidebar from "./Sidebar";
import styles from "./AppFrame.module.css";

const PUBLIC_ROUTES = new Set(["/login", "/signup"]);

export default function AppFrame({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, status } = useSelector((state: RootState) => state.auth);

  const isPublic = PUBLIC_ROUTES.has(pathname);
  const showSidebar = !!user && !isPublic && pathname !== "/choose-plan";

  // Auth gate
  useEffect(() => {
    if (status !== "ready") return;

    // If logged out: force landing to /login and block everything else
    if (!user) {
      if (pathname !== "/login" && pathname !== "/signup") {
        router.replace("/login");
      }
      return;
    }

    // If logged in, keep them out of login/signup pages
    if (user && isPublic) {
      router.replace("/for-you");
    }
  }, [status, user, pathname, router, isPublic]);

  // While checking auth, render nothing (prevents flash of protected pages)
  if (status !== "ready") return null;

  // If logged out, only allow login/signup pages
  if (!user && !isPublic) return null;

  // Layout: sidebar only when logged in (and not on /choose-plan)
  return (
    <div className={styles.root}>
      {showSidebar && (
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      )}

      <main className={showSidebar ? styles.main : styles.mainFull}>
        {children}
      </main>
    </div>
  );
}

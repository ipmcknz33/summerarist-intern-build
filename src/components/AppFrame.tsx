"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import Sidebar from "./Sidebar";
import SearchBar from "@/components/SearchBar";
import styles from "./AppFrame.module.css";

const PUBLIC_ROUTES = new Set(["/login", "/signup"]);

export default function AppFrame({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, status } = useSelector((state: RootState) => state.auth);

  const isPublic = PUBLIC_ROUTES.has(pathname);
  const showSidebar = !!user && !isPublic && pathname !== "/choose-plan";
  const showSearch = !!user && !isPublic && pathname !== "/choose-plan";

  useEffect(() => {
    if (status !== "ready") return;

    if (!user) {
      if (!isPublic) router.replace("/login");
      return;
    }

    if (isPublic) router.replace("/for-you");
  }, [status, user, isPublic, router]);

  if (status !== "ready") return null;
  if (!user && !isPublic) return null;

  return (
    <div className={styles.root}>
      {showSidebar && (
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      )}

      <main className={styles.main}>
        {showSearch ? <SearchBar /> : null}
        <div>{children}</div>
      </main>
    </div>
  );
}
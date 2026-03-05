"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import styles from "../app/layout.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

 
  const hideShell = pathname === "/" || pathname?.startsWith("/choose-plan");

  if (hideShell) {
    return <main className={styles.mainSolo}>{children}</main>;
  }

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <div className={styles.content}>
        <div className={styles.topbar}>
          <SearchBar />
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

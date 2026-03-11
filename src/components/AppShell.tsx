"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import styles from "./AppShell.module.css";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();

  const hideShell = pathname === "/" || pathname === "/choose-plan";

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className={styles.appShell}>
      <Sidebar />

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.searchWrap}>
            <SearchBar />
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

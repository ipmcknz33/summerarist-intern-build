"use client";

import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import styles from "./AppFrame.module.css";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSearch =
    pathname === "/" || pathname === "/choose-plan" || pathname === "/login";

  return (
    <div className={styles.container}>
      {!hideSearch && <SearchBar />}

      <div className={styles.content}>{children}</div>
    </div>
  );
}

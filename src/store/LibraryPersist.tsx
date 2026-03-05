"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { hydrateLibrary } from "./librarySlice";

const STORAGE_KEY = "summarist_library";

export default function LibraryPersist() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.library.items);

  const [hydrated, setHydrated] = useState(false);

  // 1) Hydrate once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch(hydrateLibrary(parsed));
      }
    } catch {
      // ignore bad storage
    } finally {
      setHydrated(true);
    }
  }, [dispatch]);

  // 2) Persist only AFTER hydration is done
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage write errors
    }
  }, [items, hydrated]);

  return null;
}
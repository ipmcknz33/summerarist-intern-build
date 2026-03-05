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

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch(hydrateLibrary(parsed));
      }
    } catch {
      
    } finally {
      setHydrated(true);
    }
  }, [dispatch]);

 
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      
    }
  }, [items, hydrated]);

  return null;
}
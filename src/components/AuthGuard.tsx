"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { openAuth } from "@/store/uiSlice";

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.user;
  const status = authState.status;

  const isProtectedRoute =
    pathname === "/for-you" ||
    pathname === "/library" ||
    pathname === "/settings" ||
    pathname === "/choose-plan" ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/player/");

  useEffect(() => {
    if (status === "loading") return;

    if (isProtectedRoute && !user) {
      router.replace("/");
      dispatch(openAuth());
    }
  }, [dispatch, isProtectedRoute, router, status, user]);

  if (isProtectedRoute && status === "loading") {
    return null;
  }

  if (isProtectedRoute && !user) {
    return null;
  }

  return <>{children}</>;
}
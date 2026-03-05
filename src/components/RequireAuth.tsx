"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoadingScreen from "./LoadingScreen";
import type { RootState } from "../store/store";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "loading") return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [user, status, router, pathname]);

  if (status === "loading") return <LoadingScreen label="Checking session..." />;
  if (!user) return <LoadingScreen label="Redirecting..." />;

  return <>{children}</>;
}
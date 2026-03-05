"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit() {
    const query = q.trim();
    if (!query) return;

    router.push(`/library?query=${encodeURIComponent(query)}`);
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "12px 16px",
        background: "rgba(243,244,246,0.9)", 
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Search books..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            outline: "none",
            fontSize: 14,
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
}
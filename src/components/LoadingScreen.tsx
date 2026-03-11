"use client";

export default function LoadingScreen({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div style={wrap}>
      <div style={spinner} />
      <p style={text}>{label}</p>
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  gap: 12,
  padding: 24,
  background: "#f7f8fa",
};

const spinner: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "4px solid rgba(3,43,65,0.15)",
  borderTopColor: "#032b41",
  animation: "spin 0.9s linear infinite",
};

const text: React.CSSProperties = {
  margin: 0,
  color: "#032b41",
  fontSize: 14,
  fontWeight: 600,
};
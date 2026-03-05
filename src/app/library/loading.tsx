export default function Loading() {
  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>Loading books...</h2>

      {[1,2,3,4].map((i) => (
        <div
          key={i}
          style={{
            height: "80px",
            marginBottom: "16px",
            borderRadius: "12px",
            background: "#e5e7eb",
            animation: "pulse 1.5s infinite",
          }}
        />
      ))}
    </div>
  );
}
"use client";

export default function LoadingScreen({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="loadingScreen" role="status" aria-live="polite">
      <div className="spinner" aria-label={label} />
      <div className="label">{label}</div>

      <style jsx>{`
        .loadingScreen {
          min-height: 100vh;
          display: grid;
          place-items: center;
          gap: 12px;
          padding: 24px;
          background: transparent;
          color: rgba(0, 0, 0, 0.8);
        }
        .spinner {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 4px solid rgba(0, 0, 0, 0.12);
          border-top-color: rgba(0, 0, 0, 0.75);
          animation: spin 0.9s linear infinite;
        }
        .label {
          font-size: 14px;
          opacity: 0.75;
          letter-spacing: 0.2px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-color-scheme: dark) {
          .loadingScreen {
            color: rgba(255, 255, 255, 0.85);
          }
          .spinner {
            border-color: rgba(255, 255, 255, 0.18);
            border-top-color: rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </div>
  );
}
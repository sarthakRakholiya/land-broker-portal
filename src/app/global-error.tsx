"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
            Something went wrong!
          </h1>
          <p style={{ marginBottom: "24px", color: "#666" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              backgroundColor: "#000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

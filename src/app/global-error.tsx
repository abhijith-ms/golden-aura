"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#faf7f0",
          color: "#1b1b1b",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: 700, margin: "10vh auto", padding: 32 }}>
          <h1>This page couldn’t load.</h1>
          <p>Please try again, or contact Golden Aura Trust directly.</p>
          <button
            onClick={reset}
            style={{
              padding: "14px 24px",
              border: 0,
              borderRadius: 999,
              background: "#111312",
              color: "#faf7f0",
              marginRight: 24,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a href="mailto:auragolden4@gmail.com">auragolden4@gmail.com</a>
        </main>
      </body>
    </html>
  );
}

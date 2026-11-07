"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/reportError";

// Last line of defence: this replaces the root layout, so it carries its own <html> and its own styles.
// It is what a person sees instead of a dead white "Application error" page.
export default function GlobalError({ error, reset }) {
  useEffect(() => { reportError("global", error); }, [error]);
  const wrap = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#f4f6fa", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", color: "#0f172a" };
  const card = { width: "100%", maxWidth: "420px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "28px 22px", textAlign: "center", boxShadow: "0 1px 2px rgba(15,23,42,.06)" };
  const primary = { display: "inline-block", margin: "4px", padding: "11px 20px", borderRadius: "999px", border: 0, background: "#0f4bd6", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" };
  const ghost = { display: "inline-block", margin: "4px", padding: "11px 20px", borderRadius: "999px", border: "1px solid #e2e8f0", background: "#fff", color: "#334155", fontSize: "14px", fontWeight: 700, cursor: "pointer" };
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div style={wrap}>
          <div style={card}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: ".18em", color: "#D6006F", textTransform: "uppercase" }}>Surya&apos;s Solar</div>
            <h1 style={{ margin: "14px 0 6px", fontSize: "20px" }}>The app could not open</h1>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "#475569" }}>
              Something broke while loading. Your data is safe - tap below to open the app again.
            </p>
            <div style={{ marginTop: "18px" }}>
              <button style={primary} onClick={() => reset()}>Try again</button>
              <button style={ghost} onClick={() => window.location.reload()}>Reload the app</button>
            </div>
            {error?.message ? (
              <pre style={{ marginTop: "16px", maxHeight: "140px", overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", textAlign: "left", background: "#f8fafc", borderRadius: "10px", padding: "10px", fontSize: "11px", color: "#64748b" }}>
                {String(error.message)}
              </pre>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}

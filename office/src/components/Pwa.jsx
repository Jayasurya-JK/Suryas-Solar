"use client";

import { useEffect } from "react";

// Registers the service worker. Kept in its own client component so the root layout stays a server
// component. Registration is silent: if the browser refuses, nothing about the app changes.
export default function Pwa() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost") return;
    const timer = setTimeout(() => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {}), 1200);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

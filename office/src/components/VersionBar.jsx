"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";

// An installed app never reloads by itself, so it can quietly run week-old code. This asks the server which
// deployment is live and offers a reload when the answer changes.
export default function VersionBar() {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let first = null;
    let done = false;

    const check = async () => {
      if (done) return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const data = await res.json();
        const v = data?.v;
        if (!v) return;
        if (first === null) first = v;
        else if (v !== first) { done = true; setStale(true); }
      } catch {}
    };

    check();
    const timer = setInterval(check, 10 * 60 * 1000);
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      done = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!stale) return null;

  return (
    <div className="no-print fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-xl lg:bottom-6">
      <Icon name="info" className="h-5 w-5 shrink-0 text-white/70" />
      <p className="min-w-0 flex-1 text-[13px] font-semibold leading-snug">A new version is ready.</p>
      <button onClick={() => window.location.reload()} className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-slate-900">
        Reload
      </button>
    </div>
  );
}

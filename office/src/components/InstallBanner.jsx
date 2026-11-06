"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { canInstall, isIos, isStandalone, promptInstall, subscribeInstall } from "@/lib/install";

const DISMISSED = "so-install-dismissed";

// A one-line prompt to put the app on the phone's home screen. Chrome fires the install event; iOS shows
// the Share instructions instead because Safari has no equivalent.
export default function InstallBanner() {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIos());
    try {
      if (isStandalone() || localStorage.getItem(DISMISSED) === "1") return;
    } catch {}
    setHidden(false);
    setReady(canInstall());
    return subscribeInstall(() => setReady(canInstall()));
  }, []);

  if (hidden) return null;
  if (!ready && !ios) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISSED, "1"); } catch {}
    setHidden(true);
  };

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary-50 px-3.5 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
        <Icon name="download" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Install on this phone</p>
        <p className="text-xs text-slate-600">
          {ios ? "Tap Share at the bottom, then Add to Home Screen." : "Opens full screen, no browser bar."}
        </p>
      </div>
      {!ios && (
        <button className="btn-primary !h-9 shrink-0 !px-3.5" onClick={async () => { if (await promptInstall()) dismiss(); }}>
          Install
        </button>
      )}
      <button onClick={dismiss} aria-label="Not now" className="shrink-0 rounded-full p-1.5 text-slate-500 hover:bg-white">
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  );
}

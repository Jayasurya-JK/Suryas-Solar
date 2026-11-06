"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { canInstall, isAndroid, isHandheld, isIos, isStandalone, promptInstall, subscribeInstall } from "@/lib/install";

const DISMISSED = "so-install-dismissed";

export function InstallSteps({ android }) {
  const steps = android
    ? [
        "Open this page in Chrome - not the browser inside WhatsApp, Instagram or Gmail.",
        "Tap the three dots at the top right of Chrome.",
        'Choose "Install app". Older Chrome says "Add to Home screen".',
        "Already have a Surya's Solar icon on your home screen? Delete it first, reload, then install again - Chrome will not offer it twice.",
      ]
    : [
        "Open this page in Safari.",
        "Tap the Share button (the square with an arrow pointing up).",
        'Scroll down and tap "Add to Home Screen".',
      ];
  return (
    <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-600">
      {steps.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary">{i + 1}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

// A strip at the top of the app offering the one-tap install, and - when Chrome will not offer it - the exact
// steps. The button alone is not enough: Chrome fires its install event once and stays quiet until a reload.
export default function InstallBanner() {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [handheld, setHandheld] = useState(false);
  const [android, setAndroid] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    setHandheld(isHandheld());
    setAndroid(isAndroid());
    try {
      if (isStandalone() || localStorage.getItem(DISMISSED) === "1") return;
    } catch {}
    setHidden(false);
    setReady(canInstall());
    return subscribeInstall(() => setReady(canInstall()));
  }, []);

  if (hidden || !handheld) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISSED, "1"); } catch {}
    setHidden(true);
  };

  return (
    <div className="mb-4 rounded-2xl border border-primary/25 bg-primary-50 px-3.5 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
          <Icon name="download" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Install on this phone</p>
          <p className="text-xs text-slate-600">
            {ready ? "Opens full screen, no browser bar." : "Two taps - tap How for the steps."}
          </p>
        </div>
        {ready ? (
          <button className="btn-primary !h-9 shrink-0 !px-3.5" onClick={async () => { if (await promptInstall()) dismiss(); }}>
            Install
          </button>
        ) : (
          <button className="btn-ghost !h-9 shrink-0 !px-3.5" onClick={() => setShowSteps((v) => !v)}>
            {showSteps ? "Hide" : "How"}
          </button>
        )}
        <button onClick={dismiss} aria-label="Not now" className="shrink-0 rounded-full p-1.5 text-slate-500 hover:bg-white">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
      {(showSteps || (isIos() && !ready)) && <InstallSteps android={android} />}
    </div>
  );
}

// The same help as a card, for the profile page, so it is still findable after the strip is dismissed.
export function InstallCard() {
  const [state, setState] = useState({ ready: false, handheld: false, android: false, installed: false });

  useEffect(() => {
    const sync = () => setState({ ready: canInstall(), handheld: isHandheld(), android: isAndroid(), installed: isStandalone() });
    sync();
    return subscribeInstall(sync);
  }, []);

  if (!state.handheld) return null;

  return (
    <section className="card p-5">
      <h2 className="font-bold text-slate-900">Install on this phone</h2>
      {state.installed ? (
        <p className="mt-1 text-sm text-slate-600">This is already the installed app. Nothing more to do.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate-600">Put Surya&apos;s Solar Office on your home screen - it opens full screen, like a normal app.</p>
          {state.ready && (
            <button className="btn-primary mt-3" onClick={() => promptInstall()}>
              <Icon name="download" className="h-4 w-4" />Install app
            </button>
          )}
          <InstallSteps android={state.android} />
        </>
      )}
    </section>
  );
}

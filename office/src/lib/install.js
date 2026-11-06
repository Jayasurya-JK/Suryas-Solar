// "Add to home screen" helpers.
//
// Chrome on Android fires `beforeinstallprompt` once per page load and the event can only be used once. It
// also stays quiet after a dismissal until the page reloads, and it fires not at all when Chrome already
// considers the site installed. So the UI must never depend on this event alone - the written steps in
// InstallBanner are the reliable path; this only makes the one-tap button work when it can.

let deferred = null;
let spent = false;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    spent = false;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    spent = true;
    notify();
  });
}

export function subscribeInstall(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const canInstall = () => !!deferred && !spent;

export async function promptInstall() {
  if (!deferred || spent) return false;
  const event = deferred;
  spent = true;
  event.prompt();
  const choice = await event.userChoice.catch(() => ({ outcome: "dismissed" }));
  deferred = null;
  notify();
  return choice?.outcome === "accepted";
}

export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);

export const isIos = () =>
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

export const isAndroid = () =>
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

// Phones and tablets - anything that can put an icon on a home screen. Not desktops.
export const isHandheld = () =>
  isIos() || isAndroid() || (typeof navigator !== "undefined" && navigator.maxTouchPoints > 1);

// "Add to home screen" helpers.
//
// Chrome on Android fires `beforeinstallprompt` when the app can be installed. We hold on to that event so
// our own Install button can trigger it later (the event fires long before the button is tapped).
// iOS Safari never fires it - there the person uses Share > Add to Home Screen.

let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export function subscribeInstall(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const canInstall = () => !!deferred;

export async function promptInstall() {
  if (!deferred) return false;
  const event = deferred;
  deferred = null;
  event.prompt();
  const choice = await event.userChoice.catch(() => ({ outcome: "dismissed" }));
  notify();
  return choice?.outcome === "accepted";
}

export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);

export const isIos = () =>
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

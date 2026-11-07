// Crashes used to reach us as "it is not opening" with no detail. Every unexpected error is now written
// to client_errors, so the owner can see what a phone actually hit instead of guessing.
import { supabase } from "@/lib/supabase";

const sent = new Set();

const text = (e) => {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return String(e.message || e.reason?.message || e.error?.message || e);
};

export function reportError(kind, error, extra = {}) {
  const message = text(error).slice(0, 600);
  // One entry per kind and message per page load: a render loop must not fill the table.
  const key = `${kind}|${message}`;
  if (sent.has(key)) return;
  sent.add(key);
  try { console.error("[office]", kind, error); } catch {}
  try {
    const row = {
      kind: String(kind || "error").slice(0, 40),
      message,
      stack: String((error && error.stack) || "").slice(0, 3000),
      page: typeof location !== "undefined" ? (location.pathname + location.search).slice(0, 300) : "",
      ua: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : "",
      online: typeof navigator !== "undefined" ? navigator.onLine : null,
      ...extra,
    };
    supabase().from("client_errors").insert(row).then(() => {}, () => {});
  } catch {}
}

// Uncaught errors and rejected promises never reach a React boundary - catch them at the window.
const CHUNK = /loading chunk \d+ failed|dynamically imported module|importing a module script failed|loading css chunk/i;

// After a deploy the browser can still hold yesterday's page. The new page asks for a script that no
// longer exists, which is the usual reason a phone shows the white "Application error" screen. One
// guarded reload picks up the new build; unsaved edits are left alone.
function recoverFromOldBuild() {
  if (typeof window === "undefined" || window.__soDirty) return false;
  try {
    const last = Number(sessionStorage.getItem("so-reload") || 0);
    if (Date.now() - last < 30000) return false;
    sessionStorage.setItem("so-reload", String(Date.now()));
  } catch { return false; }
  window.location.reload();
  return true;
}

export function watchErrors() {
  if (typeof window === "undefined") return () => {};
  const onError = (e) => {
    const message = String(e?.error?.message || e?.message || "");
    if (CHUNK.test(message) && recoverFromOldBuild()) return;
    reportError("window", e.error || message);
  };
  const onReject = (e) => {
    const message = String(e?.reason?.message || e?.reason || "");
    if (CHUNK.test(message) && recoverFromOldBuild()) return;
    reportError("promise", e.reason);
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onReject);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onReject);
  };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// On a slow connection a tap gave no feedback at all: the screen sat still for seconds, so people tapped
// again and again. This shows a thin bar the moment any internal link or form is used, and clears when the
// new screen is on. It also records the moment so a second tap on the same thing is ignored.
export default function NavProgress() {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  const start = () => {
    if (timer.current) return;
    setBusy(true);
    // Never spin forever if the request dies: give up quietly after 15 seconds.
    timer.current = setTimeout(() => { timer.current = null; setBusy(false); }, 15000);
  };

  const stop = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setBusy(false);
  };

  // Clear the bar as soon as the new screen renders.
  useEffect(() => { stop(); }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^(mailto:|tel:|https?:)/i.test(href)) return;
      // Same screen: nothing will load, so do not promise anything.
      if (href.split("?")[0] === pathname) return;
      start();
    };
    const onSubmit = () => start();
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [pathname]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div aria-hidden="true" data-nav-pending={busy ? "1" : undefined} className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5">
      <div className={`h-full origin-left bg-primary transition-opacity duration-200 ${busy ? "opacity-100" : "opacity-0"}`}
        style={busy ? { animation: "so-progress 1.1s ease-in-out infinite", width: "45%" } : { width: "0%" }} />
      <style>{`@keyframes so-progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(320%); }
      }`}</style>
    </div>
  );
}

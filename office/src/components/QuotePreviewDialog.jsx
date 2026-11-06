"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import QuoteDocument from "@/components/QuoteDocument";
import { Icon, Notice } from "@/components/ui";
import { quoteFileName, saveQuotePdf } from "@/lib/quotePdf";

const A4 = 794; // 210mm at 96dpi
const STEPS = [0.4, 0.5, 0.65, 0.8, 1, 1.25, 1.5];

// Full-screen, pinch-and-button zoomable preview of the quotation, with Save as PDF inside it.
export default function QuotePreviewDialog({ quote, s, brands, signUrl, onClose, onPrint }) {
  const [mounted, setMounted] = useState(false);
  const scroller = useRef(null);
  const doc = useRef(null);
  const [fit, setFit] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // While this is open, hide the quote copy that sits behind it, so printing gives one set of pages.
    document.body.classList.add("qd-modal-open");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("qd-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Depends on `mounted`: the dialog returns null until then, so the scroller only exists after it flips.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setFit(Math.min(1, (el.clientWidth - 20) / A4));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  // A whole A4 page squeezed into a phone is unreadable (about 45%), so start bigger there and let the
  // person scroll or zoom out, instead of making them zoom in before they can read anything.
  const auto = fit === null ? 0.5 : fit < 0.6 ? 0.8 : fit;
  const zoom = chosen ?? auto;
  const step = (dir) => {
    const i = STEPS.findIndex((v) => v > zoom + 0.001);
    const next = dir > 0 ? (i === -1 ? STEPS[STEPS.length - 1] : STEPS[i]) : [...STEPS].reverse().find((v) => v < zoom - 0.001);
    setChosen(next ?? zoom);
  };

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      await saveQuotePdf(doc.current, quoteFileName(quote));
    } catch {
      setErr("Could not build the PDF on this phone. Use Print instead - the same pages come out.");
    }
    setBusy(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex flex-col bg-slate-900/80 print:static print:block print:bg-white" role="dialog" aria-modal="true" aria-label="Quote preview">
      <header className="no-print flex shrink-0 items-center gap-2 bg-white px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] shadow-sm">
        <button onClick={onClose} className="rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="Close preview">
          <Icon name="x" className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">Preview</p>
          <p className="truncate text-xs text-slate-500">{quoteFileName(quote).replace(/\.pdf$/, "")}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          <button onClick={() => step(-1)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-white" aria-label="Zoom out">
            <span className="text-lg font-bold leading-none">-</span>
          </button>
          <button onClick={() => setChosen(null)} className="min-w-12 px-1 text-xs font-bold text-slate-700" aria-label="Fit to width">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => step(1)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-white" aria-label="Zoom in">
            <span className="text-lg font-bold leading-none">+</span>
          </button>
        </div>
        <button className="btn-primary !h-10 shrink-0 !px-4" onClick={save} disabled={busy}>
          {busy ? "..." : "Save as PDF"}
        </button>
      </header>

      {err && (
        <div className="no-print flex flex-wrap items-center gap-2 px-3 pt-3">
          <Notice tone="amber">{err}</Notice>
          {onPrint && <button className="btn-ghost shrink-0" onClick={onPrint}><Icon name="print" className="h-4 w-4" />Print instead</button>}
        </div>
      )}

      <div ref={scroller} className="min-h-0 flex-1 overflow-auto overscroll-contain px-2.5 py-4 print:overflow-visible print:p-0">
        <div ref={doc} className="qd-zoom mx-auto w-fit" style={{ zoom }}>
          <QuoteDocument quote={quote} s={s} brands={brands} signUrl={signUrl} />
        </div>
      </div>
    </div>,
    document.body
  );
}

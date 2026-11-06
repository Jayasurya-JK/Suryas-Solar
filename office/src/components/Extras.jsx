"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon } from "@/components/ui";

// A text box that grows to show everything typed. Works in every browser, including iPhone Safari.
export function AutoText({ value, onChange, className = "", ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} className={`input grow-text ${className}`} {...rest} />;
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
}

// Placeholder rows so the page keeps its shape while data loads (no jumping).
export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card flex items-center gap-3 p-4">
          <Skeleton className="h-10 w-10 !rounded-full" />
          <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
          <Skeleton className="h-6 w-16 !rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="card space-y-3 p-4"><Skeleton className="h-3 w-1/2" /><Skeleton className="h-7 w-2/3" /><Skeleton className="h-3 w-3/4" /></div>)}
      </div>
      <div className="card space-y-3 p-5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-full !rounded-full" /></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card space-y-3 p-5"><Skeleton className="h-4 w-36" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        <div className="card space-y-3 p-5"><Skeleton className="h-4 w-36" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
      </div>
    </div>
  );
}

// Month stepper: "‹ November 2026 ›". Looks the same on every phone (native month boxes do not).
export function MonthPicker({ value, onChange, dark = false }) {
  const [y, m] = value.split("-").map(Number);
  const shift = (d) => {
    const dt = new Date(y, m - 1 + d, 1);
    onChange(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  };
  const label = new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  const frame = dark ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-900";
  const btn = dark ? "text-white/80 hover:bg-white/10" : "text-slate-600 hover:bg-slate-50";
  return (
    <div className={`inline-flex h-10 shrink-0 items-center rounded-full border ${frame}`} role="group" aria-label="Month">
      <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className={`flex h-10 w-10 items-center justify-center rounded-full ${btn}`}>
        <Icon name="chevron" className="h-4 w-4 rotate-180" />
      </button>
      <span className="min-w-[5.5rem] select-none text-center text-sm font-semibold">{label}</span>
      <button type="button" onClick={() => shift(1)} aria-label="Next month" className={`flex h-10 w-10 items-center justify-center rounded-full ${btn}`}>
        <Icon name="chevron" className="h-4 w-4" />
      </button>
    </div>
  );
}

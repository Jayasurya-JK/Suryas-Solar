"use client";

import { Icon } from "@/components/ui";
import { AutoText } from "@/components/Extras";

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};

function RowTools({ i, n, onMove, onRemove }) {
  const btn = "flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btn} disabled={i === 0} onClick={() => onMove(i, -1)} title="Move up" aria-label="Move up">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.83l-3.71 3.94a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" /></svg>
      </button>
      <button type="button" className={btn} disabled={i === n - 1} onClick={() => onMove(i, 1)} title="Move down" aria-label="Move down">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
      </button>
      <button type="button" className={`${btn} hover:!bg-red-50 hover:!text-red-600`} onClick={() => onRemove(i)} title="Remove" aria-label="Remove">
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:border-primary hover:bg-primary-50 hover:text-primary">
      <Icon name="plus" className="h-4 w-4" />{children}
    </button>
  );
}

// Heading + detail rows, e.g. warranty and terms: [{ label, text }]
export function PairList({ items = [], onChange, labelPlaceholder = "Heading", textPlaceholder = "Details", addLabel = "Add row" }) {
  const set = (i, k, v) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="space-y-2">
      {items.map((x, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2">
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
            <input className="input font-semibold" placeholder={labelPlaceholder} value={x.label} onChange={(e) => set(i, "label", e.target.value)} />
            <AutoText placeholder={textPlaceholder} value={x.text} onChange={(e) => set(i, "text", e.target.value)} />
          </div>
          <RowTools i={i} n={items.length} onMove={(a, d) => onChange(move(items, a, d))} onRemove={(a) => onChange(items.filter((_, j) => j !== a))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, { label: "", text: "" }])}>{addLabel}</AddButton>
    </div>
  );
}

// Simple numbered list, e.g. scope of work: ["...", "..."]
export function LineList({ items = [], onChange, placeholder = "", addLabel = "Add item" }) {
  return (
    <div className="space-y-2">
      {items.map((x, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2">
          <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{i + 1}</span>
          <AutoText className="min-w-0 flex-1" placeholder={placeholder} value={x} onChange={(e) => onChange(items.map((y, j) => (j === i ? e.target.value : y)))} />
          <RowTools i={i} n={items.length} onMove={(a, d) => onChange(move(items, a, d))} onRemove={(a) => onChange(items.filter((_, j) => j !== a))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ""])}>{addLabel}</AddButton>
    </div>
  );
}

// Bill of materials rows: [{ item, make, spec, qty }]
export function BomRows({ rows = [], onChange, startNumber = 1 }) {
  const set = (i, k, v) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Item {i + startNumber}</span>
            <RowTools i={i} n={rows.length} onMove={(a, d) => onChange(move(rows, a, d))} onRemove={(a) => onChange(rows.filter((_, j) => j !== a))} />
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_6rem]">
            <input className="input font-semibold" placeholder="Item, e.g. ACDB with MCB" value={r.item} onChange={(e) => set(i, "item", e.target.value)} />
            <input className="input" placeholder="Make, e.g. Polycab" value={r.make} onChange={(e) => set(i, "make", e.target.value)} />
            <input className="input" placeholder="Qty" value={r.qty} onChange={(e) => set(i, "qty", e.target.value)} />
            <AutoText className="sm:col-span-3" placeholder="Specification" value={r.spec} onChange={(e) => set(i, "spec", e.target.value)} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, { item: "", make: "", spec: "", qty: "" }])}>Add material</AddButton>
    </div>
  );
}

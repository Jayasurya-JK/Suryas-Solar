"use client";

import { Icon } from "@/components/ui";
import { today } from "@/lib/format";

export const ATT_STATUSES = [
  { id: "working", label: "Working", short: "Working", hint: "Full day", icon: "check", on: "border-teal bg-teal-50", badge: "bg-teal-50 text-teal", dot: "bg-teal", iconOn: "bg-teal text-white" },
  { id: "partial", label: "Working partially", short: "Partial", hint: "Half day or a few hours", icon: "clock", on: "border-amber-400 bg-amber-50", badge: "bg-amber-50 text-amber-700", dot: "bg-amber-400", iconOn: "bg-amber-400 text-white" },
  { id: "leave", label: "Leave", short: "Leave", hint: "Not working today", icon: "x", on: "border-red-300 bg-red-50", badge: "bg-red-50 text-red-600", dot: "bg-red-400", iconOn: "bg-red-500 text-white" },
];

export const attStatus = (id) => ATT_STATUSES.find((s) => s.id === id) || null;
export const attLabel = (id) => attStatus(id)?.label || "Not marked";

// One row per person per day. Safe to call repeatedly - a second tap just corrects the same day.
// `date` defaults to today. Staff may only mark today; admins fill in past days (enforced by the database too).
export function markAttendance(sb, userId, status, note, date) {
  const table = sb.from("attendance");
  const row = { user_id: userId, work_date: date || today(), status, note: note?.trim() || null, updated_at: new Date().toISOString() };
  // The sample-data client has no upsert; the real one does.
  if (typeof table.upsert !== "function") return Promise.resolve({ error: null });
  return table.upsert(row, { onConflict: "user_id,work_date" });
}

export function StatusPicker({ value, onChange, busy }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {ATT_STATUSES.map((s) => {
        const on = value === s.id;
        return (
          <button key={s.id} type="button" disabled={busy} onClick={() => onChange(s.id)} aria-pressed={on}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${on ? s.on : "border-slate-200 bg-white hover:bg-slate-50"}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${on ? s.iconOn : "bg-slate-100 text-slate-500"}`}>
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-900">{s.label}</span>
              <span className="block text-xs text-slate-500">{s.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status }) {
  const s = attStatus(status);
  if (!s) return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">Not marked</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

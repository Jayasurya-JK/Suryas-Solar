"use client";

import { useState } from "react";
import { useApp } from "@/components/AppShell";
import { Field, Notice, Segmented } from "@/components/ui";
import { AutoText } from "@/components/Extras";
import { LEAD_SOURCES, LEAD_STATUSES, addDays, cleanPhone, dmy, today } from "@/lib/format";
import { useOnce } from "@/lib/useOnce";

export const EMPTY_LEAD = {
  name: "", phone: "", address: "", town: "", source: "call", source_other: "", status: "new",
  kw_interest: "", monthly_bill: "", notes: "", next_follow_up: "", assigned_to: "",
};

// Shared add/edit form. onSave receives a cleaned row ready for Supabase.
export default function LeadForm({ initial = EMPTY_LEAD, onSave, onCancel, saveLabel = "Save lead" }) {
  const { team, isOwner } = useApp();
  const [f, setF] = useState({ ...EMPTY_LEAD, ...initial });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const once = useOnce();
  const set = (k) => (e) => { const v = e.target.value; setF((cur) => ({ ...cur, [k]: v })); };
  // Leads are field work - the owner and admins do not take assignments, so they are not offered here.
  const assignable = team.filter((t) => t.role === "staff");
  const kept = f.assigned_to && !assignable.some((t) => t.id === f.assigned_to) ? team.find((t) => t.id === f.assigned_to) : null;
  const assignOptions = [{ id: "", label: "Not assigned" }, ...[...assignable, ...(kept ? [kept] : [])].map((t) => ({ id: t.id, label: t.full_name || t.email }))];

  const submit = (e) => {
    e.preventDefault();
    return once(async () => {
      const phone = cleanPhone(f.phone);
      if (f.phone && !/^[6-9]\d{9}$/.test(phone)) return setErr("Enter a 10-digit mobile number.");
      if (f.source === "other" && !f.source_other.trim()) return setErr("Say where this lead came from.");
      setErr("");
      setBusy(true);
      const row = {
        name: f.name.trim(),
        phone: phone || null,
        address: f.address?.trim() || null,
        town: f.town?.trim() || null,
        source: f.source,
        source_other: f.source === "other" ? f.source_other.trim() || null : null,
        status: f.status,
        kw_interest: f.kw_interest === "" || f.kw_interest == null ? null : Number(f.kw_interest),
        monthly_bill: f.monthly_bill === "" || f.monthly_bill == null ? null : Number(f.monthly_bill),
        notes: f.notes?.trim() || null,
        next_follow_up: f.next_follow_up || null,
        assigned_to: f.assigned_to || null,
      };
      const error = await onSave(row);
      setBusy(false);
      if (error) setErr(error);
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Customer name *"><input className="input" required value={f.name} onChange={set("name")} /></Field>
      <Field label="Mobile"><input className="input" inputMode="tel" value={f.phone || ""} onChange={set("phone")} placeholder="10-digit number" /></Field>
      <Field label="Address / area" className="sm:col-span-2"><AutoText value={f.address || ""} onChange={set("address")} /></Field>
      <Field label="Town"><AutoText value={f.town || ""} onChange={set("town")} placeholder="e.g. Cuddalore" /></Field>
      <Field label="When should we call them again?" className="sm:col-span-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[["Today", 0], ["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7]].map(([label, days]) => {
            const d = addDays(today(), days);
            const on = f.next_follow_up === d;
            return (
              <button key={label} type="button" onClick={() => setF((cur) => ({ ...cur, next_follow_up: on ? "" : d }))} aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${on ? "border-primary bg-primary-50 text-primary" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                {label}
              </button>
            );
          })}
          <input className="input w-auto flex-1 min-w-36" type="date" value={f.next_follow_up || ""} onChange={set("next_follow_up")} aria-label="Next follow-up date" />
        </div>
        <p className="mt-1 text-xs text-slate-500">{f.next_follow_up ? `Reminder on ${dmy(f.next_follow_up)} when you open the app.` : "Pick a day, or leave it empty if no call is needed."}</p>
      </Field>
      <Field label="Where did this lead come from?" className="sm:col-span-2">
        <Segmented size="sm" value={f.source} onChange={(v) => setF((cur) => ({ ...cur, source: v }))} options={LEAD_SOURCES} />
      </Field>
      {f.source === "other" && (
        <Field label="Where exactly? *" className="sm:col-span-2">
          <AutoText value={f.source_other} onChange={set("source_other")} placeholder="e.g. Newspaper ad, exhibition, friend of a customer" />
        </Field>
      )}
      <Field label="Stage" className="sm:col-span-2">
        <Segmented size="sm" value={f.status} onChange={(v) => setF((cur) => ({ ...cur, status: v }))} options={LEAD_STATUSES} />
      </Field>
      <Field label="System size wanted (kW)"><input className="input" type="number" step="0.1" value={f.kw_interest ?? ""} onChange={set("kw_interest")} /></Field>
      <Field label="Monthly EB bill (₹)"><input className="input" type="number" value={f.monthly_bill ?? ""} onChange={set("monthly_bill")} /></Field>
      {isOwner && (
        <Field label="Assigned to" className="sm:col-span-2">
          <Segmented size="sm" value={f.assigned_to || ""} onChange={(v) => setF((cur) => ({ ...cur, assigned_to: v }))}
            options={assignOptions} />
        </Field>
      )}
      <Field label="Notes" className="sm:col-span-2"><textarea className="input min-h-20" value={f.notes || ""} onChange={set("notes")} /></Field>
      {err && <div className="sm:col-span-2"><Notice tone="red">{err}</Notice></div>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        {onCancel && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}
        <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : saveLabel}</button>
      </div>
    </form>
  );
}

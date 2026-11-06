"use client";

import { useState } from "react";
import { useApp } from "@/components/AppShell";
import { Field, Notice, Segmented } from "@/components/ui";
import { LEAD_SOURCES, LEAD_STATUSES, cleanPhone } from "@/lib/format";

export const EMPTY_LEAD = {
  name: "", phone: "", address: "", town: "", source: "call", status: "new",
  kw_interest: "", monthly_bill: "", notes: "", next_follow_up: "", assigned_to: "",
};

// Shared add/edit form. onSave receives a cleaned row ready for Supabase.
export default function LeadForm({ initial = EMPTY_LEAD, onSave, onCancel, saveLabel = "Save lead" }) {
  const { team, isOwner } = useApp();
  const [f, setF] = useState({ ...EMPTY_LEAD, ...initial });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const phone = cleanPhone(f.phone);
    if (f.phone && !/^[6-9]\d{9}$/.test(phone)) return setErr("Enter a 10-digit mobile number.");
    setErr("");
    setBusy(true);
    const row = {
      name: f.name.trim(),
      phone: phone || null,
      address: f.address?.trim() || null,
      town: f.town?.trim() || null,
      source: f.source,
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
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Customer name *"><input className="input" required value={f.name} onChange={set("name")} /></Field>
      <Field label="Mobile"><input className="input" inputMode="tel" value={f.phone || ""} onChange={set("phone")} placeholder="10-digit number" /></Field>
      <Field label="Address / area"><input className="input" value={f.address || ""} onChange={set("address")} /></Field>
      <Field label="Town"><input className="input" value={f.town || ""} onChange={set("town")} placeholder="e.g. Cuddalore" /></Field>
      <Field label="Where did this lead come from?" className="sm:col-span-2">
        <Segmented size="sm" value={f.source} onChange={(v) => setF({ ...f, source: v })} options={LEAD_SOURCES} />
      </Field>
      <Field label="Stage" className="sm:col-span-2">
        <Segmented size="sm" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={LEAD_STATUSES} />
      </Field>
      <Field label="System size wanted (kW)"><input className="input" type="number" step="0.1" value={f.kw_interest ?? ""} onChange={set("kw_interest")} /></Field>
      <Field label="Monthly EB bill (₹)"><input className="input" type="number" value={f.monthly_bill ?? ""} onChange={set("monthly_bill")} /></Field>
      <Field label="Next follow-up"><input className="input" type="date" value={f.next_follow_up || ""} onChange={set("next_follow_up")} /></Field>
      {isOwner && (
        <Field label="Assigned to" className="sm:col-span-2">
          <Segmented size="sm" value={f.assigned_to || ""} onChange={(v) => setF({ ...f, assigned_to: v })}
            options={[{ id: "", label: "Not assigned" }, ...team.map((t) => ({ id: t.id, label: t.full_name || t.email }))]} />
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

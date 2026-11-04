"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Badge, Empty, Field, Icon, Notice, PageHeader, Segmented, Select, Spinner } from "@/components/ui";
import { EXPENSE_CATEGORIES, PAY_MODES, dmy, downloadCsv, labelOf, rupees, today } from "@/lib/format";

// Shrink phone photos to ~1600px JPEG before upload (keeps storage small).
async function compress(file) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.72));
}

const EMPTY = { spent_on: "", amount: "", category: "material", site: "", paid_by: "", payment_mode: "cash", note: "" };

export default function Expenses() {
  const sb = supabase();
  const { profile, isOwner, team } = useApp();
  const [month, setMonth] = useState(today().slice(0, 7));
  const [rows, setRows] = useState(null);
  const [f, setF] = useState({ ...EMPTY, spent_on: today(), paid_by: profile.full_name || "" });
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [cat, setCat] = useState("all");
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const [y, m] = month.split("-").map(Number);
    const end = new Date(y, m, 1);
    const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-01`;
    const { data } = await sb.from("expenses").select("*").gte("spent_on", `${month}-01`).lt("spent_on", endStr)
      .order("spent_on", { ascending: false }).order("created_at", { ascending: false });
    setRows(data || []);
  }, [sb, month]);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    if (!(Number(f.amount) > 0)) return setMsg({ tone: "red", text: "Enter the amount." });
    setBusy(true);
    setMsg(null);
    let bill_path = null;
    if (photo) {
      const blob = await compress(photo);
      bill_path = `${profile.id}/${Date.now()}.jpg`;
      const { error } = await sb.storage.from("bills").upload(bill_path, blob, { contentType: "image/jpeg" });
      if (error) { setBusy(false); return setMsg({ tone: "red", text: "Photo upload failed: " + error.message }); }
    }
    const { error } = await sb.from("expenses").insert({
      spent_on: f.spent_on, amount: Number(f.amount), category: f.category, site: f.site.trim() || null,
      paid_by: f.paid_by.trim() || null, payment_mode: f.payment_mode, note: f.note.trim() || null,
      bill_path, created_by: profile.id,
    });
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error.message });
    setF({ ...EMPTY, spent_on: f.spent_on, paid_by: f.paid_by, category: f.category, site: f.site });
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
    setMsg({ tone: "green", text: "Expense added." });
    setTimeout(() => setMsg(null), 2000);
    if (f.spent_on.startsWith(month)) load(); else setMonth(f.spent_on.slice(0, 7));
  };

  const viewBill = async (path) => {
    const { data } = await sb.storage.from("bills").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const remove = async (r) => {
    if (!confirm(`Delete ${rupees(r.amount)} expense?`)) return;
    if (r.bill_path) await sb.storage.from("bills").remove([r.bill_path]);
    await sb.from("expenses").delete().eq("id", r.id);
    load();
  };

  const shown = useMemo(() => (rows || []).filter((r) => cat === "all" || r.category === cat), [rows, cat]);
  const total = shown.reduce((a, r) => a + Number(r.amount), 0);
  const byCat = useMemo(() => {
    const m = {};
    (rows || []).forEach((r) => { m[r.category] = (m[r.category] || 0) + Number(r.amount); });
    return m;
  }, [rows]);
  const who = (id) => team.find((t) => t.id === id)?.full_name || "";

  const exportCsv = () =>
    downloadCsv(`expenses-${month}.csv`, [
      ["Date", "Amount", "Category", "Site / customer", "Paid by", "Mode", "Note", "Entered by", "Bill photo"],
      ...shown.map((r) => [dmy(r.spent_on), r.amount, labelOf(EXPENSE_CATEGORIES, r.category), r.site, r.paid_by,
        labelOf(PAY_MODES, r.payment_mode), r.note, who(r.created_by), r.bill_path ? "Yes" : ""]),
    ]);

  return (
    <>
      <PageHeader title="Expenses" subtitle={isOwner ? "All spending by the team. Staff see only their own entries." : "Add what you spent. No need to post it on WhatsApp."}>
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <form onSubmit={add} className="card h-fit p-5 lg:sticky lg:top-6">
          <h2 className="mb-4 font-bold text-slate-900">Add expense</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₹) *"><input className="input text-lg font-bold" type="number" inputMode="decimal" required value={f.amount} onChange={set("amount")} /></Field>
            <Field label="Date"><input className="input" type="date" value={f.spent_on} onChange={set("spent_on")} /></Field>
          </div>
          <div className="mt-3">
            <span className="label">Category</span>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((c) => (
                <button type="button" key={c.id} onClick={() => setF({ ...f, category: c.id })}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${f.category === c.id ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Site / customer" className="col-span-2"><input className="input" value={f.site} onChange={set("site")} placeholder="e.g. Surya, Cuddalore" /></Field>
            <Field label="Paid by"><input className="input" value={f.paid_by} onChange={set("paid_by")} /></Field>
            <Field label="Paid using" className="col-span-2">
              <Segmented size="sm" value={f.payment_mode} onChange={(v) => setF({ ...f, payment_mode: v })} options={PAY_MODES} />
            </Field>
            <Field label="Note" className="col-span-2"><input className="input" value={f.note} onChange={set("note")} placeholder="e.g. 10 m DC cable for the Cuddalore site" /></Field>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-600 hover:bg-slate-50">
            <Icon name="camera" className="h-6 w-6 text-primary" />
            <span className="flex-1 truncate">{photo ? photo.name : "Bill photo (optional)"}</span>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </label>
          {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
          <button className="btn-primary mt-4 w-full py-2.5" disabled={busy}>{busy ? "Saving..." : "Add expense"}</button>
        </form>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input type="month" className="input !w-auto" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Select className="w-44" value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="all">All categories</option>
                {EXPENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </Select>
            </div>
            <p className="text-sm text-slate-500">Total <span className="text-lg font-black text-slate-900">{rupees(total)}</span></p>
          </div>

          {rows && rows.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.filter((c) => byCat[c.id]).map((c) => (
                <span key={c.id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                  {c.label} <b className="text-slate-900">{rupees(byCat[c.id])}</b>
                </span>
              ))}
            </div>
          )}

          {!rows ? <Spinner /> : shown.length === 0 ? (
            <Empty title="No expenses this month" text="Add the first one using the form." />
          ) : (
            <div className="card divide-y divide-slate-100">
              {shown.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-slate-900">{rupees(r.amount)}</span>
                      <Badge tone="blue">{labelOf(EXPENSE_CATEGORIES, r.category)}</Badge>
                      <span className="text-xs text-slate-500">{dmy(r.spent_on)} · {labelOf(PAY_MODES, r.payment_mode)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-600">{[r.site, r.note].filter(Boolean).join(" · ") || "No details"}</p>
                    <p className="text-xs text-slate-400">Paid by {r.paid_by || "?"}{isOwner && who(r.created_by) ? ` · entered by ${who(r.created_by)}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {r.bill_path && <button onClick={() => viewBill(r.bill_path)} className="rounded-full p-2 text-slate-500 hover:bg-primary-50 hover:text-primary" title="View bill"><Icon name="camera" className="h-4 w-4" /></button>}
                    {isOwner && <button onClick={() => remove(r)} className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Icon name="trash" className="h-4 w-4" /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

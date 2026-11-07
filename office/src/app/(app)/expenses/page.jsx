"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoText, ListSkeleton, MonthPicker } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { confirmAction } from "@/components/Confirm";
import { Empty, Field, FilterTabs, Icon, IconButton, Modal, Notice, PageHeader, Segmented, Spinner } from "@/components/ui";
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

const CAT_TONE = {
  material: "bg-primary-50 text-primary", labour: "bg-violet-50 text-violet-700", transport: "bg-amber-50 text-amber-700",
  fuel: "bg-red-50 text-red-600", food: "bg-teal-50 text-teal", office: "bg-slate-100 text-slate-700", other: "bg-slate-100 text-slate-700",
};

const EMPTY = { spent_on: "", amount: "", category: "material", category_other: "", site: "", paid_by: "", payment_mode: "cash", note: "" };

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
  const [sheet, setSheet] = useState(false);
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
    if (f.category === "other" && !f.category_other.trim()) return setMsg({ tone: "red", text: "Say what the other expense was." });
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
      spent_on: f.spent_on, amount: Number(f.amount), category: f.category,
      category_other: f.category === "other" ? f.category_other.trim() || null : null,
      site: f.site.trim() || null,
      paid_by: f.paid_by.trim() || null, payment_mode: f.payment_mode, note: f.note.trim() || null,
      bill_path, created_by: profile.id,
    });
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error.message });
    setF({ ...EMPTY, spent_on: f.spent_on, paid_by: f.paid_by, category: f.category, category_other: f.category === "other" ? f.category_other : "", site: f.site });
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
    setMsg({ tone: "green", text: "Expense saved." });
    setSheet(false);
    setTimeout(() => setMsg(null), 2000);
    if (f.spent_on.startsWith(month)) load(); else setMonth(f.spent_on.slice(0, 7));
  };

  const viewBill = async (path, row) => {
    const { data } = await sb.storage.from("bills").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    if (row) sb.rpc("log_event", { p_action: "bill_view", p_table: "expenses", p_record: row.id, p_label: `₹${row.amount} ${row.category}` }).then(() => {}, () => {});
  };

  const remove = async (r) => {
    const ok = await confirmAction({
      title: "Delete this expense?",
      text: `The ${rupees(r.amount)} expense will be removed, with its bill photos. This cannot be undone.`,
      confirmLabel: "Delete expense",
    });
    if (!ok) return;
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
      ...shown.map((r) => [dmy(r.spent_on), r.amount, labelOf(EXPENSE_CATEGORIES, r.category) + (r.category_other ? ` - ${r.category_other}` : ""), r.site, r.paid_by,
        labelOf(PAY_MODES, r.payment_mode), r.note, who(r.created_by), r.bill_path ? "Yes" : ""]),
    ]);

  const monthLabel = new Date(month + "-01T00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const form = (
    <form onSubmit={add} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount (₹)">
          <input className="input !text-xl !font-bold" type="number" inputMode="decimal" required placeholder="0" value={f.amount} onChange={set("amount")} />
        </Field>
        <Field label="Date"><input className="input" type="date" value={f.spent_on} onChange={set("spent_on")} /></Field>
      </div>
      <Field label="Category"><Segmented size="sm" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={EXPENSE_CATEGORIES} /></Field>
      {f.category === "other" && (
        <Field label="What was this for? *">
          <AutoText value={f.category_other} onChange={set("category_other")} placeholder="e.g. EB meter shifting charges" />
        </Field>
      )}
      <Field label="Site or customer"><input className="input" value={f.site} onChange={set("site")} placeholder="e.g. Surya, Cuddalore" /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Paid by"><input className="input" value={f.paid_by} onChange={set("paid_by")} /></Field>
        <Field label="Paid using"><Segmented size="sm" value={f.payment_mode} onChange={(v) => setF({ ...f, payment_mode: v })} options={PAY_MODES} /></Field>
      </div>
      <Field label="Note"><input className="input" value={f.note} onChange={set("note")} placeholder="e.g. 10 m DC cable for the Cuddalore site" /></Field>
      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 text-sm transition ${photo ? "border-teal bg-teal-50 text-teal" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200"><Icon name={photo ? "check" : "camera"} className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1"><span className="block font-semibold">{photo ? "Bill photo added" : "Add bill photo"}</span><span className="block truncate text-xs opacity-80">{photo ? photo.name : "Optional · take a photo or choose one"}</span></span>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
      </label>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <button className="btn-primary h-12 w-full text-base" disabled={busy}>{busy ? "Saving..." : "Save expense"}</button>
    </form>
  );

  return (
    <>
      <PageHeader title="Expenses" subtitle={isOwner ? "All team spending, in one place." : "Everything the team spent. Add yours and the owner sees it straight away."}
        fab={{ label: "Add expense", onClick: () => setSheet(true) }}
        mobileActions={<IconButton icon="download" label="Download Excel" onClick={exportCsv} />}>
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <div className="card hidden h-fit p-5 lg:sticky lg:top-8 lg:block">
          <h2 className="mb-4 text-base font-bold text-slate-900">Add expense</h2>
          {form}
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{cat === "all" ? "Total spent" : labelOf(EXPENSE_CATEGORIES, cat)}<span className="hidden sm:inline"> · {monthLabel}</span></p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{rupees(total)}</p>
                <p className="mt-0.5 text-xs text-white/60">{shown.length} entries</p>
              </div>
              <MonthPicker dark value={month} onChange={setMonth} />
            </div>
            {rows && rows.length > 0 && (
              <div className="px-4 py-3">
                <FilterTabs value={cat} onChange={setCat} tabs={[
                  { id: "all", label: "All" },
                  ...EXPENSE_CATEGORIES.filter((c) => byCat[c.id]).map((c) => ({ id: c.id, label: `${c.label} ${rupees(byCat[c.id])}` })),
                ]} />
              </div>
            )}
          </div>

          {!rows ? <ListSkeleton rows={4} /> : shown.length === 0 ? (
            <Empty icon="wallet" title="No expenses this month" text="Tap Add expense to record what was spent today.">
              <button className="btn-primary lg:hidden" onClick={() => setSheet(true)}><Icon name="plus" className="h-4 w-4" />Add expense</button>
            </Empty>
          ) : (
            <div className="card divide-y divide-slate-100">
              {shown.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${CAT_TONE[r.category] || CAT_TONE.other}`}>
                    {labelOf(EXPENSE_CATEGORIES, r.category).slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-slate-900">{r.note || r.category_other || labelOf(EXPENSE_CATEGORIES, r.category)}</p>
                    <p className="break-words text-[13px] text-slate-500">{[labelOf(EXPENSE_CATEGORIES, r.category), r.site, dmy(r.spent_on), labelOf(PAY_MODES, r.payment_mode)].filter(Boolean).join(" · ")}</p>
                    <p className="break-words text-xs text-slate-500">Paid by {r.paid_by || "?"}{who(r.created_by) ? ` · entered by ${who(r.created_by)}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[15px] font-bold text-slate-900">{rupees(r.amount)}</span>
                    <div className="flex gap-0.5">
                      {r.bill_path && <button onClick={() => viewBill(r.bill_path, r)} className="rounded-lg p-1.5 text-primary hover:bg-primary-50" title="View bill" aria-label="View bill"><Icon name="camera" className="h-4 w-4" /></button>}
                      {isOwner && <button onClick={() => remove(r)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete" aria-label="Delete"><Icon name="trash" className="h-4 w-4" /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {sheet && <Modal title="Add expense" onClose={() => setSheet(false)}>{form}</Modal>}
    </>
  );
}

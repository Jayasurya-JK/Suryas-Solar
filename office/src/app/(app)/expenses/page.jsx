"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoText, ListSkeleton, MonthPicker } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { confirmAction } from "@/components/Confirm";
import { Empty, EntryOnlyNote, Field, FilterTabs, Icon, IconButton, Modal, Notice, PageHeader, Segmented, Spinner } from "@/components/ui";
import { EXPENSE_CATEGORIES, PAY_MODES, dmy, downloadCsv, labelOf, rupees, today } from "@/lib/format";
import { useOnce } from "@/lib/useOnce";

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
  const [otherMonths, setOtherMonths] = useState([]);
  const [detail, setDetail] = useState(null);
  const [bill, setBill] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    if (month === "all") {
      const { data } = await sb.from("expenses").select("*")
        .order("spent_on", { ascending: false }).order("created_at", { ascending: false });
      setRows(data || []);
    } else {
      const [y, m] = month.split("-").map(Number);
      const end = new Date(y, m, 1);
      const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-01`;
      const { data } = await sb.from("expenses").select("*").gte("spent_on", `${month}-01`).lt("spent_on", endStr)
        .order("spent_on", { ascending: false }).order("created_at", { ascending: false });
      setRows(data || []);
    }
    // Other months that hold entries, so nothing looks lost when the open month is quiet.
    const { data: allDates } = await sb.from("expenses").select("spent_on");
    const tally = {};
    (allDates || []).forEach((r) => { const k = String(r.spent_on).slice(0, 7); tally[k] = (tally[k] || 0) + 1; });
    setOtherMonths(Object.entries(tally).filter(([k]) => k !== month).map(([k, n]) => ({ month: k, n })).sort((a, b) => (a.month < b.month ? 1 : -1)));
  }, [sb, month]);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setF((cur) => ({ ...cur, [k]: e.target.value }));
  const addOnce = useOnce();

  const add = (e) => {
    e.preventDefault();
    return addOnce(async () => {
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
      setF((cur) => ({ ...EMPTY, spent_on: cur.spent_on, paid_by: cur.paid_by, category: cur.category, category_other: cur.category === "other" ? cur.category_other : "", site: cur.site }));
      setPhoto(null);
      if (fileRef.current) fileRef.current.value = "";
      setSheet(false);
      // Say which month it went into: an entry dated last month would otherwise vanish from the open month.
      const savedMonth = f.spent_on.slice(0, 7);
      const monthName = new Date(savedMonth + "-01T00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      setMsg({ tone: "green", text: savedMonth === month || month === "all" ? "Expense saved." : `Expense saved in ${monthName}.` });
      setTimeout(() => setMsg(null), 4000);
      if (savedMonth === month || month === "all") load(); else setMonth(savedMonth);
    });
  };

  // The bill opens inside the app. window.open was silently blocked in the installed app, so tapping the
  // camera did nothing at all.
  const viewBill = async (path, row) => {
    setBill({ loading: true, url: null, row });
    const { data, error } = await sb.storage.from("bills").createSignedUrl(path, 600);
    if (error || !data?.signedUrl) return setBill({ loading: false, url: null, row, error: error?.message || "Could not open the bill." });
    setBill({ loading: false, url: data.signedUrl, row });
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

  const monthLabel = month === "all" ? "all months" : new Date(month + "-01T00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const monthNameOf = (m) => new Date(m + "-01T00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const form = (
    <form onSubmit={add} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount (₹)">
          <input className="input !text-xl !font-bold" type="number" inputMode="decimal" required placeholder="0" value={f.amount} onChange={set("amount")} />
        </Field>
        <Field label="Date"><input className="input" type="date" value={f.spent_on} onChange={set("spent_on")} /></Field>
      </div>
      <div className="-mt-1 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600">{dmy(f.spent_on)}</span>
        {f.spent_on !== today() && (
          <button type="button" onClick={() => setF((cur) => ({ ...cur, spent_on: today() }))}
            className="rounded-full border border-slate-200 px-2.5 py-0.5 font-semibold text-slate-600 hover:bg-slate-50">
            Use today
          </button>
        )}
        {f.spent_on.slice(0, 7) !== today().slice(0, 7) && (
          <span className="font-semibold text-amber-700">goes under {monthNameOf(f.spent_on.slice(0, 7))}</span>
        )}      </div>
      <Field label="Category"><Segmented size="sm" value={f.category} onChange={(v) => setF((cur) => ({ ...cur, category: v }))} options={EXPENSE_CATEGORIES} /></Field>
      {f.category === "other" && (
        <Field label="What was this for? *">
          <AutoText value={f.category_other} onChange={set("category_other")} placeholder="e.g. EB meter shifting charges" />
        </Field>
      )}
      <Field label="Site or customer"><input className="input" value={f.site} onChange={set("site")} placeholder="e.g. Surya, Cuddalore" /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Paid by"><input className="input" value={f.paid_by} onChange={set("paid_by")} /></Field>
        <Field label="Paid using"><Segmented size="sm" value={f.payment_mode} onChange={(v) => setF((cur) => ({ ...cur, payment_mode: v }))} options={PAY_MODES} /></Field>
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

      {(profile.entry_only || []).includes("expenses") && (
        <EntryOnlyNote>Entry only. You can record what you spent. The team&apos;s other entries are not shown here.</EntryOnlyNote>
      )}

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
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <MonthPicker dark value={month === "all" ? today().slice(0, 7) : month} onChange={setMonth} />
                <button type="button" onClick={() => setMonth(month === "all" ? today().slice(0, 7) : "all")}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${month === "all" ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:bg-white/20"}`}>
                  {month === "all" ? "This month" : "All months"}
                </button>
              </div>
            </div>
            {rows && rows.length > 0 && (
              <div className="px-4 py-3">
                <FilterTabs value={cat} onChange={setCat} tabs={[
                  { id: "all", label: "All" },
                  ...EXPENSE_CATEGORIES.filter((c) => byCat[c.id]).map((c) => ({ id: c.id, label: `${c.label} ${rupees(byCat[c.id])}` })),
                ]} />
              </div>
            )}
            {otherMonths.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">Also recorded:</span>
                {otherMonths.slice(0, 4).map((o) => (
                  <button key={o.month} type="button" onClick={() => setMonth(o.month)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50">
                    {monthNameOf(o.month)} · {o.n}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!rows ? <ListSkeleton rows={4} /> : shown.length === 0 ? (
            <Empty icon="wallet" title="No expenses this month"
              text={otherMonths.length ? `Nothing dated in ${monthLabel}. Earlier months have ${otherMonths[0].n} entr${otherMonths[0].n === 1 ? "y" : "ies"}.` : "Tap Add expense to record what was spent today."}>
              {otherMonths.length > 0 && (
                <button className="btn-ghost" onClick={() => setMonth(otherMonths[0].month)}>
                  <Icon name="chevron" className="h-4 w-4" />Show {monthNameOf(otherMonths[0].month)}
                </button>
              )}
              <button className="btn-primary lg:hidden" onClick={() => setSheet(true)}><Icon name="plus" className="h-4 w-4" />Add expense</button>
            </Empty>
          ) : (
            <div className="card divide-y divide-slate-100">
              {shown.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-4">
                  <button type="button" onClick={() => setDetail(r)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${CAT_TONE[r.category] || CAT_TONE.other}`}>
                      {labelOf(EXPENSE_CATEGORIES, r.category).slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words font-semibold text-slate-900">{r.note || r.category_other || labelOf(EXPENSE_CATEGORIES, r.category)}</span>
                      <span className="block break-words text-[13px] text-slate-500">{[labelOf(EXPENSE_CATEGORIES, r.category), r.site, dmy(r.spent_on), labelOf(PAY_MODES, r.payment_mode)].filter(Boolean).join(" · ")}</span>
                      <span className="block break-words text-xs text-slate-500">Paid by {r.paid_by || "?"}{who(r.created_by) ? ` · entered by ${who(r.created_by)}` : ""}</span>
                    </span>
                  </button>
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

      {detail && (
        <Modal title="Expense detail" onClose={() => setDetail(null)}>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{rupees(detail.amount)}</p>
          <p className="mt-0.5 text-sm text-slate-500">{dmy(detail.spent_on)} · {monthNameOf(String(detail.spent_on).slice(0, 7))}</p>
          <dl className="mt-4 divide-y divide-slate-100 text-sm">
            {[
              ["What it was for", detail.category_other || labelOf(EXPENSE_CATEGORIES, detail.category)],
              ["Site or customer", detail.site],
              ["Paid by", detail.paid_by],
              ["Paid using", labelOf(PAY_MODES, detail.payment_mode)],
              ["Note", detail.note],
              ["Entered by", who(detail.created_by)],
              ["Entered on", detail.created_at ? dmy(detail.created_at) : null],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2">
                <dt className="w-36 shrink-0 text-slate-500">{k}</dt>
                <dd className="min-w-0 flex-1 break-words font-semibold text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.bill_path && <button className="btn-ghost flex-1" onClick={() => viewBill(detail.bill_path, detail)}><Icon name="camera" className="h-4 w-4" />View bill photo</button>}
            <button className="btn-ghost flex-1" onClick={() => setDetail(null)}>Close</button>
          </div>
          {isOwner && <button onClick={() => { setDetail(null); remove(detail); }} className="btn-danger mt-2 w-full"><Icon name="trash" className="h-4 w-4" />Delete this expense</button>}
        </Modal>
      )}

      {bill && (
        <Modal title="Bill photo" onClose={() => setBill(null)}>
          {bill.loading && <div className="flex justify-center py-10"><Spinner /></div>}
          {bill.error && <Notice tone="red">{bill.error}</Notice>}
          {bill.url && (
            <a href={bill.url} target="_blank" rel="noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bill.url} alt="Bill photo" className="max-h-[70vh] w-full rounded-xl object-contain" />
              <p className="mt-2 text-center text-xs font-semibold text-primary">Tap the photo to open it full size</p>
            </a>
          )}
        </Modal>
      )}
    </>
  );
}

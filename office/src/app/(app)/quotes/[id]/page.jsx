"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import QuoteDocument, { QuotePreview } from "@/components/QuoteDocument";
import QuotePreviewDialog from "@/components/QuotePreviewDialog";
import { confirmAction } from "@/components/Confirm";
import { BomRows } from "@/components/ListEditors";
import { AutoText } from "@/components/Extras";
import { HistoryPanel } from "@/components/History";
import { Field, Icon, Notice, Segmented, Spinner, Switch } from "@/components/ui";
import { QUOTE_STATUSES, calcQuote, extrasWithAmounts, rupees, waLink } from "@/lib/format";
import { useOnce } from "@/lib/useOnce";
import { quoteFileName, saveQuotePdf } from "@/lib/quotePdf";

export default function QuoteEditor() {
  const { id } = useParams();
  const sb = supabase();
  const router = useRouter();
  const { settings, isOwner, brands, signUrl } = useApp();
  const [q, setQ] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [view, setView] = useState("edit");
  const [preview, setPreview] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const pdfRef = useRef(null);
  const oncePdf = useOnce();
  const onceSend = useOnce();

  // Lets the app shell know a pull-to-refresh would throw away edits.
  useEffect(() => {
    window.__soDirty = dirty;
    return () => { window.__soDirty = false; };
  }, [dirty]);

  const load = useCallback(async () => {
    const { data } = await sb.from("quotes").select("*").eq("id", id).maybeSingle();
    // Old quotes stored a count and a rate; show them as rupee boxes so nothing is multiplied by a typo.
    setQ(data ? { ...data, extras: extrasWithAmounts(data.extras || {}) } : data);
    setDirty(false);
  }, [sb, id]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (q === undefined) return <Spinner />;
  if (!q) return <div className="card p-8 text-center text-slate-600">Quote not found, or you do not have access to it.</div>;

  const s = settings?.data || {};
  const calc = calcQuote(q);

  // Every edit goes through the functional form. Reading `q` from the closure meant that on a slow phone one
  // field could write a stale copy of the others back, which is how an inverter size appeared to change itself.
  const update = (patch) => { setQ((cur) => ({ ...cur, ...(typeof patch === "function" ? patch(cur) : patch) })); setDirty(true); };
  const setC = (k) => (e) => { const v = e.target.value; update((cur) => ({ customer: { ...(cur.customer || {}), [k]: v } })); };
  const setS = (k, num) => (e) => { const v = num ? Number(e.target.value) : e.target.value; update((cur) => ({ system: { ...(cur.system || {}), [k]: v } })); };
  const setX = (k, v) => update((cur) => ({ extras: { ...(cur.extras || {}), [k]: v } }));
  const setAmt = (k) => (e) => {
    const n = Math.max(0, Number(e.target.value) || 0);
    update((cur) => ({ extras: { ...(cur.extras || {}), amounts: { ...((cur.extras || {}).amounts || {}), [k]: n } } }));
  };

  const save = async (extra = {}) => {
    setBusy(true);
    setMsg(null);
    const c = calcQuote(q);
    const row = {
      quote_date: q.quote_date, valid_days: Number(q.valid_days) || 10, customer: q.customer, system: q.system,
      bom: q.bom, price: Number(q.price) || 0, extras: q.extras, show_subsidy: q.show_subsidy, tn_topup: q.tn_topup,
      total: c.total, net: c.net, status: q.status, ...extra,
    };
    const { error } = await sb.from("quotes").update(row).eq("id", id);
    setBusy(false);
    if (error) { setMsg({ tone: "red", text: error.message }); return false; }
    setDirty(false);
    setMsg({ tone: "green", text: "Saved" });
    setTimeout(() => setMsg(null), 2000);
    return true;
  };

  const logPdf = () =>
    sb.rpc("log_event", { p_action: "pdf", p_table: "quotes", p_record: id, p_label: q.ref_no }).then(() => {}, () => {});

  // Builds a real .pdf file and downloads it. No print dialog, so nobody has to hunt for "Save as PDF".
  const savePdf = () => oncePdf(async () => {
    setPdfBusy(true);
    setMsg(null);
    try {
      if (dirty) await save();
      await saveQuotePdf(pdfRef.current, quoteFileName(q));
      logPdf();
    } catch {
      setMsg({ tone: "amber", text: "This phone could not build the PDF. Open Preview and tap Print instead - the same pages come out." });
    }
    setPdfBusy(false);
  });

  // Fallback only: iPhone Safari allows window.print() only inside the tap that started it, so this must
  // stay synchronous - no await, no state change.
  const print = () => {
    const old = document.title;
    document.title = quoteFileName(q).replace(/\.pdf$/, "");
    window.print();
    document.title = old;
    logPdf();
  };

  const sendWhatsApp = () => onceSend(async () => {
    if (dirty && !(await save())) return;
    if (q.status === "draft") { await save({ status: "sent" }); setQ((cur) => ({ ...cur, status: "sent" })); }
    const text = `Hello ${q.customer?.name}, thank you for your enquiry. Please find our quotation ${q.ref_no} for a ${q.system?.kw} kWp rooftop solar system.\n\nTotal price: ${rupees(calc.total)} (GST included)` +
      (q.show_subsidy ? `\nSubsidy to your bank: ${rupees(calc.central + calc.tn)}\nYour effective cost: ${rupees(calc.net)}` : "") +
      `\n\nFor any doubt, call ${s.phone1 || ""}.\nSurya's Solar, Cuddalore`;
    window.open(q.customer?.phone ? waLink(q.customer.phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    sb.rpc("log_event", { p_action: "whatsapp", p_table: "quotes", p_record: id, p_label: q.ref_no }).then(() => {}, () => {});
  });

  const remove = async () => {
    const ok = await confirmAction({
      title: `Delete quote ${q.ref_no}?`,
      text: "This cannot be undone.",
      confirmLabel: "Delete quote",
    });
    if (!ok) return;
    await sb.from("quotes").delete().eq("id", id);
    router.replace("/quotes");
  };

  const ex = q.extras || {};
  const sys = q.system || {};

  return (
    <>
      <div className="no-print">
        <Link href={q.lead_id ? `/leads/${q.lead_id}` : "/quotes"} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary">
          <Icon name="back" className="h-4 w-4" />{q.lead_id ? "Back to lead" : "All quotes"}
        </Link>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 sm:text-[26px]">{q.ref_no}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{q.customer?.name} · {rupees(calc.total)} · after subsidy <b className="text-teal">{rupees(calc.net)}</b></p>
            <div className="mt-3"><Segmented size="sm" value={q.status} onChange={(v) => update({ status: v })} options={QUOTE_STATUSES} /></div>
          </div>
          <div className="hidden flex-wrap items-center gap-2 sm:flex">
            <button className={dirty ? "btn-accent" : "btn-ghost"} onClick={() => save()} disabled={busy || !dirty}>
              {busy ? "Saving..." : dirty ? "Save changes" : <><Icon name="check" className="h-4 w-4" />Saved</>}
            </button>
            <button className="btn-ghost" onClick={() => setPreview(true)}><Icon name="doc" className="h-4 w-4" />Preview</button>
            <button className="btn-primary" onClick={savePdf} disabled={pdfBusy}>
              <Icon name="download" className="h-4 w-4" />{pdfBusy ? "Building..." : "Save as PDF"}
            </button>
            <button className="btn-wa" onClick={sendWhatsApp}><Icon name="chat" className="h-4 w-4" />WhatsApp</button>
          </div>
        </div>
        {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
        <div className="mb-4 xl:hidden">
          <Segmented full value={view} onChange={setView} options={[{ id: "edit", label: "Edit details" }, { id: "preview", label: "Preview quote" }]} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className={`no-print min-w-0 space-y-4 ${view === "preview" ? "hidden xl:block" : ""}`}>
          <section className="card p-5">
            <h2 className="mb-3 font-bold text-slate-900">Customer</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><input className="input" value={q.customer?.name || ""} onChange={setC("name")} /></Field>
              <Field label="Address as">
                <Segmented size="sm" value={q.customer?.sal || "Sir"} onChange={(v) => update((cur) => ({ customer: { ...(cur.customer || {}), sal: v } }))} options={["Sir", "Madam", "Sir/Madam"]} />
              </Field>
              <Field label="Address / area" className="sm:col-span-2"><AutoText value={q.customer?.addr1 || ""} onChange={setC("addr1")} /></Field>
              <Field label="Town"><AutoText value={q.customer?.addr2 || ""} onChange={setC("addr2")} /></Field>
              <Field label="Mobile"><input className="input" value={q.customer?.phone || ""} onChange={setC("phone")} /></Field>
              <Field label="Quote date"><input className="input" type="date" value={q.quote_date} onChange={(e) => update({ quote_date: e.target.value })} /></Field>
              <Field label="Valid for (days)"><input className="input" type="number" value={q.valid_days} onChange={(e) => update({ valid_days: e.target.value })} /></Field>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-bold text-slate-900">System</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Panel capacity (kWp)"><input className="input" type="number" step="0.01" value={sys.kw ?? ""} onChange={setS("kw", true)} /></Field>
              <Field label="Inverter size (kW)"><input className="input" type="number" step="0.1" value={sys.inverter_kw ?? ""} onChange={setS("inverter_kw", true)} /></Field>
              <Field label="Phase">
                <Segmented size="sm" value={sys.phase} onChange={(v) => update((cur) => ({ system: { ...(cur.system || {}), phase: Number(v) } }))} options={[{ id: 1, label: "Single phase" }, { id: 3, label: "Three phase" }]} />
              </Field>
              <Field label="Roof type" className="sm:col-span-2"><AutoText value={sys.roof || ""} onChange={setS("roof")} /></Field>
              <Field label="Panel type" className="sm:col-span-2"><AutoText value={sys.panel_type || ""} onChange={setS("panel_type")} /></Field>
              <Field label="Panel brand"><AutoText value={sys.panel_brand || ""} onChange={setS("panel_brand")} /></Field>
              <Field label="Panel watt (Wp)"><input className="input" value={sys.panel_watt || ""} onChange={setS("panel_watt")} placeholder="e.g. 580 or 555 to 625" /></Field>
              <Field label="No. of panels"><input className="input" type="number" value={sys.panel_count ?? ""} onChange={setS("panel_count", true)} /></Field>
              <Field label="Inverter brand"><AutoText value={sys.inverter_brand || ""} onChange={setS("inverter_brand")} /></Field>
            </div>
            <div className="mt-4">
              <span className="label">Panel partner logo (top right of every page)</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {brands.filter((b) => b.active || b.name === sys.brand).map((b) => {
                  const on = sys.brand === b.name;
                  return (
                    <button type="button" key={b.id} onClick={() => update((cur) => ({ system: { ...(cur.system || {}), brand: b.name } }))}
                      className={`relative flex h-16 flex-col items-center justify-center gap-1 rounded-xl border bg-white px-2 transition ${on ? "border-primary ring-2 ring-primary-100" : "border-slate-200 hover:border-slate-300"}`}>
                      {b.logo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={b.logo_url} alt="" className="max-h-7 max-w-full object-contain" />
                        : <span className="text-sm font-bold text-slate-700">{b.name}</span>}
                      <span className="text-[10px] font-semibold text-slate-500">{b.name}</span>
                      {on && <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"><Icon name="check" className="h-3 w-3" /></span>}
                    </button>
                  );
                })}
                <button type="button" onClick={() => update((cur) => ({ system: { ...(cur.system || {}), brand: "" } }))}
                  className={`flex h-16 items-center justify-center rounded-xl border border-dashed text-xs font-semibold ${!sys.brand ? "border-primary text-primary ring-2 ring-primary-100" : "border-slate-300 text-slate-500 hover:bg-slate-50"}`}>
                  No logo
                </button>
              </div>
            </div>
            {Number(sys.panel_watt) > 0 && Math.abs((Number(sys.panel_watt) * sys.panel_count) / 1000 - sys.kw) > 0.1 && (
              <div className="mt-3"><Notice>{sys.panel_count} panels x {sys.panel_watt} Wp = {((Number(sys.panel_watt) * sys.panel_count) / 1000).toFixed(2)} kWp, but capacity says {sys.kw} kWp. Check before sending.</Notice></div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-bold text-slate-900">Price and subsidy</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="System price (₹, GST included)"><input className="input" type="number" value={q.price} onChange={(e) => update({ price: e.target.value })} /></Field>
              <Field label="Extra floors (₹)"><input className="input" type="number" min="0" value={ex.amounts?.floors ?? 0} onChange={setAmt("floors")} placeholder="0" /></Field>
              <Field label="Elevated structure" className="sm:col-span-2">
                <Segmented size="sm" value={ex.struct || "none"} onChange={(v) => {
                  // The settings' rate only fills the box; the amount stays editable and is never multiplied.
                  const rate = v === "low" ? ex.rates?.struct_low : v === "high" ? ex.rates?.struct_high : 0;
                  update((cur) => ({ extras: { ...(cur.extras || {}), struct: v, amounts: { ...((cur.extras || {}).amounts || {}), struct: Number(rate) || 0 } } }));
                }} options={[
                  { id: "none", label: "Not needed" },
                  { id: "low", label: "Low height" },
                  { id: "high", label: "High height" },
                ]} />
              </Field>
              <Field label="Elevated structure charge (₹)"><input className="input" type="number" min="0" value={ex.amounts?.struct ?? 0} onChange={setAmt("struct")} placeholder="0" /></Field>
              <Field label="Concrete pillars charge (₹)"><input className="input" type="number" min="0" value={ex.amounts?.pillar ?? 0} onChange={setAmt("pillar")} placeholder="0" /></Field>
            </div>
            {(Number(ex.amounts?.struct) > 200000 || Number(ex.amounts?.pillar) > 200000 || Number(ex.amounts?.floors) > 200000) && (
              <div className="mt-3"><Notice tone="red">One of these extras is above ₹2,00,000. Please check the amount before saving.</Notice></div>
            )}
            <div className="mt-4 space-y-2">
              <Switch checked={!!ex.show_table} onChange={(v) => setX("show_table", v)} label="Show optional extras table" hint="Lists the usual structure, pillar and floor prices for the customer" />
              <Switch checked={q.show_subsidy} onChange={(v) => update({ show_subsidy: v })} label="Show PM Surya Ghar subsidy" hint="Central subsidy and cost after subsidy" />
              <Switch checked={q.tn_topup} disabled={!q.show_subsidy} onChange={(v) => update({ tn_topup: v })} label="Add Tamil Nadu top-up" hint="Turn off for Puducherry customers" />
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 text-center">
              <div className="p-2"><p className="text-[11px] text-slate-500">Total</p><p className="font-black text-accent">{rupees(calc.total)}</p></div>
              <div className="p-2"><p className="text-[11px] text-slate-500">Subsidy</p><p className="font-black text-teal">{rupees(calc.central + calc.tn)}</p></div>
              <div className="p-2"><p className="text-[11px] text-slate-500">Customer pays net</p><p className="font-black text-primary">{rupees(calc.net)}</p></div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-1 font-bold text-slate-900">Other materials</h2>
            <p className="mb-3 text-xs text-slate-500">Items 1 and 2 (panels and inverter) come from the System section above.</p>
            <BomRows rows={q.bom || []} onChange={(bom) => update({ bom })} startNumber={3} />
          </section>

          <HistoryPanel table="quotes" id={q.id} />
          {isOwner && <button onClick={remove} className="btn-danger w-full"><Icon name="trash" className="h-4 w-4" />Delete quote</button>}
        </div>

        <div className={`min-w-0 xl:sticky xl:top-6 xl:self-start ${view === "edit" ? "hidden print:block xl:block" : ""}`}>
          <div className="no-print mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">Preview (this is what the customer gets)</p>
            <button className="btn-ghost !h-8 !px-3 !text-xs" onClick={() => setPreview(true)}>
              <Icon name="doc" className="h-4 w-4" />Full screen
            </button>
          </div>
          <QuotePreview quote={q} s={s} brands={brands} signUrl={signUrl} />
        </div>
      </div>

      {/* phone action bar: sticks to the bottom of the scrolling area, above the tab bar */}
      <div className="no-print sticky bottom-0 z-20 -mx-4 mt-4 border-t border-slate-200/80 bg-white px-4 py-2.5 sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <button className={`${dirty ? "btn-accent" : "btn-ghost"} !px-2`} onClick={() => save()} disabled={busy || !dirty}>
            {busy ? "Saving" : dirty ? "Save" : <><Icon name="check" className="h-4 w-4" />Saved</>}
          </button>
          <button className="btn-primary !px-2" onClick={savePdf} disabled={pdfBusy}><Icon name="download" className="h-4 w-4" />{pdfBusy ? "..." : "PDF"}</button>
          <button className="btn-wa !px-2" onClick={sendWhatsApp}><Icon name="chat" className="h-4 w-4" />Send</button>
        </div>
      </div>

      {/* Hidden full-size copy of the sheets. "Save as PDF" photographs this, so it works from any screen
          size without opening anything. Never shown, never printed. */}
      <div ref={pdfRef} className="qd-zoom pdf-source" aria-hidden="true">
        <QuoteDocument quote={q} s={s} brands={brands} signUrl={signUrl} />
      </div>

      {preview && (
        <QuotePreviewDialog quote={q} s={s} brands={brands} signUrl={signUrl} onClose={() => setPreview(false)} onPrint={print} />
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { QuotePreview } from "@/components/QuoteDocument";
import { Field, Icon, Notice, Segmented, Spinner, Switch } from "@/components/ui";
import { QUOTE_STATUSES, calcQuote, inr, rupees, waLink } from "@/lib/format";

export default function QuoteEditor() {
  const { id } = useParams();
  const sb = supabase();
  const router = useRouter();
  const { settings, isOwner, brands, signUrl } = useApp();
  const [q, setQ] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const { data } = await sb.from("quotes").select("*").eq("id", id).maybeSingle();
    setQ(data);
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

  const update = (patch) => { setQ((cur) => ({ ...cur, ...patch })); setDirty(true); };
  const setC = (k) => (e) => update({ customer: { ...q.customer, [k]: e.target.value } });
  const setS = (k, num) => (e) => update({ system: { ...q.system, [k]: num ? Number(e.target.value) : e.target.value } });
  const setX = (k, v) => update({ extras: { ...q.extras, [k]: v } });
  const setRow = (i, k, v) => update({ bom: q.bom.map((r, j) => (j === i ? { ...r, [k]: v } : r)) });

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

  const print = async () => {
    if (dirty && !(await save())) return;
    const old = document.title;
    document.title = `${q.customer?.name || "Quote"} ${q.system?.kw}kW Quotation ${q.ref_no.replace(/\//g, "-")}`;
    window.print();
    document.title = old;
  };

  const sendWhatsApp = async () => {
    if (dirty && !(await save())) return;
    if (q.status === "draft") { await save({ status: "sent" }); setQ((cur) => ({ ...cur, status: "sent" })); }
    const text = `Hello ${q.customer?.name}, thank you for your enquiry. Please find our quotation ${q.ref_no} for a ${q.system?.kw} kWp rooftop solar system.\n\nTotal price: ${rupees(calc.total)} (GST included)` +
      (q.show_subsidy ? `\nSubsidy to your bank: ${rupees(calc.central + calc.tn)}\nYour effective cost: ${rupees(calc.net)}` : "") +
      `\n\nFor any doubt, call ${s.phone1 || ""}.\nSurya's Solar, Cuddalore`;
    window.open(q.customer?.phone ? waLink(q.customer.phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const remove = async () => {
    if (!confirm(`Delete quote ${q.ref_no}? This cannot be undone.`)) return;
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
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{q.ref_no}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{q.customer?.name} · {rupees(calc.total)} · after subsidy <b className="text-teal">{rupees(calc.net)}</b></p>
            <div className="mt-3"><Segmented size="sm" value={q.status} onChange={(v) => update({ status: v })} options={QUOTE_STATUSES} /></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={dirty ? "btn-accent" : "btn-ghost"} onClick={() => save()} disabled={busy || !dirty}>
              {busy ? "Saving..." : dirty ? "Save changes" : <><Icon name="check" className="h-4 w-4" />Saved</>}
            </button>
            <button className="btn-primary" onClick={print}><Icon name="print" className="h-4 w-4" />Download PDF</button>
            <button className="btn-wa" onClick={sendWhatsApp}><Icon name="chat" className="h-4 w-4" />WhatsApp</button>
          </div>
        </div>
        {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="no-print min-w-0 space-y-4">
          <section className="card p-5">
            <h2 className="mb-3 font-bold text-slate-900">Customer</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><input className="input" value={q.customer?.name || ""} onChange={setC("name")} /></Field>
              <Field label="Address as">
                <Segmented size="sm" value={q.customer?.sal || "Sir"} onChange={(v) => update({ customer: { ...q.customer, sal: v } })} options={["Sir", "Madam", "Sir/Madam"]} />
              </Field>
              <Field label="Address / area"><input className="input" value={q.customer?.addr1 || ""} onChange={setC("addr1")} /></Field>
              <Field label="Town"><input className="input" value={q.customer?.addr2 || ""} onChange={setC("addr2")} /></Field>
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
                <Segmented size="sm" value={sys.phase} onChange={(v) => update({ system: { ...q.system, phase: Number(v) } })} options={[{ id: 1, label: "Single phase" }, { id: 3, label: "Three phase" }]} />
              </Field>
              <Field label="Roof type"><input className="input" value={sys.roof || ""} onChange={setS("roof")} /></Field>
              <Field label="Panel type" className="sm:col-span-2"><input className="input" value={sys.panel_type || ""} onChange={setS("panel_type")} /></Field>
              <Field label="Panel brand"><input className="input" value={sys.panel_brand || ""} onChange={setS("panel_brand")} /></Field>
              <Field label="Panel watt (Wp)"><input className="input" value={sys.panel_watt || ""} onChange={setS("panel_watt")} placeholder="580 or 555 to 625" /></Field>
              <Field label="No. of panels"><input className="input" type="number" value={sys.panel_count ?? ""} onChange={setS("panel_count", true)} /></Field>
              <Field label="Inverter brand"><input className="input" value={sys.inverter_brand || ""} onChange={setS("inverter_brand")} /></Field>
            </div>
            <div className="mt-4">
              <span className="label">Panel partner logo (top right of every page)</span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {brands.filter((b) => b.active || b.name === sys.brand).map((b) => {
                  const on = sys.brand === b.name;
                  return (
                    <button type="button" key={b.id} onClick={() => update({ system: { ...q.system, brand: b.name } })}
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
                <button type="button" onClick={() => update({ system: { ...q.system, brand: "" } })}
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
              <Field label={`Floors above G+1 (₹${inr(ex.rates?.per_floor)} each)`}><input className="input" type="number" min="0" value={ex.floors || 0} onChange={(e) => setX("floors", Number(e.target.value))} /></Field>
              <Field label="Elevated structure" className="sm:col-span-2">
                <Segmented size="sm" value={ex.struct || "none"} onChange={(v) => setX("struct", v)} options={[
                  { id: "none", label: "Not needed" },
                  { id: "low", label: `Low height +₹${inr(ex.rates?.struct_low)}` },
                  { id: "high", label: `High height +₹${inr(ex.rates?.struct_high)}` },
                ]} />
              </Field>
            </div>
            <div className="mt-4 space-y-2">
              <Switch checked={!!ex.pillar} onChange={(v) => setX("pillar", v)} label={`Concrete pillars +₹${inr(ex.rates?.pillar)}`} hint="Adds the pillar charge to the total" />
              <Switch checked={!!ex.show_table} onChange={(v) => setX("show_table", v)} label="Show optional extras table" hint="Lists structure, pillar and floor prices for the customer" />
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
            <p className="mb-3 text-xs text-slate-500">Rows 1 and 2 (panels and inverter) come from the System section.</p>
            <div className="space-y-3">
              {(q.bom || []).map((r, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Row {i + 3}</span>
                    <button className="text-slate-400 hover:text-red-600" onClick={() => update({ bom: q.bom.filter((_, j) => j !== i) })} title="Remove row"><Icon name="trash" className="h-4 w-4" /></button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className="input" placeholder="Item" value={r.item} onChange={(e) => setRow(i, "item", e.target.value)} />
                    <input className="input" placeholder="Make" value={r.make} onChange={(e) => setRow(i, "make", e.target.value)} />
                    <input className="input sm:col-span-2" placeholder="Specification" value={r.spec} onChange={(e) => setRow(i, "spec", e.target.value)} />
                    <input className="input" placeholder="Qty" value={r.qty} onChange={(e) => setRow(i, "qty", e.target.value)} />
                  </div>
                </div>
              ))}
              <button className="btn-ghost w-full" onClick={() => update({ bom: [...(q.bom || []), { item: "", make: "", spec: "", qty: "" }] })}>
                <Icon name="plus" className="h-4 w-4" />Add material row
              </button>
            </div>
          </section>

          {isOwner && <button onClick={remove} className="btn-danger w-full"><Icon name="trash" className="h-4 w-4" />Delete quote</button>}
        </div>

        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <p className="no-print mb-2 text-xs font-semibold text-slate-500">Preview (this is what the customer gets)</p>
          <QuotePreview quote={q} s={s} brands={brands} signUrl={signUrl} />
        </div>
      </div>
    </>
  );
}

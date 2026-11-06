"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Field, Icon, Notice, PageHeader, Segmented, Spinner } from "@/components/ui";
import { AutoText } from "@/components/Extras";
import { rupees, today } from "@/lib/format";

function NewQuote() {
  const sb = supabase();
  const router = useRouter();
  const leadId = useSearchParams().get("lead");
  const { settings, profile, brands } = useApp();
  const defaultBrand = (brands.find((b) => b.is_default && b.active) || brands.find((b) => b.active))?.name || null;
  const [packages, setPackages] = useState(null);
  const [pick, setPick] = useState(null);
  const [cust, setCust] = useState({ sal: "Sir", name: "", addr1: "", addr2: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    sb.from("packages").select("*").eq("active", true).order("sort").then(({ data }) => {
      setPackages(data || []);
      if (data?.length) setPick(data[0].id);
    });
    if (leadId) {
      sb.from("leads").select("*").eq("id", leadId).maybeSingle().then(({ data: l }) => {
        if (l) setCust({ sal: "Sir", name: l.name, addr1: l.address || "", addr2: l.town || "", phone: l.phone || "" });
      });
    }
  }, [sb, leadId]);

  const set = (k) => (e) => setCust({ ...cust, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const p = packages.find((x) => x.id === pick);
    const { data: ref, error: refErr } = await sb.rpc("next_quote_ref");
    if (refErr) { setBusy(false); return setErr(refErr.message); }
    const row = {
      ref_no: ref,
      lead_id: leadId || null,
      quote_date: today(),
      valid_days: 10,
      customer: cust,
      system: p ? {
        kw: Number(p.kw), inverter_kw: Number(p.inverter_kw), phase: p.phase, roof: "RCC (concrete) roof",
        panel_type: p.panel_type, panel_brand: p.panel_brand, panel_watt: p.panel_watt, panel_count: p.panel_count,
        inverter_brand: p.inverter_brand, brand: defaultBrand,
      } : { kw: 3, inverter_kw: 3, phase: 1, roof: "RCC (concrete) roof", panel_count: 6, panel_watt: "", brand: defaultBrand },
      bom: p?.bom || [],
      price: p ? Number(p.price) : 0,
      extras: { struct: "none", pillar: false, floors: 0, show_table: false, rates: settings?.data?.extras || {} },
      show_subsidy: true,
      tn_topup: true,
      created_by: profile.id,
    };
    const { data, error } = await sb.from("quotes").insert(row).select("id").single();
    if (error) { setBusy(false); return setErr(error.message); }
    if (leadId) await sb.from("leads").update({ status: "quote_sent" }).eq("id", leadId).in("status", ["new", "contacted", "site_visit"]);
    router.replace(`/quotes/${data.id}`);
  };

  if (!packages) return <Spinner />;

  return (
    <>
      <PageHeader title="New quote" subtitle="Pick a system package and the customer. You can change every detail on the next screen." />
      <form onSubmit={create} className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-bold text-slate-900">Customer</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Customer name *"><input className="input" required value={cust.name} onChange={set("name")} /></Field>
            <Field label="Address as">
              <Segmented size="sm" value={cust.sal} onChange={(v) => setCust({ ...cust, sal: v })} options={["Sir", "Madam", "Sir/Madam"]} />
            </Field>
            <Field label="Address / area" className="sm:col-span-2"><AutoText value={cust.addr1} onChange={set("addr1")} /></Field>
            <Field label="Town *"><AutoText required value={cust.addr2} onChange={set("addr2")} placeholder="e.g. Cuddalore" /></Field>
            <Field label="Mobile"><input className="input" value={cust.phone} onChange={set("phone")} /></Field>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold text-slate-900">System package</h2>
          {packages.length === 0 ? (
            <Notice>No packages yet. The owner can add them in Settings, Packages. You can still create a blank quote.</Notice>
          ) : (
            <div className="space-y-2">
              {packages.map((p) => (
                <button type="button" key={p.id} onClick={() => setPick(p.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${pick === p.id ? "border-primary bg-primary-50 ring-2 ring-primary-100" : "border-slate-200 hover:bg-slate-50"}`}>
                  <span>
                    <span className="block font-semibold text-slate-900">{p.name}</span>
                    <span className="text-xs text-slate-500">{p.panel_count} panels · {p.panel_brand}</span>
                  </span>
                  <span className="font-bold text-primary">{rupees(p.price)}</span>
                </button>
              ))}
              <button type="button" onClick={() => setPick(null)}
                className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${pick === null ? "border-primary bg-primary-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                Blank quote (fill everything myself)
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3 lg:col-span-2">
          {err && <Notice tone="red">{err}</Notice>}
          <button className="btn-accent px-6 py-2.5" disabled={busy}>{busy ? "Creating..." : <>Create quote<Icon name="arrow" className="h-4 w-4" /></>}</button>
        </div>
      </form>
    </>
  );
}

export default function Page() {
  return <Suspense fallback={<Spinner />}><NewQuote /></Suspense>;
}

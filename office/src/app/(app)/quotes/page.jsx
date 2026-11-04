"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Badge, Empty, Icon, PageHeader, Spinner } from "@/components/ui";
import { QUOTE_STATUSES, dmy, downloadCsv, labelOf, rupees, today } from "@/lib/format";

export default function Quotes() {
  const sb = supabase();
  const [quotes, setQuotes] = useState(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    sb.from("quotes").select("id, ref_no, quote_date, customer, system, total, net, status, lead_id")
      .order("created_at", { ascending: false }).limit(1000)
      .then(({ data }) => setQuotes(data || []));
  }, [sb]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (quotes || []).filter((x) =>
      (status === "all" || x.status === status) &&
      (!s || [x.ref_no, x.customer?.name, x.customer?.phone, x.customer?.addr1, x.customer?.addr2].some((v) => v && String(v).toLowerCase().includes(s))));
  }, [quotes, status, q]);

  const exportCsv = () =>
    downloadCsv(`quotes-${today()}.csv`, [
      ["Ref", "Date", "Customer", "Mobile", "Place", "kWp", "Inverter kW", "Total", "After subsidy", "Status"],
      ...shown.map((x) => [x.ref_no, dmy(x.quote_date), x.customer?.name, x.customer?.phone, x.customer?.addr2,
        x.system?.kw, x.system?.inverter_kw, x.total, x.net, labelOf(QUOTE_STATUSES, x.status)]),
    ]);

  return (
    <>
      <PageHeader title="Quotes" subtitle="Every quotation, with automatic reference numbers.">
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
        <Link href="/quotes/new" className="btn-primary"><Icon name="plus" className="h-4 w-4" />New quote</Link>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", label: "All" }, ...QUOTE_STATUSES].map((s) => (
            <button key={s.id} onClick={() => setStatus(s.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status === s.id ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search ref, name, mobile, place" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {!quotes ? <Spinner /> : shown.length === 0 ? (
        <Empty title="No quotes yet" text="Make a quote from a lead, or start a new one here.">
          <Link href="/quotes/new" className="btn-primary">New quote</Link>
        </Empty>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Ref</th><th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 md:table-cell">System</th><th className="px-4 py-3 text-right">Total</th>
                <th className="hidden px-4 py-3 text-right md:table-cell">After subsidy</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((x) => {
                const st = QUOTE_STATUSES.find((s) => s.id === x.status);
                return (
                  <tr key={x.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/quotes/${x.id}`} className="font-semibold text-primary hover:underline">{x.ref_no}</Link>
                      <div className="text-xs text-slate-500">{dmy(x.quote_date)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{x.customer?.name}</div>
                      <div className="text-xs text-slate-500">{x.customer?.addr2}</div>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{x.system?.kw} kWp · {x.system?.inverter_kw} kW</td>
                    <td className="px-4 py-3 text-right font-semibold">{rupees(x.total)}</td>
                    <td className="hidden px-4 py-3 text-right text-teal md:table-cell">{rupees(x.net)}</td>
                    <td className="px-4 py-3"><Badge tone={st?.tone}>{st?.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

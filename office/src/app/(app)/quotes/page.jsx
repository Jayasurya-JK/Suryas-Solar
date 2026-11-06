"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListSkeleton } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { Avatar, Badge, Empty, FilterTabs, Icon, IconButton, PageHeader, SearchBox, Spinner } from "@/components/ui";
import { QUOTE_STATUSES, dmy, downloadCsv, labelOf, rupees, today } from "@/lib/format";

export default function Quotes() {
  const sb = supabase();
  const router = useRouter();
  const [quotes, setQuotes] = useState(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    sb.from("quotes").select("id, ref_no, quote_date, customer, system, total, net, status, lead_id")
      .order("created_at", { ascending: false }).limit(1000)
      .then(({ data }) => setQuotes(data || []));
  }, [sb]);

  const all = quotes || [];
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all.filter((x) =>
      (status === "all" || x.status === status) &&
      (!s || [x.ref_no, x.customer?.name, x.customer?.phone, x.customer?.addr1, x.customer?.addr2].some((v) => v && String(v).toLowerCase().includes(s))));
  }, [all, status, q]);

  const tabs = [{ id: "all", label: "All", n: all.length }, ...QUOTE_STATUSES.map((s) => ({ id: s.id, label: s.label, n: all.filter((x) => x.status === s.id).length }))];
  const value = shown.reduce((a, x) => a + Number(x.total || 0), 0);

  const exportCsv = () =>
    downloadCsv(`quotes-${today()}.csv`, [
      ["Ref", "Date", "Customer", "Mobile", "Place", "kWp", "Inverter kW", "Total", "After subsidy", "Status"],
      ...shown.map((x) => [x.ref_no, dmy(x.quote_date), x.customer?.name, x.customer?.phone, x.customer?.addr2,
        x.system?.kw, x.system?.inverter_kw, x.total, x.net, labelOf(QUOTE_STATUSES, x.status)]),
    ]);

  return (
    <>
      <PageHeader title="Quotes" subtitle={quotes ? `${shown.length} quotes · ${rupees(value)}` : "Quotations with automatic numbers"}
        fab={{ label: "New quote", href: "/quotes/new" }}
        mobileActions={<IconButton icon="download" label="Download Excel" onClick={exportCsv} />}>
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
        <Link href="/quotes/new" className="btn-primary"><Icon name="plus" className="h-4 w-4" />New quote</Link>
      </PageHeader>

      <div className="mb-4 space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:space-y-0">
        <div className="lg:order-2 lg:w-80"><SearchBox value={q} onChange={setQ} placeholder="Search ref, name, mobile or place" /></div>
        <div className="min-w-0 lg:order-1"><FilterTabs tabs={tabs} value={status} onChange={setStatus} /></div>
      </div>

      {!quotes ? <ListSkeleton /> : shown.length === 0 ? (
        <Empty icon="doc" title={q ? "No matching quotes" : "No quotes yet"} text={q ? "Try a different name, number or place." : "Make a quote from a lead, or start a new one here."}>
          {!q && <Link href="/quotes/new" className="btn-primary"><Icon name="plus" className="h-4 w-4" />New quote</Link>}
        </Empty>
      ) : (
        <>
          <div className="card hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Customer</th><th className="px-4 py-3">Quote no.</th><th className="px-4 py-3">System</th>
                  <th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">After subsidy</th><th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((x) => {
                  const st = QUOTE_STATUSES.find((s) => s.id === x.status);
                  return (
                    <tr key={x.id} onClick={() => router.push(`/quotes/${x.id}`)} className="cursor-pointer transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={x.customer?.name || "?"} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">{x.customer?.name}</p>
                            <p className="text-xs text-slate-500">{x.customer?.addr2}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><Link href={`/quotes/${x.id}`} className="font-semibold text-primary hover:underline">{x.ref_no}</Link><div className="text-xs text-slate-500">{dmy(x.quote_date)}</div></td>
                      <td className="px-4 py-3.5 text-slate-600">{x.system?.kw} kWp · {x.system?.inverter_kw} kW</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-slate-900">{rupees(x.total)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-teal">{rupees(x.net)}</td>
                      <td className="px-5 py-3.5"><Badge tone={st?.tone}>{st?.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2.5 lg:hidden">
            {shown.map((x) => {
              const st = QUOTE_STATUSES.find((s) => s.id === x.status);
              return (
                <Link key={x.id} href={`/quotes/${x.id}`} className="card block p-4 active:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <Avatar name={x.customer?.name || "?"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[15px] font-semibold text-slate-900">{x.customer?.name}</p>
                        <Badge tone={st?.tone}>{st?.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{x.ref_no} · {x.system?.kw} kWp · {dmy(x.quote_date)}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <div><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total</p><p className="font-bold text-slate-900">{rupees(x.total)}</p></div>
                    <div className="text-right"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">After subsidy</p><p className="font-bold text-teal">{rupees(x.net)}</p></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

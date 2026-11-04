"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Badge, Icon, PageHeader, Spinner, Stat } from "@/components/ui";
import { EXPENSE_CATEGORIES, LEAD_SOURCES, LEAD_STATUSES, QUOTE_STATUSES, dmy, inr, labelOf, rupees, today } from "@/lib/format";

function Bars({ items }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-600">{i.label}</span><span className="font-bold text-slate-900">{i.display ?? i.value}</span></div>
          <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} /></div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-slate-400">Nothing yet.</p>}
    </div>
  );
}

export default function Dashboard() {
  const sb = supabase();
  const { isOwner } = useApp();
  const [month, setMonth] = useState(today().slice(0, 7));
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isOwner) return;
    const [y, m] = month.split("-").map(Number);
    const end = new Date(y, m, 1);
    const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-01`;
    const from = `${month}-01`;
    Promise.all([
      sb.from("leads").select("id, name, phone, town, source, status, created_at, next_follow_up").gte("created_at", from).lt("created_at", endStr),
      sb.from("quotes").select("id, ref_no, customer, total, net, status, quote_date, system").gte("quote_date", from).lt("quote_date", endStr).order("quote_date", { ascending: false }),
      sb.from("expenses").select("amount, category, site").gte("spent_on", from).lt("spent_on", endStr),
      sb.from("leads").select("id, name, phone, town, status, next_follow_up").lte("next_follow_up", today()).not("status", "in", "(won,lost)").order("next_follow_up"),
    ]).then(([l, q, e, f]) => setData({ leads: l.data || [], quotes: q.data || [], expenses: e.data || [], due: f.data || [] }));
  }, [sb, month, isOwner]);

  const k = useMemo(() => {
    if (!data) return null;
    const { leads, quotes, expenses } = data;
    const sum = (arr, f) => arr.reduce((a, x) => a + Number(f(x) || 0), 0);
    const won = quotes.filter((x) => x.status === "accepted");
    return {
      leads: leads.length,
      web: leads.filter((l) => l.source === "website").length,
      quotes: quotes.length,
      quoteValue: sum(quotes, (x) => x.total),
      won: won.length,
      wonValue: sum(won, (x) => x.total),
      wonKw: sum(won, (x) => x.system?.kw),
      spend: sum(expenses, (x) => x.amount),
      bySource: LEAD_SOURCES.map((s) => ({ label: s.label, value: leads.filter((l) => l.source === s.id).length })).filter((x) => x.value),
      byStatus: LEAD_STATUSES.map((s) => ({ label: s.label, value: leads.filter((l) => l.status === s.id).length })).filter((x) => x.value),
      byCat: EXPENSE_CATEGORIES.map((c) => {
        const v = sum(expenses.filter((x) => x.category === c.id), (x) => x.amount);
        return { label: c.label, value: v, display: rupees(v) };
      }).filter((x) => x.value),
      conv: leads.length ? Math.round((leads.filter((l) => l.status === "won").length / leads.length) * 100) : 0,
    };
  }, [data]);

  if (!isOwner) return null;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Only you can see this page.">
        <input type="month" className="input !w-auto" value={month} onChange={(e) => setMonth(e.target.value)} />
      </PageHeader>
      {!k ? <Spinner /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="New leads" value={k.leads} hint={`${k.web} from the website`} />
            <Stat label="Quotes made" value={k.quotes} hint={`worth ${rupees(k.quoteValue)}`} tone="accent" />
            <Stat label="Orders won" value={k.won} hint={`${rupees(k.wonValue)} · ${inr(k.wonKw)} kWp`} tone="teal" />
            <Stat label="Expenses" value={rupees(k.spend)} hint="this month" tone="slate" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card p-5">
              <h2 className="mb-4 font-bold text-slate-900">Leads by source</h2>
              <Bars items={k.bySource} />
            </div>
            <div className="card p-5">
              <h2 className="mb-1 font-bold text-slate-900">Lead stages</h2>
              <p className="mb-4 text-xs text-slate-500">{k.conv}% of this month&apos;s leads are won so far</p>
              <Bars items={k.byStatus} />
            </div>
            <div className="card p-5">
              <h2 className="mb-4 font-bold text-slate-900">Expenses by category</h2>
              <Bars items={k.byCat} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Follow up today</h2>
                <Badge tone={data.due.length ? "amber" : "green"}>{data.due.length}</Badge>
              </div>
              {data.due.length === 0 ? <p className="text-sm text-slate-400">All caught up.</p> : (
                <ul className="divide-y divide-slate-100">
                  {data.due.slice(0, 8).map((l) => (
                    <li key={l.id}>
                      <Link href={`/leads/${l.id}`} className="flex items-center justify-between py-2.5 hover:text-primary">
                        <span><span className="block text-sm font-semibold">{l.name}</span><span className="text-xs text-slate-500">{[l.phone, l.town].filter(Boolean).join(" · ")}</span></span>
                        <span className="text-xs font-semibold text-amber-700">{dmy(l.next_follow_up)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Quotes this month</h2>
                <Link href="/quotes" className="flex items-center gap-1 text-xs font-semibold text-primary">All quotes<Icon name="arrow" className="h-3.5 w-3.5" /></Link>
              </div>
              {data.quotes.length === 0 ? <p className="text-sm text-slate-400">No quotes this month.</p> : (
                <ul className="divide-y divide-slate-100">
                  {data.quotes.slice(0, 8).map((x) => {
                    const st = QUOTE_STATUSES.find((s) => s.id === x.status);
                    return (
                      <li key={x.id}>
                        <Link href={`/quotes/${x.id}`} className="flex items-center justify-between gap-2 py-2.5 hover:text-primary">
                          <span><span className="block text-sm font-semibold">{x.customer?.name}</span><span className="text-xs text-slate-500">{x.ref_no} · {x.system?.kw} kWp · {rupees(x.total)}</span></span>
                          <Badge tone={st?.tone}>{labelOf(QUOTE_STATUSES, x.status)}</Badge>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

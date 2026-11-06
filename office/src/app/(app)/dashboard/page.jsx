"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CardsSkeleton, MonthPicker } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Avatar, Badge, Icon, IconButton, Spinner, Stat } from "@/components/ui";
import { EXPENSE_CATEGORIES, LEAD_SOURCES, LEAD_STATUSES, QUOTE_STATUSES, dmy, inr, labelOf, rupees, today, waLink } from "@/lib/format";

const STAGE_COLORS = { new: "bg-primary", contacted: "bg-slate-400", site_visit: "bg-amber-400", quote_sent: "bg-violet-500", won: "bg-teal", lost: "bg-red-400" };

function Bars({ items }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="py-6 text-center text-sm text-slate-400">Nothing yet this month.</p>;
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1.5 flex justify-between text-[13px]"><span className="font-medium text-slate-600">{i.label}</span><span className="font-bold text-slate-900">{i.display ?? i.value}</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${(i.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const sb = supabase();
  const { isOwner, profile } = useApp();
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
    ]).then(([l, q, e, f]) => setData({ leads: l.data || [], quotes: q.data || [], expenses: e.data || [], due: (f.data || []).filter((x) => x.next_follow_up && x.next_follow_up <= today() && !["won", "lost"].includes(x.status)) }));
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
      stages: LEAD_STATUSES.map((s) => ({ ...s, value: leads.filter((l) => l.status === s.id).length })),
      byCat: EXPENSE_CATEGORIES.map((c) => {
        const v = sum(expenses.filter((x) => x.category === c.id), (x) => x.amount);
        return { label: c.label, value: v, display: rupees(v) };
      }).filter((x) => x.value),
      conv: leads.length ? Math.round((leads.filter((l) => l.status === "won").length / leads.length) * 100) : 0,
    };
  }, [data]);

  if (!isOwner) return null;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = (profile.full_name || "").split(" ")[0];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="mt-0.5 text-[22px] font-bold tracking-tight text-slate-900 sm:text-[26px]">{greet}{first ? `, ${first}` : ""}</h1>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:flex">
        <Link href="/quotes/new" className="btn-accent !h-auto flex-col !gap-1 !rounded-2xl !px-2 py-3 text-xs sm:!h-10 sm:flex-row sm:!gap-2 sm:!rounded-full sm:!px-4 sm:py-0 sm:text-sm"><Icon name="doc" className="h-5 w-5 sm:h-4 sm:w-4" />New quote</Link>
        <Link href="/leads" className="btn-ghost !h-auto flex-col !gap-1 !rounded-2xl !px-2 py-3 text-xs sm:!h-10 sm:flex-row sm:!gap-2 sm:!rounded-full sm:!px-4 sm:py-0 sm:text-sm"><Icon name="users" className="h-5 w-5 sm:h-4 sm:w-4" />Leads</Link>
        <Link href="/expenses" className="btn-ghost !h-auto flex-col !gap-1 !rounded-2xl !px-2 py-3 text-xs sm:!h-10 sm:flex-row sm:!gap-2 sm:!rounded-full sm:!px-4 sm:py-0 sm:text-sm"><Icon name="wallet" className="h-5 w-5 sm:h-4 sm:w-4" />Expenses</Link>
      </div>

      {!k ? <CardsSkeleton /> : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <Stat href="/leads" icon="users" label="New leads" value={k.leads} hint={`${k.web} from the website`} />
            <Stat href="/quotes" icon="doc" label="Quotes sent" value={k.quotes} hint={`worth ${rupees(k.quoteValue)}`} tone="accent" />
            <Stat href="/quotes?status=accepted" icon="trophy" label="Orders won" value={k.won} hint={`${rupees(k.wonValue)} · ${inr(k.wonKw)} kWp`} tone="teal" />
            <Stat href="/expenses" icon="wallet" label="Expenses" value={rupees(k.spend)} hint="spent this month" tone="slate" />
          </div>

          <Panel title="Lead pipeline" action={<span className="text-xs font-semibold text-slate-500">{k.conv}% won</span>}>
            {k.leads === 0 ? <p className="py-4 text-center text-sm text-slate-400">No leads this month yet.</p> : (
              <>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                  {k.stages.filter((s) => s.value).map((s) => (
                    <div key={s.id} className={STAGE_COLORS[s.id]} style={{ width: `${(s.value / k.leads) * 100}%` }} title={`${s.label}: ${s.value}`} />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 sm:grid-cols-6">
                  {k.stages.map((s) => (
                    <div key={s.id}>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span className={`h-2 w-2 rounded-full ${STAGE_COLORS[s.id]}`} />{s.label}</div>
                      <p className="mt-0.5 text-lg font-bold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Follow up today" action={<Badge tone={data.due.length ? "amber" : "green"}>{data.due.length ? `${data.due.length} due` : "All done"}</Badge>}>
              {data.due.length === 0 ? <p className="py-4 text-center text-sm text-slate-400">No calls pending. Nice work.</p> : (
                <ul className="-my-2 divide-y divide-slate-100">
                  {data.due.slice(0, 6).map((l) => (
                    <li key={l.id} className="flex items-center gap-3 py-2.5">
                      <Avatar name={l.name} size="sm" />
                      <Link href={`/leads/${l.id}`} className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">{l.name}</span>
                        <span className={`text-xs font-medium ${l.next_follow_up < today() ? "text-red-600" : "text-amber-700"}`}>{l.next_follow_up < today() ? `Overdue since ${dmy(l.next_follow_up)}` : "Due today"}{l.town ? ` · ${l.town}` : ""}</span>
                      </Link>
                      {l.phone && <div className="flex gap-1.5"><IconButton icon="phone" label="Call" href={`tel:${l.phone}`} /><IconButton icon="chat" label="WhatsApp" tone="wa" href={waLink(l.phone)} /></div>}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Quotes this month" action={<Link href="/quotes" className="flex items-center gap-1 text-xs font-semibold text-primary">View all<Icon name="chevron" className="h-3.5 w-3.5" /></Link>}>
              {data.quotes.length === 0 ? <p className="py-4 text-center text-sm text-slate-400">No quotes this month.</p> : (
                <ul className="-my-2 divide-y divide-slate-100">
                  {data.quotes.slice(0, 6).map((x) => {
                    const st = QUOTE_STATUSES.find((s) => s.id === x.status);
                    return (
                      <li key={x.id}>
                        <Link href={`/quotes/${x.id}`} className="flex items-center gap-3 py-2.5">
                          <Avatar name={x.customer?.name || "?"} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-slate-900">{x.customer?.name}</span>
                            <span className="text-xs text-slate-500">{x.ref_no} · {x.system?.kw} kWp</span>
                          </span>
                          <span className="text-right">
                            <span className="block text-sm font-bold text-slate-900">{rupees(x.total)}</span>
                            <Badge tone={st?.tone}>{labelOf(QUOTE_STATUSES, x.status)}</Badge>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Where leads come from"><Bars items={k.bySource} /></Panel>
            <Panel title="Spending by category"><Bars items={k.byCat} /></Panel>
          </div>
        </div>
      )}
    </>
  );
}

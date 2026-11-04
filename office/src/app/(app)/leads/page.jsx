"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import LeadForm from "@/components/LeadForm";
import { Badge, Empty, Icon, Modal, PageHeader, Spinner } from "@/components/ui";
import { LEAD_SOURCES, LEAD_STATUSES, dmy, downloadCsv, labelOf, today, waLink } from "@/lib/format";

export default function Leads() {
  const sb = supabase();
  const { profile, team } = useApp();
  const [leads, setLeads] = useState(null);
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const { data } = await sb.from("leads").select("*").order("created_at", { ascending: false }).limit(1000);
    setLeads(data || []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const t = today();
  const shown = useMemo(() => {
    if (!leads) return [];
    const s = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status === "open" && ["won", "lost"].includes(l.status)) return false;
      if (status === "due" && !(l.next_follow_up && l.next_follow_up <= t && !["won", "lost"].includes(l.status))) return false;
      if (!["open", "due", "all"].includes(status) && l.status !== status) return false;
      if (!s) return true;
      return [l.name, l.phone, l.town, l.address].some((v) => v && v.toLowerCase().includes(s));
    });
  }, [leads, status, q, t]);

  const count = (fn) => (leads || []).filter(fn).length;
  const dueCount = count((l) => l.next_follow_up && l.next_follow_up <= t && !["won", "lost"].includes(l.status));
  const tabs = [
    { id: "open", label: "Open", n: count((l) => !["won", "lost"].includes(l.status)) },
    { id: "due", label: "Follow up today", n: dueCount },
    ...LEAD_STATUSES.map((s) => ({ id: s.id, label: s.label, n: count((l) => l.status === s.id) })),
    { id: "all", label: "All", n: leads?.length || 0 },
  ];

  const add = async (row) => {
    const { error } = await sb.from("leads").insert({ ...row, created_by: profile.id });
    if (error) return error.message;
    setAdding(false);
    load();
  };

  const exportCsv = () =>
    downloadCsv(`leads-${t}.csv`, [
      ["Date", "Name", "Mobile", "Town", "Address", "Source", "Status", "kW", "EB bill", "Follow-up", "Assigned", "Notes"],
      ...shown.map((l) => [dmy(l.created_at), l.name, l.phone, l.town, l.address, labelOf(LEAD_SOURCES, l.source),
        labelOf(LEAD_STATUSES, l.status), l.kw_interest, l.monthly_bill, dmy(l.next_follow_up),
        team.find((m) => m.id === l.assigned_to)?.full_name || "", l.notes]),
    ]);

  return (
    <>
      <PageHeader title="Leads" subtitle="Every enquiry from calls, walk-ins, WhatsApp and the website.">
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
        <button className="btn-primary" onClick={() => setAdding(true)}><Icon name="plus" className="h-4 w-4" />Add lead</button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setStatus(tb.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${status === tb.id ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"} ${tb.id === "due" && tb.n > 0 && status !== "due" ? "!border-amber-300 !text-amber-700" : ""}`}>
              {tb.label} <span className="opacity-70">{tb.n}</span>
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search name, mobile, town" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {!leads ? <Spinner /> : shown.length === 0 ? (
        <Empty title="No leads here" text="Add a lead when someone calls or visits. Website enquiries appear here by themselves.">
          <button className="btn-primary" onClick={() => setAdding(true)}>Add lead</button>
        </Empty>
      ) : (
        <>
          {/* desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Town</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Follow-up</th><th className="px-4 py-3">Added</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((l) => {
                  const st = LEAD_STATUSES.find((s) => s.id === l.status);
                  const due = l.next_follow_up && l.next_follow_up <= t && !["won", "lost"].includes(l.status);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link href={`/leads/${l.id}`} className="font-semibold text-slate-900 hover:text-primary">{l.name}</Link>
                        <div className="text-xs text-slate-500">{l.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{l.town}</td>
                      <td className="px-4 py-3">{l.source === "website" ? <Badge tone="pink">Website</Badge> : <span className="text-slate-600">{labelOf(LEAD_SOURCES, l.source)}</span>}</td>
                      <td className="px-4 py-3"><Badge tone={st?.tone}>{st?.label}</Badge></td>
                      <td className={`px-4 py-3 ${due ? "font-semibold text-amber-700" : "text-slate-600"}`}>{dmy(l.next_follow_up)}</td>
                      <td className="px-4 py-3 text-slate-500">{dmy(l.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        {l.phone && (
                          <span className="inline-flex gap-1">
                            <a href={`tel:${l.phone}`} className="rounded-full p-2 text-slate-500 hover:bg-primary-50 hover:text-primary" title="Call"><Icon name="phone" className="h-4 w-4" /></a>
                            <a href={waLink(l.phone)} target="_blank" className="rounded-full p-2 text-slate-500 hover:bg-green-50 hover:text-green-600" title="WhatsApp"><Icon name="chat" className="h-4 w-4" /></a>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* mobile cards */}
          <div className="space-y-3 md:hidden">
            {shown.map((l) => {
              const st = LEAD_STATUSES.find((s) => s.id === l.status);
              return (
                <Link key={l.id} href={`/leads/${l.id}`} className="card block p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{l.name}</p>
                      <p className="text-sm text-slate-500">{[l.phone, l.town].filter(Boolean).join(" · ")}</p>
                    </div>
                    <Badge tone={st?.tone}>{st?.label}</Badge>
                  </div>
                  {l.next_follow_up && <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Icon name="clock" className="h-3.5 w-3.5" />Follow up {dmy(l.next_follow_up)}</p>}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {adding && (
        <Modal title="Add lead" onClose={() => setAdding(false)} wide>
          <LeadForm onSave={add} onCancel={() => setAdding(false)} />
        </Modal>
      )}
    </>
  );
}

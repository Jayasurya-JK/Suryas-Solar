"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListSkeleton } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import LeadForm from "@/components/LeadForm";
import { Avatar, Badge, Empty, FilterTabs, Icon, IconButton, Modal, PageHeader, SearchBox, Spinner } from "@/components/ui";
import { LEAD_SOURCES, LEAD_STATUSES, dmy, downloadCsv, labelOf, sourceLabel, today, waLink } from "@/lib/format";

const isOpen = (l) => !["won", "lost"].includes(l.status);

function FollowUp({ date, t }) {
  if (!date) return <span className="text-slate-400">Not set</span>;
  const overdue = date < t;
  const todayDue = date === t;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${overdue ? "text-red-600" : todayDue ? "text-amber-700" : "text-slate-600"}`}>
      <Icon name="clock" className="h-3.5 w-3.5" />{todayDue ? "Today" : overdue ? `Overdue · ${dmy(date)}` : dmy(date)}
    </span>
  );
}

export default function Leads() {
  const sb = supabase();
  const router = useRouter();
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
  const due = (l) => l.next_follow_up && l.next_follow_up <= t && isOpen(l);
  const mine = (l) => l.assigned_to === profile.id || l.created_by === profile.id;
  const nameOf = (id) => team.find((m) => m.id === id)?.full_name || "";

  const shown = useMemo(() => {
    if (!leads) return [];
    const s = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status === "mine" && !(l.assigned_to === profile.id || l.created_by === profile.id)) return false;
      if (status === "open" && !isOpen(l)) return false;
      if (status === "due" && !due(l)) return false;
      if (!["open", "due", "all", "mine"].includes(status) && l.status !== status) return false;
      return !s || [l.name, l.phone, l.town, l.address].some((v) => v && v.toLowerCase().includes(s));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, status, q, t, profile.id]);

  const all = leads || [];
  const count = (fn) => all.filter(fn).length;
  const tabs = [
    { id: "open", label: "Open", n: count(isOpen) },
    { id: "due", label: "Follow up", n: count(due), warn: true },
    { id: "mine", label: "Mine", n: count(mine) },
    ...LEAD_STATUSES.map((s) => ({ id: s.id, label: s.label, n: count((l) => l.status === s.id) })),
    { id: "all", label: "All", n: all.length },
  ];

  const add = async (row) => {
    const { error } = await sb.from("leads").insert({ ...row, created_by: profile.id });
    if (error) return error.message;
    setAdding(false);
    load();
  };

  const exportCsv = () =>
    downloadCsv(`leads-${t}.csv`, [
      ["Date", "Name", "Mobile", "Town", "Address", "Source", "Stage", "kW", "EB bill", "Follow-up", "Assigned", "Notes"],
      ...shown.map((l) => [dmy(l.created_at), l.name, l.phone, l.town, l.address, sourceLabel(l),
        labelOf(LEAD_STATUSES, l.status), l.kw_interest, l.monthly_bill, dmy(l.next_follow_up),
        nameOf(l.assigned_to), l.notes]),
    ]);

  const subtitle = leads ? `${count(isOpen)} open · ${count(due)} to follow up today` : "Every enquiry in one place";

  return (
    <>
      <PageHeader title="Leads" subtitle={subtitle}
        fab={{ label: "Add lead", onClick: () => setAdding(true) }}
        mobileActions={<IconButton icon="download" label="Download Excel" onClick={exportCsv} />}>
        <button className="btn-ghost" onClick={exportCsv}><Icon name="download" className="h-4 w-4" />Excel</button>
        <button className="btn-primary" onClick={() => setAdding(true)}><Icon name="plus" className="h-4 w-4" />Add lead</button>
      </PageHeader>

      <div className="mb-4 space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:space-y-0">
        <div className="lg:w-80 lg:order-2"><SearchBox value={q} onChange={setQ} placeholder="Search name, mobile or town" /></div>
        <div className="min-w-0 lg:order-1"><FilterTabs tabs={tabs} value={status} onChange={setStatus} /></div>
      </div>

      {!leads ? <ListSkeleton /> : shown.length === 0 ? (
        <Empty icon="users" title={q ? "No matching leads" : "No leads here"}
          text={q ? "Try a different name, number or town." : "Add a lead when someone calls or visits. Website enquiries appear here by themselves."}>
          {!q && <button className="btn-primary" onClick={() => setAdding(true)}><Icon name="plus" className="h-4 w-4" />Add lead</button>}
        </Empty>
      ) : (
        <>
          {/* desktop table */}
          <div className="card hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Customer</th><th className="px-4 py-3">Town</th><th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Stage</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Follow-up</th><th className="px-4 py-3">Added</th><th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((l) => {
                  const st = LEAD_STATUSES.find((s) => s.id === l.status);
                  return (
                    <tr key={l.id} onClick={() => router.push(`/leads/${l.id}`)} className="cursor-pointer transition hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={l.name} size="sm" />
                          <div className="min-w-0">
                            <Link href={`/leads/${l.id}`} className="block truncate font-semibold text-slate-900 hover:text-primary">{l.name}</Link>
                            <div className="text-xs text-slate-500">{l.phone || "No number"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{l.town || "-"}</td>
                      <td className="px-4 py-3.5">{l.source === "website" ? <Badge tone="pink">Website</Badge> : <span className="text-slate-600">{sourceLabel(l)}</span>}</td>
                      <td className="px-4 py-3.5"><Badge tone={st?.tone}>{st?.label}</Badge></td>
                      <td className="px-4 py-3.5">
                        {l.assigned_to ? (
                          <span className="flex items-center gap-2 text-[13px] text-slate-600">
                            <Avatar name={nameOf(l.assigned_to) || "?"} size="sm" />{nameOf(l.assigned_to) || "Unknown"}
                          </span>
                        ) : <span className="text-slate-400">Anyone</span>}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]"><FollowUp date={isOpen(l) ? l.next_follow_up : null} t={t} /></td>
                      <td className="px-4 py-3.5 text-slate-500">{dmy(l.created_at)}</td>
                      <td className="px-5 py-3.5">
                        {l.phone && (
                          <div className="flex justify-end gap-1.5">
                            <IconButton icon="phone" label="Call" href={`tel:${l.phone}`} />
                            <IconButton icon="chat" label="WhatsApp" tone="wa" href={waLink(l.phone)} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* phone cards */}
          <div className="space-y-2.5 lg:hidden">
            {shown.map((l) => {
              const st = LEAD_STATUSES.find((s) => s.id === l.status);
              return (
                <div key={l.id} onClick={() => router.push(`/leads/${l.id}`)} className="card cursor-pointer p-4 active:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <Avatar name={l.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[15px] font-semibold text-slate-900">{l.name}</p>
                        <Badge tone={st?.tone}>{st?.label}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-500">{[l.phone, l.town].filter(Boolean).join(" · ") || "No details"}</p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                        <Icon name="users" className="h-3.5 w-3.5 shrink-0" />
                        {l.assigned_to ? `Assigned to ${nameOf(l.assigned_to) || "a team member"}` : "Not assigned to anyone yet"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <span className="text-xs">
                      {l.source === "website" && <Badge tone="pink">Website</Badge>}
                      {l.source !== "website" && isOpen(l) && <FollowUp date={l.next_follow_up} t={t} />}
                    </span>
                    {l.phone && (
                      <div className="flex gap-2">
                        <IconButton icon="phone" label="Call" href={`tel:${l.phone}`} />
                        <IconButton icon="chat" label="WhatsApp" tone="wa" href={waLink(l.phone)} />
                      </div>
                    )}
                  </div>
                </div>
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

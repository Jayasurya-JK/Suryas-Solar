"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import LeadForm from "@/components/LeadForm";
import { HistoryPanel } from "@/components/History";
import { Avatar, Badge, Icon, Segmented, Spinner } from "@/components/ui";
import { LEAD_SOURCES, LEAD_STATUSES, QUOTE_STATUSES, dmy, labelOf, rupees, sourceLabel, waLink } from "@/lib/format";

export default function LeadDetail() {
  const { id } = useParams();
  const sb = supabase();
  const router = useRouter();
  const { isOwner } = useApp();
  const [lead, setLead] = useState(undefined);
  const [quotes, setQuotes] = useState([]);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const [{ data: l }, { data: qs }] = await Promise.all([
      sb.from("leads").select("*").eq("id", id).maybeSingle(),
      sb.from("quotes").select("id, ref_no, quote_date, total, net, status, system").eq("lead_id", id).order("created_at", { ascending: false }),
    ]);
    setLead(l);
    setQuotes(qs || []);
  }, [sb, id]);
  useEffect(() => { load(); }, [load]);

  if (lead === undefined) return <Spinner />;
  if (!lead) return <div className="card p-8 text-center text-slate-600">Lead not found, or you do not have access to it.</div>;

  const save = async (row) => {
    const { error } = await sb.from("leads").update(row).eq("id", id);
    if (error) return error.message;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  const setStatus = async (s) => {
    await sb.from("leads").update({ status: s }).eq("id", id);
    load();
  };

  const remove = async () => {
    if (!confirm(`Delete lead "${lead.name}"? Quotes for this lead are kept.`)) return;
    await sb.from("leads").delete().eq("id", id);
    router.replace("/leads");
  };

  return (
    <>
      <Link href="/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary">
        <Icon name="back" className="h-4 w-4" />All leads
      </Link>
      <div className="card mb-5 p-5">
        <div className="flex items-start gap-4">
          <Avatar name={lead.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-bold tracking-tight text-slate-900">{lead.name}</h1>
            <p className="mt-0.5 text-sm text-slate-500">{[lead.phone, lead.town].filter(Boolean).join(" · ")}</p>
            <p className="text-xs text-slate-400">{sourceLabel(lead)} lead · added {dmy(lead.created_at)}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {lead.phone && <a href={`tel:${lead.phone}`} className="btn-ghost"><Icon name="phone" className="h-4 w-4" />Call</a>}
          {lead.phone && <a href={waLink(lead.phone, `Hello ${lead.name}, this is Surya's Solar, Cuddalore.`)} target="_blank" rel="noreferrer" className="btn-wa"><Icon name="chat" className="h-4 w-4" />WhatsApp</a>}
          <Link href={`/quotes/new?lead=${lead.id}`} className={`btn-accent ${lead.phone ? "" : "col-span-3"}`}><Icon name="doc" className="h-4 w-4" />Quote</Link>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="label">Stage</p>
          <Segmented size="sm" value={lead.status} onChange={setStatus} options={LEAD_STATUSES} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Details</h2>
            {saved && <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><Icon name="check" className="h-4 w-4" />Saved</span>}
          </div>
          <LeadForm key={lead.updated_at} initial={lead} onSave={save} saveLabel="Save changes" />
        </div>
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-3 font-bold text-slate-900">Quotes</h2>
            {quotes.length === 0 ? (
              <p className="text-sm text-slate-500">No quote yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {quotes.map((qt) => {
                  const st = QUOTE_STATUSES.find((s) => s.id === qt.status);
                  return (
                    <li key={qt.id} className="py-2.5">
                      <Link href={`/quotes/${qt.id}`} className="flex items-center justify-between gap-2 hover:text-primary">
                        <span>
                          <span className="block text-sm font-semibold">{qt.ref_no}</span>
                          <span className="text-xs text-slate-500">{qt.system?.kw} kWp · {rupees(qt.total)} · {dmy(qt.quote_date)}</span>
                        </span>
                        <Badge tone={st?.tone}>{st?.label}</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link href={`/quotes/new?lead=${lead.id}`} className="btn-ghost mt-3 w-full"><Icon name="plus" className="h-4 w-4" />New quote</Link>
          </div>
          <HistoryPanel table="leads" id={lead.id} />
          {isOwner && <button onClick={remove} className="btn-danger w-full"><Icon name="trash" className="h-4 w-4" />Delete lead</button>}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Avatar } from "@/components/ui";
import { changeLines, deletedSummary, describe } from "@/lib/activity";
import { clock } from "@/lib/format";

const TONE_DOT = { green: "bg-teal", blue: "bg-primary", red: "bg-red-500", violet: "bg-violet-500", slate: "bg-slate-400" };

// One line of the activity feed: "Ravi added lead Surya Prakash", with what changed underneath.
export function ActivityItem({ entry, team, withDate = false, showActor = true }) {
  const [open, setOpen] = useState(false);
  const d = describe(entry);
  const lines = changeLines(entry, team);
  const shown = open ? lines : lines.slice(0, 3);
  const gone = entry.action === "delete" ? deletedSummary(entry) : "";
  return (
    <li className="flex gap-3 py-3.5">
      {showActor ? <Avatar name={entry.actor_name || "?"} size="sm" /> : <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${TONE_DOT[d.tone]}`} />}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-slate-700">
          {showActor && <b className="text-slate-900">{entry.actor_name || "Someone"} </b>}
          {d.verb}{" "}
          {d.subject && (d.href
            ? <Link href={d.href} className="font-semibold text-primary hover:underline">{d.subject}</Link>
            : <b className="text-slate-900">{d.subject}</b>)}
          {d.suffix}
        </p>
        {gone && <p className="mt-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-700">Was: {gone}</p>}
        {lines.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {shown.map((l) => (
              <li key={l.key} className="text-[13px] leading-snug text-slate-600">
                <span className="font-semibold text-slate-700">{l.label}:</span>{" "}
                {l.from !== null && <><span className="text-slate-500 line-through decoration-slate-300">{l.from}</span> <span aria-hidden="true">→</span> </>}
                <span className="font-semibold text-slate-900">{l.to}</span>
              </li>
            ))}
          </ul>
        )}
        {lines.length > 3 && (
          <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-xs font-semibold text-primary">
            {open ? "Show less" : `Show ${lines.length - 3} more`}
          </button>
        )}
        <p className="mt-1 text-xs text-slate-500">{withDate ? new Date(entry.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", " : ""}{clock(entry.at)}</p>
      </div>
    </li>
  );
}

// Restricted history of one lead or quote
export function HistoryPanel({ table, id, title = "History" }) {
  const sb = supabase();
  const { canSeeActivity, team } = useApp();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!canSeeActivity || !id) return;
    let q = sb.from("activity_log").select("*").eq("record_id", id);
    if (table) q = q.eq("table_name", table);
    q.order("at", { ascending: false }).limit(40).then(({ data }) => setRows(data || []));
  }, [sb, canSeeActivity, id, table]);

  if (!canSeeActivity) return null;
  return (
    <section className="card p-5">
      <h2 className="mb-1 font-bold text-slate-900">{title}</h2>
      <p className="mb-2 text-xs text-slate-500">Only a few people can see this. Who did what, and when.</p>
      {rows === null ? <div className="h-16 animate-pulse rounded-xl bg-slate-100" /> : rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">No history recorded yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => <ActivityItem key={r.id} entry={r} team={team} withDate showActor />)}
        </ul>
      )}
    </section>
  );
}

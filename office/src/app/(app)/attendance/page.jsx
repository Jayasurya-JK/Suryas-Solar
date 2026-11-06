"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { ATT_STATUSES, StatusBadge, StatusPicker, markAttendance } from "@/components/Attendance";
import { Avatar, Notice, PageHeader, Spinner } from "@/components/ui";
import { dmy, today } from "@/lib/format";

const MONTH_START = () => today().slice(0, 7) + "-01";

export default function Attendance() {
  const sb = supabase();
  const { profile, isOwner, team } = useApp();
  const [mine, setMine] = useState(undefined);
  const [month, setMonth] = useState([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const day = today();
    const [{ data: own }, { data: rows }] = await Promise.all([
      sb.from("attendance").select("*").eq("user_id", profile.id).eq("work_date", day).maybeSingle(),
      sb.from("attendance").select("user_id, status, work_date").gte("work_date", MONTH_START()).lte("work_date", day),
    ]);
    setMine(own || null);
    setNote(own?.note || "");
    setMonth(rows || []);
  }, [sb, profile.id]);

  useEffect(() => { load(); }, [load]);

  const save = async (status) => {
    setBusy(true);
    setMsg(null);
    const { error } = await markAttendance(sb, profile.id, status, note);
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error.message });
    await load();
    setMsg({ tone: "green", text: "Saved for today." });
  };

  const byUser = useMemo(() => {
    const map = {};
    month.forEach((r) => { (map[r.user_id] = map[r.user_id] || []).push(r); });
    return map;
  }, [month]);

  const day = today();
  const todays = (id) => (byUser[id] || []).find((r) => r.work_date === day)?.status;
  const counts = (id) => {
    const rows = byUser[id] || [];
    return ATT_STATUSES.map((s) => ({ ...s, n: rows.filter((r) => r.status === s.id).length }));
  };

  // Everyone who is tracked today: all staff, plus any admin who has marked themselves.
  const roster = team
    .filter((t) => t.role === "staff" || todays(t.id))
    .sort((a, b) => {
      const order = { working: 0, partial: 1, leave: 2 };
      const av = order[todays(a.id)] ?? 3, bv = order[todays(b.id)] ?? 3;
      return av - bv || (a.full_name || "").localeCompare(b.full_name || "");
    });

  if (mine === undefined) return <div className="flex justify-center py-20"><Spinner /></div>;

  const marked = roster.filter((t) => todays(t.id)).length;

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance" subtitle={`Your day and the team's, for ${dmy(day)}.`} />

      <section className="card p-5">
        <h2 className="font-bold text-slate-900">Today</h2>
        <p className="mt-1 text-sm text-slate-500">
          {mine ? `You marked "${ATT_STATUSES.find((s) => s.id === mine.status)?.label}" today. Tap another to change it.` : "Mark how today is going."}
        </p>
        <div className="mt-4"><StatusPicker value={mine?.status} onChange={save} busy={busy} /></div>
        <input className="input mt-3" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => mine && save(mine.status)}
          placeholder="Note (optional) - reason for half day or leave" />
        {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      </section>

      {isOwner && (
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Team today</h2>
            <span className="text-xs font-semibold text-slate-500">{marked} of {roster.length} marked</span>
          </div>
          {roster.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No one to show yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {roster.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={t.full_name || "?"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{t.full_name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      {counts(t.id).map((c) => (
                        <span key={c.id} className="text-[11px] text-slate-500">{c.short} {c.n}</span>
                      ))}
                    </div>
                  </div>
                  <StatusBadge status={todays(t.id)} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-500">Small numbers are this month&apos;s count of Working / Working partially / Leave.</p>
        </section>
      )}

      <section className="card p-5">
        <h2 className="font-bold text-slate-900">{isOwner ? "Your month" : "Your month"}</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {counts(profile.id).map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-xl font-bold text-slate-900">{c.n}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {(byUser[profile.id] || []).slice().sort((a, b) => (a.work_date < b.work_date ? 1 : -1)).slice(0, 10).map((r) => (
            <li key={r.work_date} className="flex items-center justify-between gap-2 py-2">
              <span className="text-sm text-slate-600">{dmy(r.work_date)}</span>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

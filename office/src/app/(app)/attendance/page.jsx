"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { ATT_STATUSES, StatusBadge, StatusPicker, attLabel, markAttendance } from "@/components/Attendance";
import { Avatar, Field, Modal, Notice, PageHeader, Spinner } from "@/components/ui";
import { addDays, dmy, today } from "@/lib/format";

const BACK_DAYS = 7; // admin can fill in or correct up to a week back

export default function Attendance() {
  const sb = supabase();
  const { profile, isOwner, team } = useApp();
  const isStaff = profile.role === "staff";
  const day = today();
  const days = useMemo(() => Array.from({ length: BACK_DAYS }, (_, i) => addDays(day, -i)), [day]);

  const [rows, setRows] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const monthStart = day.slice(0, 7) + "-01";
    const from = days[days.length - 1] < monthStart ? days[days.length - 1] : monthStart;
    const { data } = await sb.from("attendance").select("user_id, status, note, work_date").gte("work_date", from).lte("work_date", day);
    setRows(data || []);
  }, [sb, day, days]);

  useEffect(() => { load(); }, [load]);

  const byUser = useMemo(() => {
    const map = {};
    (rows || []).forEach((r) => { (map[r.user_id] = map[r.user_id] || []).push(r); });
    return map;
  }, [rows]);

  const rowOn = (id, date) => (byUser[id] || []).find((r) => r.work_date === date) || null;
  const statusOn = (id, date) => rowOn(id, date)?.status || null;
  const counts = (id) => {
    const mine = byUser[id] || [];
    return ATT_STATUSES.map((s) => ({ ...s, n: mine.filter((r) => r.status === s.id).length }));
  };

  useEffect(() => { setNote(rowOn(profile.id, day)?.note || ""); }, [byUser, profile.id, day]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveOwn = async (status) => {
    setBusy(true);
    setMsg(null);
    const { error } = await markAttendance(sb, profile.id, status, note, day);
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error.message });
    await load();
    setMsg({ tone: "green", text: "Saved for today." });
  };

  const openEditor = (member) => {
    setMsg(null);
    setEditing({ member, date: day, status: statusOn(member.id, day), note: rowOn(member.id, day)?.note || "" });
  };

  const pickDay = (date) => setEditing((e) => ({ ...e, date, status: statusOn(e.member.id, date), note: rowOn(e.member.id, date)?.note || "" }));

  const saveOther = async () => {
    setBusy(true);
    const { error } = await markAttendance(sb, editing.member.id, editing.status, editing.note, editing.date);
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error.message });
    const saved = `${editing.member.full_name} - ${editing.date === day ? "today" : dmy(editing.date)}`;
    setEditing(null);
    await load();
    setMsg({ tone: "green", text: `Saved ${saved}.` });
  };

  if (rows === null) return <div className="flex justify-center py-20"><Spinner /></div>;

  const roster = team
    .filter((t) => t.role === "staff" || statusOn(t.id, day))
    .sort((a, b) => {
      const order = { working: 0, partial: 1, leave: 2 };
      const av = order[statusOn(a.id, day)] ?? 3, bv = order[statusOn(b.id, day)] ?? 3;
      return av - bv || (a.full_name || "").localeCompare(b.full_name || "");
    });
  const marked = roster.filter((t) => statusOn(t.id, day)).length;
  const mine = statusOn(profile.id, day);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance"
        subtitle={isStaff ? `Mark your attendance for ${dmy(day)}. If you forget, tell an admin - they can fill it in for you.` : "Tap a staff member to mark or correct their day."}
      />

      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

      {isStaff && (
        <section className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Today - {dmy(day)}</h2>
            <StatusBadge status={mine} />
          </div>
          <div className="mt-3"><StatusPicker value={mine} onChange={saveOwn} busy={busy} /></div>
          <input className="input mt-3" value={note} onChange={(e) => setNote(e.target.value)}
            onBlur={() => mine && saveOwn(mine)}
            placeholder="Note (optional) - why half day or leave" />
          <p className="mt-3 text-xs text-slate-500">Past days can only be filled in by an admin.</p>
        </section>
      )}

      {isOwner && (
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Team today</h2>
            <span className="text-xs font-semibold text-slate-500">{marked} of {roster.length} marked</span>
          </div>
          {roster.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No staff to show yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {roster.map((t) => (
                <li key={t.id}>
                  <button onClick={() => openEditor(t)} className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-slate-50 active:bg-slate-100">
                    <Avatar name={t.full_name || "?"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{t.full_name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {counts(t.id).map((c) => (
                          <span key={c.id} className="text-[11px] text-slate-500">{c.short} {c.n}</span>
                        ))}
                      </div>
                    </div>
                    <StatusBadge status={statusOn(t.id, day)} />
                    <span className="text-slate-300" aria-hidden="true">&rsaquo;</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-500">Counts are this month&apos;s Working / Partial / Leave. Tap a name to mark a day up to a week back.</p>
        </section>
      )}

      {isStaff && (
        <section className="card p-5">
          <h2 className="font-bold text-slate-900">This month</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {counts(profile.id).map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 p-3 text-center">
                <p className="text-xl font-bold text-slate-900">{c.n}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{c.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {editing && (
        <Modal title={`${editing.member.full_name} - attendance`} onClose={() => setEditing(null)}>
          <Field label="Day">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {days.map((d) => {
                const st = statusOn(editing.member.id, d);
                const on = d === editing.date;
                const wd = new Date(d + "T00:00").toLocaleDateString("en-IN", { weekday: "short" });
                return (
                  <button key={d} type="button" onClick={() => pickDay(d)} aria-pressed={on}
                    className={`flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-xl border py-2 text-center transition ${on ? "border-primary bg-primary-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                    <span className={`text-[10px] font-bold uppercase ${on ? "text-primary" : "text-slate-500"}`}>{wd}</span>
                    <span className={`text-sm font-bold ${on ? "text-primary" : "text-slate-700"}`}>{d.slice(8)}</span>
                    <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${st ? ATT_STATUSES.find((s) => s.id === st).dot : "bg-slate-200"}`} />
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Status">
            <StatusPicker value={editing.status} busy={busy} onChange={(s) => setEditing((e) => ({ ...e, status: s }))} />
          </Field>

          <Field label="Note (optional)">
            <input className="input" value={editing.note} onChange={(e) => setEditing((x) => ({ ...x, note: e.target.value }))}
              placeholder="Reason for half day or leave" />
          </Field>

          <p className="text-xs text-slate-500">Currently: {editing.status ? attLabel(editing.status) : "not marked"} on {editing.date === day ? "today" : dmy(editing.date)}.</p>

          <div className="mt-4 flex gap-2">
            <button className="btn btn-ghost flex-1" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn btn-primary flex-1" disabled={!editing.status || busy} onClick={saveOther}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

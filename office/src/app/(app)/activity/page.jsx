"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { ActivityItem } from "@/components/History";
import { ListSkeleton } from "@/components/Extras";
import { Empty, FilterTabs, Icon, PageHeader, SearchBox } from "@/components/ui";
import { TYPE_FILTERS } from "@/lib/activity";
import { dayLabel } from "@/lib/format";

const PAGE = 50;

// Shown when the screen was opened from Settings > Team > "See what Ravi did"
function PersonBar({ person, onClear }) {
  if (!person) return null;
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
        <Icon name="users" className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">Showing only {person.full_name || "one person"}</p>
        <p className="truncate text-xs text-slate-500">{person.username ? `User ID: ${person.username}` : "All their entries"}</p>
      </div>
      <button type="button" onClick={onClear}
        className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:text-slate-900">
        <Icon name="x" className="h-3.5 w-3.5" />Everyone
      </button>
    </div>
  );
}

function Feed() {
  const sb = supabase();
  const router = useRouter();
  const personId = useSearchParams().get("person");
  const { canSeeActivity, team } = useApp();
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [rows, setRows] = useState(null);
  const [person, setPerson] = useState(null);

  // Wait for a pause in typing, and drop characters that would break the search filter
  useEffect(() => {
    const t = setTimeout(() => setTerm(search.trim().replace(/[,%()]/g, "")), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setLimit(PAGE); }, [type, term, personId]);

  const load = useCallback(async () => {
    if (!canSeeActivity) return;
    let q = sb.from("activity_log").select("*").order("at", { ascending: false }).limit(limit);
    const f = TYPE_FILTERS.find((x) => x.id === type);
    if (f?.tables) q = q.in("table_name", f.tables);
    if (f?.actions) q = q.in("action", f.actions);
    if (personId) q = q.eq("actor", personId);
    if (term) q = q.or(`summary.ilike.%${term}%,label.ilike.%${term}%,actor_name.ilike.%${term}%`);
    const { data } = await q;
    setRows(data || []);
  }, [sb, canSeeActivity, type, personId, term, limit]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!personId) { setPerson(null); return; }
    sb.from("profiles").select("id, full_name, username").eq("id", personId).maybeSingle()
      .then(({ data }) => setPerson(data || { id: personId }));
  }, [sb, personId]);

  // One card per day, newest first (the query is already sorted)
  const groups = useMemo(() => {
    const out = [];
    (rows || []).forEach((r) => {
      const key = new Date(r.at).toDateString();
      const last = out[out.length - 1];
      if (last?.key === key) last.items.push(r);
      else out.push({ key, label: dayLabel(r.at), items: [r] });
    });
    return out;
  }, [rows]);

  if (!canSeeActivity) return <div className="card p-8 text-center text-slate-600">You do not have access to the activity history.</div>;

  const filtered = type !== "all" || !!term || !!personId;
  const more = (rows || []).length === limit;

  return (
    <>
      <PageHeader title="Activity" subtitle="Who changed what, and when. Only you can see this." />

      <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="min-w-0"><FilterTabs tabs={TYPE_FILTERS} value={type} onChange={setType} /></div>
        <SearchBox value={search} onChange={setSearch} placeholder="Search a name or record" />
      </div>

      <PersonBar person={person} onClear={() => router.replace("/activity")} />

      {!rows ? <ListSkeleton rows={6} /> : rows.length === 0 ? (
        <Empty icon="clock"
          title={filtered ? "Nothing matches" : "Nothing recorded yet"}
          text={filtered
            ? "Try another type, or search for a different name."
            : "Changes to leads, quotes, expenses and the team appear here as they happen."}>
          {filtered && (
            <button className="btn-ghost" onClick={() => { setType("all"); setSearch(""); router.replace("/activity"); }}>
              <Icon name="back" className="h-4 w-4" />Show everything
            </button>
          )}
        </Empty>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.key} className="mb-4">
              <p className="mb-1.5 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {g.label}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{g.items.length}</span>
              </p>
              <div className="card px-4 py-1">
                <ul className="divide-y divide-slate-100">
                  {g.items.map((r) => <ActivityItem key={r.id} entry={r} team={team} />)}
                </ul>
              </div>
            </section>
          ))}
          {more && (
            <button className="btn-ghost w-full" onClick={() => setLimit(limit + PAGE)}>Load older entries</button>
          )}
        </>
      )}
    </>
  );
}

export default function Activity() {
  return (
    <Suspense fallback={<ListSkeleton rows={6} />}>
      <Feed />
    </Suspense>
  );
}

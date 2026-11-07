"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ListSkeleton } from "@/components/Extras";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import SetupNeeded from "@/components/SetupNeeded";
import { Empty, Field, FilterTabs, Icon, IconButton, Modal, Notice, PageHeader, SearchBox, Segmented, Switch } from "@/components/ui";
import { PROJECT_STEPS, dmy, rupees, stageLabel, today } from "@/lib/format";
import { useOnce } from "@/lib/useOnce";

const MISSING_TABLE = (e) => /42P01|PGRST205|does not exist/i.test(`${e?.code || ""} ${e?.message || ""}`);

const BLANK = {
  customer: "", phone: "", town: "", system_kw: "", panel_brand: "", project_type: "residential",
  subsidy: true, quoted_amount: "", advance: "", started_on: today(), notes: "",
};

// One pasted line becomes one project: name, phone, town, kW, quoted, advance, start date.
function parseLine(line) {
  const parts = line.split(/\t|,|\s{2,}|\|/).map((s) => s.trim()).filter((s) => s !== "");
  if (parts.length < 2) return null;
  const [customer, phone, town, kw, quoted, advance, started] = parts;
  const num = (v) => (v == null || v === "" ? null : Number(String(v).replace(/[^\d.]/g, "")) || null);
  return {
    customer,
    phone: (phone || "").replace(/\D/g, "").slice(-10) || null,
    town: town || null,
    system_kw: num(kw),
    quoted_amount: num(quoted) || 0,
    advance: num(advance) || 0,
    started_on: /^\d{4}-\d{2}-\d{2}$/.test(started || "") ? started : today(),
  };
}

export default function Projects() {
  const sb = supabase();
  const { profile, isOwner } = useApp();
  const [rows, setRows] = useState(null);
  const [steps, setSteps] = useState([]);
  const [setup, setSetup] = useState(false);
  const [tab, setTab] = useState("open");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState(false);
  const [text, setText] = useState("");
  const createOnce = useOnce();
  const importOnce = useOnce();

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([
      sb.from("projects").select("*").order("started_on", { ascending: false }),
      sb.from("project_steps").select("project_id, status"),
    ]);
    if (MISSING_TABLE(p.error)) return setSetup(true);
    setSetup(false);
    setRows(p.data || []);
    setSteps(s.data || []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const progress = useMemo(() => {
    const m = {};
    steps.forEach((s) => {
      m[s.project_id] = m[s.project_id] || { done: 0, total: 0 };
      m[s.project_id].total += 1;
      if (s.status === "done") m[s.project_id].done += 1;
    });
    return m;
  }, [steps]);

  const counts = useMemo(() => {
    const list = rows || [];
    return {
      open: list.filter((r) => r.status === "open").length,
      hold: list.filter((r) => r.status === "on_hold").length,
      done: list.filter((r) => r.status === "completed").length,
      all: list.length,
    };
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (tab === "open" && r.status !== "open") return false;
      if (tab === "hold" && r.status !== "on_hold") return false;
      if (tab === "done" && r.status !== "completed") return false;
      if (!needle) return true;
      return `${r.customer} ${r.phone || ""} ${r.town || ""} ${r.ref_no || ""}`.toLowerCase().includes(needle);
    });
  }, [rows, tab, q]);

  const set = (k) => (e) => setForm((cur) => ({ ...cur, [k]: e.target.value }));

  const create = (e) => {
    e.preventDefault();
    return createOnce(async () => {
      if (form.customer.trim().length < 2) return setMsg({ tone: "red", text: "Enter the customer name." });
      setBusy(true);
      const { data, error } = await sb.from("projects").insert({
        customer: form.customer.trim(),
        phone: form.phone.replace(/\D/g, "").slice(-10) || null,
        town: form.town.trim() || null,
        system_kw: Number(form.system_kw) || null,
        panel_brand: form.panel_brand.trim() || null,
        project_type: form.project_type,
        subsidy: form.subsidy,
        quoted_amount: Number(form.quoted_amount) || 0,
        started_on: form.started_on || today(),
        notes: form.notes.trim() || null,
        created_by: profile.id,
      }).select().single();
      setBusy(false);
      if (error) return setMsg({ tone: "red", text: MISSING_TABLE(error) ? "Run the setup file first." : error.message });
      if (Number(form.advance) > 0) {
        await sb.from("project_payments").insert({ project_id: data.id, kind: "advance", amount: Number(form.advance), paid_on: form.started_on || today(), created_by: profile.id });
      }
      setSheet(false);
      setForm({ ...BLANK });
      setMsg({ tone: "green", text: `${data.ref_no || "Project"} created.` });
      setTimeout(() => setMsg(null), 4000);
      load();
    });
  };

  const importList = () =>
    importOnce(async () => {
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const parsed = lines.map(parseLine).filter(Boolean);
      if (!parsed.length) return setMsg({ tone: "red", text: "Nothing to import. Put one customer per line." });
      setBusy(true);
      let made = 0;
      for (const p of parsed) {
        const { data, error } = await sb.from("projects").insert({
          customer: p.customer, phone: p.phone, town: p.town, system_kw: p.system_kw,
          quoted_amount: p.quoted_amount, started_on: p.started_on, created_by: profile.id,
        }).select().single();
        if (error) continue;
        made += 1;
        if (p.advance > 0) {
          await sb.from("project_payments").insert({ project_id: data.id, kind: "advance", amount: p.advance, paid_on: p.started_on, created_by: profile.id });
        }
      }
      setBusy(false);
      setPaste(false);
      setText("");
      setMsg({ tone: made ? "green" : "red", text: made ? `${made} customer${made === 1 ? "" : "s"} added.` : "Nothing was added." });
      setTimeout(() => setMsg(null), 5000);
      load();
    });

  if (setup) {
    return (
      <>
        <PageHeader title="Projects" subtitle="Every customer, from the survey to the last payment." />
        <SetupNeeded title="Projects" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Projects" subtitle="Every customer, from the survey to the last payment."
        fab={{ label: "New project", onClick: () => setSheet(true) }}
        mobileActions={isOwner ? <IconButton icon="download" label="Paste a list" onClick={() => setPaste(true)} /> : null}>
        {isOwner && <button className="btn-ghost" onClick={() => setPaste(true)}><Icon name="plus" className="h-4 w-4" />Paste a list</button>}
      </PageHeader>

      {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <FilterTabs value={tab} onChange={setTab} tabs={[
          { id: "open", label: "Running", n: counts.open },
          { id: "hold", label: "On hold", n: counts.hold },
          { id: "done", label: "Finished", n: counts.done },
          { id: "all", label: "All", n: counts.all },
        ]} />
        <div className="min-w-56 flex-1"><SearchBox value={q} onChange={setQ} placeholder="Search name, phone or number" /></div>
      </div>

      {!rows ? <ListSkeleton rows={4} /> : shown.length === 0 ? (
        <Empty icon="sun" title={q ? "Nothing matches that" : "No projects yet"}
          text={q ? "Try a different name or phone number." : "Tap New project to add the first customer, or paste your paper list in one go."}>
          <button className="btn-primary" onClick={() => setSheet(true)}><Icon name="plus" className="h-4 w-4" />New project</button>
        </Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((r) => {
            const p = progress[r.id] || { done: 0, total: PROJECT_STEPS.length };
            const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <Link key={r.id} href={`/projects/${r.id}`} className="card p-4 transition hover:border-primary/40 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{r.customer}</p>
                    <p className="truncate text-xs text-slate-500">{[r.ref_no, r.town, r.system_kw ? `${r.system_kw} kW` : null].filter(Boolean).join(" · ")}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${r.status === "completed" ? "bg-teal-50 text-teal" : r.status === "on_hold" ? "bg-amber-50 text-amber-700" : "bg-primary-50 text-primary"}`}>
                    {stageLabel(r.stage)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{p.done} of {p.total} steps</span>
                  <span className="font-semibold text-slate-700">{rupees(r.quoted_amount)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {sheet && (
        <Modal title="New project" onClose={() => setSheet(false)}>
          <form onSubmit={create} className="space-y-4">
            <Field label="Customer name *"><input className="input" value={form.customer} onChange={set("customer")} placeholder="e.g. Ramesh, Cuddalore" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mobile"><input className="input" inputMode="numeric" maxLength={10} value={form.phone} onChange={set("phone")} /></Field>
              <Field label="Town"><input className="input" value={form.town} onChange={set("town")} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="System size (kW)"><input className="input" inputMode="decimal" value={form.system_kw} onChange={set("system_kw")} placeholder="3" /></Field>
              <Field label="Panel brand"><input className="input" value={form.panel_brand} onChange={set("panel_brand")} placeholder="Waaree" /></Field>
            </div>
            <Field label="Type"><Segmented size="sm" value={form.project_type} onChange={(v) => setForm((c) => ({ ...c, project_type: v }))} options={[{ id: "residential", label: "Home" }, { id: "commercial", label: "Commercial" }]} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quoted amount (₹)"><input className="input" inputMode="decimal" value={form.quoted_amount} onChange={set("quoted_amount")} placeholder="0" /></Field>
              <Field label="Advance received (₹)"><input className="input" inputMode="decimal" value={form.advance} onChange={set("advance")} placeholder="0" /></Field>
            </div>
            <Field label="Started on"><input className="input" type="date" value={form.started_on} onChange={set("started_on")} /></Field>
            <Switch checked={form.subsidy} onChange={(v) => setForm((c) => ({ ...c, subsidy: v }))} label="PM Surya Ghar subsidy" hint="Subsidy steps are part of the job" />
            <Field label="Note"><input className="input" value={form.notes} onChange={set("notes")} placeholder="Anything to remember" /></Field>
            {msg?.tone === "red" && <Notice tone="red">{msg.text}</Notice>}
            <button className="btn-primary h-12 w-full text-base" disabled={busy}>{busy ? "Saving..." : "Create project"}</button>
          </form>
        </Modal>
      )}

      {paste && (
        <Modal title="Paste your customer list" onClose={() => setPaste(false)}>
          <p className="text-sm text-slate-600">One customer per line. Separate the details with a comma or a tab.</p>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            Name, Phone, Town, kW, Quoted, Advance, Start date (YYYY-MM-DD - optional)<br />
            Ramesh, 9876543210, Cuddalore, 3, 240000, 50000
          </div>
          <textarea className="input mt-3 min-h-40" value={text} onChange={(e) => setText(e.target.value)}
            placeholder={"Ramesh, 9876543210, Cuddalore, 3, 240000, 50000\nSuresh, 9123456780, Panruti, 5, 380000, 100000"} />
          {msg?.tone === "red" && <div className="mt-3"><Notice tone="red">{msg.text}</Notice></div>}
          <button className="btn-primary mt-4 h-12 w-full text-base" onClick={importList} disabled={busy}>
            {busy ? "Adding..." : "Add these customers"}
          </button>
        </Modal>
      )}
    </>
  );
}

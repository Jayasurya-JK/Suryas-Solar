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

// Where a portal application sits in our eleven steps. Used for the read-only view shown before the
// projects tables exist, so the screen is never a dead end.
const PORTAL_DONE = (status) => {
  const s = String(status || "");
  if (/Disbursed/i.test(s)) return 10;
  if (/Subsidy Request/i.test(s)) return 8;
  if (/Inspection/i.test(s)) return 7;
  if (/Upload Agreement/i.test(s)) return 6;
  if (/Installation/i.test(s)) return 4;
  return 1;
};

// The portal writes dates as DD-MM-YY.
const portalDate = (v) => {
  const m = /^(\d{2})-(\d{2})-(\d{2})$/.exec(String(v || ""));
  return m ? `20${m[3]}-${m[2]}-${m[1]}` : today();
};

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
  const [invoices, setInvoices] = useState([]);
  const [setup, setSetup] = useState(false);
  const [tab, setTab] = useState("open");
  const [payTab, setPayTab] = useState("all");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState(false);
  const [text, setText] = useState("");
  const createOnce = useOnce();
  const importOnce = useOnce();
  const portalOnce = useOnce();

  const load = useCallback(async () => {
    const [p, s, v] = await Promise.all([
      sb.from("projects").select("*").order("started_on", { ascending: false }),
      sb.from("project_steps").select("project_id, status"),
      sb.from("project_invoices").select("project_id, amount, outstanding").gt("amount", 0),
    ]);
    if (MISSING_TABLE(p.error)) return setSetup(true);
    setSetup(false);
    setRows(p.data || []);
    setSteps(s.data || []);
    setInvoices(v.data || []);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  // One line per project: how much was invoiced and how much is still owed.
  const money = useMemo(() => {
    const m = {};
    invoices.forEach((v) => {
      if (!v.project_id) return;
      const cur = m[v.project_id] || { amount: 0, due: 0, count: 0 };
      cur.amount += Number(v.amount || 0);
      cur.due += Number(v.outstanding || 0);
      cur.count += 1;
      m[v.project_id] = cur;
    });
    return m;
  }, [invoices]);

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
      invoiced: list.filter((r) => (money[r.id]?.count || 0) > 0).length,
      notInvoiced: list.filter((r) => (money[r.id]?.count || 0) === 0).length,
      due: list.filter((r) => (money[r.id]?.due || 0) > 0).length,
    };
  }, [rows, money]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (tab === "open" && r.status !== "open") return false;
      if (tab === "hold" && r.status !== "on_hold") return false;
      if (tab === "done" && r.status !== "completed") return false;
      const m = money[r.id] || { count: 0, due: 0 };
      if (payTab === "invoiced" && m.count === 0) return false;
      if (payTab === "notInvoiced" && m.count > 0) return false;
      if (payTab === "due" && m.due <= 0) return false;
      if (!needle) return true;
      return `${r.customer} ${r.phone || ""} ${r.town || ""} ${r.ref_no || ""}`.toLowerCase().includes(needle);
    });
  }, [rows, tab, q, payTab, money]);

  // Money at a glance for whatever is on screen: quoted, received, still to come.
  const totals = useMemo(() => (shown || []).reduce((a, r) => {
    const m = money[r.id] || { amount: 0, due: 0 };
    a.quoted += Number(r.quoted_amount || 0);
    a.received += Math.max(0, m.amount - m.due);
    a.pending += m.due;
    return a;
  }, { quoted: 0, received: 0, pending: 0 }), [shown, money]);

  const set = (k) => (e) => setForm((cur) => ({ ...cur, [k]: e.target.value }));

  // One tap puts every PM Surya Ghar customer into the register with the step the job has already reached.
  const importPortal = () =>
    portalOnce(async () => {
      setBusy(true);
      setMsg(null);
      let list = [];
      try {
        const res = await fetch("/data/pm-surya-ghar.json", { cache: "no-store" });
        list = await res.json();
      } catch { list = []; }
      if (!Array.isArray(list) || list.length === 0) {
        setBusy(false);
        return setMsg({ tone: "red", text: "The portal list could not be read." });
      }
      const { data: existing } = await sb.from("projects").select("phone");
      const have = new Set((existing || []).map((p) => p.phone).filter(Boolean));
      const fresh = list.filter((r) => r.phone && !have.has(r.phone));
      if (fresh.length === 0) {
        setBusy(false);
        return setMsg({ tone: "amber", text: "Everyone from the portal is already in the register." });
      }
      const rows = fresh.map((r) => {
        const done = PORTAL_DONE(r.status);
        const stage = (PROJECT_STEPS[done] || PROJECT_STEPS[PROJECT_STEPS.length - 1]).key;
        return {
          customer: r.name,
          phone: r.phone,
          town: r.subdivision || r.circle || null,
          system_kw: r.kwp || null,
          quoted_amount: 0,
          started_on: portalDate(r.submitted),
          stage,
          status: /Disbursed/i.test(r.status) ? "completed" : "open",
          notes: `PM Surya Ghar ${r.app} · consumer ${r.consumer} · ${r.status}`,
          created_by: profile.id,
        };
      });
      const { data: made, error } = await sb.from("projects").insert(rows).select("id,stage");
      if (error) {
        setBusy(false);
        return setMsg({ tone: "red", text: error.message });
      }
      // Tick the steps each job has already passed, one request per group of the same depth.
      const groups = {};
      (made || []).forEach((p) => {
        const done = PROJECT_STEPS.findIndex((s) => s.key === p.stage);
        if (done > 0) (groups[done] = groups[done] || []).push(p.id);
      });
      for (const [done, ids] of Object.entries(groups)) {
        await sb.from("project_steps").update({ status: "done" }).in("project_id", ids).lte("position", Number(done));
      }
      setBusy(false);
      setMsg({ tone: "green", text: `${(made || []).length} customers added from the portal.` });
      setTimeout(() => setMsg(null), 6000);
      load();
    });

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
        <PortalList />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Projects" subtitle="Every customer, from the survey to the last payment."
        fab={{ label: "New project", onClick: () => setSheet(true) }}
        mobileActions={isOwner ? <IconButton icon="download" label="Paste a list" onClick={() => setPaste(true)} /> : null}>
        {isOwner && <button className="btn-ghost" onClick={importPortal} disabled={busy}><Icon name="sun" className="h-4 w-4" />Add portal customers</button>}
        {isOwner && <button className="btn-ghost" onClick={() => setPaste(true)}><Icon name="plus" className="h-4 w-4" />Paste a list</button>}
      </PageHeader>

      {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="mb-4 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white text-center">
        <div className="px-2 py-3">
          <p className="text-[15px] font-black leading-tight text-slate-900 sm:text-xl">{rupees(totals.quoted)}</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">Quoted</p>
        </div>
        <div className="px-2 py-3">
          <p className="text-[15px] font-black leading-tight text-teal sm:text-xl">{rupees(totals.received)}</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">Received</p>
        </div>
        <div className="px-2 py-3">
          <p className="text-[15px] font-black leading-tight text-red-600 sm:text-xl">{rupees(totals.pending)}</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">Not received</p>
        </div>
      </div>
      <p className="mb-3 text-center text-[11px] text-slate-500">For the {shown.length} project{shown.length === 1 ? "" : "s"} shown. Open one to correct its amount or record a payment.</p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <FilterTabs value={tab} onChange={setTab} tabs={[
          { id: "open", label: "Running", n: counts.open },
          { id: "hold", label: "On hold", n: counts.hold },
          { id: "done", label: "Finished", n: counts.done },
          { id: "all", label: "All", n: counts.all },
        ]} />
        <div className="min-w-56 flex-1"><SearchBox value={q} onChange={setQ} placeholder="Search name, phone or number" /></div>
      </div>

      <div className="mb-4">
        <FilterTabs value={payTab} onChange={setPayTab} tabs={[
          { id: "all", label: "Every invoice state" },
          { id: "notInvoiced", label: "No invoice", n: counts.notInvoiced },
          { id: "invoiced", label: "Invoice added", n: counts.invoiced },
          { id: "due", label: "Money pending", n: counts.due, warn: true },
        ]} />
      </div>

      {!rows ? <ListSkeleton rows={4} /> : shown.length === 0 ? (
        <Empty icon="sun" title={q ? "Nothing matches that" : "No projects yet"}
          text={q ? "Try a different name or phone number." : "Tap New project to add the first customer, or paste your paper list in one go."}>
          <button className="btn-primary" onClick={() => setSheet(true)}><Icon name="plus" className="h-4 w-4" />New project</button>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="shrink-0">{p.done} of {p.total} steps</span>
                  {money[r.id]?.count ? (
                    <span className="min-w-0 text-right">
                      <span className="font-semibold text-slate-700">{rupees(money[r.id].amount)}</span>
                      {money[r.id].due > 0 && <span className="block font-bold text-red-600">{rupees(money[r.id].due)} pending</span>}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">No invoice</span>
                  )}
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

// Before the projects tables exist, the real portal list still makes this screen useful: every customer
// with the step the job has reached, read-only, newest first.
function PortalList() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/data/pm-surya-ghar.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setRows(Array.isArray(list) ? list : []))
      .catch(() => setRows([]));
  }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (rows || []).filter((r) => !needle || `${r.name} ${r.phone} ${r.app}`.toLowerCase().includes(needle));
    return list.slice(0, 60);
  }, [rows, q]);

  if (!rows || rows.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-900">From your portal list</h2>
          <p className="text-sm text-slate-500">{rows.length} applications, read-only, newest first. Run the setup file to edit them here.</p>
        </div>
        <Link href="/applications" className="btn-ghost !h-9 !px-3"><Icon name="doc" className="h-4 w-4" />Open Applications</Link>
      </div>
      <div className="mb-3 max-w-sm"><SearchBox value={q} onChange={setQ} placeholder="Find a customer" /></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((r) => {
          const done = PORTAL_DONE(r.status);
          const pct = Math.round((done / PROJECT_STEPS.length) * 100);
          return (
            <div key={r.app + r.sr} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">{r.name}</p>
                  <p className="truncate text-xs text-slate-500">{r.kwp ? `${Number(r.kwp)} kW · ` : ""}{r.app}</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{done} of {PROJECT_STEPS.length} steps</span>
                <span className="truncate font-semibold text-slate-700">{String(r.status || "").replace(/\s*\(.*\)$/, "")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

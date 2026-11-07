"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import SetupNeeded from "@/components/SetupNeeded";
import { confirmAction } from "@/components/Confirm";
import { Badge, Field, Icon, Modal, Notice, Segmented, Spinner } from "@/components/ui";
import { PAYMENT_KINDS, dmy, labelOf, rupees, stageLabel, today, waLink } from "@/lib/format";
import { useOnce } from "@/lib/useOnce";

const MISSING_TABLE = (e) => /42P01|PGRST205|does not exist/i.test(`${e?.code || ""} ${e?.message || ""}`);
const MODES = [{ id: "cash", label: "Cash" }, { id: "upi", label: "UPI" }, { id: "bank", label: "Bank" }, { id: "cheque", label: "Cheque" }];

export default function ProjectDetail() {
  const { id } = useParams();
  const sb = supabase();
  const router = useRouter();
  const { isOwner, reload: refreshShell } = useApp();
  const [p, setP] = useState(null);
  const [steps, setSteps] = useState([]);
  const [payments, setPayments] = useState([]);
  const [setup, setSetup] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pay, setPay] = useState(false);
  const [payForm, setPayForm] = useState({ kind: "advance", amount: "", paid_on: today(), mode: "cash", reference: "", note: "" });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [notes, setNotes] = useState("");
  const stepOnce = useOnce();
  const payOnce = useOnce();
  const saveOnce = useOnce();

  const load = useCallback(async () => {
    const [one, s, m] = await Promise.all([
      sb.from("projects").select("*").eq("id", id).single(),
      sb.from("project_steps").select("*").eq("project_id", id).order("position"),
      sb.from("project_payments").select("*").eq("project_id", id).order("paid_on", { ascending: false }),
    ]);
    if (MISSING_TABLE(one.error)) return setSetup(true);
    if (one.error) return setMsg({ tone: "red", text: one.error.message });
    setP(one.data);
    setNotes(one.data?.notes || "");
    setSteps(s.data || []);
    setPayments(m.data || []);
  }, [sb, id]);
  useEffect(() => { load(); }, [load]);

  const done = steps.filter((s) => s.status === "done").length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const received = useMemo(() => payments.reduce((a, x) => a + Number(x.amount || 0), 0), [payments]);
  const balance = Number(p?.quoted_amount || 0) - received;

  const flash = (tone, text) => { setMsg({ tone, text }); setTimeout(() => setMsg(null), 4000); };

  // Ticking a step is the real work: it dates the step and moves the job on to the next open one.
  const toggleStep = (s) =>
    stepOnce(async () => {
      const next = s.status === "done" ? "pending" : "done";
      const { error } = await sb.from("project_steps")
        .update({ status: next, done_on: next === "done" ? today() : null })
        .eq("id", s.id);
      if (error) return flash("red", error.message);
      const list = steps.map((x) => (x.id === s.id ? { ...x, status: next } : x));
      setSteps(list);
      const moving = list.find((x) => x.status !== "done") || list[list.length - 1];
      await sb.from("projects").update({ stage: moving.key }).eq("id", id);
      load();
    });

  const addPayment = () =>
    payOnce(async () => {
      if (!(Number(payForm.amount) > 0)) return flash("red", "Enter the amount.");
      const { error } = await sb.from("project_payments").insert({
        project_id: id, kind: payForm.kind, amount: Number(payForm.amount), paid_on: payForm.paid_on || today(),
        mode: payForm.mode, reference: payForm.reference.trim() || null, note: payForm.note.trim() || null,
      });
      if (error) return flash("red", error.message);
      setPay(false);
      setPayForm({ kind: "part", amount: "", paid_on: today(), mode: "cash", reference: "", note: "" });
      flash("green", "Payment recorded.");
      load();
    });

  const setStatus = async (status) => {
    const { error } = await sb.from("projects").update({ status, completed_on: status === "completed" ? today() : null }).eq("id", id);
    if (error) return flash("red", error.message);
    flash("green", status === "completed" ? "Project finished." : "Project updated.");
    load();
  };

  const saveDetails = () =>
    saveOnce(async () => {
      const { error } = await sb.from("projects").update({
        customer: form.customer.trim(), phone: form.phone.replace(/\D/g, "").slice(-10) || null,
        town: form.town.trim() || null, system_kw: Number(form.system_kw) || null,
        panel_brand: form.panel_brand.trim() || null, quoted_amount: Number(form.quoted_amount) || 0,
        target_on: form.target_on || null, notes: notes.trim() || null,
      }).eq("id", id);
      if (error) return flash("red", error.message);
      setEdit(false);
      flash("green", "Saved.");
      load();
    });

  const remove = async () => {
    const ok = await confirmAction({ title: "Delete this project?", text: `${p.customer} and its steps and payments will be removed. This cannot be undone.`, confirmLabel: "Delete project" });
    if (!ok) return;
    await sb.from("projects").delete().eq("id", id);
    refreshShell();
    router.replace("/projects");
  };

  if (setup) return <SetupNeeded title="Projects" />;
  if (!p) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <Link href="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <Icon name="back" className="h-4 w-4" />All projects
      </Link>

      {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{p.ref_no || "Project"}</p>
            <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-900">{p.customer}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {[p.town, p.system_kw ? `${p.system_kw} kW` : null, p.panel_brand, p.project_type === "commercial" ? "Commercial" : "Home"].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-xs text-slate-500">Started {dmy(p.started_on)}{p.target_on ? ` · target ${dmy(p.target_on)}` : ""}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={p.status === "completed" ? "green" : p.status === "on_hold" ? "amber" : "blue"}>{p.status === "completed" ? "Finished" : p.status === "on_hold" ? "On hold" : stageLabel(p.stage)}</Badge>
            {p.phone && <a href={`tel:${p.phone}`} className="btn-ghost !h-9 !px-3"><Icon name="phone" className="h-4 w-4" />Call</a>}
            {p.phone && <a href={waLink(p.phone, `Hello ${p.customer}, this is Surya's Solar, Cuddalore.`)} target="_blank" rel="noreferrer" className="btn-ghost !h-9 !px-3"><Icon name="chat" className="h-4 w-4" />WhatsApp</a>}
            <button className="btn-ghost !h-9 !px-3" onClick={() => { setForm({ customer: p.customer, phone: p.phone || "", town: p.town || "", system_kw: p.system_kw || "", panel_brand: p.panel_brand || "", quoted_amount: p.quoted_amount || "", target_on: p.target_on || "" }); setEdit(true); }}><Icon name="pencil" className="h-4 w-4" />Edit</button>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>{done} of {steps.length} steps done</span><span>{pct}%</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <section className="card divide-y divide-slate-100">
          <div className="flex items-center justify-between p-5">
            <h2 className="font-bold text-slate-900">Work steps</h2>
            <span className="text-xs text-slate-500">Tap a step to tick it</span>
          </div>
          {steps.map((s) => (
            <button key={s.id} type="button" onClick={() => toggleStep(s)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${s.status === "done" ? "border-teal bg-teal text-white" : "border-slate-200 bg-white text-slate-300"}`}>
                <Icon name="check" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold ${s.status === "done" ? "text-slate-400 line-through" : "text-slate-900"}`}>{s.name}</span>
                {s.done_on && <span className="block text-xs text-slate-500">Done {dmy(s.done_on)}</span>}
              </span>
            </button>
          ))}
        </section>

        <div className="space-y-4">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Money</h2>
              <button className="btn-ghost !h-9 !px-3" onClick={() => setPay(true)}><Icon name="plus" className="h-4 w-4" />Add</button>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Quoted</dt><dd className="font-semibold text-slate-900">{rupees(p.quoted_amount)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Received</dt><dd className="font-semibold text-teal">{rupees(received)}</dd></div>
              <div className="flex justify-between border-t border-slate-100 pt-2"><dt className="text-slate-500">Balance</dt><dd className={`font-bold ${balance > 0 ? "text-red-600" : "text-slate-900"}`}>{rupees(balance)}</dd></div>
            </dl>
            {payments.length > 0 && (
              <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                {payments.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-800">{rupees(m.amount)}</span>
                      <span className="block text-slate-500">{labelOf(PAYMENT_KINDS, m.kind)} · {dmy(m.paid_on)} · {labelOf(MODES, m.mode)}</span>
                    </span>
                    {isOwner && (
                      <button className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600" aria-label="Delete payment"
                        onClick={async () => { if (await confirmAction({ title: "Remove this payment?", text: `${rupees(m.amount)} will be removed from ${p.customer}.`, confirmLabel: "Remove" })) { await sb.from("project_payments").delete().eq("id", m.id); load(); } }}>
                        <Icon name="trash" className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5">
            <h2 className="font-bold text-slate-900">Status</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.status !== "open" && <button className="btn-ghost !h-9 !px-3" onClick={() => setStatus("open")}>Reopen</button>}
              {p.status !== "on_hold" && <button className="btn-ghost !h-9 !px-3" onClick={() => setStatus("on_hold")}>Put on hold</button>}
              {p.status !== "completed" && <button className="btn-primary !h-9 !px-3" onClick={() => setStatus("completed")}>Mark finished</button>}
            </div>
            {isOwner && <button onClick={remove} className="btn-danger mt-3 w-full"><Icon name="trash" className="h-4 w-4" />Delete project</button>}
          </section>

          <section className="card p-5">
            <h2 className="font-bold text-slate-900">Note</h2>
            <textarea className="input mt-3 min-h-28" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Site details, meter number, subsidy reference..." />
            <button className="btn-ghost mt-3 w-full" onClick={() => saveOnce(async () => {
              const { error } = await sb.from("projects").update({ notes: notes.trim() || null }).eq("id", id);
              flash(error ? "red" : "green", error ? error.message : "Note saved.");
            })}>Save note</button>
          </section>
        </div>
      </div>

      {pay && (
        <Modal title="Add payment" onClose={() => setPay(false)}>
          <div className="space-y-4">
            <Field label="What is it"><Segmented size="sm" value={payForm.kind} onChange={(v) => setPayForm((c) => ({ ...c, kind: v }))} options={PAYMENT_KINDS} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount (₹)"><input className="input !text-lg !font-bold" inputMode="decimal" value={payForm.amount} onChange={(e) => setPayForm((c) => ({ ...c, amount: e.target.value }))} placeholder="0" /></Field>
              <Field label="Date"><input className="input" type="date" value={payForm.paid_on} onChange={(e) => setPayForm((c) => ({ ...c, paid_on: e.target.value }))} /></Field>
            </div>
            <Field label="Paid using"><Segmented size="sm" value={payForm.mode} onChange={(v) => setPayForm((c) => ({ ...c, mode: v }))} options={MODES} /></Field>
            <Field label="Reference"><input className="input" value={payForm.reference} onChange={(e) => setPayForm((c) => ({ ...c, reference: e.target.value }))} placeholder="UPI ref, cheque number" /></Field>
            <Field label="Note"><input className="input" value={payForm.note} onChange={(e) => setPayForm((c) => ({ ...c, note: e.target.value }))} /></Field>
            <button className="btn-primary h-12 w-full text-base" onClick={addPayment}>Save payment</button>
          </div>
        </Modal>
      )}

      {edit && form && (
        <Modal title="Edit project" onClose={() => setEdit(false)}>
          <div className="space-y-4">
            <Field label="Customer name"><input className="input" value={form.customer} onChange={(e) => setForm((c) => ({ ...c, customer: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mobile"><input className="input" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} /></Field>
              <Field label="Town"><input className="input" value={form.town} onChange={(e) => setForm((c) => ({ ...c, town: e.target.value }))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="System size (kW)"><input className="input" inputMode="decimal" value={form.system_kw} onChange={(e) => setForm((c) => ({ ...c, system_kw: e.target.value }))} /></Field>
              <Field label="Panel brand"><input className="input" value={form.panel_brand} onChange={(e) => setForm((c) => ({ ...c, panel_brand: e.target.value }))} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quoted amount (₹)"><input className="input" inputMode="decimal" value={form.quoted_amount} onChange={(e) => setForm((c) => ({ ...c, quoted_amount: e.target.value }))} /></Field>
              <Field label="Target date"><input className="input" type="date" value={form.target_on} onChange={(e) => setForm((c) => ({ ...c, target_on: e.target.value }))} /></Field>
            </div>
            <button className="btn-primary h-12 w-full text-base" onClick={saveDetails}>Save changes</button>
          </div>
        </Modal>
      )}
    </>
  );
}

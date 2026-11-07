"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ListSkeleton } from "@/components/Extras";
import ProjectsTabs from "@/components/ProjectsTabs";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import InvoicePaste from "@/components/InvoicePaste";
import { Badge, Empty, FilterTabs, Icon, Modal, Notice, PageHeader, SearchBox } from "@/components/ui";
import { dmy, rupees, waLink } from "@/lib/format";

const num = (v) => Number(v || 0);
const received = (v) => Math.max(0, num(v.amount) - num(v.outstanding));

// What a person cares about on an invoice: money in, money pending, or nothing written yet.
const state = (v) => {
  if (!num(v.amount)) return "blank";
  if (num(v.outstanding) <= 0) return "paid";
  return received(v) > 0 ? "part" : "due";
};

const STATE_LABEL = { paid: "Paid", part: "Partly paid", due: "Not paid", blank: "No amount" };
const STATE_TONE = { paid: "green", part: "amber", due: "red", blank: "slate" };

// The Indian financial year an invoice date falls in, as "2026-27".
const fyOf = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(2)}`;
};

export default function Invoices() {
  const sb = supabase();
  const { isOwner } = useApp();
  const [rows, setRows] = useState(null);
  const [projects, setProjects] = useState({});
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [fy, setFy] = useState("all");
  const [detail, setDetail] = useState(null);
  const [paste, setPaste] = useState(false);
  const [flash, setFlash] = useState(null);
  const [link, setLink] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);

  const load = useCallback(async () => {
    const [v, p] = await Promise.all([
      sb.from("project_invoices").select("*").order("invoice_date", { ascending: false }).order("invoice_no", { ascending: false }),
      sb.from("projects").select("id, ref_no, customer, phone, town"),
    ]);
    if (v.error) return setError(v.error.message);
    setError(null);
    setRows(v.data || []);
    setProjects(Object.fromEntries((p.data || []).map((x) => [x.id, x])));
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const saveInvoices = async (list) => {
    const { error: bad } = await sb.from("project_invoices").upsert(list, { onConflict: "invoice_no" });
    if (bad) return bad.message;
    await load();
    setPaste(false);
    setFlash({ tone: "green", text: `${list.length} ${list.length === 1 ? "invoice" : "invoices"} saved from the billing book.` });
    return null;
  };

  const years = useMemo(
    () => [...new Set((rows || []).map((v) => fyOf(v.invoice_date)).filter(Boolean))].sort().reverse(),
    [rows],
  );

  const inYear = useMemo(
    () => (rows || []).filter((v) => fy === "all" || fyOf(v.invoice_date) === fy),
    [rows, fy],
  );

  const counts = useMemo(() => {
    const c = { all: inYear.length, due: 0, part: 0, paid: 0, blank: 0, unlinked: 0 };
    inYear.forEach((v) => {
      c[state(v)] += 1;
      if (!v.project_id) c.unlinked += 1;
    });
    return c;
  }, [inYear]);

  const totals = useMemo(() => {
    const t = { billed: 0, got: 0, due: 0 };
    inYear.forEach((v) => {
      if (!num(v.amount)) return;
      t.billed += num(v.amount);
      t.got += received(v);
      t.due += num(v.outstanding);
    });
    return t;
  }, [inYear]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return inYear.filter((v) => {
      if (tab === "unlinked") {
        if (v.project_id) return false;
      } else if (tab !== "all" && state(v) !== tab) return false;
      if (!needle) return true;
      const p = projects[v.project_id];
      return `${v.invoice_no} ${v.customer_name || ""} ${p ? `${p.ref_no} ${p.customer}` : ""}`.toLowerCase().includes(needle);
    });
  }, [inYear, tab, q, projects]);

  const list = useMemo(() => Object.values(projects || {}), [projects]);

  const matches = useMemo(() => {
    const needle = link.trim().toLowerCase();
    if (!needle) return [];
    return list
      .filter((p) => `${p.customer} ${p.ref_no || ""} ${p.town || ""}`.toLowerCase().includes(needle))
      .slice(0, 5);
  }, [list, link]);

  const linkTo = async (projectId) => {
    if (!detail || linkBusy) return;
    setLinkBusy(true);
    const { error: bad } = await sb.from("project_invoices").update({ project_id: projectId }).eq("id", detail.id);
    setLinkBusy(false);
    if (bad) return setFlash({ tone: "red", text: bad.message });
    setRows((prev) => (prev || []).map((v) => (v.id === detail.id ? { ...v, project_id: projectId } : v)));
    setDetail((d) => (d ? { ...d, project_id: projectId } : d));
    setLink("");
    setFlash({ tone: "green", text: projectId ? "Invoice linked to the project." : "Invoice unlinked from its project." });
  };

  if (!isOwner) {
    return (
      <>
        <PageHeader title="GST invoices" subtitle="The invoice book is kept with the owner and admin." />
        <Empty icon="wallet" title="Not for this login" text="Ask the owner if you need to see the invoice book." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="GST invoices" subtitle="Every tax invoice from the billing book, matched to its customer."
        fab={{ label: "Add invoices", onClick: () => setPaste(true) }}>
        <button type="button" className="btn-primary" onClick={() => setPaste(true)}><Icon name="plus" className="h-4 w-4" />Add invoices</button>
      </PageHeader>
      <ProjectsTabs />

      {flash && <Notice tone={flash.tone}>{flash.text}</Notice>}

      {error && <div className="card p-5 text-sm text-red-600">{error}</div>}

      {!rows && !error ? <ListSkeleton rows={5} /> : rows && (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:flex sm:gap-3">
            {[
              { label: "Invoiced", value: rupees(totals.billed), colour: "text-slate-900" },
              { label: "Received", value: rupees(totals.got), colour: "text-teal" },
              { label: "Pending", value: rupees(totals.due), colour: "text-red-600" },
            ].map((s) => (
              <div key={s.label} className="card flex-1 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className={`mt-0.5 whitespace-nowrap text-[13px] font-bold min-[360px]:text-base sm:text-xl ${s.colour}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <FilterTabs value={tab} onChange={setTab} tabs={[
              { id: "all", label: "All", n: counts.all },
              { id: "due", label: "Not paid", n: counts.due, warn: counts.due > 0 },
              { id: "part", label: "Partly paid", n: counts.part },
              { id: "paid", label: "Paid", n: counts.paid },
              { id: "unlinked", label: "No customer link", n: counts.unlinked },
            ]} />
            <div className="min-w-56 flex-1"><SearchBox value={q} onChange={setQ} placeholder="Invoice number, customer or project" /></div>
          </div>

          {years.length > 1 && (
            <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
              {["all", ...years].map((y) => (
                <button key={y} type="button" onClick={() => setFy(y)} aria-pressed={fy === y}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${fy === y ? "border-primary bg-primary-50 text-primary" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                  {y === "all" ? "Every year" : `FY ${y}`}
                </button>
              ))}
            </div>
          )}

          {counts.blank > 0 && (
            <p className="mb-3 text-xs text-slate-500">
              {counts.blank === 1 ? "1 invoice has" : `${counts.blank} invoices have`} no amount in the billing book, so {counts.blank === 1 ? "it is" : "they are"} left out of the totals above.
            </p>
          )}

          {shown.length === 0 ? (
            <Empty icon="wallet" title="Nothing matches that" text="Try another invoice number or customer name." />
          ) : (
            <div className="card divide-y divide-slate-100">
              {shown.map((v) => {
                const p = projects[v.project_id];
                return (
                  <div key={v.id} className="flex items-start gap-3 p-4">
                    <button type="button" onClick={() => setDetail(v)} className="min-w-0 flex-1 text-left">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold text-slate-900">{v.invoice_no}</span>
                        <Badge tone={STATE_TONE[state(v)]}>{STATE_LABEL[state(v)]}</Badge>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-slate-600">{v.customer_name || "No name on the invoice"}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {[dmy(v.invoice_date), p ? p.ref_no : "Not linked to a project"].filter(Boolean).join(" · ")}
                      </span>
                    </button>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-slate-900">{rupees(v.amount)}</p>
                      {num(v.amount) > 0 && (
                        <p className={`text-xs font-semibold ${num(v.outstanding) > 0 ? "text-red-600" : "text-teal"}`}>
                          {num(v.outstanding) > 0 ? `${rupees(v.outstanding)} due` : "Fully paid"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <InvoicePaste open={paste} onClose={() => setPaste(false)} projects={projects} onSave={saveInvoices} />

      {detail && (
        <Modal title={`Invoice ${detail.invoice_no}`} onClose={() => setDetail(null)}>
          <div className="grid gap-3">
            <dl className="grid gap-2 text-sm">
              {[
                ["Customer on the invoice", detail.customer_name || "Not written"],
                ["Invoice date", dmy(detail.invoice_date)],
                ["Invoice amount", rupees(detail.amount)],
                ["Received", rupees(received(detail))],
                ["Still to come", rupees(detail.outstanding)],
                ["Project", projects[detail.project_id] ? `${projects[detail.project_id].ref_no} · ${projects[detail.project_id].customer}` : "Not linked to a project"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                  <dt className="shrink-0 text-slate-500">{k}</dt>
                  <dd className="min-w-0 flex-1 break-words text-right font-semibold text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {projects[detail.project_id] ? "Change the project this invoice belongs to" : "This invoice has no project yet"}
              </p>
              <input className="input mt-2" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Search a customer or job number" />
              {matches.length > 0 && (
                <ul className="mt-2 divide-y divide-slate-100">
                  {matches.map((p) => (
                    <li key={p.id}>
                      <button type="button" className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm hover:text-primary" disabled={linkBusy} onClick={() => linkTo(p.id)}>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-slate-800">{p.customer}</span>
                          <span className="block text-xs text-slate-500">{[p.ref_no, p.town].filter(Boolean).join(" · ")}</span>
                        </span>
                        <Icon name="chevron" className="h-4 w-4 shrink-0 text-slate-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {link.trim() && matches.length === 0 && <p className="mt-2 text-xs text-amber-700">No job matches that name.</p>}
              {detail.project_id && (
                <button type="button" className="mt-2 text-xs font-semibold text-slate-500 hover:text-red-600" disabled={linkBusy} onClick={() => linkTo(null)}>
                  Unlink it from this project
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {projects[detail.project_id] && (
                <Link href={`/projects/${detail.project_id}`} className="btn-primary flex-1 text-center" onClick={() => setDetail(null)}>
                  <Icon name="sun" className="h-4 w-4" />Open the project
                </Link>
              )}
              {projects[detail.project_id]?.phone && (
                <>
                  <a href={`tel:${projects[detail.project_id].phone}`} className="btn-ghost flex-1 text-center"><Icon name="phone" className="h-4 w-4" />Call</a>
                  <a href={waLink(projects[detail.project_id].phone, `Hello ${projects[detail.project_id].customer}, this is Surya's Solar, Cuddalore, about invoice ${detail.invoice_no}.`)}
                    target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-center"><Icon name="chat" className="h-4 w-4" />WhatsApp</a>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

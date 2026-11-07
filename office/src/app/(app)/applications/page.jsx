"use client";

import { useEffect, useMemo, useState } from "react";
import { ListSkeleton } from "@/components/Extras";
import ProjectsTabs from "@/components/ProjectsTabs";
import { Badge, Empty, FilterTabs, Icon, Modal, PageHeader, SearchBox } from "@/components/ui";
import { dmy, waLink } from "@/lib/format";

// Straight from the PM Surya Ghar "My Applications" export (Downloads > My_Applications_List.xlsx),
// converted to public/data/pm-surya-ghar.json. Every application, with its real status.
const SOURCE = "/data/pm-surya-ghar.json";

const STATUS_TONE = (s) => {
  if (/Return/i.test(s)) return "red";
  if (/Not Redeemed/i.test(s)) return "blue";
  if (/Disbursed|Redeemed/i.test(s)) return "green";
  return "amber";
};

// "Subsidy Disbursal (Disbursed)" -> "Subsidy disbursed"
const shortStatus = (s) =>
  String(s || "")
    .replace(/^Subsidy Disbursal \(Disbursed\)$/, "Subsidy disbursed")
    .replace(/^Subsidy Request \(Redeemed\)$/, "Subsidy redeemed")
    .replace(/^Subsidy Request \(Not Redeemed\)$/, "Subsidy requested")
    .replace(/^Subsidy Request \(Return\)$/, "Subsidy returned")
    .replace(/^Upload Agreement \(Pending\)$/, "Upload agreement")
    .replace(/^Installation \(Pending\)$/, "Installation pending")
    .replace(/^Inspection \(Pending\)$/, "Inspection pending");

// The export writes dates as DD-MM-YY.
const niceDate = (v) => {
  const m = /^(\d{2})-(\d{2})-(\d{2})$/.exec(String(v || ""));
  return m ? dmy(`20${m[3]}-${m[2]}-${m[1]}`) : v || "";
};

const GROUP = (s) => {
  if (/Return/i.test(s)) return "issue";
  if (/Not Redeemed/i.test(s)) return "pending";
  if (/Disbursed|Redeemed/i.test(s)) return "done";
  return "pending";
};

export default function Applications() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch(SOURCE, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Could not read the list (${r.status})`))))
      .then(setRows)
      .catch((e) => setError(e.message));
  }, []);

  const counts = useMemo(() => {
    const list = rows || [];
    return {
      all: list.length,
      done: list.filter((r) => GROUP(r.status) === "done").length,
      pending: list.filter((r) => GROUP(r.status) === "pending").length,
      issue: list.filter((r) => GROUP(r.status) === "issue").length,
    };
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((r) => {
      if (tab !== "all" && GROUP(r.status) !== tab) return false;
      if (!needle) return true;
      return `${r.name} ${r.phone} ${r.app} ${r.consumer} ${r.subdivision || ""}`.toLowerCase().includes(needle);
    });
  }, [rows, tab, q]);

  const kwp = (n) => (n ? `${Number(n)} kW` : "");

  return (
    <>
      <PageHeader title="Applications" subtitle="Where every PM Surya Ghar application stands." />
      <ProjectsTabs />

      {error && <div className="card p-5 text-sm text-red-600">{error}</div>}

      {!rows && !error ? <ListSkeleton rows={5} /> : rows && (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:flex sm:gap-3">
            {[
              { id: "all", label: "Total", value: counts.all, colour: "text-slate-900" },
              { id: "done", label: "Subsidy received", value: counts.done, colour: "text-teal" },
              { id: "pending", label: "In progress", value: counts.pending, colour: "text-amber-700" },
            ].map((s) => (
              <button key={s.id} type="button" onClick={() => setTab(s.id)}
                className={`card flex-1 px-3 py-2.5 text-left transition ${tab === s.id ? "border-primary ring-1 ring-primary/20" : ""}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className={`mt-0.5 text-xl font-bold ${s.colour}`}>{s.value}</p>
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <FilterTabs value={tab} onChange={setTab} tabs={[
              { id: "all", label: "All", n: counts.all },
              { id: "pending", label: "In progress", n: counts.pending },
              { id: "done", label: "Subsidy received", n: counts.done },
              ...(counts.issue ? [{ id: "issue", label: "Returned", n: counts.issue, warn: true }] : []),
            ]} />
            <div className="min-w-56 flex-1"><SearchBox value={q} onChange={setQ} placeholder="Name, phone, application or consumer number" /></div>
          </div>

          {shown.length === 0 ? (
            <Empty icon="doc" title="Nothing matches that" text="Try a different name, phone or application number." />
          ) : (
            <div className="card divide-y divide-slate-100">
              {shown.map((r) => (
                <div key={r.app + r.sr} className="flex flex-wrap items-center gap-3 p-4">
                  <button type="button" onClick={() => setDetail(r)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-sm font-bold text-primary">
                      {(r.name || "?").trim().slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="break-words font-semibold text-slate-900">{r.name}</span>
                        <span className="sm:hidden"><Badge tone={STATUS_TONE(r.status)}>{shortStatus(r.status)}</Badge></span>
                      </span>
                      <span className="block text-[13px] text-slate-500">{[kwp(r.kwp), niceDate(r.submitted)].filter(Boolean).join(" · ")}</span>
                      <span className="block truncate text-xs text-slate-500">{[r.app, r.subdivision].filter(Boolean).join(" · ")}</span>
                    </span>
                  </button>
                  <div className="flex w-full flex-row items-center justify-end gap-1 min-[360px]:w-auto min-[360px]:shrink-0 min-[360px]:flex-col min-[360px]:items-end">
                    <span className="hidden sm:block"><Badge tone={STATUS_TONE(r.status)}>{shortStatus(r.status)}</Badge></span>
                    <div className="flex gap-0.5">
                      {r.phone && <a href={`tel:${r.phone}`} className="rounded-lg p-1.5 text-primary hover:bg-primary-50" aria-label={`Call ${r.name}`}><Icon name="phone" className="h-4 w-4" /></a>}
                      {r.phone && <a href={waLink(r.phone, `Hello ${r.name}, this is Surya's Solar, Cuddalore, about your PM Surya Ghar application ${r.app}.`)} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-teal hover:bg-teal-50" aria-label={`WhatsApp ${r.name}`}><Icon name="chat" className="h-4 w-4" /></a>}
                      <button type="button" onClick={() => setDetail(r)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Details of ${r.name}`}><Icon name="chevron" className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {detail && (
        <Modal title="Application" onClose={() => setDetail(null)}>
          <p className="text-xl font-bold tracking-tight text-slate-900">{detail.name}</p>
          <p className="mt-0.5 text-sm text-slate-500">{kwp(detail.kwp)} · submitted {niceDate(detail.submitted)}</p>
          <div className="mt-3"><Badge tone={STATUS_TONE(detail.status)}>{shortStatus(detail.status)}</Badge></div>
          <dl className="mt-4 divide-y divide-slate-100 text-sm">
            {[
              ["Application no.", detail.app],
              ["Consumer no.", detail.consumer],
              ["Mobile", detail.phone],
              ["Proposed capacity", kwp(detail.kwp)],
              ["Status", detail.status],
              ["Submitted on", niceDate(detail.submitted)],
              ["Circle", detail.circle],
              ["Division", detail.division],
              ["Sub division", detail.subdivision],
              ["Reverification", detail.reverification],
              ["Duplicate", detail.duplicate],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2">
                <dt className="w-32 shrink-0 text-slate-500">{k}</dt>
                <dd className="min-w-0 flex-1 break-words font-semibold text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.phone && <a href={`tel:${detail.phone}`} className="btn-primary flex-1 text-center"><Icon name="phone" className="h-4 w-4" />Call</a>}
            {detail.phone && <a href={waLink(detail.phone, `Hello ${detail.name}, this is Surya's Solar, Cuddalore, about your PM Surya Ghar application ${detail.app}.`)} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-center"><Icon name="chat" className="h-4 w-4" />WhatsApp</a>}
          </div>
          <button type="button" className="btn-ghost mt-2 w-full" onClick={() => navigator.clipboard?.writeText(detail.app).catch(() => {})}>
            Copy application number
          </button>
        </Modal>
      )}
    </>
  );
}

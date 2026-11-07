"use client";

import { useMemo, useState } from "react";
import { Modal, Notice } from "@/components/ui";
import { dmy, rupees } from "@/lib/format";

// One invoice per line, pasted straight off the billing book. Columns can be separated by tabs (a copied
// table row), by two or more spaces, or by commas, and the order can be anything: the pieces are found by
// what they look like, so a checkbox column or an extra "payment type" column does no harm.
const MONEY = /^[₹\s]*(?:rs\.?)?\s*[\d,]+(?:\.\d{1,2})?$/i;
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const PAY_WORDS = /^(cash|credit|bank|upi|online|neft|cheque|card|part|advance)$/i;

const money = (s) => Number(String(s).replace(/[^\d.]/g, "")) || 0;

// 05.11.2026, 05-11-26, 05/Nov/2026 -> 2026-11-05. Anything unreadable is left blank rather than guessed.
function toIso(s) {
  const t = String(s).trim();
  let m = /^(\d{1,2})[-./\s]([A-Za-z]{3,})[-./\s](\d{2,4})$/.exec(t);
  if (m) {
    const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (!mon) return "";
    const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    return `${y}-${String(mon).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
  m = /^(\d{1,2})[-./](\d{1,2})[-./](\d{2,4})$/.exec(t);
  if (!m) return "";
  const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  return `${y}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
}

const isInvoiceNo = (s) => /^\d{2}-\d{2}\/\d+$/.test(String(s).trim());
const nameKey = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

function cells(line) {
  if (line.includes("\t")) return line.split("\t").map((c) => c.trim()).filter((c) => c !== "");
  const byGap = line.split(/\s{2,}/).map((c) => c.trim()).filter(Boolean);
  if (byGap.length >= 3) return byGap;
  if (line.includes(",")) return line.split(",").map((c) => c.trim()).filter(Boolean);
  return byGap;
}

// Reads one pasted line into an invoice, or null when it is not an invoice line.
export function parseLine(line) {
  const list = cells(line);
  if (list.length < 2) return null;

  let at = list.findIndex(isInvoiceNo);
  if (at === -1) return null;

  const invoice_no = list[at].trim();
  const rest = list.filter((_, i) => i !== at);

  const dateCell = rest.find((c) => toIso(c));
  const invoice_date = dateCell ? toIso(dateCell) : "";
  const moneyCells = rest.filter((c) => MONEY.test(c) && !toIso(c));
  const others = rest.filter((c) => c !== dateCell && !moneyCells.includes(c));

  const after = list[at + 1];
  const named = after && after !== dateCell && !MONEY.test(after) && !isInvoiceNo(after) && /[a-z]/i.test(after) ? after : null;
  const customer_name = (named || others.filter((c) => /[a-z]/i.test(c) && !PAY_WORDS.test(c)).sort((a, b) => b.length - a.length)[0] || "").trim();

  const amount = moneyCells.length ? money(moneyCells[0]) : 0;
  const outstanding = moneyCells.length > 1 ? money(moneyCells[moneyCells.length - 1]) : amount;
  const payment_type = others.find((c) => PAY_WORDS.test(c)) || null;

  return { invoice_no, invoice_date, customer_name, amount, outstanding, payment_type };
}

export default function InvoicePaste({ open, onClose, projects, onSave }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // Name to project: an exact match first, then a name that only one project contains.
  const lookup = useMemo(() => {
    const exact = {};
    const list = Object.values(projects || {});
    list.forEach((p) => { const k = nameKey(p.customer); if (k && !exact[k]) exact[k] = p; });
    const find = (name) => {
      const k = nameKey(name);
      if (!k) return null;
      if (exact[k]) return exact[k];
      const hits = list.filter((p) => nameKey(p.customer).includes(k) || k.includes(nameKey(p.customer)));
      return hits.length === 1 ? hits[0] : null;
    };
    return { find };
  }, [projects]);

  const rows = useMemo(() => {
    const seen = new Set();
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map(parseLine)
      .filter((r) => r && !seen.has(r.invoice_no) && seen.add(r.invoice_no))
      .map((r) => ({ ...r, project: lookup.find(r.customer_name) }));
  }, [text, lookup]);

  const matched = rows.filter((r) => r.project).length;
  const total = rows.reduce((a, r) => a + r.amount, 0);
  const due = rows.reduce((a, r) => a + r.outstanding, 0);

  const save = async () => {
    if (!rows.length || busy) return;
    setBusy(true);
    setMsg(null);
    const error = await onSave(rows.map((r) => ({
      invoice_no: r.invoice_no,
      invoice_date: r.invoice_date || null,
      customer_name: r.customer_name || null,
      amount: r.amount,
      outstanding: r.outstanding,
      payment_type: r.payment_type,
      project_id: r.project ? r.project.id : null,
    })));
    setBusy(false);
    if (error) return setMsg({ tone: "red", text: error });
    setMsg({ tone: "green", text: `${rows.length} ${rows.length === 1 ? "invoice" : "invoices"} saved.` });
    setText("");
  };

  if (!open) return null;

  return (
    <Modal title="Add invoices from the billing book" onClose={onClose} wide>
      <div className="grid gap-3">
        <p className="text-sm text-slate-600">
          Open the invoice list on bill.gogstbill.com, select the rows and copy them, then paste here. One invoice per line.
          An invoice number that is already saved is updated, never doubled.
        </p>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setMsg(null); }}
          rows={6}
          spellCheck={false}
          placeholder={"26-27/105\tSARAVANAN\t05.11.2026\t2,30,030\tCash\t0"}
          className="input font-mono text-[13px]"
        />

        {rows.length > 0 && (
          <>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span className="font-semibold text-slate-900">{rows.length} to save</span>
              <span className="text-slate-500">{matched} matched to a customer</span>
              <span className="text-slate-500">{rupees(total)} invoiced</span>
              <span className={due > 0 ? "font-semibold text-red-600" : "text-slate-500"}>{rupees(due)} pending</span>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr><th className="px-3 py-2">Invoice</th><th className="px-3 py-2">Customer</th><th className="px-3 py-2">Date</th><th className="px-3 py-2 text-right">Amount</th><th className="px-3 py-2 text-right">Pending</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r) => (
                    <tr key={r.invoice_no}>
                      <td className="px-3 py-2 font-semibold text-slate-900">{r.invoice_no}</td>
                      <td className="px-3 py-2">
                        <span className="block truncate">{r.customer_name || "No name read"}</span>
                        <span className={`block text-[11px] ${r.project ? "text-teal" : "text-amber-700"}`}>
                          {r.project ? r.project.ref_no : "No customer link"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500">{r.invoice_date ? dmy(r.invoice_date) : "No date read"}</td>
                      <td className="px-3 py-2 text-right">{rupees(r.amount)}</td>
                      <td className={`px-3 py-2 text-right ${r.outstanding > 0 ? "text-red-600" : "text-teal"}`}>{rupees(r.outstanding)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {matched < rows.length && (
              <p className="text-xs text-amber-700">
                {rows.length - matched === 1
                  ? '1 invoice has no matching project. It is still saved and stays under "No customer link" until you link it.'
                  : `${rows.length - matched} invoices have no matching project. They are still saved and stay under "No customer link" until you link them.`}
              </p>
            )}
          </>
        )}

        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary flex-1" disabled={!rows.length || busy} onClick={save}>
            {busy ? "Saving..." : rows.length ? `Save ${rows.length} ${rows.length === 1 ? "invoice" : "invoices"}` : "Nothing to save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

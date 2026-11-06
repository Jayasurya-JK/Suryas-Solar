// Indian number formatting: 205000 -> "2,05,000"
export function inr(n) {
  const v = Math.round(Number(n) || 0);
  const s = String(Math.abs(v));
  let last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  if (rest) last3 = "," + last3;
  return (v < 0 ? "-" : "") + rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + last3;
}

export const rupees = (n) => "₹" + inr(n);

// 205000 -> "Two Lakh Five Thousand"
export function words(n) {
  n = Math.round(Number(n) || 0);
  if (n === 0) return "Zero";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x) => (x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? " " + a[x % 10] : ""));
  const three = (x) =>
    (x >= 100 ? a[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " : "") : "") + (x % 100 ? two(x % 100) : "");
  const out = [];
  const cr = Math.floor(n / 10000000), lk = Math.floor(n / 100000) % 100, th = Math.floor(n / 1000) % 100, r = n % 1000;
  if (cr) out.push(three(cr) + " Crore");
  if (lk) out.push(two(lk) + " Lakh");
  if (th) out.push(two(th) + " Thousand");
  if (r) out.push(three(r));
  return out.join(" ");
}

// "2026-11-04" -> "04.11.2026"
export function dmy(value) {
  if (!value) return "";
  const d = new Date(String(value).length === 10 ? value + "T00:00" : value);
  if (isNaN(d)) return "";
  return String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear();
}

export function addDays(value, days) {
  const d = new Date(value + "T00:00");
  d.setDate(d.getDate() + (Number(days) || 0));
  return d.toISOString().slice(0, 10);
}

export function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// PM Surya Ghar: Rs 30,000/kW for first 2 kW + Rs 18,000 for the 3rd kW (max Rs 78,000).
// TN top-up (G.O. 102, Sep 2026): 1 kW Rs 5,000, 2 kW Rs 10,000, 3 kW+ Rs 22,000.
export function subsidy(kw) {
  kw = Number(kw) || 0;
  if (kw >= 3) return { central: 78000, tn: 22000 };
  if (kw >= 2) return { central: 60000 + (kw - 2) * 18000, tn: 10000 };
  if (kw >= 1) return { central: kw * 30000, tn: 5000 };
  return { central: 0, tn: 0 };
}

export function calcQuote(q) {
  const ex = q.extras || {};
  const rates = ex.rates || {};
  const structAmt = ex.struct === "low" ? Number(rates.struct_low) || 0 : ex.struct === "high" ? Number(rates.struct_high) || 0 : 0;
  const pillarAmt = ex.pillar ? Number(rates.pillar) || 0 : 0;
  const floorAmt = (Number(ex.floors) || 0) * (Number(rates.per_floor) || 0);
  const total = (Number(q.price) || 0) + structAmt + pillarAmt + floorAmt;
  const s = subsidy(q.system?.kw);
  const central = q.show_subsidy ? s.central : 0;
  const tn = q.show_subsidy && q.tn_topup ? s.tn : 0;
  return { structAmt, pillarAmt, floorAmt, total, central, tn, net: total - central - tn };
}

export const LEAD_STATUSES = [
  { id: "new", label: "New", tone: "blue" },
  { id: "contacted", label: "Contacted", tone: "slate" },
  { id: "site_visit", label: "Site visit", tone: "amber" },
  { id: "quote_sent", label: "Quote sent", tone: "violet" },
  { id: "won", label: "Won", tone: "green" },
  { id: "lost", label: "Lost", tone: "red" },
];

export const LEAD_SOURCES = [
  { id: "website", label: "Website" },
  { id: "call", label: "Phone call" },
  { id: "walk-in", label: "Walk-in" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "referral", label: "Referral" },
  { id: "other", label: "Other" },
];

export const QUOTE_STATUSES = [
  { id: "draft", label: "Draft", tone: "slate" },
  { id: "sent", label: "Sent", tone: "blue" },
  { id: "accepted", label: "Accepted", tone: "green" },
  { id: "rejected", label: "Rejected", tone: "red" },
];

export const EXPENSE_CATEGORIES = [
  { id: "material", label: "Material" },
  { id: "labour", label: "Labour" },
  { id: "transport", label: "Transport" },
  { id: "fuel", label: "Fuel" },
  { id: "food", label: "Food" },
  { id: "office", label: "Office" },
  { id: "other", label: "Other" },
];

export const PAY_MODES = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "bank", label: "Bank" },
  { id: "card", label: "Card" },
];

export const labelOf = (list, id) => list.find((x) => x.id === id)?.label || id || "";

// "Other" gets a free-text answer, so show that instead of the plain word.
export const sourceLabel = (l) =>
  l?.source === "other" && l?.source_other ? l.source_other : labelOf(LEAD_SOURCES, l?.source);

// Indian mobile: keep last 10 digits
export const cleanPhone = (p) => String(p || "").replace(/\D/g, "").slice(-10);
export const waLink = (phone, text) =>
  `https://wa.me/91${cleanPhone(phone)}${text ? "?text=" + encodeURIComponent(text) : ""}`;

// CSV that opens straight in Excel (BOM keeps the ₹ sign readable)
export function downloadCsv(filename, rows) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- staff accounts ----
// "owner" is the one account that can never be locked out. "admin" has the same powers in the app.
// "pending" is somebody who asked for access and is still waiting.
export const ROLE_LABEL = { owner: "Owner", admin: "Admin", staff: "Staff", pending: "Waiting" };
export const isOwnerRole = (role) => role === "owner" || role === "admin";
export const roleLabel = (role) => ROLE_LABEL[role] || role || "";

export const MODULES = [
  { id: "leads", label: "Leads", hint: "Customer enquiries and follow-ups", icon: "users" },
  { id: "quotes", label: "Quotes", hint: "Make and send quotations", icon: "doc" },
  { id: "expenses", label: "Expenses", hint: "Record daily spending and bills", icon: "wallet" },
];

// Not a screen: asking for this means "make me an admin". Only the owner can grant it.
export const ADMIN_PERM = "admin";
export const ADMIN_OPTION = {
  id: ADMIN_PERM, label: "Admin - full access",
  hint: "Every screen and can approve people. The activity history stays owner-only.",
  icon: "cog",
};
export const permLabel = (id) =>
  id === ADMIN_PERM ? ADMIN_OPTION.label : MODULES.find((m) => m.id === id)?.label || id;

// Staff sign in with a User ID. The login system needs an email, so a User ID is mapped to a
// hidden plus-address on the business Gmail (the domain itself has no mailboxes). Staff never see it.
export const STAFF_MAIL = "suryassolarenergy";
export const validUserId = (s) => /^[a-z0-9][a-z0-9._-]{2,19}$/.test(String(s || ""));
export function loginEmail(value) {
  const s = String(value || "").trim().toLowerCase();
  return s.includes("@") ? s : `${STAFF_MAIL}+${s}@gmail.com`;
}

// "5 min ago", "2 h ago", "yesterday", "03.11.2026"
export function ago(value) {
  if (!value) return "Never";
  const t = new Date(value).getTime();
  if (isNaN(t)) return "";
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  return dmy(value);
}

export const clock = (value) =>
  value ? new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "";

// "Today", "Yesterday" or "Fri, 6 Nov"
export function dayLabel(value) {
  const d = new Date(value);
  const t = new Date();
  const same = (a, b) => a.toDateString() === b.toDateString();
  const y = new Date(); y.setDate(t.getDate() - 1);
  if (same(d, t)) return "Today";
  if (same(d, y)) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

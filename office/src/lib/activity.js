import {
  EXPENSE_CATEGORIES, LEAD_SOURCES, LEAD_STATUSES, MODULES, PAY_MODES, QUOTE_STATUSES, dmy, labelOf, permLabel, roleLabel, rupees,
} from "@/lib/format";

const KIND = {
  leads: "lead", quotes: "quote", expenses: "expense", packages: "price package", brands: "brand",
  app_settings: "company settings", profiles: "team member",
};
const LABELS = {
  leads: {
    name: "Name", phone: "Mobile", address: "Address", town: "Town", source: "Source", source_other: "Came from", status: "Stage",
    kw_interest: "System size (kW)", monthly_bill: "EB bill", notes: "Notes", next_follow_up: "Follow-up date", assigned_to: "Assigned to",
  },
  quotes: {
    ref_no: "Quote no.", quote_date: "Date", valid_days: "Valid for (days)", price: "Price", total: "Total", net: "After subsidy",
    status: "Status", show_subsidy: "Subsidy shown", tn_topup: "TN top-up", bom: "Materials",
    "customer.name": "Customer name", "customer.addr1": "Customer address", "customer.addr2": "Town", "customer.phone": "Customer mobile", "customer.sal": "Address as",
    "system.kw": "Panel kWp", "system.inverter_kw": "Inverter kW", "system.panel_count": "No. of panels", "system.panel_watt": "Panel watt",
    "system.panel_type": "Panel type", "system.panel_brand": "Panel brand", "system.inverter_brand": "Inverter brand", "system.brand": "Partner logo",
    "system.phase": "Phase", "system.roof": "Roof type",
    "extras.struct": "Elevated structure", "extras.pillar": "Concrete pillars", "extras.floors": "Extra floors", "extras.show_table": "Extras table",
  },
  expenses: {
    amount: "Amount", category: "Category", category_other: "What it was for", site: "Site or customer", paid_by: "Paid by", payment_mode: "Paid using",
    note: "Note", spent_on: "Date", bill_path: "Bill photo",
  },
  profiles: { role: "Role", perms: "Screens", active: "Access", full_name: "Name", username: "User ID", requested_perms: "Requested screens" },
};

const MONEY = new Set(["price", "total", "net", "amount", "monthly_bill"]);
const DATES = new Set(["quote_date", "next_follow_up", "spent_on"]);

export function fieldLabel(table, key) {
  const hit = LABELS[table]?.[key];
  if (hit) return hit;
  const last = String(key).split(".").pop().replace(/_/g, " ");
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function fmtValue(table, key, v, team = []) {
  if (v === null || v === undefined || v === "") return "not set";
  if (typeof v === "boolean") return v ? "On" : "Off";
  if (Array.isArray(v)) {
    if (key === "perms" || key === "requested_perms") return v.length ? v.map(permLabel).join(", ") : "none";
    return "updated";
  }
  if (typeof v === "object") return "updated";
  if (MONEY.has(key) && !isNaN(Number(v))) return rupees(v);
  if (DATES.has(key)) return dmy(v);
  if (key === "status") return labelOf(table === "quotes" ? QUOTE_STATUSES : LEAD_STATUSES, v);
  if (key === "source") return labelOf(LEAD_SOURCES, v);
  if (key === "category") return labelOf(EXPENSE_CATEGORIES, v);
  if (key === "payment_mode") return labelOf(PAY_MODES, v);
  if (key === "assigned_to") return team.find((t) => t.id === v)?.full_name || "someone";
  if (key === "role") return roleLabel(v);
  if (key === "bill_path") return "added";
  if (key === "active") return v ? "On" : "Off";
  return String(v);
}

// Field-by-field changes for an "update" entry
export function changeLines(entry, team) {
  const c = entry.changes;
  if (!c || entry.action !== "update") return [];
  return Object.entries(c)
    .filter(([, pair]) => Array.isArray(pair) && pair.length === 2)
    .map(([key, [from, to]]) => {
      const k = key.split(".").pop();
      const isList = (Array.isArray(from) || Array.isArray(to)) && k !== "perms" && k !== "requested_perms";
      return {
        key,
        label: fieldLabel(entry.table_name, key),
        from: isList ? null : fmtValue(entry.table_name, k, from, team),
        to: isList ? "changed" : fmtValue(entry.table_name, k, to, team),
      };
    });
}

// What a deleted record looked like, in one line
export function deletedSummary(entry) {
  const d = entry.changes?.deleted;
  if (!d) return "";
  if (entry.table_name === "leads") return [d.name, d.phone, d.town].filter(Boolean).join(" · ");
  if (entry.table_name === "quotes") return [d.ref_no, d.customer?.name, d.total ? rupees(d.total) : null].filter(Boolean).join(" · ");
  if (entry.table_name === "expenses") return [d.amount ? rupees(d.amount) : null, labelOf(EXPENSE_CATEGORIES, d.category), d.note].filter(Boolean).join(" · ");
  return entry.label || "";
}

export function describe(entry) {
  const kind = KIND[entry.table_name] || entry.table_name || "";
  const c = entry.changes || {};
  let verb = "", subject = entry.label || "", suffix = "", tone = "blue";
  switch (entry.action) {
    case "create":
      tone = "green";
      verb = entry.actor_name === "Website form" ? "sent a website enquiry:" : `added ${kind}`;
      break;
    case "delete":
      tone = "red"; verb = `deleted ${kind}`;
      break;
    case "update":
      tone = "blue";
      if (entry.table_name === "profiles") {
        const role = c.role, act = c.active;
        if (role && role[0] === "pending" && (role[1] === "staff" || role[1] === "admin")) { verb = "approved access for"; tone = "green"; }
        else if (role && role[1] === "admin" && role[0] !== "admin") { verb = "made an admin"; tone = "green"; }
        else if (role && role[0] === "admin" && role[1] === "staff") { verb = "changed to staff for"; }
        else if (act && act[1] === false) { verb = "switched off access for"; tone = "red"; }
        else if (act && act[1] === true) { verb = "switched on access for"; tone = "green"; }
        else if (c.perms) verb = "changed the screens for";
        else verb = "edited team member";
      } else if (entry.table_name === "app_settings") { verb = "changed company settings"; subject = ""; }
      else verb = `edited ${kind}`;
      break;
    case "login": verb = "signed in"; subject = ""; tone = "slate"; break;
    case "logout": verb = "signed out"; subject = ""; tone = "slate"; break;
    case "pdf": verb = "downloaded the PDF of quote"; tone = "violet"; break;
    case "whatsapp": verb = "sent quote"; suffix = " on WhatsApp"; tone = "violet"; break;
    case "bill_view": verb = "viewed a bill photo"; subject = ""; tone = "slate"; break;
    default: verb = entry.summary || entry.action;
  }
  const href = entry.record_id && entry.action !== "delete"
    ? entry.table_name === "leads" ? `/leads/${entry.record_id}` : entry.table_name === "quotes" ? `/quotes/${entry.record_id}` : null
    : null;
  return { verb, subject, suffix, tone, href };
}

export const TYPE_FILTERS = [
  { id: "all", label: "Everything" },
  { id: "leads", label: "Leads", tables: ["leads"] },
  { id: "quotes", label: "Quotes", tables: ["quotes"] },
  { id: "expenses", label: "Expenses", tables: ["expenses"] },
  { id: "signins", label: "Sign-ins", actions: ["login", "logout"] },
  { id: "team", label: "Team and settings", tables: ["profiles", "app_settings", "packages", "brands"] },
];

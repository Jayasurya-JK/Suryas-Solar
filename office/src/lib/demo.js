// LOCAL DESIGN PREVIEW ONLY. Used when NEXT_PUBLIC_DEMO=1 (never set on Vercel).
// A small in-memory stand-in for the Supabase client so every screen can be checked
// with realistic sample data, in any role, without logging in.
// Roles: NEXT_PUBLIC_DEMO_ROLE = owner (default) | staff | pending | declined

const day = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const ts = (n) => new Date(Date.now() + n * 86400000).toISOString();
const hrs = (n) => new Date(Date.now() + n * 3600000).toISOString();

const ALL = ["leads", "quotes", "expenses"];
const owner = { id: "u1", full_name: "Surya Kumar", email: "owner@example.com", username: null, role: "owner", perms: ALL, requested_perms: [], active: true, last_seen_at: hrs(-0.1), requested_at: ts(-60), created_at: ts(-60) };
const staff = { id: "u2", full_name: "Ravi Kumar", email: "x+ravi@example.com", username: "ravi", role: "staff", perms: ["leads", "expenses"], requested_perms: ALL, active: true, last_seen_at: hrs(-2), requested_at: ts(-30), created_at: ts(-30) };
const waiting = { id: "u3", full_name: "Karthik", email: "x+karthik@example.com", username: "karthik", role: "pending", perms: [], requested_perms: ["leads", "expenses"], active: true, last_seen_at: null, requested_at: hrs(-3), created_at: hrs(-3) };
const declined = { id: "u4", full_name: "Mohan", email: "x+mohan@example.com", username: "mohan", role: "pending", perms: [], requested_perms: ["quotes"], active: false, decided_at: ts(-1), last_seen_at: null, requested_at: ts(-2), created_at: ts(-2) };

const settingsData = {
  header_line1: "Registered Vendor · PM Surya Ghar: Muft Bijli Yojana",
  header_line2: "Ministry of New and Renewable Energy (MNRE), Government of India",
  address: "No.33, Sri Gokul Enterprises Building, Nellikuppam Main Rd, Chavadi, Kondur, Cuddalore 607006",
  phone1: "+91 79043 69094", phone2: "+91 96559 89595", email: "suryassolarenergy@gmail.com", website: "www.suryassolar.com",
  gstin: "", signatory_name: "J. Kamala", signatory_title: "Proprietor, Surya's Solar",
  bank: { account_name: "SURYAS SOLAR", bank: "Union Bank of India", account_no: "101311010000077", account_type: "Current", ifsc: "UBIN0810134" },
  warranty: [{ label: "Solar panels", text: "12 years product warranty and 30 years performance warranty" }, { label: "On-grid string inverter", text: "8 years warranty" }],
  terms: [{ label: "GST", text: "Included in the above price" }, { label: "Payment", text: "80% advance with order, balance 20% when material is delivered at site" }],
  our_scope: ["Design, supply, installation and commissioning", "PM Surya Ghar application support"],
  customer_scope: ["Net-meter fee on TNPDCL portal", "Rs 500 stamp paper"],
  extras: { struct_low: 15000, struct_high: 25000, pillar: 3000, per_floor: 2500 },
};

const bom = [{ item: "MMS structure", make: "VRM / DM Power", spec: "Module mounting structure for RCC roof", qty: "1 Lot" }];
const sys = { kw: 3.3, inverter_kw: 3, phase: 1, roof: "RCC (concrete) roof", panel_type: "Bifacial N-type TOPCon, DCR", panel_brand: "Adani / Goldi / Vikram", panel_watt: "555 to 625", panel_count: 6, inverter_brand: "SolarEdge / Sungrow / Fox", brand: "Premier Energies" };

const db = {
  profiles: [owner, staff, waiting, declined],
  app_settings: [{ id: 1, data: settingsData, quote_prefix: "SS", next_quote_no: 21, updated_at: ts(0) }],
  brands: [
    { id: "b1", name: "Premier Energies", logo_url: "/brands/premier.png", is_default: true, active: true, sort: 1 },
    { id: "b2", name: "Tata Power Solar", logo_url: "/brands/tata.png", is_default: false, active: true, sort: 2 },
    { id: "b3", name: "Adani Solar", logo_url: "/brands/adani.png", is_default: false, active: true, sort: 3 },
    { id: "b4", name: "Waaree", logo_url: null, is_default: false, active: true, sort: 4 },
    { id: "b5", name: "Microtek", logo_url: "/brands/microtek.svg", is_default: false, active: true, sort: 5 },
  ],
  packages: [
    { id: "p1", name: "3.3 kWp TOPCon · 3 kW 1 phase", kw: 3.3, inverter_kw: 3, phase: 1, panel_count: 6, panel_watt: "555 to 625", panel_type: "Bifacial N-type TOPCon, DCR", panel_brand: "Adani / Goldi / Vikram", inverter_brand: "SolarEdge / Sungrow / Fox", price: 205000, bom, active: true, sort: 1 },
    { id: "p2", name: "5.5 kWp TOPCon · 5 kW 1 phase", kw: 5.5, inverter_kw: 5, phase: 1, panel_count: 10, panel_watt: "555 to 625", panel_type: "Bifacial N-type TOPCon, DCR", panel_brand: "Adani / Goldi / Vikram", inverter_brand: "Sungrow", price: 315000, bom, active: true, sort: 2 },
  ],
  leads: [
    { id: "l1", name: "Surya Prakash", phone: "9876543210", address: "VIP Nagar", town: "Cuddalore", source: "website", status: "new", kw_interest: 3, monthly_bill: 2800, notes: "Asked about TN subsidy", next_follow_up: day(0), assigned_to: "u2", created_by: "u1", created_at: ts(0), updated_at: ts(0) },
    { id: "l2", name: "Meena Rajan", phone: "9443322110", address: "Thirupapuliyur", town: "Cuddalore", source: "call", status: "site_visit", kw_interest: 5, monthly_bill: 5200, notes: "", next_follow_up: day(1), assigned_to: "u2", created_by: "u1", created_at: ts(-2), updated_at: ts(-1) },
    { id: "l3", name: "Arun Kumar", phone: "9003344556", address: "Muthialpet", town: "Puducherry", source: "referral", status: "quote_sent", kw_interest: 3, monthly_bill: 3100, notes: "", next_follow_up: day(-1), assigned_to: null, created_by: "u1", created_at: ts(-5), updated_at: ts(-2) },
    { id: "l4", name: "Lakshmi Narayanan", phone: "9790011223", address: "Main Road", town: "Panruti", source: "walk-in", status: "contacted", kw_interest: 2, monthly_bill: 1800, notes: "", next_follow_up: day(3), assigned_to: null, created_by: "u2", created_at: ts(-6), updated_at: ts(-4) },
    { id: "l5", name: "Vijay Anand", phone: "9840099887", address: "Block 21", town: "Neyveli", source: "whatsapp", status: "won", kw_interest: 5, monthly_bill: 6000, notes: "", next_follow_up: null, assigned_to: "u2", created_by: "u1", created_at: ts(-12), updated_at: ts(-3) },
    { id: "l6", name: "Kavitha S", phone: "9566778899", address: "Semmandalam", town: "Cuddalore", source: "website", status: "lost", kw_interest: 3, monthly_bill: 2500, notes: "Went with cheaper vendor", next_follow_up: null, assigned_to: null, created_by: "u1", created_at: ts(-15), updated_at: ts(-8) },
  ],
  quotes: [
    { id: "q1", ref_no: "SS/0020/26", lead_id: "l3", quote_date: day(-2), valid_days: 10, customer: { sal: "Sir", name: "Arun Kumar", addr1: "Muthialpet", addr2: "Puducherry", phone: "9003344556" }, system: sys, bom, price: 205000, extras: { rates: settingsData.extras }, show_subsidy: true, tn_topup: false, total: 205000, net: 127000, status: "sent", created_by: "u1", created_at: ts(-2), updated_at: ts(-2) },
    { id: "q2", ref_no: "SS/0019/26", lead_id: "l5", quote_date: day(-4), valid_days: 10, customer: { sal: "Sir", name: "Vijay Anand", addr1: "Block 21", addr2: "Neyveli", phone: "9840099887" }, system: { ...sys, kw: 5.5, inverter_kw: 5, panel_count: 10 }, bom, price: 315000, extras: { rates: settingsData.extras }, show_subsidy: true, tn_topup: true, total: 315000, net: 215000, status: "accepted", created_by: "u1", created_at: ts(-4), updated_at: ts(-3) },
    { id: "q3", ref_no: "SS/0018/26", lead_id: null, quote_date: day(-6), valid_days: 10, customer: { sal: "Madam", name: "Surya Devi", addr1: "Manjakuppam", addr2: "Cuddalore", phone: "9443300000" }, system: sys, bom, price: 205000, extras: { rates: settingsData.extras }, show_subsidy: true, tn_topup: true, total: 205000, net: 105000, status: "draft", created_by: "u2", created_at: ts(-6), updated_at: ts(-6) },
  ],
  expenses: [
    { id: "e1", spent_on: day(0), amount: 4200, category: "material", site: "Vijay Anand, Neyveli", lead_id: null, paid_by: "Ravi", payment_mode: "upi", note: "30 m DC cable", bill_path: "x", created_by: "u2", created_at: ts(0) },
    { id: "e2", spent_on: day(0), amount: 450, category: "food", site: "Vijay Anand, Neyveli", lead_id: null, paid_by: "Ravi", payment_mode: "cash", note: "Lunch for 3 workers", bill_path: null, created_by: "u2", created_at: ts(0) },
    { id: "e3", spent_on: day(-1), amount: 1800, category: "transport", site: "Neyveli", lead_id: null, paid_by: "Surya Kumar", payment_mode: "cash", note: "Mini truck hire", bill_path: null, created_by: "u1", created_at: ts(-1) },
    { id: "e4", spent_on: day(-2), amount: 9000, category: "labour", site: "Vijay Anand, Neyveli", lead_id: null, paid_by: "Surya Kumar", payment_mode: "bank", note: "Installation team, 3 days", bill_path: null, created_by: "u1", created_at: ts(-2) },
  ],
  activity_log: [
    { id: 12, at: hrs(-0.2), actor: "u2", actor_name: "Ravi Kumar", table_name: "expenses", record_id: "e1", action: "create", label: "₹4200 material", summary: "Added expense ₹4200 material", changes: null },
    { id: 11, at: hrs(-0.5), actor: "u2", actor_name: "Ravi Kumar", table_name: "leads", record_id: "l2", action: "update", label: "Meena Rajan", summary: "Edited lead Meena Rajan", changes: { status: ["contacted", "site_visit"], next_follow_up: [null, day(1)], notes: ["", "Roof is 2 floors, needs high structure"] } },
    { id: 10, at: hrs(-1), actor: "u1", actor_name: "Surya Kumar", table_name: "quotes", record_id: "q1", action: "update", label: "SS/0020/26 · Arun Kumar", summary: "Edited quote SS/0020/26 · Arun Kumar", changes: { status: ["draft", "sent"], price: [200000, 205000], "customer.addr1": ["Muthialpet 2nd St", "Muthialpet"] } },
    { id: 9, at: hrs(-1.1), actor: "u1", actor_name: "Surya Kumar", table_name: "quotes", record_id: "q1", action: "pdf", label: "SS/0020/26", summary: "Downloaded the PDF of SS/0020/26", changes: null },
    { id: 8, at: hrs(-2), actor: "u2", actor_name: "Ravi Kumar", table_name: null, record_id: null, action: "login", label: null, summary: "Signed in", changes: null },
    { id: 7, at: hrs(-3), actor: null, actor_name: "Website form", table_name: "leads", record_id: "l1", action: "create", label: "Surya Prakash", summary: "New website enquiry: Surya Prakash", changes: null },
    { id: 6, at: hrs(-26), actor: "u2", actor_name: "Ravi Kumar", table_name: "leads", record_id: "l4", action: "create", label: "Lakshmi Narayanan", summary: "Added lead Lakshmi Narayanan", changes: null },
    { id: 5, at: hrs(-27), actor: "u1", actor_name: "Surya Kumar", table_name: "profiles", record_id: "u2", action: "update", label: "Ravi Kumar", summary: "Edited team member Ravi Kumar", changes: { role: ["pending", "staff"], perms: [[], ["leads", "expenses"]] } },
    { id: 4, at: hrs(-30), actor: "u1", actor_name: "Surya Kumar", table_name: "expenses", record_id: "x1", action: "delete", label: "₹100 other", summary: "Deleted expense ₹100 other", changes: { deleted: { amount: 100, category: "other", note: "test" } } },
  ],
};

const me = () => {
  const r = process.env.NEXT_PUBLIC_DEMO_ROLE;
  return r === "staff" ? staff : r === "pending" ? waiting : r === "declined" ? declined : owner;
};

function query(table) {
  const filters = [];
  let mode = "select", patch = null, ins = null, single = false, maybe = false;
  let orderKey = null, asc = true, lim = null, from = null, to = null;
  const run = () => {
    const rows = db[table] || (db[table] = []);
    if (mode === "insert") {
      const arr = Array.isArray(ins) ? ins : [ins];
      const made = arr.map((r) => ({ id: "n" + Math.random().toString(36).slice(2, 8), created_at: ts(0), updated_at: ts(0), ...r }));
      rows.unshift(...made);
      return { data: single ? made[0] : made, error: null };
    }
    const m = rows.filter((r) => filters.every((f) => f(r)));
    if (mode === "update") { m.forEach((r) => Object.assign(r, patch, { updated_at: ts(0) })); return { data: m, error: null }; }
    if (mode === "delete") { db[table] = rows.filter((r) => !m.includes(r)); return { data: null, error: null }; }
    let out = [...m];
    if (orderKey) out.sort((a, b) => (String(a[orderKey] ?? "") < String(b[orderKey] ?? "") ? -1 : 1) * (asc ? 1 : -1));
    if (from != null) out = out.slice(from, to + 1);
    if (lim != null) out = out.slice(0, lim);
    return { data: single || maybe ? out[0] || null : out, error: null };
  };
  const q = {
    select: () => q,
    order: (k, o) => { orderKey = k; asc = o?.ascending !== false; return q; },
    limit: (n) => { lim = n; return q; },
    range: (a, b) => { from = a; to = b; return q; },
    eq: (k, v) => { filters.push((r) => String(r[k]) === String(v)); return q; },
    neq: (k, v) => { filters.push((r) => String(r[k]) !== String(v)); return q; },
    in: (k, arr) => { filters.push((r) => arr.map(String).includes(String(r[k]))); return q; },
    not: (k, op, v) => {
      if (op === "in") { const list = String(v).replace(/[()]/g, "").split(","); filters.push((r) => !list.includes(String(r[k]))); }
      return q;
    },
    // Only the pattern the Activity screen uses: "a.ilike.%x%,b.ilike.%x%"
    or: (spec) => {
      const tests = String(spec).split(",").map((part) => {
        const [col, , ...rest] = part.split(".");
        const needle = rest.join(".").replace(/%/g, "").toLowerCase();
        return (r) => String(r[col] ?? "").toLowerCase().includes(needle);
      });
      filters.push((r) => tests.some((t) => t(r)));
      return q;
    },
    gte: (k, v) => { filters.push((r) => String(r[k] ?? "") >= String(v)); return q; },
    lt: (k, v) => { filters.push((r) => String(r[k] ?? "") < String(v)); return q; },
    lte: (k, v) => { filters.push((r) => r[k] != null && String(r[k]) <= String(v)); return q; },
    single: () => { single = true; return q; },
    maybeSingle: () => { maybe = true; return q; },
    insert: (row) => { mode = "insert"; ins = row; return q; },
    update: (p) => { mode = "update"; patch = p; return q; },
    delete: () => { mode = "delete"; return q; },
    then: (res, rej) => Promise.resolve(run()).then(res, rej),
  };
  return q;
}

export function demoClient() {
  return {
    from: query,
    rpc: async (name) => ({ data: name === "next_quote_ref" ? "SS/0021/26" : null, error: null }),
    functions: { invoke: async () => ({ data: { ok: true }, error: null }) },
    auth: {
      getUser: async () => ({ data: { user: { id: me().id, email: me().email } } }),
      signOut: async () => ({}),
      signInWithPassword: async () => ({ error: null }),
      signUp: async () => ({ data: { session: {} }, error: null }),
    },
    storage: {
      from: () => ({
        createSignedUrl: async () => ({ data: { signedUrl: "/logo.png" } }),
        upload: async () => ({ error: null }),
        remove: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/logo.png" } }),
      }),
    },
  };
}

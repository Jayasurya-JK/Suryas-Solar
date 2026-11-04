// LOCAL DESIGN PREVIEW ONLY. Used when NEXT_PUBLIC_DEMO=1 (never set on Vercel).
// A tiny in-memory stand-in for the Supabase client so every screen can be
// checked with realistic sample data without logging in.

const day = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const ts = (n) => new Date(Date.now() + n * 86400000).toISOString();

const owner = { id: "u1", full_name: "Surya Kumar", email: "owner@example.com", role: "owner", created_at: ts(-60) };
const staff = { id: "u2", full_name: "Ravi", email: "ravi@example.com", role: "staff", created_at: ts(-30) };
const waiting = { id: "u3", full_name: "Karthik", email: "karthik@example.com", role: "pending", created_at: ts(-1) };

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
  profiles: [owner, staff, waiting],
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
};

function query(table) {
  const filters = [];
  let single = false;
  let maybe = false;
  const q = {
    select: () => q, order: () => q, limit: () => q, in: () => q, not: () => q,
    gte: () => q, lt: () => q, lte: () => q,
    eq: (k, v) => { filters.push((r) => String(r[k]) === String(v)); return q; },
    neq: (k, v) => { filters.push((r) => String(r[k]) !== String(v)); return q; },
    single: () => { single = true; return q; },
    maybeSingle: () => { maybe = true; return q; },
    insert: () => ({ ...q, select: () => ({ single: () => Promise.resolve({ data: { id: (db[table][0] || {}).id }, error: null }) }), then: (r) => r({ error: null }) }),
    update: () => ({ eq: () => ({ in: () => Promise.resolve({ error: null }), then: (r) => r({ error: null }) }), neq: () => Promise.resolve({ error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    then: (resolve) => {
      const rows = (db[table] || []).filter((r) => filters.every((f) => f(r)));
      resolve({ data: single || maybe ? rows[0] || null : rows, error: null });
    },
  };
  return q;
}

export function demoClient() {
  return {
    from: query,
    rpc: async () => ({ data: "SS/0021/26", error: null }),
    auth: {
      getUser: async () => ({ data: { user: { id: owner.id, email: owner.email } } }),
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

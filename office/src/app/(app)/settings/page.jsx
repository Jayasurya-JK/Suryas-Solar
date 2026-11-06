"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Badge, Field, FilterTabs, Icon, Modal, Notice, PageHeader, Segmented, Spinner, Switch } from "@/components/ui";
import { rupees } from "@/lib/format";
import { BomRows, LineList, PairList } from "@/components/ListEditors";

const TABS = [
  { id: "company", label: "Company" },
  { id: "wording", label: "Quote wording" },
  { id: "packages", label: "Price packages" },
  { id: "brands", label: "Brands" },
  { id: "team", label: "Team" },
];

// Signature stamp is kept in the private "assets" bucket (never in the public code repo).
function SignatureUpload({ settingsData, onUploaded, reload }) {
  const sb = supabase();
  const { signUrl } = useApp();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file) => {
    if (!file) return;
    setBusy(true); setErr("");
    const path = `signature-${Date.now()}.${(file.name.split(".").pop() || "jpg").toLowerCase()}`;
    const { error } = await sb.storage.from("assets").upload(path, file, { contentType: file.type });
    if (error) { setBusy(false); return setErr("Upload failed: " + error.message); }
    const data = { ...settingsData, signature_path: path };
    const { error: e2 } = await sb.from("app_settings").update({ data }).eq("id", 1);
    setBusy(false);
    if (e2) return setErr(e2.message);
    onUploaded(path);
    reload();
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-slate-200 bg-white">
        {signUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={signUrl} alt="Signature stamp" className="max-h-14 max-w-full object-contain" />
          : <span className="text-xs font-semibold text-slate-500">No stamp yet</span>}
      </div>
      <div className="min-w-48 flex-1">
        <p className="text-sm font-semibold text-slate-800">Signature stamp on quotes</p>
        <p className="text-xs text-slate-500">Stored privately. Only logged-in team members can see it.</p>
        {err && <p className="mt-1 text-xs font-semibold text-red-600">{err}</p>}
      </div>
      <label className="btn-ghost cursor-pointer">
        <Icon name="camera" className="h-4 w-4" />{busy ? "Uploading..." : signUrl ? "Change stamp" : "Upload stamp"}
        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </label>
    </div>
  );
}

function BrandsTab() {
  const sb = supabase();
  const { reload } = useApp();
  const [list, setList] = useState(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");
  const load = useCallback(() => sb.from("brands").select("*").order("sort").then(({ data }) => setList(data || [])), [sb]);
  useEffect(() => { load(); }, [load]);
  const done = () => { load(); reload(); };

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await sb.from("brands").insert({ name: name.trim(), sort: (list?.length || 0) + 1 });
    if (error) return setErr(error.message.includes("duplicate") ? "That brand already exists." : error.message);
    setName(""); setErr(""); done();
  };

  const upload = async (b, file) => {
    if (!file) return;
    setBusy(b.id); setErr("");
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${b.id}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("brands").upload(path, file, { contentType: file.type });
    if (error) { setBusy(null); return setErr("Upload failed: " + error.message); }
    const url = sb.storage.from("brands").getPublicUrl(path).data.publicUrl;
    await sb.from("brands").update({ logo_url: url }).eq("id", b.id);
    setBusy(null); done();
  };

  const makeDefault = async (b) => {
    await sb.from("brands").update({ is_default: false }).neq("id", b.id);
    await sb.from("brands").update({ is_default: true, active: true }).eq("id", b.id);
    done();
  };
  const toggle = async (b) => { await sb.from("brands").update({ active: !b.active }).eq("id", b.id); done(); };
  const remove = async (b) => {
    if (!confirm(`Delete brand "${b.name}"? Old quotes keep the name but lose the logo.`)) return;
    await sb.from("brands").delete().eq("id", b.id); done();
  };

  if (!list) return <Spinner />;
  return (
    <div className="space-y-4">
      <Notice>The brand you pick on a quote shows its logo at the top right of every page. The default brand is used for every new quote. Upload a PNG or JPG logo (under 1 MB) with a white or clear background.</Notice>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => (
          <div key={b.id} className="card p-5">
            <div className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white px-4">
              {b.logo_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={b.logo_url} alt={b.name} className="max-h-10 max-w-full object-contain" />
                : <span className="text-sm font-semibold text-slate-500">No logo yet</span>}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="font-bold text-slate-900">{b.name}</p>
              <div className="flex gap-1">
                {b.is_default && <Badge tone="pink">Default</Badge>}
                {!b.active && <Badge>Hidden</Badge>}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="btn-ghost cursor-pointer">
                <Icon name="camera" className="h-4 w-4" />{busy === b.id ? "Uploading..." : b.logo_url ? "Change logo" : "Upload logo"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => upload(b, e.target.files?.[0])} />
              </label>
              {!b.is_default && <button className="btn-ghost" onClick={() => makeDefault(b)}>Make default</button>}
              {!b.is_default && <button className="btn-ghost" onClick={() => toggle(b)}>{b.active ? "Hide" : "Show"}</button>}
              {!b.is_default && <button className="btn-danger" onClick={() => remove(b)} title="Delete"><Icon name="trash" className="h-4 w-4" /></button>}
            </div>
          </div>
        ))}
      </div>
      <div className="card flex flex-wrap items-end gap-3 p-5">
        <Field label="Add a new brand" className="min-w-60 flex-1"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikram Solar" /></Field>
        <button className="btn-primary" onClick={add}><Icon name="plus" className="h-4 w-4" />Add brand</button>
      </div>
      {err && <Notice tone="red">{err}</Notice>}
    </div>
  );
}

function SaveBar({ onSave, busy, msg }) {
  return (
    <div className="mt-5 flex items-center justify-end gap-3">
      {msg && <span className={`text-sm font-semibold ${msg.tone === "red" ? "text-red-600" : "text-green-600"}`}>{msg.text}</span>}
      <button className="btn-primary" onClick={onSave} disabled={busy}>{busy ? "Saving..." : "Save"}</button>
    </div>
  );
}

function CompanyTab({ settings, reload }) {
  const sb = supabase();
  const [d, setD] = useState(settings.data);
  const [prefix, setPrefix] = useState(settings.quote_prefix);
  const [next, setNext] = useState(settings.next_quote_no);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const setBank = (k) => (e) => setD({ ...d, bank: { ...d.bank, [k]: e.target.value } });
  const setEx = (k) => (e) => setD({ ...d, extras: { ...d.extras, [k]: Number(e.target.value) } });

  const save = async () => {
    setBusy(true);
    const { error } = await sb.from("app_settings").update({ data: d, quote_prefix: prefix.trim() || "SS", next_quote_no: Number(next) || 1 }).eq("id", 1);
    setBusy(false);
    setMsg(error ? { tone: "red", text: error.message } : { tone: "green", text: "Saved" });
    if (!error) reload();
  };

  return (
    <div className="card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Header line 1"><input className="input" value={d.header_line1 || ""} onChange={set("header_line1")} /></Field>
        <Field label="Header line 2"><input className="input" value={d.header_line2 || ""} onChange={set("header_line2")} /></Field>
        <Field label="Address" className="sm:col-span-2"><input className="input" value={d.address || ""} onChange={set("address")} /></Field>
        <Field label="Phone 1"><input className="input" value={d.phone1 || ""} onChange={set("phone1")} /></Field>
        <Field label="Phone 2"><input className="input" value={d.phone2 || ""} onChange={set("phone2")} /></Field>
        <Field label="Email"><input className="input" value={d.email || ""} onChange={set("email")} /></Field>
        <Field label="Website"><input className="input" value={d.website || ""} onChange={set("website")} /></Field>
        <Field label="GSTIN (printed on quotes when filled)"><input className="input" value={d.gstin || ""} onChange={set("gstin")} /></Field>
        <Field label="Signatory name"><input className="input" value={d.signatory_name || ""} onChange={set("signatory_name")} /></Field>
        <Field label="Signatory title"><input className="input" value={d.signatory_title || ""} onChange={set("signatory_title")} /></Field>
      </div>
      <SignatureUpload settingsData={d} onUploaded={(path) => setD({ ...d, signature_path: path })} reload={reload} />
      <h3 className="mb-3 mt-6 font-bold text-slate-900">Bank details</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Account name"><input className="input" value={d.bank?.account_name || ""} onChange={setBank("account_name")} /></Field>
        <Field label="Bank"><input className="input" value={d.bank?.bank || ""} onChange={setBank("bank")} /></Field>
        <Field label="Account number"><input className="input" value={d.bank?.account_no || ""} onChange={setBank("account_no")} /></Field>
        <Field label="IFSC"><input className="input" value={d.bank?.ifsc || ""} onChange={setBank("ifsc")} /></Field>
        <Field label="Account type"><input className="input" value={d.bank?.account_type || ""} onChange={setBank("account_type")} /></Field>
      </div>
      <h3 className="mb-3 mt-6 font-bold text-slate-900">Optional extras prices (₹)</h3>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Structure, low height"><input className="input" type="number" value={d.extras?.struct_low ?? ""} onChange={setEx("struct_low")} /></Field>
        <Field label="Structure, high height"><input className="input" type="number" value={d.extras?.struct_high ?? ""} onChange={setEx("struct_high")} /></Field>
        <Field label="Concrete pillars"><input className="input" type="number" value={d.extras?.pillar ?? ""} onChange={setEx("pillar")} /></Field>
        <Field label="Each floor above G+1"><input className="input" type="number" value={d.extras?.per_floor ?? ""} onChange={setEx("per_floor")} /></Field>
      </div>
      <h3 className="mb-3 mt-6 font-bold text-slate-900">Quote numbers</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Prefix"><input className="input" value={prefix} onChange={(e) => setPrefix(e.target.value)} /></Field>
        <Field label="Next number"><input className="input" type="number" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        <div className="self-end pb-2 text-sm text-slate-500">Next quote: <b className="text-slate-900">{prefix}/{String(next).padStart(4, "0")}/{String(new Date().getFullYear()).slice(2)}</b></div>
      </div>
      <SaveBar onSave={save} busy={busy} msg={msg} />
    </div>
  );
}

function Section({ title, hint, children }) {
  return (
    <section className="border-b border-slate-100 py-5 first:pt-0 last:border-0">
      <h3 className="font-bold text-slate-900">{title}</h3>
      {hint && <p className="mb-3 mt-0.5 text-sm text-slate-500">{hint}</p>}
      {children}
    </section>
  );
}

function WordingTab({ settings, reload }) {
  const sb = supabase();
  const d = settings.data;
  const [warranty, setWarranty] = useState(d.warranty || []);
  const [terms, setTerms] = useState(d.terms || []);
  const [ours, setOurs] = useState(d.our_scope || []);
  const [theirs, setTheirs] = useState(d.customer_scope || []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const clean = (arr) => arr.filter((x) => (typeof x === "string" ? x.trim() : x.label.trim() || x.text.trim()));
  const save = async () => {
    setBusy(true);
    const data = { ...d, warranty: clean(warranty), terms: clean(terms), our_scope: clean(ours), customer_scope: clean(theirs) };
    const { error } = await sb.from("app_settings").update({ data }).eq("id", 1);
    setBusy(false);
    setMsg(error ? { tone: "red", text: error.message } : { tone: "green", text: "Saved" });
    if (!error) reload();
  };

  return (
    <div className="card p-5">
      <Notice>This wording prints on every quotation. Changes also apply when an older quote is printed again.</Notice>
      <div className="mt-2">
        <Section title="Warranty" hint="Shown in the Warranty table.">
          <PairList items={warranty} onChange={setWarranty} labelPlaceholder="e.g. Solar panels" textPlaceholder="e.g. 12 years product warranty" addLabel="Add warranty line" />
        </Section>
        <Section title="Terms and conditions" hint="Validity is added automatically from each quote.">
          <PairList items={terms} onChange={setTerms} labelPlaceholder="e.g. Payment" textPlaceholder="e.g. 80% advance with order" addLabel="Add term" />
        </Section>
        <Section title="Surya's Solar will do">
          <LineList items={ours} onChange={setOurs} placeholder="e.g. Net-meter application support" addLabel="Add item" />
        </Section>
        <Section title="Customer will provide">
          <LineList items={theirs} onChange={setTheirs} placeholder="e.g. Rs 500 stamp paper" addLabel="Add item" />
        </Section>
      </div>
      <SaveBar onSave={save} busy={busy} msg={msg} />
    </div>
  );
}

const EMPTY_PKG = { name: "", kw: 3, inverter_kw: 3, phase: 1, panel_count: 6, panel_watt: "", panel_type: "", panel_brand: "", inverter_brand: "", price: 0, bom: [], active: true, sort: 0 };

function PackageForm({ initial, onDone }) {
  const sb = supabase();
  const [p, setP] = useState({ ...EMPTY_PKG, ...initial, bom: initial.bom || [] });
  const [err, setErr] = useState("");
  const set = (k, num) => (e) => setP({ ...p, [k]: num ? Number(e.target.value) : e.target.value });

  const save = async () => {
    if (!p.name.trim()) return setErr("Give the package a name.");
    const bom = p.bom.filter((r) => r.item.trim());
    const row = { name: p.name, kw: p.kw, inverter_kw: p.inverter_kw, phase: p.phase, panel_count: p.panel_count, panel_watt: p.panel_watt,
      panel_type: p.panel_type, panel_brand: p.panel_brand, inverter_brand: p.inverter_brand, price: p.price, bom, active: p.active, sort: p.sort };
    const { error } = p.id ? await sb.from("packages").update(row).eq("id", p.id) : await sb.from("packages").insert(row);
    if (error) return setErr(error.message);
    onDone();
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Package name" className="sm:col-span-2"><input className="input" value={p.name} onChange={set("name")} placeholder="3.3 kWp TOPCon · 3 kW 1 phase" /></Field>
      <Field label="Panel capacity (kWp)"><input className="input" type="number" step="0.01" value={p.kw} onChange={set("kw", true)} /></Field>
      <Field label="Inverter size (kW)"><input className="input" type="number" step="0.1" value={p.inverter_kw} onChange={set("inverter_kw", true)} /></Field>
      <Field label="Phase"><Segmented size="sm" value={p.phase} onChange={(v) => setP({ ...p, phase: Number(v) })} options={[{ id: 1, label: "Single phase" }, { id: 3, label: "Three phase" }]} /></Field>
      <Field label="Price (₹, GST included)"><input className="input" type="number" value={p.price} onChange={set("price", true)} /></Field>
      <Field label="No. of panels"><input className="input" type="number" value={p.panel_count} onChange={set("panel_count", true)} /></Field>
      <Field label="Panel watt"><input className="input" value={p.panel_watt} onChange={set("panel_watt")} placeholder="e.g. 555 to 625" /></Field>
      <Field label="Panel type" className="sm:col-span-2"><input className="input" value={p.panel_type || ""} onChange={set("panel_type")} /></Field>
      <Field label="Panel brand"><input className="input" value={p.panel_brand || ""} onChange={set("panel_brand")} /></Field>
      <Field label="Inverter brand"><input className="input" value={p.inverter_brand || ""} onChange={set("inverter_brand")} /></Field>
      <div className="sm:col-span-2">
        <span className="label">Other materials (panels and inverter are added automatically as items 1 and 2)</span>
        <BomRows rows={p.bom} onChange={(bom) => setP({ ...p, bom })} startNumber={3} />
      </div>
      <Field label="Position in list"><input className="input" type="number" value={p.sort} onChange={set("sort", true)} /></Field>
      <div className="self-end"><Switch checked={p.active} onChange={(v) => setP({ ...p, active: v })} label="Show when making quotes" /></div>
      {err && <div className="sm:col-span-2"><Notice tone="red">{err}</Notice></div>}
      <div className="flex justify-end gap-2 sm:col-span-2"><button className="btn-ghost" onClick={onDone}>Cancel</button><button className="btn-primary" onClick={save}>Save package</button></div>
    </div>
  );
}

function PackagesTab() {
  const sb = supabase();
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const load = useCallback(() => sb.from("packages").select("*").order("sort").then(({ data }) => setList(data || [])), [sb]);
  useEffect(() => { load(); }, [load]);

  const remove = async (p) => {
    if (!confirm(`Delete package "${p.name}"? Existing quotes are not affected.`)) return;
    await sb.from("packages").delete().eq("id", p.id);
    load();
  };

  if (!list) return <Spinner />;
  return (
    <div>
      <div className="mb-4 flex justify-end"><button className="btn-primary" onClick={() => setEdit({})}><Icon name="plus" className="h-4 w-4" />Add package</button></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-slate-900">{p.name}</p>
              {!p.active && <Badge>Hidden</Badge>}
            </div>
            <p className="mt-1 text-2xl font-black text-primary">{rupees(p.price)}</p>
            <p className="mt-2 text-sm text-slate-500">{p.panel_count} x {p.panel_watt} Wp · {p.panel_brand}</p>
            <p className="text-sm text-slate-500">{p.inverter_kw} kW {p.phase === 3 ? "3 phase" : "1 phase"} · {p.inverter_brand}</p>
            <div className="mt-4 flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => setEdit(p)}>Edit</button>
              <button className="btn-danger" onClick={() => remove(p)} title="Delete"><Icon name="trash" className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal title={edit.id ? "Edit package" : "Add package"} onClose={() => setEdit(null)} wide>
          <PackageForm initial={edit} onDone={() => { setEdit(null); load(); }} />
        </Modal>
      )}
    </div>
  );
}

function TeamTab() {
  const sb = supabase();
  const { profile, reload } = useApp();
  const [list, setList] = useState(null);
  const load = useCallback(() => sb.from("profiles").select("*").order("created_at").then(({ data }) => setList(data || [])), [sb]);
  useEffect(() => { load(); }, [load]);

  const setRole = async (u, role) => {
    if (u.id === profile.id) return;
    await sb.from("profiles").update({ role }).eq("id", u.id);
    load();
    reload();
  };
  const setName = async (u, full_name) => {
    const name = full_name.trim();
    if (!name || name === u.full_name) return;
    await sb.from("profiles").update({ full_name: name }).eq("id", u.id);
    load();
    reload();
  };

  if (!list) return <Spinner />;
  return (
    <div className="card divide-y divide-slate-100">
      <div className="p-5">
        <Notice>To add a staff member, create their login in Supabase (Authentication, Add user) or ask them to use <b>Create an account</b> on the login page. They appear here as <b>Waiting</b> until you set them to <b>Staff</b>. Staff can add leads, quotes and expenses, but cannot see the dashboard, settings or other people&apos;s records.</Notice>
      </div>
      {list.map((u) => (
        <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="min-w-0 flex-1 sm:max-w-sm">
            <input className="input font-semibold" defaultValue={u.full_name || ""} placeholder="Full name"
              onBlur={(e) => setName(u, e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} aria-label="Full name" />
            <p className="mt-1 break-all px-1 text-sm text-slate-500">{u.email}{u.id === profile.id && " · you"}</p>
          </div>
          {u.id === profile.id ? <Badge tone="pink">Owner</Badge> : (
            <div className="flex items-center gap-2">
              {u.role === "pending" && <Badge tone="amber">Waiting</Badge>}
              <Segmented size="sm" value={u.role} onChange={(v) => setRole(u, v)} options={[
                { id: "pending", label: "No access" }, { id: "staff", label: "Staff" }, { id: "owner", label: "Owner" },
              ]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const { settings, reload, isOwner } = useApp();
  const [tab, setTab] = useState("company");
  if (!isOwner) return null;
  return (
    <>
      <PageHeader title="Settings" subtitle="Company details, quote wording, price packages and who can log in." />
      <div className="mb-5"><FilterTabs tabs={TABS} value={tab} onChange={setTab} /></div>
      {tab === "company" && <CompanyTab key={settings.updated_at} settings={settings} reload={reload} />}
      {tab === "wording" && <WordingTab key={settings.updated_at} settings={settings} reload={reload} />}
      {tab === "packages" && <PackagesTab />}
      {tab === "brands" && <BrandsTab />}
      {tab === "team" && <TeamTab />}
    </>
  );
}

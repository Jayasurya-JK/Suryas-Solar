/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./quote.css";
import { addDays, calcQuote, dmy, inr, rupees, words } from "@/lib/format";

const A4_PX = 794; // 210mm at 96dpi

// On screen, scale the A4 sheets to exactly fill the column.
export function QuotePreview(props) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(0.4);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setZoom(Math.min(1.2, e.contentRect.width / A4_PX)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="qd-preview">
      <div className="qd-zoom" style={{ zoom }}><QuoteDocument {...props} /></div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content is described as a list of blocks. A block is either a fixed piece
// ({ node }) or a table that may continue on the next page ({ table }).
// The paginator measures every block and fills A4 sheets top to bottom.
// ---------------------------------------------------------------------------

function buildBlocks(q, s, signUrl) {
  const c = q.customer || {};
  const sys = q.system || {};
  const ex = q.extras || {};
  const rates = ex.rates || {};
  const calc = calcQuote(q);
  const phase = Number(sys.phase) === 3 ? "3 phase" : "1 phase";
  const kw = Number(sys.kw) || 0;
  const bank = s.bank || {};
  const B = [];

  B.push({ key: "title", node: (
    <div className="title">
      <div>
        <div className="kicker">QUOTATION</div>
        <h1>Rooftop Solar Power System</h1>
        <div className="subt">{kw} kWp On-Grid · {sys.inverter_kw} kW {phase} inverter</div>
      </div>
      <div className="metabox">
        <div><span>Quote no.</span><b>{q.ref_no || "(new)"}</b></div>
        <div><span>Date</span><b>{dmy(q.quote_date)}</b></div>
        <div><span>Valid till</span><b>{q.quote_date ? dmy(addDays(q.quote_date, q.valid_days)) : ""}</b></div>
        <div><span>{s.gstin ? "GSTIN" : "Contact"}</span><b>{s.gstin || s.phone1}</b></div>
      </div>
    </div>
  ) });

  B.push({ key: "parties", node: (
    <div className="parties">
      <div className="pcard">
        <div className="cap">Prepared for</div>
        <div className="nm">{c.name}</div>
        {c.addr1 && <div className="ln">{c.addr1}</div>}
        {c.addr2 && <div className="ln">{c.addr2}</div>}
        {c.phone && <div className="ln">Phone: {c.phone}</div>}
      </div>
      <div className="pcard glance">
        <div className="cap">Your system at a glance</div>
        <div className="kv"><span>Solar panels</span><b>{kw} kWp · {sys.panel_count} panels</b></div>
        <div className="kv"><span>Inverter</span><b>{sys.inverter_kw} kW · {phase}</b></div>
        <div className="kv"><span>Expected generation</span><b>{Math.round(kw * 4)} to {Math.round(kw * 5)} units/day</b></div>
        {q.show_subsidy
          ? <div className="kv hl"><span>Cost after subsidy</span><b>{rupees(calc.net)}</b></div>
          : <div className="kv hl"><span>Total price</span><b>{rupees(calc.total)}</b></div>}
      </div>
    </div>
  ) });

  B.push({ key: "greet", node: (
    <>
      <p>Dear {c.sal || "Sir/Madam"},</p>
      <p>Thank you for your enquiry. We are pleased to offer the following rooftop solar power system for your home.</p>
    </>
  ) });

  B.push({ key: "summary", table: {
    title: "System summary",
    rows: [
      ["Project location", c.addr2],
      ["Type of roof", sys.roof],
      ["Solar panel capacity", `${kw} kWp (${sys.panel_count} panels x ${sys.panel_watt} Wp${sys.panel_type ? ", " + sys.panel_type : ""})`],
      ["Inverter", `${sys.inverter_kw} kW On-Grid string inverter, ${phase}`],
      ["Expected generation", `4 to 5 units per kW per day (about ${Math.round(kw * 4)} to ${Math.round(kw * 5)} units a day, depending on sunlight)`],
      ["Roof space needed", `About 80 to 100 sq ft per kW (about ${Math.round(kw * 80)} to ${Math.round(kw * 100)} sq ft, shadow-free)`],
    ].map(([a, b], i) => <tr key={i}><td className="lbl" style={{ width: "38%" }}>{a}</td><td>{b}</td></tr>),
  } });

  const bom = [
    { item: "Solar module", make: sys.panel_brand, spec: `${sys.panel_type || ""}${sys.panel_type ? ", " : ""}${sys.panel_watt || ""} Wp`, qty: `${sys.panel_count || ""} Nos` },
    { item: "String inverter", make: sys.inverter_brand, spec: `${sys.inverter_kw || ""} kW on-grid, ${phase}, with WiFi monitoring`, qty: "1 No" },
    ...(q.bom || []),
  ];
  B.push({ key: "bom", table: {
    title: "Bill of materials",
    head: <tr><th className="c" style={{ width: "8mm" }}>No.</th><th>Item</th><th>Make</th><th>Specification</th><th className="c" style={{ width: "15mm" }}>Qty</th></tr>,
    rows: bom.map((r, i) => <tr key={i}><td className="c">{i + 1}</td><td><b>{r.item}</b></td><td>{r.make}</td><td>{r.spec}</td><td className="c nowrap">{r.qty}</td></tr>),
  } });

  const priceRows = [
    <tr key="p"><td><b>{kw} kWp {sys.panel_type} panels with {sys.inverter_kw} kW {phase} on-grid solar power plant, with MMS structure.</b> Supply, installation, testing and commissioning of all items listed above.</td><td className="r">{inr(q.price)}</td></tr>,
  ];
  if (calc.structAmt > 0) priceRows.push(<tr key="s" className="opt"><td>Add: elevated Galvalume structure, {ex.struct === "high" ? "high" : "low"} height</td><td className="r">{inr(calc.structAmt)}</td></tr>);
  if (calc.pillarAmt > 0) priceRows.push(<tr key="pl" className="opt"><td>Add: concrete pillars for structure</td><td className="r">{inr(calc.pillarAmt)}</td></tr>);
  if (calc.floorAmt > 0) priceRows.push(<tr key="f" className="opt"><td>Add: extra floor charge ({ex.floors} floor above G+1)</td><td className="r">{inr(calc.floorAmt)}</td></tr>);
  priceRows.push(<tr key="t" className="tot"><td>Total price (GST included)</td><td className="r">{inr(calc.total)}</td></tr>);
  if (q.show_subsidy) {
    priceRows.push(<tr key="c" className="subr"><td>Less: PM Surya Ghar central subsidy*</td><td className="r">- {inr(calc.central)}</td></tr>);
    if (q.tn_topup) priceRows.push(<tr key="tn" className="subr"><td>Less: Tamil Nadu state top-up*</td><td className="r">- {inr(calc.tn)}</td></tr>);
    priceRows.push(<tr key="n" className="net"><td>Your effective cost after subsidy</td><td className="r">{inr(calc.net)}</td></tr>);
  }
  B.push({ key: "price", table: {
    title: "Price", cls: "price",
    head: <tr><th>Description</th><th className="r">Amount (Rs)</th></tr>,
    rows: priceRows,
  } });
  B.push({ key: "pricenote", node: (
    <>
      <div className="small" style={{ marginTop: "1.5mm" }}>Total in words: <b style={{ color: "var(--ink)" }}>Rupees {words(calc.total)} only</b></div>
      {q.show_subsidy && (
        <p className="small" style={{ marginTop: "2mm" }}>
          * You pay the total plant cost to us. The subsidy is credited by the Government directly to your bank account, usually within 1 to 3 months after the TNEB solar plant commissioning certificate is issued and the subsidy request is submitted on the PM Surya Ghar portal. Amounts are as per the scheme rules in force today.
        </p>
      )}
    </>
  ) });

  if (ex.show_table) {
    B.push({ key: "extras", table: {
      title: "Optional extras (only if your roof needs them)",
      head: <tr><th>Item</th><th className="r">Extra amount (Rs)</th></tr>,
      rows: [
        ["Elevated Galvalume structure, low height", rates.struct_low],
        ["Elevated Galvalume structure, high height", rates.struct_high],
        ["Concrete pillars for structure", rates.pillar],
        ["Each floor above G+1", rates.per_floor],
      ].map(([a, b], i) => <tr key={i}><td>{a}</td><td className="r">{inr(b)}</td></tr>),
    } });
    B.push({ key: "extrasnote", node: <p className="small" style={{ marginTop: "1.5mm" }}>These are not included in the system price unless shown in the Price table above.</p> });
  }

  if (s.warranty?.length) {
    B.push({ key: "warranty", table: {
      title: "Warranty",
      rows: s.warranty.map((w, i) => <tr key={i}><td className="lbl" style={{ width: "30%" }}>{w.label}</td><td>{w.text}</td></tr>),
    } });
  }

  B.push({ key: "scope", node: (
    <>
      <h4>Scope of work</h4>
      <div className="two">
        <div className="box"><h5 style={{ color: "var(--teal)" }}>Surya&apos;s Solar will do</h5>
          <ol>{(s.our_scope || []).map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>
        <div className="box"><h5 style={{ color: "var(--pink)" }}>Customer will provide</h5>
          <ol>{(s.customer_scope || []).map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>
      </div>
    </>
  ) });

  B.push({ key: "terms", table: {
    title: "Terms and conditions",
    rows: [...(s.terms || []), { label: "Validity", text: `${q.valid_days} days from the date of this quotation` }]
      .map((w, i) => <tr key={i}><td className="lbl" style={{ width: "30%" }}>{w.label}</td><td>{w.text}</td></tr>),
  } });

  B.push({ key: "bank", table: {
    title: "Bank details",
    rows: [
      <tr key="a"><td className="lbl" style={{ width: "18%" }}>Account name</td><td>{bank.account_name}</td><td className="lbl" style={{ width: "18%" }}>Bank</td><td>{bank.bank}</td></tr>,
      <tr key="b"><td className="lbl">Account number</td><td><b>{bank.account_no}</b></td><td className="lbl">IFSC</td><td><b>{bank.ifsc}</b></td></tr>,
      <tr key="c"><td className="lbl">Account type</td><td>{bank.account_type}</td><td /><td /></tr>,
    ],
  } });

  B.push({ key: "closing", node: (
    <>
      <p style={{ marginTop: "3mm" }}>We hope this offer meets your requirement. Please call or WhatsApp us on {s.phone1} for any clarification. We look forward to installing your solar system.</p>
      <div className="sign">
        <div>
          <div>Yours truly,</div>
          {signUrl ? <img src={signUrl} alt="Signature" /> : <div style={{ height: "15mm" }} />}
          <div style={{ fontWeight: 700, color: "var(--ink)" }}>{s.signatory_name}</div>
          <div className="small">{s.signatory_title}</div>
        </div>
        <div className="accept">Customer acceptance (signature and date)</div>
      </div>
    </>
  ) });

  return B;
}

function Letterhead({ s, sys, brand }) {
  return (
    <header className="qd-head">
      <div className="band" />
      <div className="lh">
        <img className="logo" src="/logo.png" alt="Surya's Solar" />
        <div className="vendor">
          <div className="v1">{s.header_line1}</div>
          <div className="v2">{s.header_line2}</div>
        </div>
        {sys.brand && (
          <div className="brand">
            <div className="cap">Panel partner</div>
            {brand?.logo_url ? <img src={brand.logo_url} alt={brand.name} /> : <div className="name">{sys.brand}</div>}
          </div>
        )}
      </div>
    </header>
  );
}

function Footer({ s, page, pages }) {
  return (
    <footer className="qd-foot">
      <div className="info">
        <div>{s.address}{pages > 1 && <div className="pgno" style={{ marginTop: "0.8mm" }}>Page {page} of {pages}</div>}</div>
        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
          <b>{s.phone1}</b> · <b>{s.phone2}</b><br />{s.email} · <b>{s.website}</b>
        </div>
      </div>
      <div className="band" />
    </footer>
  );
}

// One piece of a page: a whole fixed block, or a slice of a table's rows.
function Piece({ block, piece }) {
  if (block.node) return <div className="blk">{block.node}</div>;
  const t = block.table;
  return (
    <div className="blk">
      {piece.first ? <h4>{t.title}</h4> : <div className="cont">{t.title} (continued)</div>}
      <table className={`t ${t.cls || ""}`}>
        {t.head && <thead>{t.head}</thead>}
        <tbody>{t.rows.slice(piece.from, piece.to)}</tbody>
      </table>
    </div>
  );
}

// Fill sheets with blocks using measured heights (px at 96dpi).
function paginate(blocks, m) {
  const pages = [[]];
  let used = 0;
  const room = m.body - 10; // safety margin so nothing is clipped at the bottom
  const newPage = () => { pages.push([]); used = 0; };
  blocks.forEach((b, i) => {
    const h = m.blocks[i];
    if (!h) return;
    if (b.node) {
      if (used > 0 && used + h.total > room) newPage();
      pages[pages.length - 1].push({ i });
      used += h.total;
      return;
    }
    const n = b.table.rows.length;
    let from = 0, first = true;
    while (from < n) {
      const top = first ? h.title : h.cont;
      // keep the heading with at least one row
      if (used > 0 && used + top + h.head + h.rows[from] > room) newPage();
      let size = top + h.head, to = from;
      while (to < n && (to === from || used + size + h.rows[to] <= room)) { size += h.rows[to]; to++; }
      pages[pages.length - 1].push({ i, from, to, first });
      used += size + h.gap;
      from = to;
      first = false;
      if (from < n) newPage();
    }
  });
  return pages.filter((p) => p.length);
}

// The quotation as real A4 sheets. Used for the on-screen preview and for printing.
export default function QuoteDocument({ quote: q, s = {}, brands = [], signUrl = null }) {
  const sys = q.system || {};
  const brand = brands.find((b) => b.name === sys.brand);
  const blocks = buildBlocks(q, s, signUrl);
  const measureRef = useRef(null);
  const [pages, setPages] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return;
    const run = () => {
      const px = (el) => (el ? el.getBoundingClientRect().height : 0);
      const withMargins = (el) => {
        const st = getComputedStyle(el);
        return px(el) + parseFloat(st.marginTop) + parseFloat(st.marginBottom);
      };
      const body = px(root.querySelector(".sbody")) - 2;
      const cont = withMargins(root.querySelector(".mcont"));
      const m = { body, blocks: [] };
      root.querySelectorAll("[data-b]").forEach((el) => {
        const i = Number(el.dataset.b);
        if (blocks[i].node) { m.blocks[i] = { total: px(el) }; return; }
        m.blocks[i] = {
          title: withMargins(el.querySelector("h4")),
          cont,
          head: px(el.querySelector("thead")),
          rows: [...el.querySelectorAll("tbody > tr")].map(px),
          gap: 0,
        };
      });
      setPages(paginate(blocks, m));
    };
    run();
    document.fonts?.ready.then(run);
    const imgs = [...root.querySelectorAll("img")].filter((im) => !im.complete);
    imgs.forEach((im) => im.addEventListener("load", run, { once: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(q), JSON.stringify(s), mounted]);

  const measurer = mounted && createPortal(
    <div className="qd qd-measure" ref={measureRef} aria-hidden="true">
      <div className="sheet">
        <Letterhead s={s} sys={sys} brand={brand} />
        <div className="sbody">
          <div className="cont mcont">x</div>
          {blocks.map((b, i) => (
            <div key={b.key} data-b={i} className="blk">
              {b.node || (
                <>
                  <h4>{b.table.title}</h4>
                  <table className={`t ${b.table.cls || ""}`}>
                    {b.table.head && <thead>{b.table.head}</thead>}
                    <tbody>{b.table.rows}</tbody>
                  </table>
                </>
              )}
            </div>
          ))}
        </div>
        <Footer s={s} page={1} pages={2} />
      </div>
    </div>,
    document.body
  );

  // The measuring sheet overflows on purpose; its .sbody height is still the real page body height
  // because the sheet has a fixed height and the footer is pushed to the bottom.
  const list = pages || [blocks.map((_, i) => (blocks[i].node ? { i } : { i, from: 0, to: blocks[i].table.rows.length, first: true }))];

  return (
    <>
      {measurer}
      <div className="qd">
        {list.map((pg, pi) => (
          <section className="sheet" key={pi}>
            <Letterhead s={s} sys={sys} brand={brand} />
            <div className="sbody">
              {pg.map((piece, k) => <Fragment key={k}><Piece block={blocks[piece.i]} piece={piece} /></Fragment>)}
            </div>
            <Footer s={s} page={pi + 1} pages={list.length} />
          </section>
        ))}
      </div>
    </>
  );
}

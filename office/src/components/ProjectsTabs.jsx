"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// One customer register seen three ways. These are not three screens with three sets of data: Jobs holds
// the customer, Applications is where that customer's PM Surya Ghar papers stand, Invoices is the money
// billed to the same customer. Same rows underneath, three lenses.
const TABS = [
  { href: "/projects", label: "Jobs", hint: "The work" },
  { href: "/applications", label: "Applications", hint: "Portal papers" },
  { href: "/invoices", label: "Invoices", hint: "The money" },
];

export default function ProjectsTabs() {
  const path = usePathname() || "";
  return (
    <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
      {TABS.map((t) => {
        const on = path === t.href || path.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined}
            className={`rounded-xl px-2 py-2 text-center text-[13px] font-semibold transition ${on ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
            <span className="block truncate">{t.label}</span>
            <span className={`block truncate text-[10px] font-medium ${on ? "text-primary/70" : "text-slate-400"}`}>{t.hint}</span>
          </Link>
        );
      })}
    </div>
  );
}

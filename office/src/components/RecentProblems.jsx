"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { clearRecentErrors, readRecentErrors } from "@/lib/reportError";

// What went wrong on this phone, newest first. Only shown when there is something to show, so it never
// clutters the profile of someone who has had no trouble.
export default function RecentProblems() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { setList(readRecentErrors()); }, []);

  if (!list.length) return null;

  const when = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <section className="card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Icon name="info" className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-slate-900">Recent problems</h2>
          <p className="mt-1 text-sm text-slate-500">
            {list.length} problem{list.length > 1 ? "s" : ""} recorded on this phone. Show this to the office if a screen keeps failing.
          </p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="btn-ghost !h-9 shrink-0 !px-3.5">
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <>
          <ul className="mt-4 space-y-2">
            {list.map((e, i) => (
              <li key={`${e.at}-${i}`} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">{when(e.at)} · {e.page || "app"}</p>
                <p className="mt-1 break-words text-[13px] text-slate-700">{e.message}</p>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => { clearRecentErrors(); setList([]); }} className="btn-ghost mt-3 w-full">
            Clear this list
          </button>
        </>
      )}
    </section>
  );
}

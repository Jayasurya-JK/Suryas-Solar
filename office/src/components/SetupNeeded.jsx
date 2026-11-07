"use client";

import { Icon } from "@/components/ui";

// Shown when a table has not been created yet. One paste in the Supabase SQL editor turns the screen on.
export default function SetupNeeded({ title = "Projects", file = "office/supabase/projects.sql" }) {
  return (
    <div className="card mx-auto max-w-lg p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Icon name="info" className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title} needs one setup step</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        The tables for this screen are not in the database yet. Open Supabase, then SQL Editor, paste the
        file below and press Run. It is safe to run twice and nothing existing is touched.
      </p>
      <p className="mt-3 inline-block rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-700">{file}</p>
      <p className="mt-3 text-xs text-slate-500">After that, reload this screen.</p>
    </div>
  );
}

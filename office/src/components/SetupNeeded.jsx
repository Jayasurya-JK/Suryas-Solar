"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

const SOURCE = "/data/setup-projects.sql";

// Shown when the tables have not been created yet. Nobody should have to hunt for a file in the code:
// one tap copies the whole script, ready to paste into the Supabase SQL editor.
export default function SetupNeeded({ title = "Projects" }) {
  const [copied, setCopied] = useState("");

  const copy = async () => {
    try {
      const res = await fetch(SOURCE, { cache: "no-store" });
      const sql = await res.text();
      await navigator.clipboard.writeText(sql);
      setCopied("Copied. Paste it in the Supabase SQL editor and press Run.");
    } catch {
      setCopied("Could not copy here. Use Open the file instead.");
    }
  };

  return (
    <div className="card mx-auto max-w-lg p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Icon name="info" className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title} needs one setup step</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        The tables for this screen are not in the database yet. Open Supabase, go to the SQL editor, paste and
        press Run. Nothing existing is touched and it is safe to run twice.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <button type="button" className="btn-primary h-11 w-full" onClick={copy}>
          <Icon name="doc" className="h-4 w-4" />Copy the setup file
        </button>
        <a className="btn-ghost h-11 w-full" href={SOURCE} target="_blank" rel="noreferrer">
          <Icon name="download" className="h-4 w-4" />Open the file instead
        </a>
      </div>
      {copied && <p className="mt-3 text-xs font-semibold text-teal">{copied}</p>}
      <p className="mt-4 text-xs text-slate-500">
        The portal customers can be seen now under{" "}
        <Link href="/applications" className="font-semibold text-primary hover:underline">Applications</Link>.
      </p>
    </div>
  );
}


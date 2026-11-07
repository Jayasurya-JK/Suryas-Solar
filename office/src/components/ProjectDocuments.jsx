"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { confirmAction } from "@/components/Confirm";
import { Icon, Notice } from "@/components/ui";
import { ago } from "@/lib/format";

// Documents live in a private Supabase Storage bucket, one folder per project (the folder name is the
// project id, which is what the storage policies read to decide who may open it).
const BUCKET = "project-files";
const MAX_MB = 15;

const sizeText = (n) => {
  const b = Number(n || 0);
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

// Storage names cannot carry spaces or indian-language punctuation safely, so the real name is kept
// beside the file: "{timestamp}-{safe name}" on disk, the picked name shown in the list.
const storedName = (name) => `${Date.now()}-${String(name).replace(/[^A-Za-z0-9._-]+/g, "-").slice(-70)}`;
const shownName = (name) => String(name).replace(/^\d{10,}-/, "");

export default function ProjectDocuments({ projectId, customer }) {
  const sb = supabase();
  const [files, setFiles] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyName, setBusyName] = useState(null);
  const picker = useRef(null);

  const load = useCallback(async () => {
    const { data, error } = await sb.storage.from(BUCKET).list(projectId, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      setFiles([]);
      setMsg({ tone: "red", text: "The document folder is not set up yet. Run supabase/projects.sql again." });
      return;
    }
    setFiles((data || []).filter((f) => f.id && f.name));
  }, [sb, projectId]);
  useEffect(() => { load(); }, [load]);

  const upload = async (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length || busy) return;
    setBusy(true);
    setMsg(null);
    const problems = [];
    let done = 0;
    for (const f of picked) {
      if (f.size > MAX_MB * 1024 * 1024) {
        problems.push(`${f.name} is larger than ${MAX_MB} MB`);
        continue;
      }
      const path = `${projectId}/${storedName(f.name)}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, f, {
        cacheControl: "3600",
        upsert: false,
        contentType: f.type || "application/octet-stream",
      });
      if (error) {
        problems.push(`${f.name}: ${error.message}`);
        continue;
      }
      // The record is a courtesy, not the truth: if it fails the file is still safe in the folder.
      await sb.from("project_files").insert({ project_id: projectId, path, name: f.name, kind: "document" });
      done += 1;
    }
    setBusy(false);
    await load();
    setMsg(problems.length
      ? { tone: "amber", text: `${done} added. ${problems.join(". ")}.` }
      : { tone: "green", text: `${done} file${done === 1 ? "" : "s"} added.` });
  };

  const open = async (f) => {
    setBusyName(f.name);
    const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(`${projectId}/${f.name}`, 600);
    setBusyName(null);
    if (error) return setMsg({ tone: "red", text: error.message });
    const url = data?.signedUrl || data?.signedURL;
    if (url) window.open(url, "_blank", "noreferrer");
  };

  const remove = async (f) => {
    const ok = await confirmAction({
      title: "Remove this document?",
      text: `${shownName(f.name)} will be deleted from ${customer || "this customer"}. This cannot be undone.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setBusyName(f.name);
    const { error } = await sb.storage.from(BUCKET).remove([`${projectId}/${f.name}`]);
    await sb.from("project_files").delete().eq("path", `${projectId}/${f.name}`);
    setBusyName(null);
    if (error) return setMsg({ tone: "red", text: error.message });
    await load();
  };

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-slate-900">Documents</h2>
        <button type="button" className="btn-ghost !h-9 shrink-0 !px-3" disabled={busy} onClick={() => picker.current?.click()}>
          <Icon name="plus" className="h-4 w-4" />{busy ? "Adding..." : "Add"}
        </button>
        <input ref={picker} type="file" multiple className="hidden" onChange={upload} />
      </div>

      <p className="mt-1 text-xs text-slate-500">Aadhaar, EB bill, signed agreement, site photos. Up to {MAX_MB} MB each.</p>

      {files === null ? (
        <p className="mt-3 text-sm text-slate-400">Reading the folder...</p>
      ) : files.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Nothing kept for this customer yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 py-2">
              <Icon name="doc" className="h-4 w-4 shrink-0 text-slate-400" />
              <button type="button" onClick={() => open(f)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-semibold text-slate-800">{shownName(f.name)}</span>
                <span className="block text-xs text-slate-500">{sizeText(f.metadata?.size)} · {ago(f.created_at)}</span>
              </button>
              {busyName === f.name ? (
                <span className="text-xs text-slate-400">...</span>
              ) : (
                <button type="button" onClick={() => remove(f)} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${shownName(f.name)}`}>
                  <Icon name="trash" className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
    </section>
  );
}

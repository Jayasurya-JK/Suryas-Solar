"use client";

import Image from "next/image";
import { Icon } from "@/components/ui";

// One friendly screen for every kind of failure: a page that threw, a boot that could not reach the
// server, or the last-resort root boundary. Recovery first, detail hidden one tap away.
export default function AppError({
  title = "Something went wrong",
  text = "This screen hit a problem. Your work is safe - tap below to open it again.",
  detail,
  onRetry,
  retryLabel = "Try again",
  tone = "amber",
  busy = false,
  inline = false,
}) {
  const icon = tone === "red" ? "x" : "info";
  const circle = tone === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600";
  const body = (
    <div className={`card w-full max-w-md p-7 text-center ${inline ? "" : "shadow-sm"}`}>
      {!inline && (
        <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="mx-auto mb-5 h-auto w-36" />
      )}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${circle}`}>
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {onRetry && (
          <button type="button" className="btn-primary" onClick={onRetry} disabled={busy}>
            {busy ? "Trying..." : retryLabel}
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={() => window.location.reload()}>
          Reload the app
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        If this keeps happening, send a screenshot to the office - the details below help us fix it.
      </p>
      {detail && (
        <details className="mt-3 text-left">
          <summary className="cursor-pointer text-xs font-semibold text-slate-500">What exactly happened</summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">{detail}</pre>
        </details>
      )}
    </div>
  );
  if (inline) return body;
  return <div className="flex page-min items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50/60 to-white p-4">{body}</div>;
}

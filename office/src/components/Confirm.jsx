"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui";

let push = null;

// Replaces window.confirm(). The browser's own dialog is headed "app.suryassolar.com says", which reads like
// a security warning about the site rather than a question from the app - staff hesitate over it. This one
// looks like the rest of the app and says what will actually happen.
export function confirmAction(options = {}) {
  return new Promise((resolve) => {
    if (!push) return resolve(false);
    push({ title: "Are you sure?", text: "", confirmLabel: "Delete", tone: "danger", ...options, resolve });
  });
}

export default function ConfirmHost() {
  const [req, setReq] = useState(null);

  useEffect(() => {
    push = setReq;
    return () => { push = null; };
  }, []);

  const close = (value) => {
    req?.resolve(value);
    setReq(null);
  };

  if (!req) return null;

  return (
    <Modal title={req.title} onClose={() => close(false)}>
      <p className="text-sm leading-relaxed text-slate-600">{req.text}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-ghost" onClick={() => close(false)}>Cancel</button>
        <button className={req.tone === "danger" ? "btn-danger-solid" : "btn-primary"} onClick={() => close(true)}>
          {req.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

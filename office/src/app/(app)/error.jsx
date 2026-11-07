"use client";

import { useEffect } from "react";
import AppError from "@/components/AppError";
import { reportError } from "@/lib/reportError";

// A screen that throws keeps the sidebar and tabs working: only the page area is replaced, so the
// person can walk out of the broken screen instead of losing the whole app.
export default function ScreenError({ error, reset }) {
  useEffect(() => { reportError("screen", error); }, [error]);
  return (
    <div className="flex page-min items-center justify-center p-4">
      <AppError
        inline
        title="This screen did not load"
        text="The rest of the app is still working. Try this screen again, or go back and open something else."
        detail={String(error?.message || error || "")}
        onRetry={() => reset()}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import AppError from "@/components/AppError";
import { reportError } from "@/lib/reportError";

// Catch-all for the routes outside the app shell (login, offline). Without it Next shows the bare
// "Application error: a client-side exception has occurred" page.
export default function RootError({ error, reset }) {
  useEffect(() => { reportError("root", error); }, [error]);
  return (
    <AppError
      title="The app could not open"
      text="Something broke while loading. Tap below and it should come back."
      detail={String(error?.message || error || "")}
      onRetry={() => reset()}
      tone="red"
    />
  );
}

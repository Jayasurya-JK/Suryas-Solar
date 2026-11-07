"use client";

import { useEffect } from "react";
import { watchErrors } from "@/lib/reportError";

// Mounted in the root layout so a crash on any screen - including login - is written down instead of
// vanishing into the browser console.
export default function ErrorWatch() {
  useEffect(() => watchErrors(), []);
  return null;
}

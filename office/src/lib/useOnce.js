"use client";

import { useCallback, useRef } from "react";

// Runs an async action at most once at a time. On a slow connection people tap again because nothing seemed
// to happen; the second tap then saved a duplicate. A ref is used rather than state because state updates
// only land after a re-render, which is exactly the window a fast double tap slips through.
export function useOnce() {
  const running = useRef(false);
  return useCallback(async (fn) => {
    if (running.current) return undefined;
    running.current = true;
    try {
      return await fn();
    } finally {
      running.current = false;
    }
  }, []);
}

/**
 * useNow — returns the current timestamp and re-renders the component
 * every `intervalMs` milliseconds.
 *
 * WHY THIS EXISTS:
 * Convex queries are *reactive* — they only re-run when the underlying DB
 * documents change. When a user goes offline their `lastSeenAt` stops being
 * updated, so the DB never changes, so the query never re-runs, so `isOnline()`
 * is never re-evaluated, so the presence dot stays green forever.
 *
 * By calling `useNow()` in any component that renders an online indicator,
 * we force a local re-render on a timer so `isOnline(lastSeenAt)` is
 * recalculated even when Convex hasn't pushed new data.
 */
import { useState, useEffect } from "react";

export function useNow(intervalMs = 15_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

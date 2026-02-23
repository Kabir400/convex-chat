"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const INTERVAL_MS = 30_000;
export function LastSeenUpdater() {
  const updateLastSeen = useMutation(
    api.controllers.user.updateLastSeen.updateLastSeen,
  );

  const updateRef = useRef(updateLastSeen);
  useEffect(() => {
    updateRef.current = updateLastSeen;
  }, [updateLastSeen]);

  useEffect(() => {
    updateRef.current().catch(() => {});

    const interval = setInterval(() => {
      updateRef.current().catch(() => {});
    }, INTERVAL_MS);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  return null;
}

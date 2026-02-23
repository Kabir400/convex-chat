"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface TypingIndicatorProps {
  conversationId: Id<"conversations">;
}

export default function TypingIndicator({
  conversationId,
}: TypingIndicatorProps) {
  const typingStatus = useQuery(
    api.controllers.typing.getTypingStatus.getTypingStatus,
    { conversationId },
  );

  const [now, setNow] = useState(Date.now());

  // 1. Keep 'now' updated to prune stale typing records every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Derive activeTypers directly from typingStatus and now.
  // This avoids the 'infinite update loop' caused by setting state in useEffect.
  const activeTypers = useMemo(() => {
    if (!typingStatus) return [];

    return typingStatus
      .filter((u) => now - u.updatedAt < 3000)
      .map((u) => u.name);
  }, [typingStatus, now]);

  if (activeTypers.length === 0) return null;

  const text =
    activeTypers.length === 1
      ? `${activeTypers[0]} is typing...`
      : activeTypers.length === 2
        ? `${activeTypers[0]} and ${activeTypers[1]} are typing...`
        : `${activeTypers[0]} and ${activeTypers.length - 1} others are typing...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
      {/* ── loading dots animation ── */}
      <div className="flex gap-1 items-center h-4">
        <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" />
      </div>

      <p className="text-[12px] text-slate-400 font-medium italic">{text}</p>
    </div>
  );
}

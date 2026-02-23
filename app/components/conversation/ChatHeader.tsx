"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  isOnline,
  formatLastSeen,
  getInitials,
  avatarGradient,
} from "../../lib/helpers/userHelpers";
import { useNow } from "../../lib/helpers/useNow";

interface ChatHeaderProps {
  conversationId: Id<"conversations">;
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  const info = useQuery(
    api.controllers.conversation.getOtherUserLastSeen.getOtherUserLastSeen,
    { conversationId },
  );

  // Tick every 15 s so isOnline() is re-evaluated even when Convex hasn't
  // pushed new data (the DB doesn't change when a user is offline).
  useNow(15_000);

  /* ── loading / unauthenticated skeleton ── */
  if (info === undefined || info === null) {
    return (
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/6 bg-[#0f0d1a] animate-pulse shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/8 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-28 rounded-full bg-white/8" />
          <div className="h-2 w-20 rounded-full bg-white/5" />
        </div>
      </header>
    );
  }

  /* ── direct conversation ── */
  if (info.type === "direct") {
    const online = isOnline(info.lastSeenAt ?? undefined);

    return (
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/6 bg-[#0f0d1a] shrink-0">
        {/* avatar */}
        <div className="relative shrink-0">
          {info.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.imageUrl}
              alt={info.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarGradient(info.name)} flex items-center justify-center text-white text-[12px] font-bold`}
            >
              {getInitials(info.name)}
            </div>
          )}

          {/* online / offline dot */}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f0d1a] transition-colors duration-500
              ${
                online
                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                  : "bg-red-500"
              }`}
          />
        </div>

        {/* name + status */}
        <div className="flex flex-col min-w-0">
          <p className="text-[14px] font-semibold text-white truncate leading-none">
            {info.name}
          </p>
          <p
            className={`text-[11.5px] mt-0.5 leading-none font-medium
            ${online ? "text-emerald-400" : "text-slate-500"}`}
          >
            {online
              ? "Active now"
              : formatLastSeen(info.lastSeenAt ?? undefined)}
          </p>
        </div>
      </header>
    );
  }

  /* ── group conversation ── */
  return (
    <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/6 bg-[#0f0d1a] shrink-0">
      {/* group avatar */}
      <div
        className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarGradient(info.name)} flex items-center justify-center text-white shrink-0`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* name + members */}
      <div className="flex flex-col min-w-0">
        <p className="text-[14px] font-semibold text-white truncate leading-none">
          {info.name}
        </p>
        <p className="text-[11.5px] text-slate-500 mt-0.5 leading-none">
          {info.memberCount} members
        </p>
      </div>
    </header>
  );
}

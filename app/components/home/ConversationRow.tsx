"use client";

import {
  getInitials,
  avatarGradient,
  isOnline,
} from "../../lib/helpers/userHelpers";
import { useNow } from "../../lib/helpers/useNow";

/* ─── type matching getConversations return shape ───────────────── */
export interface ConversationItem {
  conversationId: string;
  type: "direct" | "group";
  name: string;
  imageUrl: string | null;
  otherUserClerkId: string | null;
  lastMessageAt: number;
  lastMessagePreview: string | null;
  unreadCount: number;
  otherUserLastSeenAt: number | null;
  memberCount?: number;
}

interface ConversationRowProps {
  conversation: ConversationItem;
  isActive?: boolean;
  onClick: (id: string) => void;
}

/** Truncates text to a max length, appending "…" if needed. */
function truncate(text: string, max = 30) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

/** Relative timestamp — "just now", "5m", "3h", date */
function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ConversationRow({
  conversation,
  isActive = false,
  onClick,
}: ConversationRowProps) {
  // Tick every 15 s so isOnline() is re-evaluated locally even when Convex
  // hasn't pushed new data (DB doesn't change after a user goes offline).
  useNow(15_000);

  const {
    conversationId,
    type,
    name,
    imageUrl,
    unreadCount,
    lastMessagePreview,
    lastMessageAt,
    otherUserLastSeenAt,
  } = conversation;

  // For direct chats: always show a badge — green if online, red if offline.
  // Group chats never show a badge (no single "other" to track).
  const online =
    type === "direct" && isOnline(otherUserLastSeenAt ?? undefined);
  const showPresence = type === "direct";
  const hasUnread = unreadCount > 0;

  return (
    <button
      id={`conversation-${conversationId}`}
      onClick={() => onClick(conversationId)}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer group text-left
        ${isActive ? "bg-violet-500/14" : "hover:bg-white/4"}`}
    >
      {/* ── avatar ── */}
      <div className="relative shrink-0">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarGradient(name)} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}
          >
            {type === "group" ? (
              /* group icon */
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
            ) : (
              getInitials(name)
            )}
          </div>
        )}

        {/* online / offline badge — direct chats only */}
        {showPresence && (
          <span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-[1.5px] border-[#0f0d1a] transition-colors duration-500
              ${
                online
                  ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]"
                  : "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"
              }`}
          />
        )}
      </div>

      {/* ── text ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-[13px] truncate leading-none ${
              hasUnread
                ? "font-bold text-white"
                : isActive
                  ? "font-semibold text-violet-300"
                  : "font-medium text-slate-300 group-hover:text-white"
            }`}
          >
            {name}
          </p>
          <span className="text-[10.5px] text-slate-600 shrink-0">
            {relativeTime(lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-[11.5px] text-slate-600 truncate leading-none">
            {lastMessagePreview
              ? truncate(lastMessagePreview)
              : type === "group"
                ? `${conversation.memberCount ?? "?"} members`
                : "No messages yet"}
          </p>

          {/* unread badge */}
          {hasUnread && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.6)]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

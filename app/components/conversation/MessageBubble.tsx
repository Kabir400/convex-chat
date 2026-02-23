"use client";

import { useState, useCallback } from "react";
import {
  getInitials,
  avatarGradient,
  formatMessageTime,
} from "../../lib/helpers/userHelpers";
import ActionMenu from "./ActionMenu";

/* ─── types ────────────────────────────────────────────────────── */
export interface Reaction {
  reactionId: string;
  type: string;
  userId: string;
  name: string;
  isMine: boolean;
}

export interface Message {
  _id: string;
  content: string | null;
  isDeleted: boolean;
  createdAt: number;
  isMine: boolean;
  sender: {
    name: string;
    imageUrl: string | null;
    clerkId: string | null;
  };
  reactions: Reaction[];
}

function groupReactions(reactions: Reaction[]) {
  const map: Record<string, Reaction[]> = {};
  for (const r of reactions) {
    if (!map[r.type]) map[r.type] = [];
    map[r.type].push(r);
  }
  return Object.entries(map);
}

/* ─── MessageBubble ─────────────────────────────────────────────── */
interface MessageBubbleProps {
  message: Message;
  isGrouped: boolean;
}

export default function MessageBubble({
  message,
  isGrouped,
}: MessageBubbleProps) {
  const { _id, isMine, sender, content, isDeleted, createdAt, reactions } =
    message;
  const grouped = groupReactions(reactions);

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div
      className={`group flex items-end gap-2 ${
        isMine ? "flex-row-reverse" : "flex-row"
      } ${isGrouped ? "mt-0.5" : "mt-4"}`}
    >
      {/* ── avatar ── */}
      <div className="w-7 shrink-0">
        {!isMine &&
          !isGrouped &&
          (sender.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sender.imageUrl}
              alt={sender.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-7 h-7 rounded-full bg-linear-to-br ${avatarGradient(sender.name)} flex items-center justify-center text-white text-[10px] font-bold`}
            >
              {getInitials(sender.name)}
            </div>
          ))}
      </div>

      {/* ── bubble column ── */}
      <div
        className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}
      >
        {/* sender name */}
        {!isMine && !isGrouped && (
          <p className="text-[11px] text-slate-500 font-medium mb-1 ml-1">
            {sender.name}
          </p>
        )}

        {/* ── bubble + action trigger row ── */}
        <div
          className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* bubble */}
          <div
            className={`relative px-3.5 py-2 rounded-2xl text-[13.5px] leading-relaxed
              ${
                isMine
                  ? "bg-violet-600 text-white rounded-br-sm shadow-[0_2px_12px_rgba(139,92,246,0.35)]"
                  : "bg-white/7 text-slate-200 rounded-bl-sm border border-white/8"
              }
              ${isDeleted ? "italic opacity-50" : ""}
            `}
          >
            {isDeleted ? "This message was deleted" : content}
            <span
              className={`ml-2 text-[10px] opacity-50 select-none whitespace-nowrap
                ${isMine ? "text-violet-200" : "text-slate-500"}`}
            >
              {formatMessageTime(createdAt)}
            </span>
          </div>

          {/* ── action trigger ── */}
          {!isDeleted && (
            <div className="relative shrink-0 self-center">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                title="More actions"
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  text-slate-500 hover:text-slate-300
                  hover:bg-white/10 active:bg-white/15
                  transition-all duration-150 cursor-pointer
                  opacity-0 group-hover:opacity-100
                  ${menuOpen ? "opacity-100 bg-white/10 text-slate-300" : ""}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <ActionMenu
                  messageId={_id}
                  isMine={isMine}
                  isDeleted={isDeleted}
                  onClose={closeMenu}
                  alignRight={isMine}
                />
              )}
            </div>
          )}
        </div>

        {/* ── reaction pills ── */}
        {grouped.length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}
          >
            {grouped.map(([emoji, reactors]) => (
              <div
                key={emoji}
                title={reactors.map((r) => r.name).join(", ")}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] cursor-default select-none
                  border transition-colors
                  ${
                    reactors.some((r) => r.isMine)
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
              >
                <span>{emoji}</span>
                {reactors.length > 1 && (
                  <span className="font-semibold">{reactors.length}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

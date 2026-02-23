"use client";

import {
  getInitials,
  formatLastSeen,
  avatarGradient,
  isOnline,
} from "../../lib/helpers/userHelpers";
import { Id } from "../../../convex/_generated/dataModel";

export interface GroupUserRowUser {
  _id: Id<"users">;
  clerkId: string;
  name: string;
  email: string;
  imageUrl?: string;
  lastSeenAt?: number;
}

interface GroupUserRowProps {
  user: GroupUserRowUser;
  selected: boolean;
  onToggle: (id: Id<"users">) => void;
}

export default function GroupUserRow({
  user,
  selected,
  onToggle,
}: GroupUserRowProps) {
  const online = isOnline(user.lastSeenAt);

  return (
    <div
      onClick={() => onToggle(user._id)}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 active:bg-white/8 transition-all duration-150 cursor-pointer group text-left"
    >
      {/* ── checkbox ── */}
      <div className="shrink-0 flex items-center justify-center">
        <div
          className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
            ${
              selected
                ? "bg-violet-600 border-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                : "border-white/20 group-hover:border-white/40"
            }`}
        >
          {selected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {/* ── avatar ── */}
      <div className="relative shrink-0">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all duration-200"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full bg-linear-to-br ${avatarGradient(user.name)} flex items-center justify-center text-white text-[13px] font-bold ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all duration-200`}
          >
            {getInitials(user.name)}
          </div>
        )}

        {online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0d1a] shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
        )}
      </div>

      {/* ── name + email ── */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13.5px] font-semibold transition-colors duration-150 truncate ${selected ? "text-violet-400" : "text-slate-200 group-hover:text-white"}`}
        >
          {user.name}
        </p>
        <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
      </div>

      {/* ── last seen ── */}
      <span className="text-[11px] text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors duration-150">
        {formatLastSeen(user.lastSeenAt)}
      </span>
    </div>
  );
}

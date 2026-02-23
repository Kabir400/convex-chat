"use client";

import {
  getInitials,
  formatLastSeen,
  avatarGradient,
  isOnline,
} from "../../lib/helpers/userHelpers";

export interface UserRowUser {
  clerkId: string;
  name: string;
  email: string;
  imageUrl?: string;
  lastSeenAt?: number;
}

interface UserRowProps {
  user: UserRowUser;
  onClick: (user: UserRowUser) => void;
}

/**
 * A single tappable row in the user list.
 * Shows an avatar (photo or gradient initials fallback), name, email,
 * an optional online indicator, and a relative last-seen timestamp.
 */
export default function UserRow({ user, onClick }: UserRowProps) {
  const online = isOnline(user.lastSeenAt);

  return (
    <button
      id={`user-${user.clerkId}`}
      onClick={() => onClick(user)}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 active:bg-white/8 transition-all duration-150 cursor-pointer group text-left"
    >
      {/* ── avatar ── */}
      <div className="relative shrink-0">
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
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

        {/* online dot */}
        {online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0d1a] shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
        )}
      </div>

      {/* ── name + email ── */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-slate-200 group-hover:text-white truncate transition-colors duration-150">
          {user.name}
        </p>
        <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
      </div>

      {/* ── last seen ── */}
      <span className="text-[11px] text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors duration-150">
        {formatLastSeen(user.lastSeenAt)}
      </span>
    </button>
  );
}

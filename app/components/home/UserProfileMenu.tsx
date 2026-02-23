"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

export default function UserProfileMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const name = user.fullName ?? user.username ?? "User";
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const avatar = user.imageUrl;

  return (
    <div ref={menuRef} className="relative w-full">
      {/* ── Dropdown (opens upward) ── */}
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-[#1a1730] border border-violet-500/20 rounded-2xl p-3 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* User info */}
          <div className="flex items-center gap-3 px-1 pb-3">
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/50 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {name}
              </p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
          </div>

          <div className="h-px bg-white/6 mb-2" />

          {/* Logout */}
          <button
            onClick={() => signOut({ redirectUrl: "/login" })}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors duration-150 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      )}

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left
          ${
            open
              ? "bg-white/6 border-white/10"
              : "bg-transparent border-transparent hover:bg-white/4 hover:border-white/6"
          }`}
        aria-label="User menu"
      >
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover border-2 border-violet-500/40 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-200 truncate leading-tight">
            {name}
          </p>
          <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
            {email}
          </p>
        </div>
        {/* Chevron */}
        <svg
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}

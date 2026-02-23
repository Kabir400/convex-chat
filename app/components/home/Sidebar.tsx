"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import UserProfileMenu from "./UserProfileMenu";
import ConversationList from "./ConversationList";
import type { ConversationItem } from "./ConversationRow";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  /* ── fetch all conversations (real-time via Convex) ── */
  const rawConversations = useQuery(
    api.controllers.conversation.getConversations.getConversations,
  );

  /* ── derive active conversation from the URL ── */
  // pathname is e.g. "/j57abc123xyz", so we strip the leading slash
  const activeId = pathname?.startsWith("/") ? pathname.slice(1) : undefined;

  /* ── filter by the sidebar search term ── */
  const conversations: ConversationItem[] | undefined =
    rawConversations == null // covers both undefined (loading) and null (unauthenticated)
      ? undefined
      : (rawConversations
          .filter((c) =>
            search.trim()
              ? c.name.toLowerCase().includes(search.trim().toLowerCase())
              : true,
          )
          // getConversations returns Id<"conversations">, coerce to string
          .map((c) => ({
            ...c,
            conversationId: c.conversationId as string,
          })) as ConversationItem[]);

  function handleConversationSelect(id: string) {
    router.push(`/${id}`);
    onClose(); // close sidebar on mobile
  }

  return (
    <aside className="w-[240px] h-screen flex flex-col bg-[#0f0d1a] border-r border-white/6 px-3 py-5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Logo + mobile close button ── */}
      <div className="flex items-center gap-2.5 px-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(139,92,246,0.45)] shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="flex-1 text-[17px] font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          ConvexChat
        </span>

        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/6 transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="relative px-1 mb-3">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations…"
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/8 text-[13px] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all duration-200"
        />
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2 px-1 mb-3">
        <button
          onClick={() => router.push("/new-chat")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-500/14 hover:bg-violet-500/24 text-violet-400 hover:text-violet-300 text-[12.5px] font-semibold transition-all duration-200 cursor-pointer border border-violet-500/20 hover:border-violet-500/40"
          aria-label="Create Chat"
        >
          <svg
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="10" y1="11" x2="14" y2="11" />
          </svg>
          New Chat
        </button>
        <button
          onClick={() => router.push("/new-group")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/12 hover:bg-indigo-500/22 text-indigo-400 hover:text-indigo-300 text-[12.5px] font-semibold transition-all duration-200 cursor-pointer border border-indigo-500/20 hover:border-indigo-500/40"
          aria-label="Create Group"
        >
          <svg
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          New Group
        </button>
      </div>

      {/* ── section label ── */}
      {rawConversations != null && rawConversations.length > 0 && (
        <p className="text-[10.5px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">
          Conversations
        </p>
      )}

      {/* ── Conversation list (fills remaining space, scrollable) ── */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={handleConversationSelect}
        searchTerm={search}
      />

      {/* ── User profile pinned to bottom ── */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="h-px bg-white/6" />
        <UserProfileMenu />
      </div>
    </aside>
  );
}

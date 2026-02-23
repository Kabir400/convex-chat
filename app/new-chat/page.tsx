"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDebounce } from "../lib/hooks/useDebounce";
import SearchBar from "../components/new-chat/SearchBar";
import UserList from "../components/new-chat/UserList";
import CreatingConversationOverlay from "../components/new-chat/CreatingConversationOverlay";
import ErrorToast from "../components/new-chat/ErrorToast";
import type { UserRowUser } from "../components/new-chat/UserRow";

export default function NewChatPage() {
  const router = useRouter();

  // ── search state ──────────────────────────────────────────────
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 300);

  // ── mutation state ────────────────────────────────────────────
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── convex ────────────────────────────────────────────────────
  const users = useQuery(api.controllers.user.getUsers.getUsers, {
    search: debouncedSearch || undefined,
  });

  const createConversation = useMutation(
    api.controllers.conversation.createOrGetDirectConversation
      .createOrGetDirectConversation,
  );

  // ── handlers ──────────────────────────────────────────────────
  async function handleUserClick(user: UserRowUser) {
    if (isCreating) return; // block double-tap

    setError(null);
    setIsCreating(true);

    try {
      const result = await createConversation({
        otherUserClerkId: user.clerkId,
      });

      router.push(`/${result.conversationId}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d1a] flex flex-col">
      {/* ── decorative glow blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      {/* ── loading overlay (blocks interaction while creating) ── */}
      {isCreating && <CreatingConversationOverlay />}

      {/* ── error toast ── */}
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      {/* ── page header ── */}
      <header className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-4 border-b border-white/6">
        <button
          onClick={() => router.back()}
          disabled={isCreating}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div>
          <h1 className="text-[16px] font-bold text-white tracking-tight leading-none">
            New Chat
          </h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Select a person to start chatting
          </p>
        </div>
      </header>

      <SearchBar
        value={rawSearch}
        onChange={setRawSearch}
        resultCount={users?.length}
        isLoading={users === undefined}
        debouncedValue={debouncedSearch}
      />

      <UserList
        users={users}
        searchTerm={debouncedSearch}
        onUserClick={handleUserClick}
      />
    </div>
  );
}

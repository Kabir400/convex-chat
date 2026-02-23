"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

import { useDebounce } from "../lib/hooks/useDebounce";
import SearchBar from "../components/new-chat/SearchBar";
import UserListSkeleton from "../components/new-chat/UserListSkeleton";
import EmptyState from "../components/new-chat/EmptyState";
import CreatingConversationOverlay from "../components/new-chat/CreatingConversationOverlay";
import ErrorToast from "../components/new-chat/ErrorToast";

import GroupUserRow, {
  type GroupUserRowUser,
} from "../components/new-group/GroupUserRow";
import GroupNameModal from "../components/new-group/GroupNameModal";

export default function NewGroupPage() {
  const router = useRouter();

  // ── search state ──────────────────────────────────────────────
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 300);

  // ── selection state ───────────────────────────────────────────
  const [selectedUserIds, setSelectedUserIds] = useState<Set<Id<"users">>>(
    new Set(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── mutation state ────────────────────────────────────────────
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── convex ────────────────────────────────────────────────────
  const users = useQuery(api.controllers.user.getUsers.getUsers, {
    search: debouncedSearch || undefined,
  }) as GroupUserRowUser[] | undefined;

  const createGroup = useMutation(
    api.controllers.conversation.createGroup.createGroup,
  );

  // ── handlers ──────────────────────────────────────────────────
  function toggleUserSelection(id: Id<"users">) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleCreateGroup(name: string) {
    if (isCreating || !name.trim()) return;

    setError(null);
    setIsCreating(true);

    try {
      const result = await createGroup({
        name: name.trim(),
        memberIds: Array.from(selectedUserIds),
      });

      router.push(`/${result.conversationId}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setIsCreating(false);
      setIsModalOpen(false);
    }
  }

  // Right arrow appears when at least 1 user is selected
  const canContinue = selectedUserIds.size >= 1;

  return (
    <div className="min-h-screen bg-[#0f0d1a] flex flex-col relative overflow-hidden">
      {/* ── decorative glow blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      {/* ── loading overlay ── */}
      {isCreating && <CreatingConversationOverlay />}

      {/* ── group name modal ── */}
      {isModalOpen && (
        <GroupNameModal
          onConfirm={handleCreateGroup}
          onCancel={() => setIsModalOpen(false)}
          isCreating={isCreating}
        />
      )}

      {/* ── error toast ── */}
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      {/* ── page header ── */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-5 pt-6 pb-4 border-b border-white/6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            disabled={isCreating}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-40"
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
              New Group
            </h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {selectedUserIds.size > 0
                ? `${selectedUserIds.size} users selected`
                : "Select users to start a group"}
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <SearchBar
          value={rawSearch}
          onChange={setRawSearch}
          resultCount={users?.length}
          isLoading={users === undefined}
          debouncedValue={debouncedSearch}
        />
      </div>

      {/* ── scrollable user list ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-24 space-y-1 custom-scrollbar">
        {users === undefined && <UserListSkeleton rows={6} />}

        {users &&
          users.map((user) => (
            <GroupUserRow
              key={user.clerkId}
              user={user}
              selected={selectedUserIds.has(user._id)}
              onToggle={toggleUserSelection}
            />
          ))}

        {users && users.length === 0 && (
          <EmptyState searchTerm={debouncedSearch} />
        )}
      </div>

      {/* ── sticky bottom creation button ── */}
      <div
        className={`fixed bottom-8 right-8 z-30 transition-all duration-300 transform 
        ${canContinue ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90 pointer-events-none"}`}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(139,92,246,0.5)] hover:bg-violet-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

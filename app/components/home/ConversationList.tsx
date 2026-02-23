"use client";

import ConversationRow, { type ConversationItem } from "./ConversationRow";
import ConversationListSkeleton from "./ConversationListSkeleton";

interface ConversationListProps {
  conversations: ConversationItem[] | undefined;
  activeId?: string;
  onSelect: (id: string) => void;
  searchTerm?: string;
}

/**
 * Handles all three sidebar list states:
 *  - undefined  → animated skeleton
 *  - empty []   → friendly empty-state nudge
 *  - data       → scrollable list of ConversationRow items
 */
export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  searchTerm,
}: ConversationListProps) {
  const isLoading = conversations === undefined;

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 pr-0.5 custom-scrollbar">
      {/* ── loading ── */}
      {isLoading && <ConversationListSkeleton rows={5} />}

      {/* ── empty ── */}
      {!isLoading && conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-white/4 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-600"
            >
              {searchTerm ? (
                /* search x icon */
                <>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </>
              ) : (
                /* chat bubble icon */
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              )}
            </svg>
          </div>
          <p className="text-[12.5px] font-semibold text-slate-500">
            {searchTerm ? "No results found" : "No conversations"}
          </p>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            {searchTerm
              ? `We couldn't find anything for "${searchTerm}"`
              : 'Tap "New Chat" to start talking'}
          </p>
        </div>
      )}

      {/* ── data ── */}
      {!isLoading &&
        conversations.map((c) => (
          <ConversationRow
            key={c.conversationId}
            conversation={c}
            isActive={c.conversationId === activeId}
            onClick={onSelect}
          />
        ))}
    </div>
  );
}

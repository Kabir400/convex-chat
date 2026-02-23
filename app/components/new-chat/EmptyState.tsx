"use client";

interface EmptyStateProps {
  /** The debounced search term currently in effect, if any. */
  searchTerm?: string;
}

/**
 * Full-bleed empty state displayed when the user list returns nothing.
 * Shows a contextual message depending on whether a search is active.
 */
export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center select-none">
      {/* icon tile */}
      <div className="w-16 h-16 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-600"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <p className="text-[14px] font-semibold text-slate-500">
        {searchTerm ? "No results found" : "No users yet"}
      </p>

      <p className="text-[12px] text-slate-600 mt-1 max-w-[200px]">
        {searchTerm
          ? `Nothing matched "${searchTerm}"`
          : "Invite your friends to ConvexChat!"}
      </p>
    </div>
  );
}

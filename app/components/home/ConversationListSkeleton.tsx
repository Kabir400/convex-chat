"use client";

/** Skeleton loading state for the conversation list in the sidebar. */
export default function ConversationListSkeleton({
  rows = 5,
}: {
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1 px-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl animate-pulse"
        >
          <div className="w-9 h-9 rounded-full bg-white/6 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-full bg-white/6 w-3/5" />
            <div className="h-2 rounded-full bg-white/4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

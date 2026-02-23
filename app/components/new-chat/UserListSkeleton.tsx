"use client";

/** Animated skeleton rows shown while user data is loading. */
export default function UserListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse"
        >
          {/* avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-white/6 shrink-0" />
          {/* text placeholders */}
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded-full bg-white/6 w-2/5" />
            <div className="h-2.5 rounded-full bg-white/4 w-1/2" />
          </div>
          {/* timestamp placeholder */}
          <div className="h-2.5 rounded-full bg-white/4 w-10 shrink-0" />
        </div>
      ))}
    </>
  );
}

"use client";

/** Animated skeleton shown while messages are loading. */
export default function MessageListSkeleton() {
  // Alternating mine / theirs pattern so it looks realistic
  const rows: Array<{ mine: boolean; wide: boolean }> = [
    { mine: false, wide: true },
    { mine: false, wide: false },
    { mine: true, wide: false },
    { mine: true, wide: true },
    { mine: false, wide: true },
    { mine: true, wide: false },
    { mine: false, wide: false },
    { mine: true, wide: true },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 animate-pulse ${row.mine ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* avatar placeholder — theirs only */}
          {!row.mine && (
            <div className="w-7 h-7 rounded-full bg-white/7 shrink-0" />
          )}

          {/* bubble placeholder */}
          <div
            className={`h-9 rounded-2xl ${row.mine ? "bg-violet-600/20" : "bg-white/6"}
              ${row.wide ? "w-52" : "w-32"}`}
          />
        </div>
      ))}
    </div>
  );
}

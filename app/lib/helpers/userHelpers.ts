/** Returns up to 2 uppercase initials from a full name. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Human-readable relative timestamp for the last-seen value. */
export function formatLastSeen(ts: number | undefined): string {
  if (!ts) return "Never online";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

/**
 * A user is "online" if their last-seen timestamp was within the last 30 seconds.
 * Anything older counts as offline.
 */
export function isOnline(lastSeenAt: number | undefined): boolean {
  return !!lastSeenAt && Date.now() - lastSeenAt < 30_000;
}

/* ─── avatar gradient palette ─────────────────────────────────── */
const AVATAR_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-fuchsia-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
] as const;

/**
 * Returns a deterministic Tailwind gradient class based on the first
 * character of the user's name so the colour stays consistent.
 */
export function avatarGradient(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

/**
 * Advanced timestamp formatter for Point 4:
 * - Today: "2:34 PM"
 * - Older (this year): "Feb 15, 2:34 PM"
 * - Older (different year): "Jan 1, 2023, 2:34 PM"
 */
export function formatMessageTime(ts: number): string {
  const date = new Date(ts);
  const now = new Date();

  // 1. Time string (e.g. "2:34 PM")
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return timeStr;

  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isThisYear) {
    // e.g. "Feb 15, 2:34 PM"
    return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${timeStr}`;
  }

  // e.g. "Jan 1, 2023, 2:34 PM"
  return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}, ${timeStr}`;
}

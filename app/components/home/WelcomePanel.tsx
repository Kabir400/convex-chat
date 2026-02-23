"use client";

interface WelcomePanelProps {
  onMenuClick: () => void;
}

const PILLS = [
  { icon: "⚡", label: "Real-time" },
  { icon: "🔒", label: "Secure" },
  { icon: "👥", label: "Groups & DMs" },
  { icon: "😄", label: "Reactions" },
];

export default function WelcomePanel({ onMenuClick }: WelcomePanelProps) {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#100e1c] relative">
      {/* Background orbs — pointer-events-none so they don't interfere */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Mobile top bar with hamburger ── */}
      <div className="md:hidden flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl bg-white/4 border border-white/6 text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
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
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="text-sm font-semibold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          ConvexChat
        </span>
      </div>

      {/* ── Centered content ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="flex flex-col items-center text-center gap-6 max-w-md w-full">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.4)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to{" "}
              <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                ConvexChat
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Real-time messaging powered by Convex & Clerk.
              <br className="hidden sm:block" />
              Select a chat from the sidebar to get started.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PILLS.map((p) => (
              <span
                key={p.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-slate-300 text-xs font-medium"
              >
                <span>{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/6" />

          {/* Hint */}
          <p className="text-slate-600 text-xs">
            👈 Choose a conversation or start a new one from the sidebar
          </p>
        </div>
      </div>
    </div>
  );
}

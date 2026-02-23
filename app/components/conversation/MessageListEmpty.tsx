"use client";

export default function MessageListEmpty() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center px-6 select-none">
        <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-600"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-slate-500">
          No messages yet
        </p>
        <p className="text-[11.5px] text-slate-600 leading-snug">
          Say hello! Your messages will appear here.
        </p>
      </div>
    </div>
  );
}

"use client";

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm animate-[slideDown_0.2s_ease-out]">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 backdrop-blur-sm shadow-lg">
        {/* icon */}
        <span className="shrink-0 mt-0.5 text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>

        {/* message */}
        <p className="flex-1 text-[13px] text-red-300 leading-snug">
          {message}
        </p>

        {/* dismiss */}
        <button
          onClick={onDismiss}
          className="shrink-0 text-red-500 hover:text-red-300 transition-colors cursor-pointer"
          aria-label="Dismiss error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

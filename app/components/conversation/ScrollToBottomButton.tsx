"use client";

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

export default function ScrollToBottomButton({
  onClick,
}: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Scroll to latest message"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
        bg-violet-600/90 hover:bg-violet-500 backdrop-blur-sm
        text-white text-[12px] font-semibold
        shadow-[0_4px_16px_rgba(139,92,246,0.5)]
        border border-violet-500/40
        transition-all duration-200 hover:scale-105 cursor-pointer
        animate-[fadeUp_0.2s_ease-out]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
      New message
    </button>
  );
}

"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── mutations ── */
  const sendMessage = useMutation(
    api.controllers.message.sendMessage.sendMessage,
  );
  const setTyping = useMutation(api.controllers.typing.setTyping.setTyping);

  const lastTypingTime = useRef<number>(0);

  /* ── auto-grow textarea up to ~5 lines ── */
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    setError(null);

    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";

    // ── typing indicator logic ──
    const now = Date.now();
    // Only notify if it's been > 2s since the last setTyping call
    if (val.trim() && now - lastTypingTime.current > 2000) {
      lastTypingTime.current = now;
      setTyping({ conversationId }).catch(() => {});
    }
  }

  /* ── send ── */
  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      await sendMessage({ conversationId, content: trimmed });
      setText("");
      // Reset typing record immediately on send
      setTyping({ conversationId, isTyping: false }).catch(() => {});
      lastTypingTime.current = 0;

      // reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send. Try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  /* ── Enter sends, Shift+Enter adds newline ── */
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = text.trim().length > 0 && !isSending;

  return (
    <div className="px-4 py-3 border-t border-white/6 bg-[#0f0d1a] shrink-0">
      {/* ── error banner ── */}
      {error && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[12px] text-red-300 flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-300 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
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
      )}

      {/* ── input row ── */}
      <div className="flex items-end gap-2">
        {/* textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            disabled={isSending}
            className="w-full resize-none rounded-2xl bg-white/5 border border-white/8 text-[13.5px] text-slate-200 placeholder-slate-600
              px-4 py-2.5 leading-relaxed
              focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/40
              disabled:opacity-50 transition-all duration-200
              scrollbar-hide"
            style={{ minHeight: "42px", maxHeight: "120px" }}
          />
        </div>

        {/* send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200
            ${
              canSend
                ? "bg-violet-600 hover:bg-violet-500 shadow-[0_2px_12px_rgba(139,92,246,0.5)] cursor-pointer scale-100 hover:scale-105"
                : "bg-white/6 cursor-not-allowed opacity-40"
            }`}
        >
          {isSending ? (
            /* spinner */
            <svg
              className="animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            /* send arrow */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white -translate-x-px"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      {/* shift+enter hint */}
      <p className="text-[10.5px] text-slate-700 mt-1.5 ml-1 select-none">
        Shift + Enter for new line
      </p>
    </div>
  );
}

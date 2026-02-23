"use client";

import { useRef, useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

/* ─── constants ─────────────────────────────────────────────────── */
const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"] as const;
type EmojiType = (typeof EMOJIS)[number];

/* ─── ActionMenu ────────────────────────────────────────────────── */
interface ActionMenuProps {
  messageId: string;
  isMine: boolean;
  isDeleted: boolean;
  onClose: () => void;
  /** position the menu to the left if the bubble is on the right (isMine) */
  alignRight: boolean;
}

export default function ActionMenu({
  messageId,
  isMine,
  isDeleted,
  onClose,
  alignRight,
}: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const updateReaction = useMutation(
    api.controllers.reaction.updateReaction.updateReaction,
  );
  const deleteMessage = useMutation(
    api.controllers.message.deleteMessage.deleteMessage,
  );

  const [deleting, setDeleting] = useState(false);
  const [reactingTo, setReactingTo] = useState<EmojiType | null>(null);

  /* close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  async function handleReact(emoji: EmojiType) {
    if (reactingTo) return;
    setReactingTo(emoji);
    try {
      await updateReaction({
        messageId: messageId as Id<"messages">,
        reaction: emoji,
      });
    } catch {
      // silently ignore
    } finally {
      setReactingTo(null);
      onClose();
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteMessage({ messageId: messageId as Id<"messages"> });
    } catch {
      // silently ignore
    } finally {
      setDeleting(false);
      onClose();
    }
  }

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 bottom-full mb-2 ${
        alignRight ? "right-0" : "left-0"
      }`}
      // stop the parent hover-group from seeing mouseleave
      onMouseLeave={(e) => e.stopPropagation()}
    >
      {/* ── glass card ── */}
      <div
        className="
          bg-[#1a1628]/95 backdrop-blur-xl
          border border-white/10
          rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]
          p-2 flex flex-col gap-1
          animate-in fade-in slide-in-from-bottom-2 duration-150
        "
        style={{ minWidth: "min-content" }}
      >
        {/* ── emoji row ── */}
        {!isDeleted && (
          <div className="flex items-center gap-0.5 px-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                disabled={!!reactingTo}
                title={`React with ${emoji}`}
                className="
                  w-8 h-8 rounded-xl flex items-center justify-center text-[18px]
                  hover:bg-white/10 active:scale-90
                  transition-all duration-100 cursor-pointer
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {reactingTo === emoji ? (
                  <span className="animate-spin text-[12px]">⟳</span>
                ) : (
                  emoji
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── divider (only when both sections exist) ── */}
        {!isDeleted && isMine && <div className="h-px bg-white/8 mx-1" />}

        {/* ── delete (owner only) ── */}
        {isMine && !isDeleted && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="
              flex items-center gap-2 px-3 py-1.5 rounded-xl
              text-[12.5px] font-medium text-red-400
              hover:bg-red-500/15 active:bg-red-500/25
              transition-colors duration-150 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              whitespace-nowrap
            "
          >
            {deleting ? (
              <>
                <span className="w-3.5 h-3.5 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                {/* trash icon */}
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
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Delete
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

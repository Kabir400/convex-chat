"use client";

import { Id } from "../../../convex/_generated/dataModel";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatPanelProps {
  conversationId: Id<"conversations">;
}

/**
 * Right-side panel for the /:id route.
 * Composed of: ChatHeader | MessageList | MessageInput (coming next)
 */
export default function ChatPanel({ conversationId }: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#100e1c] relative overflow-hidden">
      {/* decorative orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/6 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── top bar ── */}
      <div className="relative z-10 shrink-0">
        <ChatHeader conversationId={conversationId} />
      </div>

      {/* ── messages (fills remaining space, scrollable) ── */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <MessageList conversationId={conversationId} />
      </div>

      {/* ── input bar ── */}
      <MessageInput conversationId={conversationId} />
    </div>
  );
}

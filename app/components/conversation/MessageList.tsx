"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import MessageBubble, { type Message } from "./MessageBubble";
import MessageListSkeleton from "./MessageListSkeleton";
import MessageListError from "./MessageListError";
import MessageListEmpty from "./MessageListEmpty";
import ScrollToBottomButton from "./ScrollToBottomButton";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  conversationId: Id<"conversations">;
}

const BOTTOM_THRESHOLD = 80;

export default function MessageList({ conversationId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  /* ── reset when conversation switches ── */
  useEffect(() => {
    isInitialLoad.current = true;
    setShowScrollBtn(false);
  }, [conversationId]);

  /* ── queries ── */
  const messages = useQuery(api.controllers.message.getMessages.getMessages, {
    conversationId,
  });
  const reactionsMap = useQuery(
    api.controllers.reaction.getReactionsByConversation
      .getReactionsByConversation,
    { conversationId },
  );

  /* ── mutations ── */
  const markAsRead = useMutation(api.controllers.message.markAsRead.markAsRead);
  /* ── scroll helpers ── */
  function isNearBottom() {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
  }

  const handleScroll = useCallback(() => {
    if (isNearBottom()) setShowScrollBtn(false);
  }, []);

  function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    bottomRef.current?.scrollIntoView({ behavior });
    setShowScrollBtn(false);
  }

  /* ── proactive read synchronizer ── */
  useEffect(() => {
    // 1. Mark as read when the window gains focus or tab becomes visible
    const handleFocus = () => {
      if (document.visibilityState === "visible" && isNearBottom()) {
        markAsRead({ conversationId }).catch(() => {});
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [conversationId, markAsRead]);

  /* ── react to incoming messages ── */
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const isVisible = document.visibilityState === "visible";

    if (isInitialLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
      // Mark as read on first load
      markAsRead({ conversationId }).catch(() => {});
      return;
    }

    if (isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      // If the user is at the bottom and currently looking at the app,
      // mark it as read immediately so the sidebar badge stays at 0.
      if (isVisible) {
        markAsRead({ conversationId }).catch(() => {});
      }
    } else {
      setShowScrollBtn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, conversationId]);

  /* ── loading ── */
  if (messages === undefined || reactionsMap === undefined) {
    return (
      <div className="flex-1 overflow-y-auto">
        <MessageListSkeleton />
      </div>
    );
  }

  /* ── error ── */
  if (!Array.isArray(messages)) {
    return <MessageListError />;
  }

  /* ── empty ── */
  if (messages.length === 0) {
    return <MessageListEmpty />;
  }

  /* ── merge messages + reactions ── */
  const enriched: Message[] = messages.map((msg) => ({
    ...msg,
    _id: msg._id as string,
    reactions:
      (reactionsMap as Record<string, Message["reactions"]>)[
        msg._id as string
      ] ?? [],
  }));

  /* ── render ── */
  return (
    <div className="flex-1 relative min-h-0">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto px-4 py-4 custom-scrollbar"
      >
        {enriched.map((msg, i) => {
          const prev = enriched[i - 1];
          const isGrouped =
            !!prev &&
            prev.sender.clerkId === msg.sender.clerkId &&
            !prev.isMine === !msg.isMine &&
            msg.createdAt - prev.createdAt < 120_000;

          return (
            <MessageBubble key={msg._id} message={msg} isGrouped={isGrouped} />
          );
        })}
        <TypingIndicator conversationId={conversationId} />
        <div ref={bottomRef} className="h-1" />
      </div>

      {showScrollBtn && (
        <ScrollToBottomButton onClick={() => scrollToBottom("smooth")} />
      )}
    </div>
  );
}

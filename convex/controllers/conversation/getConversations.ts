import { query } from "../../_generated/server";

export const getConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null; // auth not ready yet; Convex will re-run once token arrives

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return null; // Syncing from Clerk is still in progress
    }

    const allConversations = await ctx.db.query("conversations").collect();

    const myConversations = allConversations.filter((c) =>
      c.members.includes(currentUser._id),
    );

    //Enrich each conversation in parallel
    const enriched = await Promise.all(
      myConversations.map(async (conversation) => {
        //Read status → to compute unread count
        const readRecord = await ctx.db
          .query("conversationReads")
          .withIndex("by_user_conversation", (q) =>
            q
              .eq("userId", currentUser._id)
              .eq("conversationId", conversation._id),
          )
          .unique();

        const lastReadAt = readRecord?.lastReadAt ?? 0;

        //Unread count: non-deleted messages after lastReadAt
        //sent by someone other than the current user
        const allMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q
              .eq("conversationId", conversation._id)
              .gt("createdAt", lastReadAt),
          )
          .collect();

        const unreadCount = allMessages.filter(
          (m) => !m.isDeleted && m.senderId !== currentUser._id,
        ).length;

        //Last message preview (from lastMessageId if set)
        let lastMessagePreview: string | null = null;
        if (conversation.lastMessageId) {
          const lastMsg = await ctx.db.get(conversation.lastMessageId);
          if (lastMsg) {
            lastMessagePreview = lastMsg.isDeleted
              ? "This message was deleted"
              : lastMsg.content;
          }
        }

        //Conversation display info
        if (conversation.type === "direct") {
          //Find the other member
          const otherUserId = conversation.members.find(
            (id) => id !== currentUser._id,
          );

          const otherUser = otherUserId ? await ctx.db.get(otherUserId) : null;

          return {
            conversationId: conversation._id,
            type: "direct" as const,

            //Display info
            name: otherUser?.name ?? "Unknown User",
            imageUrl: otherUser?.imageUrl ?? null,
            otherUserClerkId: otherUser?.clerkId ?? null,

            //Sorting & badges
            lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt,
            lastMessagePreview,
            unreadCount,

            //Other user's online status
            otherUserLastSeenAt: otherUser?.lastSeenAt ?? null,
          };
        } else {
          //Group conversation
          return {
            conversationId: conversation._id,
            type: "group" as const,

            //Display info
            name: conversation.name ?? "Unnamed Group",
            imageUrl: null,
            otherUserClerkId: null,

            //Sorting & badges
            lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt,
            lastMessagePreview,
            unreadCount,

            memberCount: conversation.members.length,
            otherUserLastSeenAt: null,
          };
        }
      }),
    );

    //Sort conversations with recent activity bubble to the top
    //Primary sort   → lastMessageAt descending (most recent first)
    //Secondary sort → unread conversations first (when timestamps are equal)
    enriched.sort((a, b) => {
      if (b.lastMessageAt !== a.lastMessageAt) {
        return b.lastMessageAt - a.lastMessageAt;
      }
      return b.unreadCount - a.unreadCount;
    });

    return enriched;
  },
});

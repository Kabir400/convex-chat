import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null; // auth not ready yet; Convex will re-run once token arrives

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return null;
    }

    // Verify the conversation exists
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify the current user is a member
    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    // Fetch all messages ordered oldest → newest
    // by_conversation index: ["conversationId", "createdAt"]
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("asc")
      .collect();

    // Enrich each message with sender info
    const enriched = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);

        return {
          _id: message._id,
          conversationId: message.conversationId,
          content: message.isDeleted ? null : message.content,
          isDeleted: message.isDeleted,
          createdAt: message.createdAt,
          isMine: message.senderId === currentUser._id,
          sender: {
            clerkId: sender?.clerkId ?? null,
            name: sender?.name ?? "Unknown User",
            imageUrl: sender?.imageUrl ?? null,
          },
        };
      }),
    );

    return enriched;
  },
});

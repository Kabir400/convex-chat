import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Verify the conversation exists
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify the current user is actually a member
    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    // Guard against empty messages
    const content = args.content.trim();
    if (!content) {
      throw new Error("Message content cannot be empty");
    }

    const now = Date.now();

    // Insert the message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: currentUser._id,
      content,
      isDeleted: false,
      createdAt: now,
    });

    // Update conversation's lastMessageAt and lastMessageId
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
      lastMessageId: messageId,
    });

    // Mark conversation as read for the sender
    // (they obviously just read it — they sent the message)
    const existingRead = await ctx.db
      .query("conversationReads")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("conversationId", args.conversationId),
      )
      .unique();

    if (existingRead) {
      await ctx.db.patch(existingRead._id, { lastReadAt: now });
    } else {
      await ctx.db.insert("conversationReads", {
        userId: currentUser._id,
        conversationId: args.conversationId,
        lastReadAt: now,
      });
    }

    return { messageId };
  },
});

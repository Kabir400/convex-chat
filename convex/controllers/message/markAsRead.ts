import { mutation } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Mark all messages in a conversation as read for the current user.
 *
 * Strategy: we store one `conversationReads` row per (user, conversation).
 * Setting `lastReadAt` to `Date.now()` means every message whose
 * `createdAt <= lastReadAt` is considered read by this user.
 */
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Resolve current user
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

    // Verify the current user is a member
    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    const now = Date.now();

    // Upsert the read-receipt row
    const existingRead = await ctx.db
      .query("conversationReads")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("conversationId", args.conversationId),
      )
      .unique();

    if (existingRead) {
      // Only update if there are actually newer messages to mark as read
      if (existingRead.lastReadAt < now) {
        await ctx.db.patch(existingRead._id, { lastReadAt: now });
      }
    } else {
      await ctx.db.insert("conversationReads", {
        userId: currentUser._id,
        conversationId: args.conversationId,
        lastReadAt: now,
      });
    }

    return { success: true };
  },
});

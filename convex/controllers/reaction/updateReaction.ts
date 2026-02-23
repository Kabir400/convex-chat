import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const updateReaction = mutation({
  args: {
    messageId: v.id("messages"),
    reaction: v.union(
      v.literal("👍"),
      v.literal("❤️"),
      v.literal("😂"),
      v.literal("😮"),
      v.literal("😢"),
    ),
  },

  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Resolve the current user from the DB
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // 3. Verify the message exists and is not deleted
    const message = await ctx.db.get(args.messageId);
    if (!message || message.isDeleted) {
      throw new Error("Message not found");
    }

    // 4. Verify the current user belongs to the conversation the message is in
    const conversation = await ctx.db.get(message.conversationId);
    if (!conversation || !conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    // 5. Look up any existing reaction by this user on this message
    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message_user", (q) =>
        q.eq("messageId", args.messageId).eq("userId", currentUser._id),
      )
      .unique();

    if (existingReaction) {
      if (existingReaction.type === args.reaction) {
        // Same reaction → toggle off (remove it)
        await ctx.db.delete(existingReaction._id);
        return { action: "removed", reaction: args.reaction };
      } else {
        // Different reaction → replace it
        await ctx.db.patch(existingReaction._id, {
          type: args.reaction,
          createdAt: Date.now(),
        });
        return { action: "replaced", reaction: args.reaction };
      }
    } else {
      // No existing reaction → add a new one
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: currentUser._id,
        type: args.reaction,
        createdAt: Date.now(),
      });
      return { action: "added", reaction: args.reaction };
    }
  },
});

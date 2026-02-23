import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
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

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Only the sender can delete their own message
    if (message.senderId !== currentUser._id) {
      throw new Error("You can only delete your own messages");
    }

    // Already deleted — no-op
    if (message.isDeleted) {
      return { messageId: args.messageId };
    }

    // Soft delete: flip the boolean, content stays intact in DB
    await ctx.db.patch(args.messageId, { isDeleted: true });

    return { messageId: args.messageId };
  },
});

import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.optional(v.boolean()),
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    // Check for existing typing record
    const existingRecord = await ctx.db
      .query("typing")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("conversationId", args.conversationId),
      )
      .unique();

    // If explicitly told typing has STOPPED, remove the record
    if (args.isTyping === false) {
      if (existingRecord) {
        await ctx.db.delete(existingRecord._id);
      }
      return;
    }

    // Otherwise, upsert or patch
    if (existingRecord) {
      await ctx.db.patch(existingRecord._id, { updatedAt: Date.now() });
    } else {
      await ctx.db.insert("typing", {
        conversationId: args.conversationId,
        userId: currentUser._id,
        updatedAt: Date.now(),
      });
    }
  },
});

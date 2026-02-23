import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const createOrGetDirectConversation = mutation({
  args: {
    otherUserClerkId: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Resolve current user's Convex record
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Guard: cannot start a conversation with yourself
    if (currentUser.clerkId === args.otherUserClerkId) {
      throw new Error("Cannot start a conversation with yourself");
    }

    // Resolve the other user by their clerkId
    const otherUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.otherUserClerkId))
      .unique();

    if (!otherUser) {
      throw new Error("The specified user does not exist");
    }

    // Fetch all conversations and filter in memory.
    const allConversations = await ctx.db.query("conversations").collect();

    // Find a direct conversation that has exactly these two members
    const existing = allConversations.find(
      (c) =>
        c.type === "direct" &&
        c.members.length === 2 &&
        c.members.includes(currentUser._id) &&
        c.members.includes(otherUser._id),
    );

    if (existing) {
      return {
        conversationId: existing._id,
        isNew: false,
        conversation: existing,
        currentUser: {
          clerkId: currentUser.clerkId,
          name: currentUser.name,
          imageUrl: currentUser.imageUrl,
        },
        otherUser: {
          clerkId: otherUser.clerkId,
          name: otherUser.name,
          imageUrl: otherUser.imageUrl,
        },
      };
    }

    //create a new direct conversation
    const now = Date.now();

    const conversationId = await ctx.db.insert("conversations", {
      type: "direct",
      members: [currentUser._id, otherUser._id],
      createdBy: currentUser._id,
      createdAt: now,
    });

    const newConversation = await ctx.db.get(conversationId);

    return {
      conversationId,
      isNew: true,
      conversation: newConversation,
      currentUser: {
        clerkId: currentUser.clerkId,
        name: currentUser.name,
        imageUrl: currentUser.imageUrl,
      },
      otherUser: {
        clerkId: otherUser.clerkId,
        name: otherUser.name,
        imageUrl: otherUser.imageUrl,
      },
    };
  },
});

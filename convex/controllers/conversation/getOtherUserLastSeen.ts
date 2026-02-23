import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getOtherUserLastSeen = query({
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

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    //Direct message
    if (conversation.type === "direct") {
      const otherUserId = conversation.members.find(
        (id) => id !== currentUser._id,
      );

      const otherUser = otherUserId ? await ctx.db.get(otherUserId) : null;

      return {
        type: "direct" as const,
        clerkId: otherUser?.clerkId ?? null,
        name: otherUser?.name ?? "Unknown User",
        imageUrl: otherUser?.imageUrl ?? null,
        lastSeenAt: otherUser?.lastSeenAt ?? null,
      };
    }

    //Group conversation
    const members = await Promise.all(
      conversation.members.map(async (memberId) => {
        const user = await ctx.db.get(memberId);
        return {
          clerkId: user?.clerkId ?? null,
          name: user?.name ?? "Unknown User",
          imageUrl: user?.imageUrl ?? null,
        };
      }),
    );

    return {
      type: "group" as const,
      name: conversation.name ?? "Unnamed Group",
      memberCount: conversation.members.length,
      members,
    };
  },
});

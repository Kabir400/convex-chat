import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getTypingStatus = query({
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

    // Fetch all typing records for this conversation
    const typingRecords = await ctx.db
      .query("typing")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    // Exclude the current user's own record
    const otherRecords = typingRecords.filter(
      (r) => r.userId !== currentUser._id,
    );

    // Enrich with user data and return raw — no staleness filtering here.
    // Convex only re-runs this query on document mutations, NOT on time passing.
    // The frontend uses updatedAt + a 3s setTimeout to decide if still typing.
    const enriched = await Promise.all(
      otherRecords.map(async (record) => {
        const user = await ctx.db.get(record.userId);
        return {
          clerkId: user?.clerkId ?? null,
          name: user?.name ?? "Unknown User",
          updatedAt: record.updatedAt,
        };
      }),
    );

    return enriched;
  },
});

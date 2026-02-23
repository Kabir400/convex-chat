import { mutation } from "../../_generated/server";

export const updateLastSeen = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return; // auth not ready yet; skip silently

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    await ctx.db.patch(currentUser._id, {
      lastSeenAt: Date.now(),
    });
  },
});

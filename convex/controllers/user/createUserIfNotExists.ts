import { mutation } from "../../_generated/server";

export const createUserIfNotExists = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const now = Date.now();

    if (!existing) {
      await ctx.db.insert("users", {
        clerkId: identity.subject,
        name: identity.name ?? "",
        email: identity.email ?? "",
        imageUrl: identity.pictureUrl,
        lastSeenAt: now,
        createdAt: now,
      });
    } else {
      await ctx.db.patch(existing._id, {
        lastSeenAt: now,
      });
    }
  },
});

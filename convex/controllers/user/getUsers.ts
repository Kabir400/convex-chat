import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getUsers = query({
  args: {
    search: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    // Must be authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Resolve the currently logged-in user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      return null;
    }

    const searchTerm = args.search?.trim().toLowerCase() ?? "";

    if (searchTerm === "") {
      // No search term → return all users except self
      const allUsers = await ctx.db.query("users").collect();

      return allUsers
        .filter((u) => u._id !== currentUser._id)
        .map((u) => ({
          _id: u._id,
          clerkId: u.clerkId,
          name: u.name,
          email: u.email,
          imageUrl: u.imageUrl,
          lastSeenAt: u.lastSeenAt,
        }));
    }

    // Search by name (using index for efficient prefix scan)
    const byName = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.gte("name", searchTerm))
      .collect();

    // Search by email (using index for efficient prefix scan)
    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.gte("email", searchTerm))
      .collect();

    // Merge and deduplicate results
    const seen = new Set<string>();
    const merged = [...byName, ...byEmail].filter((u) => {
      if (seen.has(u._id)) return false;
      seen.add(u._id);
      return true;
    });

    // Client-side filter: full substring match on name OR email, excluding self
    const results = merged.filter((u) => {
      if (u._id === currentUser._id) return false;
      return (
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    });

    return results.map((u) => ({
      _id: u._id,
      clerkId: u.clerkId,
      name: u.name,
      email: u.email,
      imageUrl: u.imageUrl,
      lastSeenAt: u.lastSeenAt,
    }));
  },
});

import { mutation } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Creates a new group conversation.
 *
 * Logic:
 * 1. Authenticate the user.
 * 2. Validate the group name isn't empty.
 * 3. Enforce that at least 1 other member is invited.
 * 4. Insert the conversation record with type 'group'.
 */
export const createGroup = mutation({
  args: {
    memberIds: v.array(v.id("users")),
    name: v.string(),
  },

  handler: async (ctx, args) => {
    // 1. Authenticate
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Resolve the current (creating) user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // 3. Validate group name
    const groupName = args.name.trim();
    if (!groupName) {
      throw new Error("Group name cannot be empty");
    }

    // 4. Guard: must add at least 1 other member
    const uniqueOtherMemberIds = [...new Set(args.memberIds)].filter(
      (id) => id !== currentUser._id,
    );

    if (uniqueOtherMemberIds.length < 1) {
      throw new Error("A group must have at least 1 other member");
    }

    // 5. Verify all provided user IDs actually exist
    const memberDocs = await Promise.all(
      uniqueOtherMemberIds.map((id) => ctx.db.get(id)),
    );

    const invalidIds = uniqueOtherMemberIds.filter(
      (_, i) => memberDocs[i] === null,
    );
    if (invalidIds.length > 0) {
      throw new Error(`Some users could not be found`);
    }

    const now = Date.now();
    const allMembers = [currentUser._id, ...uniqueOtherMemberIds];

    // 6. Create the group conversation
    const conversationId = await ctx.db.insert("conversations", {
      type: "group",
      name: groupName,
      members: allMembers,
      createdBy: currentUser._id,
      createdAt: now,
    });

    return {
      conversationId,
      name: groupName,
    };
  },
});

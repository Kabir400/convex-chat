import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getReactionsByConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    // 1. Authenticate
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null; // auth not ready yet; Convex will re-run once token arrives

    // 2. Resolve current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // 3. Verify the conversation exists and user is a member
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!conversation.members.includes(currentUser._id)) {
      throw new Error("You are not a member of this conversation");
    }

    // 4. Fetch all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    if (messages.length === 0) {
      return {};
    }

    // 5. Fetch all reactions for all messages in parallel (one DB call per message, all concurrent)
    const reactionGroups = await Promise.all(
      messages.map((message) =>
        ctx.db
          .query("reactions")
          .withIndex("by_message", (q) => q.eq("messageId", message._id))
          .collect(),
      ),
    );

    // 6. Flatten reactions and collect unique userIds for enrichment
    const allReactions = reactionGroups.flat();

    if (allReactions.length === 0) {
      return {};
    }

    const uniqueUserIds = [...new Set(allReactions.map((r) => r.userId))];

    // 7. Fetch all relevant users in parallel
    const users = await Promise.all(
      uniqueUserIds.map((userId) => ctx.db.get(userId)),
    );

    // 8. Build a userId → user lookup map
    const userMap = new Map(
      users
        .filter(Boolean)
        .map((user) => [
          user!._id,
          { name: user!.name, imageUrl: user!.imageUrl ?? null },
        ]),
    );

    // 9. Group enriched reactions by messageId
    const reactionsByMessage: Record<
      string,
      {
        reactionId: string;
        type: string;
        userId: string;
        name: string;
        imageUrl: string | null;
        isMine: boolean;
        createdAt: number;
      }[]
    > = {};

    for (let i = 0; i < messages.length; i++) {
      const messageId = messages[i]._id;
      const reactions = reactionGroups[i];

      reactionsByMessage[messageId] = reactions.map((reaction) => {
        const reactorInfo = userMap.get(reaction.userId);
        return {
          reactionId: reaction._id,
          type: reaction.type,
          userId: reaction.userId,
          name: reactorInfo?.name ?? "Unknown User",
          imageUrl: reactorInfo?.imageUrl ?? null,
          isMine: reaction.userId === currentUser._id,
          createdAt: reaction.createdAt,
        };
      });
    }

    return reactionsByMessage;
  },
});

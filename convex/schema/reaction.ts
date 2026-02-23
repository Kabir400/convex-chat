import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reactions = defineTable({
  messageId: v.id("messages"),
  userId: v.id("users"),

  type: v.union(
    v.literal("👍"),
    v.literal("❤️"),
    v.literal("😂"),
    v.literal("😮"),
    v.literal("😢"),
  ),

  createdAt: v.number(),
})
  .index("by_message", ["messageId"])
  .index("by_message_user", ["messageId", "userId"]);

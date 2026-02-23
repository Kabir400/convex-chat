import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationReads = defineTable({
  conversationId: v.id("conversations"),
  userId: v.id("users"),
  lastReadAt: v.number(),
})
  .index("by_user_conversation", ["userId", "conversationId"])
  .index("by_conversation", ["conversationId"]);

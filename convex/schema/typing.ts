import { defineTable } from "convex/server";
import { v } from "convex/values";

export const typing = defineTable({
  conversationId: v.id("conversations"),
  userId: v.id("users"),

  updatedAt: v.number(),
})
  .index("by_conversation", ["conversationId"])
  .index("by_user_conversation", ["userId", "conversationId"]);

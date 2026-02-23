import { defineTable } from "convex/server";
import { v } from "convex/values";

export const messages = defineTable({
  conversationId: v.id("conversations"),
  senderId: v.id("users"),

  content: v.string(),

  // Soft delete
  isDeleted: v.boolean(),

  createdAt: v.number(),
})
  .index("by_conversation", ["conversationId", "createdAt"])
  .index("by_sender", ["senderId"]);

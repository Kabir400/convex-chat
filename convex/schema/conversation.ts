import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversations = defineTable({
  type: v.union(v.literal("direct"), v.literal("group")),
  members: v.array(v.id("users")),
  name: v.optional(v.string()),
  createdBy: v.id("users"),
  createdAt: v.number(),
  lastMessageAt: v.optional(v.number()),
  lastMessageId: v.optional(v.id("messages")),
})
  .index("by_member", ["members"])
  .index("by_lastMessageAt", ["lastMessageAt"]);

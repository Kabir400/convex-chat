import { defineTable } from "convex/server";
import { v } from "convex/values";

export const users = defineTable({
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  imageUrl: v.optional(v.string()),
  lastSeenAt: v.number(),
  createdAt: v.number(),
})
  .index("by_clerkId", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_name", ["name"]);

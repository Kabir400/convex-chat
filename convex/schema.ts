import { defineSchema } from "convex/server";
import { users } from "./schema/user";
import { conversations } from "./schema/conversation";
import { messages } from "./schema/message";
import { conversationReads } from "./schema/conversationRead";
import { typing } from "./schema/typing";
import { reactions } from "./schema/reaction";

export default defineSchema({
  users,
  conversations,
  messages,
  conversationReads,
  typing,
  reactions,
});

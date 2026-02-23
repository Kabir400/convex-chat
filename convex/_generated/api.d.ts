/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as controllers_conversation_createGroup from "../controllers/conversation/createGroup.js";
import type * as controllers_conversation_createOrGetDirectConversation from "../controllers/conversation/createOrGetDirectConversation.js";
import type * as controllers_conversation_getConversations from "../controllers/conversation/getConversations.js";
import type * as controllers_conversation_getOtherUserLastSeen from "../controllers/conversation/getOtherUserLastSeen.js";
import type * as controllers_message_deleteMessage from "../controllers/message/deleteMessage.js";
import type * as controllers_message_getMessages from "../controllers/message/getMessages.js";
import type * as controllers_message_markAsRead from "../controllers/message/markAsRead.js";
import type * as controllers_message_sendMessage from "../controllers/message/sendMessage.js";
import type * as controllers_reaction_getReactionsByConversation from "../controllers/reaction/getReactionsByConversation.js";
import type * as controllers_reaction_updateReaction from "../controllers/reaction/updateReaction.js";
import type * as controllers_typing_getTypingStatus from "../controllers/typing/getTypingStatus.js";
import type * as controllers_typing_setTyping from "../controllers/typing/setTyping.js";
import type * as controllers_user_createUserIfNotExists from "../controllers/user/createUserIfNotExists.js";
import type * as controllers_user_getUsers from "../controllers/user/getUsers.js";
import type * as controllers_user_updateLastSeen from "../controllers/user/updateLastSeen.js";
import type * as schema_conversation from "../schema/conversation.js";
import type * as schema_conversationRead from "../schema/conversationRead.js";
import type * as schema_message from "../schema/message.js";
import type * as schema_reaction from "../schema/reaction.js";
import type * as schema_typing from "../schema/typing.js";
import type * as schema_user from "../schema/user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "controllers/conversation/createGroup": typeof controllers_conversation_createGroup;
  "controllers/conversation/createOrGetDirectConversation": typeof controllers_conversation_createOrGetDirectConversation;
  "controllers/conversation/getConversations": typeof controllers_conversation_getConversations;
  "controllers/conversation/getOtherUserLastSeen": typeof controllers_conversation_getOtherUserLastSeen;
  "controllers/message/deleteMessage": typeof controllers_message_deleteMessage;
  "controllers/message/getMessages": typeof controllers_message_getMessages;
  "controllers/message/markAsRead": typeof controllers_message_markAsRead;
  "controllers/message/sendMessage": typeof controllers_message_sendMessage;
  "controllers/reaction/getReactionsByConversation": typeof controllers_reaction_getReactionsByConversation;
  "controllers/reaction/updateReaction": typeof controllers_reaction_updateReaction;
  "controllers/typing/getTypingStatus": typeof controllers_typing_getTypingStatus;
  "controllers/typing/setTyping": typeof controllers_typing_setTyping;
  "controllers/user/createUserIfNotExists": typeof controllers_user_createUserIfNotExists;
  "controllers/user/getUsers": typeof controllers_user_getUsers;
  "controllers/user/updateLastSeen": typeof controllers_user_updateLastSeen;
  "schema/conversation": typeof schema_conversation;
  "schema/conversationRead": typeof schema_conversationRead;
  "schema/message": typeof schema_message;
  "schema/reaction": typeof schema_reaction;
  "schema/typing": typeof schema_typing;
  "schema/user": typeof schema_user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

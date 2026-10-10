import { apiRequest } from "../../../shared/api/apiClient";
import {
  ConversationMessagesResponse,
  CreateConversationData,
  CreateConversationApiResponse,
  CreateConversationResponse,
  InboxMessageResponse,
  MessageActionResponse,
  MessageResponse,
  SendMessageApiResponse,
  InboxMessage,
  Message,
  ReactToMessageResponse,
  SendMessageData,
} from "../types/message.types";
import { apiEndpoints } from "../../../constant/url";

export const messageService = {
  listMessages: async (): Promise<InboxMessage[]> => {
    const response = await apiRequest<
      { success?: boolean; message?: string; data: InboxMessageResponse[] }
    >(apiEndpoints.messages.listMessages);
    if (response.success === false) {
      throw new Error(response.message || "Failed to load conversations.");
    }
    if (!Array.isArray(response.data)) {
      throw new Error("The messages response did not include a conversation list.");
    }
    return response.data.map((item) => {
      const msgId = item.msgId ?? item.uid;
      if (!msgId) {
        throw new Error("A conversation in the response did not include an ID.");
      }
      return {
        msgId,
        recipientName: item.recipientName ?? "Conversation",
        latestMsg: item.latestMsg ?? item.lastMessage?.content ?? "",
        contextType:
          item.contextType ??
          (item.requestId ? "request" : item.tripId ? "trip" : "direct"),
        avatarUrl: item.avatarUrl ?? null,
        timestamp: item.timestamp ?? item.lastMessage?.createdAt ?? item.createdAt,
        unreadCount: item.unreadCount ?? 0,
      };
    });
  },

  createConversation: async (
    data: CreateConversationData,
  ): Promise<CreateConversationResponse> => {
    const response = await apiRequest<CreateConversationApiResponse>(
      apiEndpoints.messages.createConversationForTripOrRequest,
      {
        method: "POST",
        body: data,
      },
    );

    if (response.success === false) {
      throw new Error(response.message || "Failed to create conversation.");
    }

    if (!response.data?.id) {
      throw new Error("The conversation response did not include an ID.");
    }

    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    data: SendMessageData,
  ): Promise<Message> => {
    const response = await apiRequest<SendMessageApiResponse>(
      apiEndpoints.messages.conversationMessages.replace(
        ":id",
        encodeURIComponent(conversationId),
      ),
      {
        method: "POST",
        body: data,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to send the message.");
    }

    if (!response.data) {
      throw new Error("The sent message response did not include message data.");
    }

    return normalizeMessage(response.data, conversationId);
  },

  getConversationMessages: async (
    conversationId: string,
  ): Promise<Message[]> => {
    const response = await apiRequest<ConversationMessagesResponse>(
      apiEndpoints.messages.conversationMessages.replace(
        ":id",
        encodeURIComponent(conversationId),
      ),
      { method: "GET" },
    );

    if (response.success === false) {
      throw new Error(response.message || "Failed to load conversation messages.");
    }

    if (!Array.isArray(response.data)) {
      throw new Error("The conversation response did not include a message list.");
    }

    return response.data
      .map((message) => normalizeMessage(message, conversationId))
      .sort(
      (left, right) =>
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime(),
      );
  },

  markConversationAsRead: async (conversationId: string): Promise<void> => {
    const response = await apiRequest<MessageActionResponse>(
      apiEndpoints.messages.markAsRead.replace(
        ":id",
        encodeURIComponent(conversationId),
      ),
      { method: "POST" },
    );
    assertActionSuccess(response, "Failed to mark conversation as read.");
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    const response = await apiRequest<MessageActionResponse>(
      apiEndpoints.messages.deleteConversation.replace(
        ":id",
        encodeURIComponent(conversationId),
      ),
      { method: "DELETE" },
    );
    assertActionSuccess(response, "Failed to delete conversation.");
  },

  deleteMessages: async (messageUids: string[]): Promise<number> => {
    const response = await apiRequest<MessageActionResponse>(
      apiEndpoints.messages.deleteMessage,
      {
        method: "DELETE",
        body: { messageUids },
      },
    );
    assertActionSuccess(response, "Failed to delete messages.");
    return response.data.deletedCount ?? messageUids.length;
  },

  reactToMessage: async (messageUid: string, emoji: string): Promise<Message> => {
    const response = await apiRequest<ReactToMessageResponse>(
      apiEndpoints.messages.reactToMessage.replace(
        ":id",
        encodeURIComponent(messageUid),
      ),
      {
        method: "POST",
        body: { emoji },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to react to message.");
    }

    return normalizeMessage(response.data);
  },
};

function normalizeMessage(
  message: MessageResponse,
  conversationUid?: string,
): Message {
  const id = message.id || message.uid;
  if (!id) {
    throw new Error("The message response did not include a message ID.");
  }

  return {
    id,
    conversationUid:
      message.conversationUid ?? message.conversationId ?? conversationUid,
    senderId: message.senderId ?? message.senderUid ?? null,
    text: message.text ?? message.content ?? "",
    createdAt: message.createdAt,
    type: message.type,
    mediaUrl: message.mediaUrl ?? null,
    replyToUid: message.replyToUid ?? null,
    reactions: message.reactions ?? null,
    readBy: message.readBy ?? [],
    deletedAt: message.deletedAt ?? null,
    updatedAt: message.updatedAt,
    sender: message.sender ?? null,
  };
}

function assertActionSuccess(
  response: MessageActionResponse,
  fallback: string,
) {
  if (!response.success || !response.data?.success) {
    throw new Error(response.message || fallback);
  }
}

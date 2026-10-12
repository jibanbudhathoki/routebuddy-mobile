import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import { chatMediaService } from "../services/chatMediaService";
import type {
  CreateConversationData,
  SendMessageData,
} from "../types/message.types";
import type { ChatMediaFile } from "../types/chatMedia.types";
import type { InboxMessage } from "../types/message.types";
import { formatMessagePreview } from "../utils/messagePreview";

export const messageKeys = {
  all: ["messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  messages: (conversationId: string) =>
    [...messageKeys.all, "conversation", conversationId] as const,
};

export const useListMessages = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: async () => {
      const fetchedConversations = await messageService.listMessages();
      const cachedConversations = queryClient.getQueryData<InboxMessage[]>(
        messageKeys.conversations(),
      );
      if (!cachedConversations) return fetchedConversations;

      const cachedById = new Map(
        cachedConversations.map((conversation) => [
          conversation.msgId,
          conversation,
        ]),
      );
      return fetchedConversations.map((conversation) => {
        const cached = cachedById.get(conversation.msgId);
        if (!cached?.latestMsgIsOwn || conversation.latestMsgIsOwn) {
          return conversation;
        }

        const cachedTime = Date.parse(cached.timestamp ?? "");
        const fetchedTime = Date.parse(conversation.timestamp ?? "");
        if (
          Number.isFinite(cachedTime) &&
          Number.isFinite(fetchedTime) &&
          fetchedTime > cachedTime
        ) {
          return conversation;
        }

        return {
          ...conversation,
          latestMsg: cached.latestMsg,
          latestMsgIsOwn: true,
          timestamp: cached.timestamp ?? conversation.timestamp,
        };
      });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationData) =>
      messageService.createConversation(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: () => messageService.getConversationMessages(conversationId),
    enabled: Boolean(conversationId),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
};

export const useSendConversationMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) =>
      messageService.sendMessage(conversationId, data),
    onSuccess: async (message) => {
      queryClient.setQueryData(
        messageKeys.messages(conversationId),
        (currentMessages: typeof message[] | undefined) => {
          const messages = currentMessages ?? [];
          if (messages.some((currentMessage) => currentMessage.id === message.id)) {
            return messages;
          }
          return [...messages, message].sort(
            (left, right) =>
              new Date(left.createdAt).getTime() -
              new Date(right.createdAt).getTime(),
          );
        },
      );
      queryClient.setQueryData(
        messageKeys.conversations(),
        (conversations: InboxMessage[] | undefined) =>
          conversations?.map((conversation) =>
            conversation.msgId === conversationId
              ? {
                  ...conversation,
                  latestMsg: formatMessagePreview(
                    message.text,
                    message.type,
                    true,
                  ),
                  latestMsgIsOwn: true,
                  timestamp: message.createdAt,
                }
              : conversation,
          ),
      );
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useUploadChatMedia = () =>
  useMutation({
    mutationFn: (file: ChatMediaFile) => chatMediaService.upload(file),
  });

export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.markConversationAsRead,
    onSuccess: async (_result, conversationId) => {
      queryClient.setQueryData(
        messageKeys.conversations(),
        (conversations: InboxMessage[] | undefined) =>
          conversations?.map((conversation) =>
            conversation.msgId === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: messageKeys.conversations(),
        }),
        queryClient.invalidateQueries({
          queryKey: messageKeys.messages(conversationId),
        }),
      ]);
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.deleteConversation,
    onSuccess: async (_result, conversationId) => {
      queryClient.removeQueries({
        queryKey: messageKeys.messages(conversationId),
      });
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useDeleteMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.deleteMessages,
    onSuccess: async (_deletedCount, messageUids) => {
      queryClient.setQueryData(
        messageKeys.messages(conversationId),
        (messages: Awaited<ReturnType<typeof messageService.getConversationMessages>> | undefined) =>
          messages?.filter((message) => !messageUids.includes(message.id)),
      );
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useReactToMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageUid, emoji }: { messageUid: string; emoji: string }) =>
      messageService.reactToMessage(messageUid, emoji),
    onSuccess: async (updatedMessage) => {
      queryClient.setQueryData(
        messageKeys.messages(conversationId),
        (messages: Awaited<ReturnType<typeof messageService.getConversationMessages>> | undefined) =>
          messages?.map((message) =>
            message.id === updatedMessage.id
              ? {
                  ...message,
                  ...updatedMessage,
                  sender: updatedMessage.sender ?? message.sender,
                }
              : message,
          ),
      );
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

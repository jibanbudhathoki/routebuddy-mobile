import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import type { SendMessageData } from "../types/message.types";

export const messageKeys = {
  all: ["messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  messages: (conversationId: string) =>
    [...messageKeys.all, "conversation", conversationId] as const,
};

export const useListMessages = () => {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: messageService.listMessages,
  });
};

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: () => messageService.getConversationMessages(conversationId),
    enabled: Boolean(conversationId),
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
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.markConversationAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
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

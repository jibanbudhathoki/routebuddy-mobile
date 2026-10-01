import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";

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



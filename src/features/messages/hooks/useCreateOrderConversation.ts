import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import { messageKeys } from "./useMessages";

export interface CreateOrderConversationInput {
  tripId: string;
  requestId: string;
  driverUid: string;
  message: string;
}

export function useCreateOrderConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tripId,
      requestId,
      driverUid,
      message,
    }: CreateOrderConversationInput) => {
      const conversation = await messageService.createConversation({
        tripId,
        requestId,
        userId: driverUid,
      });
      await messageService.sendMessage(conversation.id, {
        content: message,
        type: "text",
      });
      return conversation;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
}

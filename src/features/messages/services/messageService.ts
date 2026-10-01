import { apiRequest } from "../../../shared/api/apiClient";
import {
  InboxMessage,
} from "../types/message.types";
import { apiEndpoints } from "../../../constant/url";

export const messageService = {
  listMessages: async (): Promise<InboxMessage[]> => {
    const response = await apiRequest<{ success: boolean; message: string; data: InboxMessage[] }>(apiEndpoints.messages.listMessages);
    return response.data;
  },


    //need to pusl url for this method from swagger
  // createConversation: async (data: CreateConversationData): Promise<{ id: string; participants: string[] }> => {
  //   return apiRequest<{ id: string; participants: string[] }>(apiEndpoints.messages.requestMessage, {
  //     method: "POST",
  //     body: data,
  //   });
  // },
};

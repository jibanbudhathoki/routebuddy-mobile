import { apiRequest } from "../../../shared/api/apiClient";

export interface CreateOpenRequestApiPayload {
  stores: string[];
  items: Array<{
    item: string;
    description: string;
    estimatePrice: number;
  }>;
  deliveryAddress: string;
  deliveryCityUid: string;
  neededBy: string;
  latestDeliveryBy: string;
  notes: string;
}

export const requestService = {
  createOpenRequest: async (payload: CreateOpenRequestApiPayload) => {
    return apiRequest("/requests", {
      method: "POST",
      body: payload,
    });
  },
};

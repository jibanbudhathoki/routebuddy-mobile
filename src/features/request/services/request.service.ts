import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type { ListMyRequestsResponse } from "../types/request";

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
    return apiRequest(apiEndpoints.requests.requests, {
      method: "POST",
      body: payload,
    });
  },
};

export const listMyRequests = async (): Promise<
  ListMyRequestsResponse["data"]
> => {
  const response = await apiRequest<ListMyRequestsResponse>(
    apiEndpoints.requests.listMyRequests,
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load your requests.");
  }

  if (!Array.isArray(response.data)) {
    throw new Error("The requests response did not include a valid data list.");
  }

  return response.data;
};

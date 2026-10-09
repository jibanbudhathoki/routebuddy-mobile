import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripOrderPayload,
  CreateTripOrderResponse,
  ListAllRequestsResponse,
  ListMyRequestsResponse,
  RequestDetailsResponse,
} from "../types/request";

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
  createTripOrder: async (
    payload: CreateTripOrderPayload,
  ): Promise<CreateTripOrderResponse> => {
    const response = await apiRequest<CreateTripOrderResponse>(
      apiEndpoints.orders.postOrder,
      {
        method: "POST",
        body: payload,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to create trip order.");
    }

    if (
      !response.data ||
      typeof response.data.uid !== "string" ||
      !response.data.uid.trim()
    ) {
      throw new Error("The order response did not include a valid order ID.");
    }

    return response;
  },
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

export const listAllRequests = async (): Promise<
  ListAllRequestsResponse["data"]
> => {
  const response = await apiRequest<ListAllRequestsResponse>(
    apiEndpoints.requests.listAllRequests,
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load open requests.");
  }

  if (!Array.isArray(response.data)) {
    throw new Error("The requests response did not include a valid data list.");
  }

  return response.data;
};

export const getRequestDetails = async (
  uid: string,
): Promise<RequestDetailsResponse> => {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: RequestDetailsResponse;
  }>(apiEndpoints.requests.requestDetails.replace(":uid", encodeURIComponent(uid)), {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to load request details.");
  }

  if (!response.data) {
    throw new Error("The request details response did not include request data.");
  }

  return response.data;
};

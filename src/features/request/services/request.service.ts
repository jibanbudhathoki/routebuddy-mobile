import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripOrderPayload,
  CreateTripOrderResponse,
  CreateOpenRequestApiPayload,
  CreateOpenRequestResponse,
  ListAllRequestsResponse,
  ListMyRequestsResponse,
  RequestDetailsResponse,
  SubmitRequestOfferPayload,
  SubmitRequestOfferResponse,
} from "../types/request";

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
  createOpenRequest: async (
    payload: CreateOpenRequestApiPayload,
  ): Promise<CreateOpenRequestResponse> => {
    const response = await apiRequest<CreateOpenRequestResponse>(
      apiEndpoints.requests.requests,
      {
        method: "POST",
        body: payload,
      },
    );

    if (!response?.success) {
      throw new Error(response?.message || "Failed to create request.");
    }
    if (
      !response.data ||
      typeof response.data.postId !== "string" ||
      !response.data.postId.trim() ||
      (response.data.status !== "pending" && response.data.status !== "open")
    ) {
      throw new Error(
        "The request response did not include valid request details.",
      );
    }

    return response;
  },
  submitOffer: async (
    requestUid: string,
    payload: SubmitRequestOfferPayload,
  ): Promise<SubmitRequestOfferResponse> => {
    const response = await apiRequest<SubmitRequestOfferResponse>(
      apiEndpoints.requests.submitOffer.replace(
        ":uid",
        encodeURIComponent(requestUid),
      ),
      {
        method: "POST",
        body: payload,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to send your offer.");
    }
    if (!response.data || typeof response.data.uid !== "string") {
      throw new Error("The offer response did not include offer details.");
    }

    return response;
  },
  acceptOffer: async (
    requestUid: string,
    offerUid: string,
  ): Promise<RequestDetailsResponse> => {
    if (!requestUid.trim() || !offerUid.trim()) {
      throw new Error("A request ID and offer ID are required to accept an offer.");
    }

    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: RequestDetailsResponse;
    }>(
      apiEndpoints.requests.acceptOffer
        .replace(":uid", encodeURIComponent(requestUid))
        .replace(":offerUid", encodeURIComponent(offerUid)),
      { method: "POST" },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to accept this offer.");
    }
    if (!response.data) {
      throw new Error("The accept-offer response did not include request data.");
    }

    return response.data;
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

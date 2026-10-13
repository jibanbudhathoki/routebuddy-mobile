import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripOrderPayload,
  CreateTripOrderResponse,
  CreateOpenRequestApiPayload,
  CreateOpenRequestResponse,
  CancelRequestResponse,
  DeleteRequestResponse,
  ListAllRequestsResponse,
  ListMyRequestsResponse,
  ListMyAssignedRequestsResponse,
  RequestDetailsResponse,
  RequestDeliveryStatus,
  SubmitRequestOfferPayload,
  SubmitRequestOfferResponse,
} from "../types/request";
import { updateRequestStatusSchema } from "../validations/updateRequestStatus";
import { listMyAssignedRequestsResponseSchema } from "../validations/assignedRequests";
import { myRequestsResponseSchema } from "../validations/myRequests";

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
  acceptTripOrder: async (
    orderUid: string,
  ): Promise<RequestDetailsResponse> => {
    if (!orderUid.trim()) {
      throw new Error("An order ID is required to accept this order.");
    }

    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: RequestDetailsResponse;
    }>(
      apiEndpoints.requests.acceptTripOrder.replace(
        ":uid",
        encodeURIComponent(orderUid),
      ),
      { method: "POST" },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to accept this order.");
    }
    if (!response.data) {
      throw new Error("The accept-order response did not include order details.");
    }

    return response.data;
  },
  updateRequestStatus: async (
    requestUid: string,
    status: RequestDeliveryStatus,
  ): Promise<RequestDetailsResponse> => {
    if (!requestUid.trim()) {
      throw new Error("A request ID is required to update its status.");
    }
    const validation = updateRequestStatusSchema.safeParse({ status });
    if (!validation.success) {
      throw new Error(
        validation.error.issues[0]?.message ?? "Choose a valid request status.",
      );
    }

    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: RequestDetailsResponse;
    }>(
      apiEndpoints.requests.updateRequestStatus.replace(
        ":uid",
        encodeURIComponent(requestUid),
      ),
      {
        method: "PATCH",
        body: validation.data,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to update request status.");
    }
    if (!response.data?.uid) {
      throw new Error("The status response did not include request details.");
    }

    return response.data;
  },
  cancelRequest: async (requestUid: string): Promise<CancelRequestResponse> => {
    if (!requestUid.trim()) {
      throw new Error("A request ID is required to cancel this request.");
    }

    const response = await apiRequest<CancelRequestResponse>(
      apiEndpoints.requests.cancelRequest.replace(
        ":uid",
        encodeURIComponent(requestUid),
      ),
      { method: "PATCH" },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to cancel this request.");
    }
    if (!response.data?.uid) {
      throw new Error("The cancel response did not include request details.");
    }

    return response;
  },
  deleteRequest: async (requestUid: string): Promise<DeleteRequestResponse> => {
    if (!requestUid.trim()) {
      throw new Error("A request ID is required to delete this request.");
    }

    const response = await apiRequest<DeleteRequestResponse>(
      apiEndpoints.requests.deleteRequest.replace(
        ":uid",
        encodeURIComponent(requestUid),
      ),
      { method: "DELETE" },
    );

    if (response.success === false) {
      throw new Error(response.message || "Unable to delete this request.");
    }
    if (!response.message) {
      throw new Error("The delete response did not include a confirmation.");
    }

    return response;
  },
};

export const listMyRequests = async (): Promise<
  ListMyRequestsResponse["data"]
> => {
  const response = await apiRequest<unknown>(
    apiEndpoints.requests.listMyRequests,
    { method: "GET" },
  );

  if (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  ) {
    throw new Error(
      "message" in response && typeof response.message === "string"
        ? response.message
        : "Failed to load your requests.",
    );
  }

  const parsedResponse = myRequestsResponseSchema.safeParse(response);
  if (!parsedResponse.success) {
    throw new Error(
      parsedResponse.error.issues[0]?.message ??
        "The requests response was invalid.",
    );
  }
  return parsedResponse.data.data;
};

export const listMyAssignedRequests = async (): Promise<
  ListMyAssignedRequestsResponse["data"]
> => {
  const response = await apiRequest<unknown>(
    apiEndpoints.requests.listMyAssignedRequests,
    { method: "GET" },
  );

  if (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  ) {
    const message =
      "message" in response && typeof response.message === "string"
        ? response.message
        : "Failed to load assigned requests.";
    throw new Error(message);
  }

  const parsedResponse =
    listMyAssignedRequestsResponseSchema.safeParse(response);
  if (!parsedResponse.success) {
    throw new Error(
      parsedResponse.error.issues[0]?.message ??
        "The assigned requests response was invalid.",
    );
  }
  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message || "Failed to load assigned requests.",
    );
  }

  return parsedResponse.data.data;
};

export const listAllRequests = async (): Promise<
  ListAllRequestsResponse["data"]
> => {
  const response = await apiRequest<unknown>(
    apiEndpoints.requests.listAllRequests,
    { method: "GET" },
  );

  if (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  ) {
    throw new Error(
      "message" in response && typeof response.message === "string"
        ? response.message
        : "Failed to load open requests.",
    );
  }

  const parsedResponse = myRequestsResponseSchema.safeParse(response);
  if (!parsedResponse.success) {
    throw new Error(
      parsedResponse.error.issues[0]?.message ??
        "The open requests response was invalid.",
    );
  }

  return parsedResponse.data.data;
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

import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  ListAllRequestsResponse,
  ListMyAssignedRequestsResponse,
  ListMyRequestsResponse,
  RequestDetailsResponse,
} from "../types/request";
import { listMyAssignedRequestsResponseSchema } from "../validations/assignedRequests";
import { myRequestsResponseSchema } from "../validations/myRequests";

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
  }>(
    apiEndpoints.requests.requestDetails.replace(
      ":uid",
      encodeURIComponent(uid),
    ),
    {
      method: "GET",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load request details.");
  }

  if (!response.data) {
    throw new Error("The request details response did not include request data.");
  }

  return response.data;
};

export const getSharedRequestDetails = async (
  uid: string,
): Promise<RequestDetailsResponse> => {
  if (!uid.trim()) {
    throw new Error("A request ID is required to load shared request details.");
  }
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: RequestDetailsResponse;
  }>(
    apiEndpoints.requests.sharedRequestDetails.replace(
      ":uid",
      encodeURIComponent(uid),
    ),
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(
      response.message || "Failed to load shared request details.",
    );
  }
  if (!response.data?.uid) {
    throw new Error(
      "The shared request response did not include request details.",
    );
  }
  return response.data;
};

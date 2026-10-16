import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripOrderPayload,
  CreateTripOrderResponse,
  CreateOpenRequestApiPayload,
  CreateOpenRequestResponse,
  SubmitRequestOfferPayload,
  SubmitRequestOfferResponse,
} from "../types/request";
import { createTripOrderResponseSchema } from "../validations/createTripOrder";

export const createTripOrder = async (
  payload: CreateTripOrderPayload,
): Promise<CreateTripOrderResponse> => {
  const rawResponse = await apiRequest<unknown>(apiEndpoints.orders.postOrder, {
    method: "POST",
    body: payload,
  });
  const parsedResponse = createTripOrderResponseSchema.safeParse(rawResponse);

  if (!parsedResponse.success) {
    throw new Error(
      `The order response did not match the expected format: ${parsedResponse.error.issues[0]?.message ?? "invalid response"}`,
    );
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message || "Failed to create trip order.",
    );
  }

  if (!parsedResponse.data.data) {
    throw new Error("The order response did not include a valid order ID.");
  }

  return {
    success: true,
    message: parsedResponse.data.message ?? "",
    data: parsedResponse.data.data,
  };
};

export const createOpenRequest = async (
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
};

export const submitOffer = async (
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
};

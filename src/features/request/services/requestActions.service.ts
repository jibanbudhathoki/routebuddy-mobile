import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  AddRequestDeliveryProofPayload,
  CancelRequestResponse,
  DeleteRequestResponse,
  RequestDetailsResponse,
  RequestAction,
  RequestDeliveryStatus,
  ReportRequestIssuePayload,
  ReportRequestIssueResponse,
} from "../types/request";
import { addDeliveryProofSchema } from "../validations/deliveryProof";
import {
  reportRequestIssueResponseSchema,
  reportRequestIssueSchema,
} from "../validations/reportRequestIssue";
import { updateRequestStatusSchema } from "../validations/updateRequestStatus";

export const respondToOffer = async (
  requestUid: string,
  offerUid: string,
  action: RequestAction,
): Promise<void> => {
  if (!requestUid.trim() || !offerUid.trim()) {
    throw new Error(
      "A request ID and offer ID are required to respond to an offer.",
    );
  }

  const response = await apiRequest<{
    success: boolean;
    message?: string;
  }>(
    apiEndpoints.requests.acceptOrRejectOffer
      .replace(":uid", encodeURIComponent(requestUid))
      .replace(":offerUid", encodeURIComponent(offerUid)),
    { method: "POST", body: { action } },
  );

  if (!response.success) {
    throw new Error(response.message || `Unable to ${action} this offer.`);
  }
};

export const respondToTripOrder = async (
  orderUid: string,
  action: RequestAction,
): Promise<void> => {
  if (!orderUid.trim()) {
    throw new Error("An order ID is required to respond to this order.");
  }

  const response = await apiRequest<{
    success: boolean;
    message?: string;
  }>(
    apiEndpoints.requests.acceptOrRejectTripOrder.replace(
      ":uid",
      encodeURIComponent(orderUid),
    ),
    { method: "POST", body: { action } },
  );

  if (!response.success) {
    throw new Error(response.message || `Unable to ${action} this order.`);
  }
};

export const updateRequestStatus = async (
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
};

export const addDeliveryProof = async (
  requestUid: string,
  payload: AddRequestDeliveryProofPayload,
): Promise<RequestDetailsResponse> => {
  if (!requestUid.trim()) {
    throw new Error("A request ID is required to add delivery proof.");
  }
  const validation = addDeliveryProofSchema.safeParse(payload);
  if (!validation.success) {
    throw new Error(
      validation.error.issues[0]?.message ??
        "Add at least one valid delivery photo.",
    );
  }

  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: RequestDetailsResponse;
  }>(
    apiEndpoints.requests.addDeliveryProof.replace(
      ":uid",
      encodeURIComponent(requestUid),
    ),
    {
      method: "POST",
      body: validation.data,
    },
  );

  if (!response.success || !response.data?.uid) {
    throw new Error(response.message || "Unable to save delivery proof.");
  }
  return response.data;
};

export const confirmDelivery = async (
  requestUid: string,
): Promise<RequestDetailsResponse> => {
  if (!requestUid.trim()) {
    throw new Error("A request ID is required to confirm delivery.");
  }

  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: RequestDetailsResponse;
  }>(
    apiEndpoints.requests.confirmDelivery.replace(
      ":uid",
      encodeURIComponent(requestUid),
    ),
    { method: "POST" },
  );

  if (!response.success || !response.data?.uid) {
    throw new Error(response.message || "Unable to confirm delivery.");
  }
  return response.data;
};

export const cancelRequest = async (
  requestUid: string,
): Promise<CancelRequestResponse> => {
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
};

export const cancelTripOrder = async (
  orderUid: string,
): Promise<void> => {
  if (!orderUid.trim()) {
    throw new Error("An order ID is required to cancel this order.");
  }

  const response = await apiRequest<{
    success: boolean;
    message?: string;
    data?: { uid?: string };
  }>(
    apiEndpoints.requests.cancelTripOrder.replace(
      ":uid",
      encodeURIComponent(orderUid),
    ),
    { method: "PATCH" },
  );

  if (!response.success) {
    throw new Error(response.message || "Unable to cancel the unpaid order.");
  }
  if (!response.data?.uid) {
    throw new Error("The cancel response did not include the updated order.");
  }
};

export const deleteRequest = async (
  requestUid: string,
): Promise<DeleteRequestResponse> => {
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
};

export const reportIssue = async (
  requestUid: string,
  payload: ReportRequestIssuePayload,
): Promise<ReportRequestIssueResponse> => {
  if (!requestUid.trim()) {
    throw new Error("A request ID is required to report an issue.");
  }
  const body = reportRequestIssueSchema.parse(payload);
  const response = await apiRequest<unknown>(
    apiEndpoints.requests.reportIssue.replace(
      ":uid",
      encodeURIComponent(requestUid),
    ),
    {
      method: "POST",
      body,
    },
  );
  return reportRequestIssueResponseSchema.parse(response);
};

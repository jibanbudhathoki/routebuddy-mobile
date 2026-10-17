import {
  acceptOffer,
  acceptTripOrder,
  addDeliveryProof,
  cancelRequest,
  confirmDelivery,
  deleteRequest,
  reportIssue,
  updateRequestStatus,
} from "./requestActions.service";
import {
  createOpenRequest,
  createTripOrder,
  submitOffer,
} from "./requestCreation.service";

export {
  getRequestDetails,
  getSharedRequestDetails,
  listAllRequests,
  listMyAssignedRequests,
  listMyRequests,
} from "./requestQueries.service";

export const requestService = {
  createTripOrder,
  createOpenRequest,
  submitOffer,
  acceptOffer,
  acceptTripOrder,
  updateRequestStatus,
  addDeliveryProof,
  confirmDelivery,
  cancelRequest,
  deleteRequest,
  reportIssue,
};

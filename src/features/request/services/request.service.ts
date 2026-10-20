import {
  addDeliveryProof,
  cancelTripOrder,
  cancelRequest,
  confirmDelivery,
  deleteRequest,
  reportIssue,
  respondToOffer,
  respondToTripOrder,
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
  respondToOffer,
  respondToTripOrder,
  updateRequestStatus,
  addDeliveryProof,
  confirmDelivery,
  cancelRequest,
  cancelTripOrder,
  deleteRequest,
  reportIssue,
};

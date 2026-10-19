import type { AddressLocation } from "../../../shared/address/types/address";

export interface RequestItem {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
}

export interface CreateRequestPayload {
  stores: string[];
  deliveryAddress: string;
  deliveryCityUid: string;
  itemsInstructions: string;
  dayNeeded: string;
  latestDeliveryTime: string;
  items: RequestItem[];
}

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

export interface CreateOpenRequestResponse {
  success: boolean;
  message: string;
  data: {
    postId: string;
    status: "pending" | "open";
    totalItems: number;
    totalCost: string;
  };
}

export interface CancelRequestResponse {
  success: boolean;
  message: string;
  data: RequestDetailsResponse;
}

export interface DeleteRequestResponse {
  success?: boolean;
  message: string;
}

export interface ReportRequestIssuePayload {
  message: string;
}

export interface ReportRequestIssueResponse {
  message: string;
}

export interface CreateTripOrderPayload {
  tripUid: string;
  stores: string[];
  items: Array<{
    item: string;
    description: string;
    estimatePrice: number;
  }>;
  deliveryAddress: string;
  notes: string;
}

export interface CreateTripOrderResponse {
  success: boolean;
  message: string;
  data: Omit<TripOrder, "status"> & {
    status: "pending" | "open";
  };
}

export interface TripOrder {
  uid: string;
  kind: "order";
  deliveryAddress: string;
  neededBy: string;
  latestDeliveryBy: string;
  notes: string;
  itemSubtotal: string;
  serviceFee: string;
  driverFee: string;
  platformFee: string;
  tax: string;
  total: string;
  paymentIntentId: string | null;
  captureBefore: string | null;
  deliveryProof: RequestDeliveryProof | string | null;
  issue: string | null;
  rating: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items: Array<{
    item: string;
    description: string;
    estimatePrice: string;
  }>;
  stores: Array<{
    uid: string;
    name: string;
    location: AddressLocation;
  }>;
  requester: {
    uid: string;
    fName: string;
    photoUrl: string | null;
    photoKey: string | null;
  };
  deliveryLocation: AddressLocation;
  driver: {
    uid: string;
    fName: string;
    photoUrl: string | null;
    photoKey: string | null;
  } | null;
  trip: {
    uid: string;
    origin: string;
    destination: string;
  } | null;
  offers: unknown[];
}

export interface MyRequestListItem {
  uid: string;
  neededBy: string;
  latestDeliveryBy: string;
  status: string;
  totalCost: string | null;
  deliveryCity: string;
  origin: string;
  destination: string;
  stores: string[];
  requester: {
    name: string;
    photoUrl?: string | null;
  };
  driver: {
    name: string;
    photoUrl?: string | null;
  } | null;
}

export interface ListMyRequestsResponse {
  success: boolean;
  message: string;
  data: MyRequestListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ListAllRequestsResponse extends ListMyRequestsResponse {}

export interface AssignedRequestListItem extends MyRequestListItem {}

export interface ListMyAssignedRequestsResponse {
  success: boolean;
  message: string;
  data: AssignedRequestListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface RequestDetailsResponse {
  uid: string;
  kind: string;
  deliveryAddress: string;
  neededBy: string;
  latestDeliveryBy: string;
  notes: string;
  itemSubtotal: string | null;
  serviceFee: string | null;
  driverFee: string | null;
  platformFee: string | null;
  tax: string | null;
  total: string | null;
  paymentIntentId: string | null;
  captureBefore: string | null;
  deliveryProof: RequestDeliveryProof | string | null;
  issue: string | null;
  rating: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    item: string;
    description: string;
    estimatePrice: string;
  }>;
  stores: Array<{
    uid: string;
    name: string;
    location: AddressLocation;
  }>;
  requester: {
    uid: string;
    photoUrl?: string | null;
    name?: string;
    fName?: string;
  };
  deliveryLocation: AddressLocation;
  driver: {
    uid: string;
    photoUrl?: string | null;
    name: string;
  } | null;
  trip: {
    uid: string;
    origin: string;
    destination: string;
  } | null;
  offers: RequestOffer[];
  origin: string;
  destination: string;
}

export type RequestDeliveryStatus = "shopping" | "delivering" | "delivered";

export interface RequestDeliveryProof {
  receiptUrl?: string | null;
  itemPhotoUrls?: string[];
  note?: string | null;
}

export interface AddRequestDeliveryProofPayload {
  itemPhotoUrls: string[];
  note?: string;
}

export interface DeliveryProofPhoto {
  uri: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface RequestOffer {
  uid: string;
  driver: {
    uid: string;
    name?: string;
    fName?: string;
    photoUrl?: string | null;
    photoKey?: string | null;
    rating?: number | null;
  };
  message: string;
  proposedLatestBy: string;
  status: string;
  createdAt?: string;
}

export interface SubmitRequestOfferPayload {
  proposedLatestBy: string;
  message?: string;
}

export interface SubmitRequestOfferResponse {
  success: boolean;
  message: string;
  data: SubmittedRequestOffer;
}

export type RequestAction = "accept" | "reject";

export interface SubmittedRequestOffer {
  uid: string;
  message?: string;
  proposedLatestBy?: string;
  status?: string;
  createdAt?: string;
  driver?: RequestOffer["driver"];
}

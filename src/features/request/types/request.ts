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
  deliveryProof: string | null;
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
    name: string;
  };
  deliveryLocation: AddressLocation;
  driver: {
    uid: string;
    photoUrl?: string | null;
    name: string;
  } | null;
  trip: unknown | null;
  offers: unknown[];
  origin: string;
  destination: string;
}

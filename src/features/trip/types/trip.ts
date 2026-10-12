import type { AddressLocation } from "../../../shared/address/types/address";

export interface CreateTripRequest {
  originCityUid: string;
  originCityName?: string;
  destinationCityUid: string;
  destinationCityName?: string;
  stores: string[];
  departureAt: string;
  orderCutoffAt: string;
  deliveryLatestBy: string;
  capacity: number;
  price?: number;
  notes: string | null;
}

export interface UpdateTripPayload {
  originCityUid?: string;
  destinationCityUid?: string;
  stores?: string[];
  departureAt?: string;
  orderCutoffAt?: string;
  deliveryLatestBy?: string;
  capacity?: number;
  price?: number;
  notes?: string | null;
}

export interface ListMyTripsResponse {
  uid: string;
  departureAt: string;
  availableSeats: number;
  capacity: number;
  price: string | null;
  status: string;
  origin: string;
  destination: string;
  driver: {
    name: string;
    photoUrl?: string | null;
  };
}

export interface ListAllTripsItem extends ListMyTripsResponse {
  deliveryLatestBy: string;
  stores: string[];
}

export interface TripDetailsResponse {
  uid: string;
  departureAt: string;
  orderCutoffAt: string;
  deliveryLatestBy: string;
  capacity: number;
  availableSeats: number;
  price: string | null;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stores: Array<{
    uid: string;
    name: string;
    location: AddressLocation;
  }>;
  originAddress: AddressLocation;
  destinationAddress: AddressLocation;
  driver: {
    uid: string;
    photoUrl?: string | null;
    name: string;
  };
  origin: string;
  destination: string;
}

export interface ToggleTripOrdersPayload {
  closed: boolean;
}

export const TRIP_STATUSES = [
  "shopping",
  "delivering",
  "delivered",
  "completed",
  "cancelled",
] as const;

export type TripStatus = (typeof TRIP_STATUSES)[number];

export interface UpdateTripStatusPayload {
  status: TripStatus;
}

export interface ToggleTripOrdersResponse {
  success: boolean;
  message: string;
  data: TripDetailsResponse;
}

export interface UpdateTripStatusResponse {
  success: boolean;
  message: string;
  data: TripDetailsResponse;
}

export interface UpdateTripResponse {
  success: boolean;
  message: string;
  data: TripDetailsResponse;
}

export interface ListAllTripsResponse {
  success: boolean;
  message: string;
  data: ListAllTripsItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteTripResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

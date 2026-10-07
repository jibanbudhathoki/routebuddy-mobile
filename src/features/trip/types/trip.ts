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
  notes: string;
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
  price: string;
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

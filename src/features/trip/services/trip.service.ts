import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripRequest,
  ListMyTripsResponse,
  TripDetailsResponse,
} from "../types/trip";

export const tripService = {
  async createTrip(data: CreateTripRequest) {
    const response = await apiRequest<{
      success: boolean;
      message?: string;
      data?: unknown;
    }>(apiEndpoints.trips.trips, {
      method: "POST",
      body: data,
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to post trip.');
    }

    return response.data;
  },
};

export const listMyTrips = async (): Promise<ListMyTripsResponse[]> => {
  const response = await apiRequest<any>(apiEndpoints.trips.listMyTrips, {
    method: "GET",
  });
  return response.data;
};

export const getTripDetails = async (
  uid: string,
): Promise<TripDetailsResponse> => {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: TripDetailsResponse;
  }>(apiEndpoints.trips.tripDetails.replace(':uid', encodeURIComponent(uid)), {
    method: 'GET',
  });

  if (!response.success) {
    throw new Error(response.message || 'Failed to load trip details.');
  }

  return response.data;
};

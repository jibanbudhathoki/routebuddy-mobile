import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type { CreateTripRequest, ListMyTripsResponse } from "../types/trip";

export const tripService = {
  async createTrip(data: CreateTripRequest) {
    const response = await apiRequest<any>(apiEndpoints.trips.trips, {
      method: "POST",
      body: data,
    });
    return response.data;
  },
};

export const listMyTrips = async (): Promise<ListMyTripsResponse[]> => {
  const response = await apiRequest<any>(apiEndpoints.trips.listMyTrips, {
    method: "GET",
  });
  return response.data;
};

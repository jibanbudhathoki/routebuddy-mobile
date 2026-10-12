import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripRequest,
  DeleteTripResponse,
  ListMyTripsResponse,
  TripDetailsResponse,
  ListAllTripsResponse,
  ToggleTripOrdersPayload,
  ToggleTripOrdersResponse,
  UpdateTripPayload,
  UpdateTripResponse,
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
      throw new Error(response.message || "Failed to post trip.");
    }

    return response.data;
  },
  async toggleTripOrders(
    uid: string,
    payload: ToggleTripOrdersPayload,
  ): Promise<ToggleTripOrdersResponse> {
    if (!uid.trim()) {
      throw new Error("A trip ID is required to update order availability.");
    }

    const response = await apiRequest<ToggleTripOrdersResponse>(
      apiEndpoints.trips.openOrcloseOrder.replace(
        ":uid",
        encodeURIComponent(uid),
      ),
      {
        method: "PATCH",
        body: payload,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to update trip orders.");
    }
    if (!response.data?.uid) {
      throw new Error("The order availability response did not include trip data.");
    }

    return response;
  },
  async updateTrip(
    uid: string,
    payload: UpdateTripPayload,
  ): Promise<UpdateTripResponse> {
    if (!uid.trim()) {
      throw new Error("A trip ID is required to update this trip.");
    }
    if (Object.keys(payload).length === 0) {
      throw new Error("Provide at least one trip field to update.");
    }

    const response = await apiRequest<UpdateTripResponse>(
      apiEndpoints.trips.editMyTrip.replace(":uid", encodeURIComponent(uid)),
      {
        method: "PATCH",
        body: payload,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to update this trip.");
    }
    if (!response.data?.uid) {
      throw new Error("The update-trip response did not include trip data.");
    }

    return response;
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
  }>(apiEndpoints.trips.tripDetails.replace(":uid", encodeURIComponent(uid)), {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to load trip details.");
  }

  return response.data;
};

export const deleteTrip = async (uid: string): Promise<DeleteTripResponse> => {
  const response = await apiRequest<DeleteTripResponse>(
    apiEndpoints.trips.deleteTrip.replace(":uid", encodeURIComponent(uid)),
    { method: "DELETE" },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
};

export const listAllTrips = async (): Promise<ListAllTripsResponse["data"]> => {
  const response = await apiRequest<ListAllTripsResponse>(
    apiEndpoints.trips.listAllTrips,
    {
      method: "GET",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load trips.");
  }

  if (!Array.isArray(response.data)) {
    throw new Error("The trips response did not include a valid data list.");
  }

  return response.data;
};

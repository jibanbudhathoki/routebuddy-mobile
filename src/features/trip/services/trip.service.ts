import { apiRequest } from "../../../shared/api/apiClient";
import { apiEndpoints } from "../../../constant/url";
import type {
  CreateTripRequest,
  DeleteTripResponse,
  ListMyTripsResponse,
  TripDetailsResponse,
  ListAllTripsResponse,
  TripOrder,
  ToggleTripOrdersPayload,
  ToggleTripOrdersResponse,
  UpdateTripPayload,
  UpdateTripResponse,
  UpdateTripStatusPayload,
  UpdateTripStatusResponse,
} from "../types/trip";
import { updateTripStatusSchema } from "../validations/updateTripStatus";
import { listTripOrdersResponseSchema } from "../validations/tripOrders";
import { myTripsResponseSchema } from "../validations/myTrips";

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
  async updateTripStatus(
    uid: string,
    payload: UpdateTripStatusPayload,
  ): Promise<UpdateTripStatusResponse> {
    if (!uid.trim()) {
      throw new Error("A trip ID is required to update its status.");
    }

    const validation = updateTripStatusSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error(
        validation.error.issues[0]?.message ?? "Choose a valid trip status.",
      );
    }

    const response = await apiRequest<UpdateTripStatusResponse>(
      apiEndpoints.trips.updateTripStatus.replace(
        ":uid",
        encodeURIComponent(uid),
      ),
      {
        method: "PATCH",
        body: validation.data,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to update trip status.");
    }
    if (!response.data?.uid) {
      throw new Error("The status response did not include trip data.");
    }

    return response;
  },
  async listOrdersForTrip(uid: string): Promise<TripOrder[]> {
    if (!uid.trim()) {
      throw new Error("A trip ID is required to load its orders.");
    }

    const response = await apiRequest<unknown>(
      apiEndpoints.trips.listOrderForTrip.replace(
        ":uid",
        encodeURIComponent(uid),
      ),
      { method: "GET" },
    );
    if (
      typeof response === "object" &&
      response !== null &&
      "success" in response &&
      response.success === false
    ) {
      const message =
        "message" in response && typeof response.message === "string"
          ? response.message
          : "Unable to load trip orders.";
      throw new Error(message);
    }
    const parsedResponse = listTripOrdersResponseSchema.safeParse(response);
    if (!parsedResponse.success) {
      throw new Error(
        parsedResponse.error.issues[0]?.message ??
          "The trip orders response was invalid.",
      );
    }
    if (!parsedResponse.data.success) {
      throw new Error(parsedResponse.data.message || "Unable to load trip orders.");
    }
    return parsedResponse.data.data;
  },
};

export const listMyTrips = async (): Promise<ListMyTripsResponse[]> => {
  const response = await apiRequest<unknown>(apiEndpoints.trips.listMyTrips, {
    method: "GET",
  });

  if (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  ) {
    throw new Error(
      "message" in response && typeof response.message === "string"
        ? response.message
        : "Failed to load your trips.",
    );
  }

  const parsedResponse = myTripsResponseSchema.safeParse(response);
  if (!parsedResponse.success) {
    throw new Error(
      parsedResponse.error.issues[0]?.message ??
        "The trips response was invalid.",
    );
  }
  return parsedResponse.data.data;
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

export const getSharedTripDetails = async (
  uid: string,
): Promise<TripDetailsResponse> => {
  if (!uid.trim()) {
    throw new Error("A trip ID is required to load shared trip details.");
  }
  const response = await apiRequest<{
    success: boolean;
    message: string;
    data: TripDetailsResponse;
  }>(
    apiEndpoints.trips.sharedTripDetails.replace(
      ":uid",
      encodeURIComponent(uid),
    ),
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to load shared trip details.");
  }
  if (!response.data?.uid) {
    throw new Error("The shared trip response did not include trip details.");
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

import { useQuery } from "@tanstack/react-query";

import { tripService } from "../services/trip.service";

export const tripOrderKeys = {
  all: ["trips", "orders"] as const,
  byTrip: (tripUid: string) => [...tripOrderKeys.all, tripUid] as const,
};

export function useTripOrders(tripUid: string) {
  return useQuery({
    queryKey: tripOrderKeys.byTrip(tripUid),
    queryFn: () => tripService.listOrdersForTrip(tripUid),
    enabled: Boolean(tripUid),
  });
}

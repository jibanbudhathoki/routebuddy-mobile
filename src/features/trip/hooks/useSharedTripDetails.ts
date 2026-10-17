import { useQuery } from "@tanstack/react-query";

import { getSharedTripDetails } from "../services/trip.service";

export function useSharedTripDetails(uid: string) {
  return useQuery({
    queryKey: ["trips", "shared", uid],
    queryFn: () => getSharedTripDetails(uid),
    enabled: Boolean(uid),
  });
}

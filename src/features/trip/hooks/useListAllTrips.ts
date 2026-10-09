import { useQuery } from "@tanstack/react-query";
import { listAllTrips } from "../services/trip.service";

export function useListAllTrips(enabled = true) {
  return useQuery({
    queryKey: ["trips", "all"],
    queryFn: listAllTrips,
    enabled,
  });
}

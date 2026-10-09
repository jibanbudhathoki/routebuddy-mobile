import { useQuery } from "@tanstack/react-query";
import { listMyRequests } from "../services/request.service";

export function useListMyRequests(enabled = true) {
  return useQuery({
    queryKey: ["requests", "mine"],
    queryFn: listMyRequests,
    enabled,
  });
}

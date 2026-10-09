import { useQuery } from "@tanstack/react-query";
import { listAllRequests } from "../services/request.service";

export function useListAllRequests(enabled = true) {
  return useQuery({
    queryKey: ["requests", "all"],
    queryFn: listAllRequests,
    enabled,
  });
}

import { useQuery } from "@tanstack/react-query";

import { listMyAssignedRequests } from "../services/request.service";

export function useListMyAssignedRequests(enabled = true) {
  return useQuery({
    queryKey: ["requests", "assigned-to-me"],
    queryFn: listMyAssignedRequests,
    enabled,
  });
}

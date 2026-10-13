import { useQuery } from "@tanstack/react-query";

import { getSharedRequestDetails } from "../services/request.service";

export function useSharedRequestDetails(uid: string) {
  return useQuery({
    queryKey: ["requests", "shared", uid],
    queryFn: () => getSharedRequestDetails(uid),
    enabled: Boolean(uid),
  });
}

import { useQuery } from "@tanstack/react-query";
import { getRequestDetails } from "../services/request.service";

export function useRequestDetails(
  uid: string,
  options?: { refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["requests", "details", uid],
    queryFn: () => getRequestDetails(uid),
    enabled: Boolean(uid),
    refetchInterval: options?.refetchInterval,
    refetchIntervalInBackground: false,
  });
}

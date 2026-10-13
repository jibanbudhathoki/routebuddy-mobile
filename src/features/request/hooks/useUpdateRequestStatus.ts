import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestService } from "../services/request.service";
import type { RequestDeliveryStatus } from "../types/request";

export function useUpdateRequestStatus(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: RequestDeliveryStatus) =>
      requestService.updateRequestStatus(requestUid, status),
    onSuccess: async (request) => {
      queryClient.setQueryData(
        ["requests", "details", requestUid],
        request,
      );
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

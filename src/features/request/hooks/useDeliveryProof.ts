import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestService } from "../services/request.service";
import type {
  AddRequestDeliveryProofPayload,
  RequestDetailsResponse,
} from "../types/request";

export function useAddDeliveryProof(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddRequestDeliveryProofPayload) =>
      requestService.addDeliveryProof(requestUid, payload),
    onSuccess: async (request) => {
      queryClient.setQueryData(
        ["requests", "details", requestUid],
        request,
      );
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestUid: string) =>
      requestService.confirmDelivery(requestUid),
    onSuccess: async (request: RequestDetailsResponse) => {
      queryClient.setQueryData(
        ["requests", "details", request.uid],
        request,
      );
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

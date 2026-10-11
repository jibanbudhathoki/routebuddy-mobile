import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestService } from "../services/request.service";
import type {
  SubmitRequestOfferPayload,
} from "../types/request";

export function useSubmitRequestOffer(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitRequestOfferPayload) =>
      requestService.submitOffer(requestUid, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useAcceptRequestOffer(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerUid: string) =>
      requestService.acceptOffer(requestUid, offerUid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestService } from "../services/request.service";
import type {
  RequestAction,
  SubmitRequestOfferPayload,
} from "../types/request";
import { tripOrderKeys } from "../../trip/hooks/useTripOrders";

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

export function useRespondToRequestOffer(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      offerUid,
      action,
    }: {
      offerUid: string;
      action: RequestAction;
    }) => requestService.respondToOffer(requestUid, offerUid, action),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useRespondToTripOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderUid,
      action,
    }: {
      orderUid: string;
      action: RequestAction;
    }) => requestService.respondToTripOrder(orderUid, action),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
        queryClient.invalidateQueries({ queryKey: tripOrderKeys.all }),
      ]);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestService } from "../services/request.service";

export function useCreateTripOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestService.createTripOrder,
    onSuccess: async (_response, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["trips", "details", payload.tripUid],
        }),
        queryClient.invalidateQueries({ queryKey: ["trips", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["trips", "all"] }),
      ]);
    },
  });
}

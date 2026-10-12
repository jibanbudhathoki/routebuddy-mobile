import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripService } from "../services/trip.service";
import type { UpdateTripStatusPayload } from "../types/trip";

interface UpdateTripStatusInput {
  uid: string;
  payload: UpdateTripStatusPayload;
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, payload }: UpdateTripStatusInput) =>
      tripService.updateTripStatus(uid, payload),
    onSuccess: async (response, { uid }) => {
      queryClient.setQueryData(["trips", "details", uid], response.data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trips", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["trips", "all"] }),
      ]);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripService } from "../services/trip.service";
import type { UpdateTripPayload } from "../types/trip";

interface UpdateTripInput {
  uid: string;
  payload: UpdateTripPayload;
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, payload }: UpdateTripInput) =>
      tripService.updateTrip(uid, payload),
    onSuccess: async (response, { uid }) => {
      queryClient.setQueryData(["trips", "details", uid], response.data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trips", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["trips", "all"] }),
      ]);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tripService } from "../services/trip.service";
import type { ToggleTripOrdersPayload } from "../types/trip";

interface ToggleTripOrdersInput extends ToggleTripOrdersPayload {
  uid: string;
}

export function useToggleTripOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, closed }: ToggleTripOrdersInput) =>
      tripService.toggleTripOrders(uid, { closed }),
    onSuccess: async (response, { uid }) => {
      queryClient.setQueryData(["trips", "details", uid], response.data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trips", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["trips", "all"] }),
      ]);
    },
  });
}

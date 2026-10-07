import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "../services/trip.service";

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: async (_response, uid) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trips", "mine"] }),
        queryClient.invalidateQueries({ queryKey: ["trips", "all"] }),
        queryClient.removeQueries({ queryKey: ["trips", "details", uid] }),
      ]);
    },
  });
}

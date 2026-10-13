import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "../services/rating.service";
import type { SubmitDriverRatingInput } from "../types/rating";

export function useRateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestUid, score, comment }: SubmitDriverRatingInput) =>
      ratingService.rateDriver(requestUid, { score, comment }),
    onSuccess: async (_response, input) => {
      await queryClient.invalidateQueries({
        queryKey: ["requests", "details", input.requestUid],
      });
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

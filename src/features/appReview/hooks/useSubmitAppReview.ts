import { useMutation } from "@tanstack/react-query";

import { appReviewService } from "../services/appReview.service";
import type { SubmitAppReviewPayload } from "../types/appReview";

export function useSubmitAppReview() {
  return useMutation({
    mutationFn: (payload: SubmitAppReviewPayload) =>
      appReviewService.submit(payload),
  });
}

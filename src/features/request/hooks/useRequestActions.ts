import { useMutation, useQueryClient } from "@tanstack/react-query";

import { requestService } from "../services/request.service";

export function useCancelRequest(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => requestService.cancelRequest(requestUid),
    onSuccess: async (response) => {
      queryClient.setQueryData(
        ["requests", "details", requestUid],
        response.data,
      );
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useDeleteRequest(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => requestService.deleteRequest(requestUid),
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: ["requests", "details", requestUid],
        exact: true,
      });
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useReportRequestIssue(requestUid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) =>
      requestService.reportIssue(requestUid, { message }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["requests", "details", requestUid],
      });
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

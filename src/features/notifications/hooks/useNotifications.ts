import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../services/notification.service";
import type { AppNotification } from "../types/notification";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationService.list,
    refetchInterval: 60_000,
  });
}

export function useUnreadNotificationCount() {
  const { data: notifications } = useNotifications();
  return notifications?.filter((notification) => !notification.isRead).length ?? 0;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.list(),
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: async () => {
      queryClient.setQueryData<AppNotification[]>(
        notificationKeys.list(),
        (current) => current?.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.list(),
      });
    },
  });
}

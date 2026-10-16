import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import type { ProfileNotificationPreferences } from "../types/profile";

export const notificationPreferencesKey = [
  "profile",
  "notification-preferences",
] as const;

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationPreferencesKey,
    queryFn: profileService.getNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: ProfileNotificationPreferences) =>
      profileService.updateNotificationPreferences(preferences),
    onSuccess: (preferences) => {
      queryClient.setQueryData(notificationPreferencesKey, preferences);
    },
  });
}

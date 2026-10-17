import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  profileService,
  type UpdateUserProfilePayload,
  type UserProfile,
} from "../services/profile.service";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateInProgress = useRef(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (failure) {
      setError(getFailureMessage(failure, "Failed to load profile."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchProfile();
    }, [fetchProfile]),
  );

  const updateProfile = async (
    data: UpdateUserProfilePayload,
  ): Promise<{ success: boolean; error?: string }> => {
    if (updateInProgress.current) {
      return {
        success: false,
        error: "A profile update is already in progress.",
      };
    }

    updateInProgress.current = true;
    setIsUpdating(true);
    setError(null);
    try {
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      return { success: true };
    } catch (failure) {
      const message = getFailureMessage(failure, "Failed to update profile.");
      setError(message);
      return { success: false, error: message };
    } finally {
      updateInProgress.current = false;
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}

function getFailureMessage(failure: unknown, fallback: string) {
  return failure instanceof Error && failure.message
    ? failure.message
    : fallback;
}

import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { profileService } from "../services/profile.service";
import type { ProfileSummary } from "../types/profile";

export function useProfileSummary() {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setSummary(await profileService.getProfileSummary());
    } catch (failure: unknown) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Failed to load profile summary.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchSummary();
    }, [fetchSummary]),
  );

  return { summary, isLoading, error, refetch: fetchSummary };
}

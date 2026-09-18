import { useState, useEffect } from 'react';
import { profileService, type UserProfile } from '../services/profile.service';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: { firstName: string; lastName: string; phone?: string }) => {
    setError(null);
    try {
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      return { success: true };
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      return { success: false };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}

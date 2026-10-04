import { useQuery } from '@tanstack/react-query';
import { getTripDetails } from '../services/trip.service';

export function useTripDetails(uid: string) {
  return useQuery({
    queryKey: ['trips', 'details', uid],
    queryFn: () => getTripDetails(uid),
    enabled: Boolean(uid),
  });
}

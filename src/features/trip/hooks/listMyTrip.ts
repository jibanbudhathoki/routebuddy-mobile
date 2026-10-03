import { useQuery } from '@tanstack/react-query';
import { listMyTrips } from '../services/trip.service';

export function useListMyTrip(enabled = true) {
  return useQuery({
    queryKey: ['trips', 'mine'],
    queryFn: listMyTrips,
    enabled,
  });
}

export interface HomeTrip {
  id: string;
  driverName: string;
  driverInitials: string;
  rating: string;
  tripCount: number;
  remainingSpots: number;
  origin: string;
  destination: string;
  departureLabel: string;
  deliveryLabel: string;
  stores: string[];
}

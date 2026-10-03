export interface CreateTripRequest {
  originCityUid: string;
  originCityName?: string;
  destinationCityUid: string;
  destinationCityName?: string;
  stores: string[];
  departureAt: string;
  orderCutoffAt: string;
  deliveryLatestBy: string;
  capacity: number;
  price?: number; // Backend schema has price, but UI won't set it for now.
  notes: string;
}

export interface ListMyTripsResponse {
  uid: string;
  departureAt: string;
  availableSeats: number;
  capacity: number;
  price: string;
  status: string;
  origin: string;
  destination: string;
  driver: {
    name: string;
    photoUrl?: string | null;
  };
}

import type { CreateTripRequest } from '../types/trip';

export function validateTripData(tripData: Partial<CreateTripRequest>): { isValid: boolean; error?: string } {
  // 1. Check for missing fields
  if (!tripData.stores || tripData.stores.length === 0) {
    return { isValid: false, error: "Please select at least one store." };
  }
  if (!tripData.orderCutoffAt) {
    return { isValid: false, error: "Please select an Ordering Cut-off date." };
  }
  if (!tripData.departureAt) {
    return { isValid: false, error: "Please select a Day of Departure." };
  }
  if (!tripData.deliveryLatestBy) {
    return { isValid: false, error: "Please select a Latest Delivery By date." };
  }
  if (!tripData.originCityUid) {
    return { isValid: false, error: "Please select a starting city (From)." };
  }
  if (!tripData.destinationCityUid) {
    return { isValid: false, error: "Please select a destination city (To)." };
  }
  if (!tripData.capacity || tripData.capacity < 1) {
    return { isValid: false, error: "Please set the number of orders allowed (at least 1)." };
  }

  // 2. Validate chronological order of dates
  const orderCutoff = new Date(tripData.orderCutoffAt).setHours(0, 0, 0, 0);
  const departure = new Date(tripData.departureAt).setHours(0, 0, 0, 0);
  const delivery = new Date(tripData.deliveryLatestBy).setHours(0, 0, 0, 0);

  if (orderCutoff > departure) {
    return { isValid: false, error: "Ordering Cut-off date must be on or before the Day of Departure." };
  }
  if (departure > delivery) {
    return { isValid: false, error: "Day of Departure must be on or before the Latest Delivery By date." };
  }

  return { isValid: true };
}

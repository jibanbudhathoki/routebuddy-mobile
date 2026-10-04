import type { CreateTripRequest } from '../types/trip';

type TripDataValidation =
  | { isValid: true; data: CreateTripRequest }
  | { isValid: false; error: string };

export function isTripDateOnOrBefore(first: Date, second: Date) {
  const firstDay = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  ).getTime();
  const secondDay = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  ).getTime();
  return firstDay <= secondDay;
}

export function validateTripData(
  tripData: Partial<CreateTripRequest>,
): TripDataValidation {
  if (!tripData.stores || tripData.stores.length === 0) {
    return { isValid: false, error: 'Please select at least one store.' };
  }
  if (!tripData.orderCutoffAt) {
    return { isValid: false, error: 'Please select an Ordering Cut-off date.' };
  }
  if (!tripData.departureAt) {
    return { isValid: false, error: 'Please select a Day of Departure.' };
  }
  if (!tripData.deliveryLatestBy) {
    return { isValid: false, error: 'Please select a Latest Delivery By date.' };
  }
  if (!tripData.originCityUid) {
    return { isValid: false, error: 'Please select a starting city (From).' };
  }
  if (!tripData.destinationCityUid) {
    return { isValid: false, error: 'Please select a destination city (To).' };
  }
  if (
    typeof tripData.capacity !== 'number' ||
    !Number.isInteger(tripData.capacity) ||
    tripData.capacity < 1
  ) {
    return {
      isValid: false,
      error: 'Please set the number of orders allowed (at least 1).',
    };
  }

  const orderCutoffDate = new Date(tripData.orderCutoffAt);
  const departureDate = new Date(tripData.departureAt);
  const deliveryDate = new Date(tripData.deliveryLatestBy);

  if (
    Number.isNaN(orderCutoffDate.getTime()) ||
    Number.isNaN(departureDate.getTime()) ||
    Number.isNaN(deliveryDate.getTime())
  ) {
    return { isValid: false, error: 'Please select valid trip dates.' };
  }

  if (!isTripDateOnOrBefore(orderCutoffDate, departureDate)) {
    return {
      isValid: false,
      error: 'Ordering Cut-off date must be on or before the Day of Departure.',
    };
  }
  if (!isTripDateOnOrBefore(departureDate, deliveryDate)) {
    return {
      isValid: false,
      error: 'Day of Departure must be on or before the Latest Delivery By date.',
    };
  }

  return {
    isValid: true,
    data: {
      originCityUid: tripData.originCityUid,
      originCityName: tripData.originCityName,
      destinationCityUid: tripData.destinationCityUid,
      destinationCityName: tripData.destinationCityName,
      stores: tripData.stores,
      departureAt: tripData.departureAt,
      orderCutoffAt: tripData.orderCutoffAt,
      deliveryLatestBy: tripData.deliveryLatestBy,
      capacity: tripData.capacity,
      price: tripData.price,
      notes: tripData.notes ?? '',
    },
  };
}

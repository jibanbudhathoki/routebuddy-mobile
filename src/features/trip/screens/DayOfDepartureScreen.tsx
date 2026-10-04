import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";
import { isTripDateOnOrBefore } from "../validations/trip";

export function DayOfDepartureScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();
  const { showToast } = useToast();

  const handleContinue = (date: Date | null) => {
    if (date) {
      if (
        tripData.orderCutoffAt &&
        !isTripDateOnOrBefore(new Date(tripData.orderCutoffAt), date)
      ) {
        showToast("Departure must be on or after the ordering cut-off.");
        return;
      }
      if (
        tripData.deliveryLatestBy &&
        !isTripDateOnOrBefore(date, new Date(tripData.deliveryLatestBy))
      ) {
        showToast("Departure must be on or before the latest delivery date.");
        return;
      }

      updateTripData({ departureAt: date.toISOString() });
    }

    router.back();
  };

  const initialDate = tripData.departureAt ? new Date(tripData.departureAt) : new Date();

  return (
    <DateSelectionScreen
      headerTitle="Day of Departure"
      title="When are you leaving?"
      subtitle="Select the day you'll start your trip."
      initialDate={initialDate}
      onContinue={handleContinue}
      onClose={() => router.back()}
    />
  );
}

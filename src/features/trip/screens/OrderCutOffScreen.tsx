import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";
import { isTripDateOnOrBefore } from "../validations/trip";

export function OrderCutOffScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();
  const { showToast } = useToast();

  const handleContinue = (date: Date | null) => {
    if (date) {
      if (
        tripData.departureAt &&
        !isTripDateOnOrBefore(date, new Date(tripData.departureAt))
      ) {
        showToast("Ordering cut-off must be on or before departure.");
        return;
      }

      updateTripData({ orderCutoffAt: date.toISOString() });
    }

    router.back();
  };

  const initialDate = tripData.orderCutoffAt ? new Date(tripData.orderCutoffAt) : new Date();

  return (
    <DateSelectionScreen
      headerTitle="Order Cut-Off"
      title="Order Cut-off"
      subtitle="Select the day you'll stop accepting orders."
      initialDate={initialDate}
      onContinue={handleContinue}
      onClose={() => router.back()}
    />
  );
}

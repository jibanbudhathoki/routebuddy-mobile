import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";
import { isTripDateOnOrBefore } from "../validations/trip";

export function LatestDeliveryTimeScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();
  const { showToast } = useToast();

  const handleContinue = (date: Date | null) => {
    if (date) {
      if (
        tripData.departureAt &&
        !isTripDateOnOrBefore(new Date(tripData.departureAt), date)
      ) {
        showToast("Latest delivery date must be on or after departure.");
        return;
      }

      updateTripData({ deliveryLatestBy: date.toISOString() });
    }

    router.back();
  };

  const initialDate = tripData.deliveryLatestBy
    ? new Date(tripData.deliveryLatestBy)
    : new Date();

  return (
    <DateSelectionScreen
      headerTitle="Latest Delivery Time"
      title="Latest Delivery Time"
      subtitle="Select the day you'll deliver the items by."
      initialDate={initialDate}
      onContinue={handleContinue}
      onClose={() => router.back()}
    />
  );
}

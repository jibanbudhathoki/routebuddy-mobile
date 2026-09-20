import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";

export function OrderCutOffScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();

  const handleContinue = (date: Date | null) => {
    if (date) {
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

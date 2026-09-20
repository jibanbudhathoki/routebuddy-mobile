import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";

export function DayOfDepartureScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();

  const handleContinue = (date: Date | null) => {
    if (date) {
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

import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useRequestCreation } from "../context/RequestCreationContext";

export function SelectDayScreen() {
  const router = useRouter();
  const { requestData, updateRequestData } = useRequestCreation();

  const handleContinue = (date: Date | null) => {
    if (date) {
      updateRequestData({ dayNeeded: date.toISOString() });
    }
    router.back();
  };

  const initialDate = requestData.dayNeeded ? new Date(requestData.dayNeeded) : new Date();

  return (
    <DateSelectionScreen
      headerTitle="Select Day"
      title={"Select the day you need\nyour items."}
      initialDate={initialDate}
      onContinue={handleContinue}
      onClose={() => router.back()}
    />
  );
}

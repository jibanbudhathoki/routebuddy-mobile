import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useRequestCreation } from "../context/RequestCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";

export function SelectDayScreen() {
  const router = useRouter();
  const { requestData, updateRequestData } = useRequestCreation();
  const { showToast } = useToast();

  const handleContinue = (date: Date | null) => {
    if (date) {
      const selectedCalendarDay = new Date(date);
      selectedCalendarDay.setHours(0, 0, 0, 0);
      const latestDeliveryDate = requestData.latestDeliveryTime
        ? new Date(requestData.latestDeliveryTime)
        : null;
      latestDeliveryDate?.setHours(0, 0, 0, 0);
      if (latestDeliveryDate && selectedCalendarDay > latestDeliveryDate) {
        showToast("The day you need the items must be on or before the latest delivery date.");
        return;
      }
      updateRequestData({ dayNeeded: date.toISOString() });
    }
    router.back();
  };

  const initialDate = requestData.dayNeeded
    ? new Date(requestData.dayNeeded)
    : undefined;

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

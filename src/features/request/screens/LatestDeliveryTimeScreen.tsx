import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useRequestCreation } from "../context/RequestCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";

export function LatestDeliveryTimeScreen() {
  const router = useRouter();
  const { requestData, updateRequestData } = useRequestCreation();
  const { showToast } = useToast();

  const handleContinue = (date: Date | null) => {
    if (date) {
      const latestDeliveryDate = new Date(date);
      latestDeliveryDate.setHours(23, 59, 59, 999);
      const neededDate = requestData.dayNeeded
        ? new Date(requestData.dayNeeded)
        : null;
      if (neededDate && latestDeliveryDate < neededDate) {
        showToast("Latest delivery date must be on or after the day you need the items.");
        return;
      }
      updateRequestData({ latestDeliveryTime: latestDeliveryDate.toISOString() });
    }
    router.back();
  };

  const initialDate = requestData.latestDeliveryTime
    ? new Date(requestData.latestDeliveryTime)
    : undefined;

  return (
    <DateSelectionScreen
      headerTitle="Needed By"
      title="Needed By (Latest Delivery)"
      subtitle="Select the latest date you need your items delivered by."
      initialDate={initialDate}
      onContinue={handleContinue}
      onClose={() => router.back()}
    />
  );
}

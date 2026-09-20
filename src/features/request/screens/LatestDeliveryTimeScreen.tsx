import React from "react";
import { useRouter } from "expo-router";
import { DateSelectionScreen } from "../../../shared/components/DateSelectionScreen";
import { useRequestCreation } from "../context/RequestCreationContext";

export function LatestDeliveryTimeScreen() {
  const router = useRouter();
  const { requestData, updateRequestData } = useRequestCreation();

  const handleContinue = (date: Date | null) => {
    if (date) {
      updateRequestData({ latestDeliveryTime: date.toISOString() });
    }
    router.back();
  };

  const initialDate = requestData.latestDeliveryTime
    ? new Date(requestData.latestDeliveryTime)
    : new Date();

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

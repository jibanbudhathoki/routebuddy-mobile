import React from "react";
import { useRouter } from "expo-router";
import { StoreSelectionScreen as SharedStoreSelectionScreen } from "../../../shared/components/StoreSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";

export function SelectStoreScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();

  return (
    <SharedStoreSelectionScreen
      initialSelectedStores={tripData.stores || []}
      onSave={(selectedStores) => {
        updateTripData({ stores: selectedStores });
        router.back();
      }}
    />
  );
}

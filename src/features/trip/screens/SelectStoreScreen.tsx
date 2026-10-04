import React from "react";
import { useRouter } from "expo-router";
import { StoreSelectionScreen as SharedStoreSelectionScreen } from "../../../shared/components/StoreSelectionScreen";
import { useTripCreation } from "../context/TripCreationContext";
import { useToast } from "../../../shared/components/ToastProvider";

export function SelectStoreScreen() {
  const router = useRouter();
  const { tripData, updateTripData } = useTripCreation();
  const { showToast } = useToast();

  return (
    <SharedStoreSelectionScreen
      initialSelectedStores={tripData.stores || []}
      onSave={(selectedStores) => {
        if (selectedStores.length === 0) {
          showToast("Select at least one store to continue.");
          return;
        }

        updateTripData({ stores: selectedStores });
        router.back();
      }}
    />
  );
}

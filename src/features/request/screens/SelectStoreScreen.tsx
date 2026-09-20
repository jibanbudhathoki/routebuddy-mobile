import React from "react";
import { useRouter } from "expo-router";
import { StoreSelectionScreen as SharedStoreSelectionScreen } from "../../../shared/components/StoreSelectionScreen";
import { useRequestCreation } from "../context/RequestCreationContext";

export function SelectStoreScreen() {
  const router = useRouter();
  const { requestData, updateRequestData } = useRequestCreation();

  return (
    <SharedStoreSelectionScreen
      initialSelectedStores={requestData.stores || []}
      onSave={(selectedStores) => {
        updateRequestData({ stores: selectedStores });
        router.back();
      }}
    />
  );
}

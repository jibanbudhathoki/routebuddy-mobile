import React from "react";
import { useRouter } from "expo-router";
import { AddressFormScreen } from "../../../shared/components/AddressFormScreen";

export default function AddAddressModal() {
  const router = useRouter();

  return (
    <AddressFormScreen 
      onSave={(data) => {
        console.log("Saved Address:", data);
        // In the future we will save this to API or local state
        router.back();
      }} 
    />
  );
}

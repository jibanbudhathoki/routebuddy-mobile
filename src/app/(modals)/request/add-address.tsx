import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  AddressFormScreen,
  AddressFormData,
} from "../../../shared/components/AddressFormScreen";
import { useAddresses } from "../../../shared/address/hooks/useAddresses";
import { Alert } from "react-native";

export default function AddAddressModal() {
  const router = useRouter();
  const { createAddress } = useAddresses();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      await createAddress({
        label: data.label,
        recipientName: data.fullName,
        line1: data.address,
        line2: data.aptSuiteUnit,
        cityUid: data.cityUid,
        provinceUid: data.provinceUid,
        postalCode: data.postalCode,
        countryUid: "country_b5a5c0a2-dfe1-4850-b946-da93c6ffe9aa", // Default to Nepal
        notes: data.notes,
      });
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  return <AddressFormScreen onSave={handleSave} isLoading={isSaving} />;
}

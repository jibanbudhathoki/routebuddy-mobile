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
        line2: data.aptSuiteUnit.trim() || null,
        cityUid: data.cityUid,
        provinceUid: data.provinceUid,
        countryUid: data.countryUid,
        postalCode: data.postalCode,
        phone: data.phone.trim() || null,
        notes: data.notes.trim() || null,
        isDefault: data.isDefault,
      });
      router.back();
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save address",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return <AddressFormScreen onSave={handleSave} isLoading={isSaving} />;
}

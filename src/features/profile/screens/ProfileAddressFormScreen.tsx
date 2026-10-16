import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { AddressFormScreen, type AddressFormData } from "../../../shared/components/AddressFormScreen";
import { useAddresses } from "../../../shared/address/hooks/useAddresses";
import type { Address } from "../../../shared/address/types/address";

function toFormData(address: Address): AddressFormData {
  return {
    label: address.label,
    fullName: address.recipientName,
    address: address.line1,
    aptSuiteUnit: address.line2 ?? "",
    cityName: address.city?.name ?? "",
    cityUid: address.cityUid,
    provinceName: address.province?.name ?? "",
    provinceUid: address.provinceUid,
    countryName: address.country?.name ?? "",
    countryUid: address.countryUid,
    postalCode: address.postalCode,
    notes: address.notes ?? "",
    phone: address.phone ?? "",
    isDefault: address.isDefault,
  };
}

interface ProfileAddressFormScreenProps {
  addressUid?: string;
}

export function ProfileAddressFormScreen({
  addressUid,
}: ProfileAddressFormScreenProps) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { addresses, isLoading, error, createAddress, updateAddress } = useAddresses();
  const [isSaving, setIsSaving] = useState(false);
  const address = addressUid
    ? addresses.find((item) => item.uid === addressUid)
    : undefined;

  const save = async (data: AddressFormData) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const dto = {
        label: data.label.trim(),
        recipientName: data.fullName.trim(),
        line1: data.address.trim(),
        line2: data.aptSuiteUnit.trim() || null,
        cityUid: data.cityUid,
        provinceUid: data.provinceUid,
        countryUid: data.countryUid,
        postalCode: data.postalCode.trim(),
        phone: data.phone.trim() || null,
        notes: data.notes.trim() || null,
        isDefault: data.isDefault,
      };
      if (addressUid) {
        await updateAddress(addressUid, dto);
      } else {
        await createAddress(dto);
      }
      router.back();
    } catch (saveError: unknown) {
      Alert.alert(
        "Unable to save address",
        saveError instanceof Error ? saveError.message : "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (addressUid && isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.text} />
      </View>
    );
  }

  if (addressUid && (error || !address)) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorText}>
          {error ?? "The requested address could not be found."}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorAction}>Go back to addresses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AddressFormScreen
      onSave={save}
      isLoading={isSaving}
      initialData={address ? toFormData(address) : undefined}
      title={address ? "Edit Address" : "Add New Address"}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  loading: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    flex: 1,
    justifyContent: "center",
  },
  errorState: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  errorText: { color: theme.colors.error, fontSize: 14, textAlign: "center" },
  errorAction: { color: theme.colors.text, fontSize: 14, fontWeight: "700" },
}));

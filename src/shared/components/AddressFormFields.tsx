import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { AddressFormData } from "../address/types/addressForm";
import { FormInput } from "./FormInput";

interface AddressFormFieldsProps {
  formData: AddressFormData;
  updateField: (field: keyof AddressFormData, value: string | boolean) => void;
  onSelectCountry: () => void;
  onSelectProvince: () => void;
  onSelectCity: () => void;
}

export function AddressFormFields({
  formData,
  updateField,
  onSelectCountry,
  onSelectProvince,
  onSelectCity,
}: AddressFormFieldsProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.formSection}>
      <FormInput
        label="Address Label"
        icon="label-outline"
        placeholder="e.g. Home, Work"
        value={formData.label}
        onChangeText={(text) => updateField("label", text)}
        maxLength={50}
      />
      <FormInput
        label="Full Name"
        icon="account-outline"
        placeholder="e.g. John Smith"
        value={formData.fullName}
        onChangeText={(text) => updateField("fullName", text)}
        maxLength={100}
      />
      <LocationSelector
        label="Country"
        value={formData.countryName}
        placeholder="Select country"
        onPress={onSelectCountry}
      />
      <LocationSelector
        label="Province / State"
        value={formData.provinceName}
        placeholder={
          formData.countryUid ? "Select province or state" : "Select a country first"
        }
        disabled={!formData.countryUid}
        onPress={onSelectProvince}
      />
      <LocationSelector
        label="City"
        value={formData.cityName}
        placeholder={
          formData.provinceUid ? "Select city" : "Select a province first"
        }
        disabled={!formData.provinceUid}
        onPress={onSelectCity}
      />
      <FormInput
        label="Address"
        icon="map-marker-outline"
        placeholder="e.g. 123 Main St"
        value={formData.address}
        onChangeText={(text) => updateField("address", text)}
        maxLength={200}
      />
      <FormInput
        label="Apt, Suite, Unit (optional)"
        icon="office-building-outline"
        placeholder="e.g. Unit 5"
        value={formData.aptSuiteUnit}
        onChangeText={(text) => updateField("aptSuiteUnit", text)}
        maxLength={100}
      />
      <FormInput
        label="Postal Code"
        icon="mailbox-outline"
        placeholder="e.g. M4B 1B3"
        value={formData.postalCode}
        onChangeText={(text) => updateField("postalCode", text)}
        maxLength={20}
      />
      <FormInput
        label="Phone (optional)"
        icon="phone-outline"
        placeholder="Recipient phone number"
        value={formData.phone}
        onChangeText={(text) => updateField("phone", text)}
        maxLength={20}
        keyboardType="phone-pad"
      />
      <View style={styles.textAreaWrapper}>
        <FormInput
          label="Notes for driver (optional)"
          icon="note-edit-outline"
          placeholder="e.g. Ring doorbell, call on arrival"
          value={formData.notes}
          onChangeText={(text) => {
            if (text.length <= 150) {
              updateField("notes", text);
            }
          }}
          multiline
        />
        <Text style={styles.charCount}>{formData.notes.length}/150</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: formData.isDefault }}
        style={styles.defaultAddressRow}
        onPress={() => updateField("isDefault", !formData.isDefault)}
      >
        <MaterialCommunityIcons
          name={formData.isDefault ? "checkbox-marked" : "checkbox-blank-outline"}
          size={22}
          color={formData.isDefault ? theme.colors.text : theme.colors.muted}
        />
        <Text style={styles.defaultAddressText}>Set as default address</Text>
      </TouchableOpacity>
    </View>
  );
}

function LocationSelector({
  label,
  value,
  placeholder,
  disabled = false,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ disabled }}
        style={[styles.dropdownContainer, disabled && styles.dropdownDisabled]}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={onPress}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color={disabled ? theme.colors.muted : theme.colors.text}
          style={styles.inputIcon}
        />
        <Text
          style={[
            styles.dropdownText,
            !value && styles.dropdownPlaceholder,
          ]}
        >
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color={disabled ? theme.colors.muted : theme.colors.text}
          style={styles.dropdownChevron}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  formSection: {
    gap: theme.spacing.md,
  },
  inputWrapper: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 56,
    backgroundColor: theme.colors.surface,
  },
  dropdownDisabled: {
    backgroundColor: theme.colors.primarySoft,
  },
  inputIcon: {
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownPlaceholder: {
    color: theme.colors.muted,
  },
  dropdownChevron: {
    marginLeft: 10,
  },
  textAreaWrapper: {
    position: "relative",
  },
  defaultAddressRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  defaultAddressText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  charCount: {
    position: "absolute",
    bottom: 28,
    right: 12,
    fontSize: 12,
    color: theme.colors.muted,
  },
}));

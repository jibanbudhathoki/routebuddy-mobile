import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { AddressFormData } from "./AddressFormScreen";
import { FormInput } from "./FormInput";

interface AddressFormFieldsProps {
  formData: AddressFormData;
  updateField: (field: keyof AddressFormData, value: string) => void;
  onOpenCityPicker: () => void;
}

export function AddressFormFields({
  formData,
  updateField,
  onOpenCityPicker,
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
      />
      <FormInput
        label="Full Name"
        icon="account-outline"
        placeholder="e.g. John Smith"
        value={formData.fullName}
        onChangeText={(text) => updateField("fullName", text)}
      />
      <FormInput
        label="Address"
        icon="map-marker-outline"
        placeholder="e.g. 123 Main St"
        value={formData.address}
        onChangeText={(text) => updateField("address", text)}
      />
      <FormInput
        label="Apt, Suite, Unit (optional)"
        icon="office-building-outline"
        placeholder="e.g. Unit 5"
        value={formData.aptSuiteUnit}
        onChangeText={(text) => updateField("aptSuiteUnit", text)}
      />
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>City</Text>
        <TouchableOpacity
          style={styles.dropdownContainer}
          activeOpacity={0.7}
          onPress={onOpenCityPicker}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={20}
            color={theme.colors.text}
            style={styles.inputIcon}
          />
          <Text
            style={[
              styles.dropdownText,
              !formData.cityName && styles.dropdownPlaceholder,
            ]}
          >
            {formData.cityName || "Select city"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.text}
            style={styles.dropdownChevron}
          />
        </TouchableOpacity>
      </View>
      <FormInput
        label="Postal Code"
        icon="mailbox-outline"
        placeholder="e.g. M4B 1B3"
        value={formData.postalCode}
        onChangeText={(text) => updateField("postalCode", text)}
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
  charCount: {
    position: "absolute",
    bottom: 28,
    right: 12,
    fontSize: 12,
    color: theme.colors.muted,
  },
}));

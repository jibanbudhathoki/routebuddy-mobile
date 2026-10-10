import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useCities } from "../city/hooks/useCities";
import { City } from "../city/types/city";
import { getTopSafeAreaInset } from "../utils/safeArea";
import { AddressCitySelectionModal } from "./AddressCitySelectionModal";
import { AddressFormFields } from "./AddressFormFields";
import { PrimaryButton } from "./PrimaryButton";

export interface AddressFormData {
  label: string;
  fullName: string;
  address: string;
  aptSuiteUnit: string;
  cityName: string;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  notes: string;
}

interface AddressFormScreenProps {
  onSave: (data: AddressFormData) => void;
  isLoading?: boolean;
}

const EMPTY_ADDRESS: AddressFormData = {
  label: "",
  fullName: "",
  address: "",
  aptSuiteUnit: "",
  cityName: "",
  cityUid: "",
  provinceUid: "",
  postalCode: "",
  notes: "",
};

function useAddressForm() {
  const [formData, setFormData] = useState<AddressFormData>(EMPTY_ADDRESS);
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const { cities, isLoading: isLoadingCities } = useCities();

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const selectCity = (city: City) => {
    setFormData((previous) => ({
      ...previous,
      cityName: city.name,
      cityUid: city.uid,
      provinceUid:
        typeof city.province === "object" ? city.province?.uid || "" : "",
    }));
    setCityModalVisible(false);
  };

  return {
    formData,
    updateField,
    cities,
    isLoadingCities,
    isCityModalVisible,
    openCityModal: () => setCityModalVisible(true),
    closeCityModal: () => setCityModalVisible(false),
    selectCity,
  };
}

function AddressFormHeader({
  topInset,
  onClose,
}: {
  topInset: number;
  onClose: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.header, { marginTop: getTopSafeAreaInset(topInset) }]}>
      <TouchableOpacity style={styles.headerButton} onPress={onClose}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={32}
          color={theme.colors.text}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Add New Address</Text>
      <TouchableOpacity style={styles.headerButton} onPress={onClose}>
        <MaterialCommunityIcons
          name="close"
          size={28}
          color={theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

function AddressFormIntro() {
  return (
    <View style={styles.titleSection}>
      <Text style={styles.title}>
        Enter the address where items should be delivered.
      </Text>
      <Text style={styles.subtitle}>
        Provide as much detail as possible for accurate delivery.
      </Text>
    </View>
  );
}

function AddressFormFooter({
  formData,
  bottomInset,
  isLoading,
  onSave,
}: {
  formData: AddressFormData;
  bottomInset: number;
  isLoading: boolean;
  onSave: () => void;
}) {
  const { theme } = useUnistyles();
  const isSaveDisabled =
    !formData.label ||
    !formData.fullName ||
    !formData.address ||
    !formData.postalCode ||
    !formData.cityUid ||
    isLoading;

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: bottomInset || theme.spacing.md },
      ]}
    >
      <PrimaryButton
        title="Save Address"
        onPress={onSave}
        disabled={isSaveDisabled}
        loading={isLoading}
      />
    </View>
  );
}

export function AddressFormScreen({
  onSave,
  isLoading = false,
}: AddressFormScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    formData,
    updateField,
    cities,
    isLoadingCities,
    isCityModalVisible,
    openCityModal,
    closeCityModal,
    selectCity,
  } = useAddressForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AddressFormHeader
        topInset={insets.top}
        onClose={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AddressFormIntro />
        <AddressFormFields
          formData={formData}
          updateField={updateField}
          onOpenCityPicker={openCityModal}
        />
      </ScrollView>
      <AddressFormFooter
        formData={formData}
        bottomInset={insets.bottom}
        isLoading={isLoading}
        onSave={() => onSave(formData)}
      />
      <AddressCitySelectionModal
        visible={isCityModalVisible}
        topInset={insets.top}
        cities={cities}
        isLoading={isLoadingCities}
        onClose={closeCityModal}
        onSelect={selectCity}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));

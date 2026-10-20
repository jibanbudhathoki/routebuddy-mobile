import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getTopSafeAreaInset } from "../utils/safeArea";
import { AddressLocationSelectionModal } from "./AddressLocationSelectionModal";
import { AddressFormFields } from "./AddressFormFields";
import { PrimaryButton } from "./PrimaryButton";
import { useAddressForm } from "../address/hooks/useAddressForm";
import type { AddressFormData } from "../address/types/addressForm";

export type { AddressFormData } from "../address/types/addressForm";

interface AddressFormScreenProps {
  onSave: (data: AddressFormData) => void;
  isLoading?: boolean;
  initialData?: AddressFormData;
  title?: string;
}

function AddressFormHeader({
  topInset,
  onClose,
  title,
}: {
  topInset: number;
  onClose: () => void;
  title: string;
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
      <Text style={styles.headerTitle}>{title}</Text>
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
  buttonTitle,
}: {
  formData: AddressFormData;
  bottomInset: number;
  isLoading: boolean;
  onSave: () => void;
  buttonTitle: string;
}) {
  const { theme } = useUnistyles();
  const isSaveDisabled =
    !formData.label.trim() ||
    !formData.fullName.trim() ||
    !formData.address.trim() ||
    !formData.postalCode.trim() ||
    !formData.cityUid ||
    !formData.provinceUid ||
    !formData.countryUid ||
    formData.label.trim().length > 50 ||
    formData.fullName.trim().length > 100 ||
    formData.address.trim().length > 200 ||
    formData.aptSuiteUnit.trim().length > 100 ||
    formData.postalCode.trim().length < 3 ||
    formData.postalCode.trim().length > 20 ||
    formData.phone.trim().length > 20 ||
    formData.notes.trim().length > 150 ||
    isLoading;

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: bottomInset || theme.spacing.md },
      ]}
    >
      <PrimaryButton
        title={buttonTitle}
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
  initialData,
  title = "Add New Address",
}: AddressFormScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    formData,
    updateField,
    cities,
    countries,
    provinces,
    selectionType,
    setSelectionType,
    isLoadingCountries,
    isLoadingProvinces,
    isLoadingCities,
    isLoadingOptions,
    selectLocation,
  } = useAddressForm(initialData);

  return (
    <View style={styles.container}>
      <AddressFormHeader
        topInset={insets.top}
        onClose={() => router.back()}
        title={title}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AddressFormIntro />
        <AddressFormFields
          formData={formData}
          updateField={updateField}
          onSelectCountry={() =>
            !isLoadingCountries && setSelectionType("country")
          }
          onSelectProvince={() =>
            formData.countryUid &&
            !isLoadingProvinces &&
            setSelectionType("province")
          }
          onSelectCity={() =>
            formData.provinceUid &&
            !isLoadingCities &&
            setSelectionType("city")
          }
        />
      </ScrollView>
      <AddressFormFooter
        formData={formData}
        bottomInset={insets.bottom}
        isLoading={isLoading}
        onSave={() => onSave(formData)}
        buttonTitle={initialData ? "Update Address" : "Save Address"}
      />
      <AddressLocationSelectionModal
        visible={selectionType !== null}
        topInset={insets.top}
        title={
          selectionType === "country"
            ? "Select Country"
            : selectionType === "province"
              ? "Select Province"
              : "Select City"
        }
        options={
          selectionType === "country"
            ? countries
            : selectionType === "province"
              ? provinces
              : cities
        }
        isLoading={isLoadingOptions}
        onClose={() => setSelectionType(null)}
        onSelect={selectLocation}
      />
    </View>
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

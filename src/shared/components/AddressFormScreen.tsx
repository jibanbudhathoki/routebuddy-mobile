import React, { useEffect, useState } from "react";
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
import { cityService } from "../city/services/city.service";
import { getTopSafeAreaInset } from "../utils/safeArea";
import { AddressLocationSelectionModal } from "./AddressLocationSelectionModal";
import { AddressFormFields } from "./AddressFormFields";
import { PrimaryButton } from "./PrimaryButton";
import { useToast } from "./ToastProvider";
import { locationService } from "../location/services/location.service";
import type { LocationOption } from "../location/types/location";

export interface AddressFormData {
  label: string;
  fullName: string;
  address: string;
  aptSuiteUnit: string;
  cityName: string;
  cityUid: string;
  provinceUid: string;
  provinceName: string;
  countryUid: string;
  countryName: string;
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
  provinceName: "",
  countryUid: "",
  countryName: "",
  postalCode: "",
  notes: "",
};

function useAddressForm() {
  const [formData, setFormData] = useState<AddressFormData>(EMPTY_ADDRESS);
  const [selectionType, setSelectionType] = useState<
    "country" | "province" | "city" | null
  >(null);
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isActive = true;
    locationService
      .getCountries()
      .then((items) => {
        if (isActive) {
          setCountries(items.map(({ uid, name, code }) => ({
            uid,
            name,
            subtitle: code,
          })));
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error
              ? error.message
              : "Unable to load countries.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingCountries(false);
      });

    return () => {
      isActive = false;
    };
  }, [showToast]);

  useEffect(() => {
    if (!formData.countryUid) {
      setProvinces([]);
      return;
    }

    let isActive = true;
    setIsLoadingProvinces(true);
    locationService
      .getProvinces(formData.countryUid)
      .then((items) => {
        if (isActive) {
          setProvinces(items.map(({ uid, name, code }) => ({
            uid,
            name,
            subtitle: code,
          })));
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error
              ? error.message
              : "Unable to load provinces.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingProvinces(false);
      });

    return () => {
      isActive = false;
    };
  }, [formData.countryUid, showToast]);

  useEffect(() => {
    if (!formData.provinceUid) {
      setCities([]);
      return;
    }

    let isActive = true;
    setIsLoadingCities(true);
    cityService
      .getCities({ provinceUid: formData.provinceUid, page: 1, limit: 100 })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The cities response did not include a valid list.");
        }
        if (isActive) {
          setCities(response.data.map(({ uid, name }) => ({ uid, name })));
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error ? error.message : "Unable to load cities.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingCities(false);
      });

    return () => {
      isActive = false;
    };
  }, [formData.provinceUid, showToast]);

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const selectLocation = (option: LocationOption) => {
    if (selectionType === "country") {
      setFormData((previous) => ({
        ...previous,
        countryUid: option.uid,
        countryName: option.name,
        provinceUid: "",
        provinceName: "",
        cityUid: "",
        cityName: "",
      }));
    } else if (selectionType === "province") {
      setFormData((previous) => ({
        ...previous,
        provinceUid: option.uid,
        provinceName: option.name,
        cityUid: "",
        cityName: "",
      }));
    } else if (selectionType === "city") {
      setFormData((previous) => ({
        ...previous,
        cityUid: option.uid,
        cityName: option.name,
      }));
    }
    setSelectionType(null);
  };

  return {
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
    isLoadingOptions:
      selectionType === "country"
        ? isLoadingCountries
        : selectionType === "province"
          ? isLoadingProvinces
          : isLoadingCities,
    selectLocation,
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
    countries,
    provinces,
    selectionType,
    setSelectionType,
    isLoadingCountries,
    isLoadingProvinces,
    isLoadingCities,
    isLoadingOptions,
    selectLocation,
  } = useAddressForm();

  return (
    <View style={styles.container}>
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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AddressLocationSelectionModal } from "../../../shared/components/AddressLocationSelectionModal";
import type { LocationOption } from "../../../shared/location/types/location";
import type { useCommunitySubmissionForm } from "../hooks/useCommunitySubmissionForm";

type FormState = ReturnType<typeof useCommunitySubmissionForm>;

interface CommunityLocationFieldsProps {
  form: FormState;
  topInset: number;
}

export function CommunityLocationFields({
  form,
  topInset,
}: CommunityLocationFieldsProps) {
  const { theme } = useUnistyles();
  const countryOptions = form.countries.map((country): LocationOption => ({
    uid: country.uid,
    name: country.name,
    subtitle: country.code,
  }));
  const provinceOptions = form.provinces.map((province): LocationOption => ({
    uid: province.uid,
    name: province.name,
    subtitle: province.code,
  }));
  const cityOptions = form.cities.map((city): LocationOption => ({
    uid: city.uid,
    name: city.name,
    subtitle:
      typeof city.province === "string" ? city.province : city.province?.name,
  }));
  const options =
    form.selection === "country"
      ? countryOptions
      : form.selection === "province"
        ? provinceOptions
        : cityOptions;
  const loading =
    form.selection === "country"
      ? form.loadingCountry
      : form.selection === "province"
        ? form.loadingProvince
        : form.loadingCity;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Community location</Text>
      <LocationButton
        label="Country"
        value={form.countryName}
        placeholder="Select country"
        loading={form.loadingCountry}
        onPress={() => form.setSelection("country")}
      />
      <LocationButton
        label="Province"
        value={form.provinceName}
        placeholder="Select province"
        loading={form.loadingProvince}
        disabled={!form.countryUid || form.loadingProvince}
        error={form.errors.provinceUid}
        onPress={() => form.setSelection("province")}
      />
      <LocationButton
        label="City"
        value={form.cityName}
        placeholder="Select city"
        loading={form.loadingCity}
        disabled={!form.provinceUid || form.loadingCity}
        error={form.errors.cityUid}
        onPress={() => form.setSelection("city")}
      />
      {form.locationError ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{form.locationError}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => void form.retryLocations()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <AddressLocationSelectionModal
        visible={form.selection !== null}
        topInset={topInset}
        title={
          form.selection === "country"
            ? "Select country"
            : form.selection === "province"
              ? "Select province"
              : "Select city"
        }
        options={options}
        isLoading={loading}
        onClose={() => form.setSelection(null)}
        onSelect={(option) => form.selectLocation(option.uid, option.name)}
      />
    </View>
  );
}

function LocationButton({
  label,
  value,
  placeholder,
  loading,
  disabled = false,
  error,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  loading: boolean;
  disabled?: boolean;
  error?: string;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ disabled, busy: loading }}
        disabled={disabled}
        onPress={onPress}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Text
          numberOfLines={1}
          style={[styles.value, !value && styles.placeholder]}
        >
          {value || placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={theme.colors.muted}
          />
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.md,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  field: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
  },
  value: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
  },
  placeholder: {
    color: theme.colors.muted,
  },
  disabled: {
    opacity: 0.55,
  },
  errorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    flex: 1,
    fontSize: 12,
  },
  retryButton: {
    padding: theme.spacing.xs,
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
}));

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Address } from "../../../shared/address/types/address";

interface BuildTripOrderAddressSectionProps {
  isLoading: boolean;
  error: string;
  selectedAddress?: Address;
  onRetry: () => void;
  onChooseAddress: () => void;
  onAddAddress: () => void;
}

export function BuildTripOrderAddressSection({
  isLoading,
  error,
  selectedAddress,
  onRetry,
  onChooseAddress,
  onAddAddress,
}: BuildTripOrderAddressSectionProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      {isLoading ? (
        <ActivityIndicator
          color={theme.colors.primary}
          style={styles.addressLoading}
        />
      ) : error ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : selectedAddress ? (
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.addressCard}
          onPress={onChooseAddress}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={22}
            color={theme.colors.primary}
          />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>{selectedAddress.label}</Text>
            <Text style={styles.addressText}>
              {formatAddress(selectedAddress)}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color={theme.colors.muted}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>
            Add a saved address to continue with this order.
          </Text>
          <TouchableOpacity accessibilityRole="button" onPress={onAddAddress}>
            <Text style={styles.retryText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function formatAddress(address: Address) {
  return [
    address.line1,
    address.line2,
    address.city.name,
    address.province.name,
    address.postalCode,
    address.country.name,
  ]
    .filter(Boolean)
    .join(", ");
}

const styles = StyleSheet.create((theme) => ({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  addressLoading: {
    marginVertical: theme.spacing.md,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    padding: theme.spacing.xs,
  },
  addressCard: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  addressDetails: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  addressTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  addressText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
}));

import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useAddresses } from "../../../shared/address/hooks/useAddresses";
import type { Address } from "../../../shared/address/types/address";

export function SavedAddressesScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { addresses, isLoading, error, refetch, deleteAddress, updateAddress } =
    useAddresses();
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const confirmDelete = (address: Address) => {
    Alert.alert("Delete address?", `Remove "${address.label}" from your saved addresses?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusyUid(address.uid);
          try {
            await deleteAddress(address.uid);
          } catch (deleteError: unknown) {
            Alert.alert(
              "Unable to delete address",
              deleteError instanceof Error ? deleteError.message : "Please try again.",
            );
          } finally {
            setBusyUid(null);
          }
        },
      },
    ]);
  };

  const makeDefault = async (address: Address) => {
    setBusyUid(address.uid);
    try {
      await updateAddress(address.uid, { isDefault: true });
      await refetch();
    } catch (updateError: unknown) {
      Alert.alert(
        "Unable to update address",
        updateError instanceof Error ? updateError.message : "Please try again.",
      );
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Addresses</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Manage delivery addresses for your RouteBuddy orders.
        </Text>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.loading} />
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity onPress={() => void refetch()}>
              <Text style={styles.actionText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialCommunityIcons
              name="map-marker-plus-outline"
              size={32}
              color={theme.colors.muted}
            />
            <Text style={styles.stateText}>You haven’t saved an address yet.</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.uid} style={styles.card}>
              <View style={styles.cardHeading}>
                <View style={styles.labelRow}>
                  <MaterialCommunityIcons
                    name={address.isDefault ? "home" : "map-marker-outline"}
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault ? (
                    <Text style={styles.defaultBadge}>Default</Text>
                  ) : null}
                </View>
                {busyUid === address.uid ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : null}
              </View>
              <Text style={styles.recipient}>{address.recipientName}</Text>
              <Text style={styles.addressText}>
                {[
                  address.line1,
                  address.line2,
                  address.city?.name,
                  address.province?.name,
                  address.postalCode,
                  address.country?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
              {address.phone ? <Text style={styles.addressText}>{address.phone}</Text> : null}
              <View style={styles.actions}>
                {!address.isDefault ? (
                  <TouchableOpacity
                    disabled={busyUid !== null}
                    onPress={() => void makeDefault(address)}
                  >
                    <Text style={styles.actionText}>Set default</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  disabled={busyUid !== null}
                  onPress={() =>
                    router.push(`/(modals)/profile-address/${encodeURIComponent(address.uid)}`)
                  }
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={busyUid !== null}
                  onPress={() => confirmDelete(address)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.addButton}
          onPress={() => router.push("/(modals)/profile-address")}
        >
          <MaterialCommunityIcons name="plus" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.addButtonText}>Add address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButton: { alignItems: "center", justifyContent: "center", minWidth: 40 },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: "700" },
  content: { gap: theme.spacing.md, padding: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  subtitle: { color: theme.colors.muted, fontSize: 14, marginBottom: theme.spacing.xs },
  loading: { margin: theme.spacing.xl },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateText: { color: theme.colors.muted, fontSize: 14, textAlign: "center" },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  cardHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  labelRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing.xs },
  addressLabel: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  defaultBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    color: theme.colors.primary,
    fontSize: 11,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  recipient: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  addressText: { color: theme.colors.muted, fontSize: 13, lineHeight: 19 },
  actions: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
  },
  actionText: { color: theme.colors.primary, fontSize: 14, fontWeight: "600" },
  deleteText: { color: theme.colors.error, fontSize: 14, fontWeight: "600" },
  addButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    marginTop: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  addButtonText: { color: theme.colors.onPrimary, fontSize: 15, fontWeight: "700" },
}));

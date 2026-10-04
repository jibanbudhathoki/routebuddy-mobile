import React, { useState } from "react";
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

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { AddRequestItemModal } from "../components/AddRequestItemModal";
import { RequestItemsEditor } from "../components/RequestItemsEditor";
import { RequestTripPreviewCard } from "../components/RequestTripPreviewCard";
import { useRequestCreation } from "../context/RequestCreationContext";
import type { RequestItem } from "../types/request";

export function BuildShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData, updateRequestData } = useRequestCreation();
  const { stores } = useStores({ limit: 100 });
  const { cities } = useCities();

  const [items, setItems] = useState<RequestItem[]>(requestData.items || []);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const selectedStores = stores.filter((store) =>
    requestData.stores?.includes(store.uid),
  );
  const selectedStore = selectedStores[0];
  const storeName = selectedStore
    ? selectedStores.length > 1
      ? `${selectedStore.name} + ${selectedStores.length - 1} more`
      : selectedStore.name
    : "Select a store";
  const destinationCity = cities.find(
    (city) => city.uid === requestData.deliveryCityUid,
  );
  const destinationProvince =
    typeof destinationCity?.province === "string"
      ? destinationCity.province
      : destinationCity?.province?.name;
  const routeText = [
    selectedStore?.city?.name || "Origin",
    destinationCity?.name
      ? `${destinationCity.name}${destinationProvince ? `, ${destinationProvince}` : ""}`
      : "Destination",
  ].join(" → ");

  const handleAddItem = (newItem: Omit<RequestItem, "id">) => {
    const item: RequestItem = {
      ...newItem,
      id: `${Date.now()}-${Math.random()}`,
    };
    setItems((currentItems) => [...currentItems, item]);
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  const handleContinue = () => {
    updateRequestData({ items });
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: getTopSafeAreaInset(insets.top),
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Shopping List</Text>
        <View style={styles.headerButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={28}
            color={theme.colors.primary}
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RequestTripPreviewCard
          storeName={storeName}
          storeLogoText={
            selectedStore?.name.split(/\s+/)[0]?.toUpperCase() || "STORE"
          }
          storeLogoSubText={
            selectedStore?.name.split(/\s+/).slice(1).join(" ").toUpperCase() ||
            ""
          }
          routeText={routeText}
          neededBy={requestData.dayNeeded}
          latestDeliveryTime={requestData.latestDeliveryTime}
        />

        <RequestItemsEditor
          items={items}
          onRemoveItem={handleRemoveItem}
          onAddItem={() => setIsAddingItem(true)}
        />
      </ScrollView>

      {!isAddingItem && (
        <View style={styles.footer}>
          <PrimaryButton title="Continue" onPress={handleContinue} />
        </View>
      )}

      <AddRequestItemModal
        visible={isAddingItem}
        onClose={() => setIsAddingItem(false)}
        onAddItem={handleAddItem}
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
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  notificationText: {
    color: theme.colors.onPrimary,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));

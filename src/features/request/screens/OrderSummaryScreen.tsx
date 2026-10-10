import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { OrderSummaryEstimateCard } from "../components/OrderSummaryEstimateCard";
import { OrderSummaryItemsList } from "../components/OrderSummaryItemsList";
import { OrderSummaryTripCard } from "../components/OrderSummaryTripCard";
import { useRequestCreation } from "../context/RequestCreationContext";
import { useCreateRequest } from "../hooks/useRequests";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";

export function OrderSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData, updateRequestData } = useRequestCreation();
  const { createRequest, isLoading: isCreatingRequest } = useCreateRequest();
  const items = requestData.items || [];
  const estimate = calculateEstimate(items);

  const handleContinue = async () => {
    try {
      const payload = {
        stores: requestData.stores || [],
        items: (requestData.items || []).map((item) => ({
          item: item.name,
          description: item.description,
          estimatePrice: parseFloat(item.estimatedPrice) || 0,
        })),
        deliveryAddress: requestData.deliveryAddress || "",
        deliveryCityUid: requestData.deliveryCityUid || "",
        neededBy: requestData.dayNeeded || new Date().toISOString(),
        latestDeliveryBy:
          requestData.latestDeliveryTime || new Date().toISOString(),
        notes: requestData.itemsInstructions || "",
      };
      const response: any = await createRequest(payload);

      if (response?.data?.status === "pending") {
        router.push({
          pathname: "/(modals)/request/checkout",
          params: { postId: response.data.postId },
        });
      } else if (response?.success || response?.data?.status === "open") {
        router.push("/(modals)/request/payment-success");
      } else {
        throw new Error(response?.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  const handleRemoveItem = (id: string) => {
    updateRequestData({
      items: items.filter((item) => item.id !== id),
    });
  };

  const { stores } = useStores({ limit: 100 });
  const { cities } = useCities();
  const selectedStore = stores.find((store) =>
    requestData.stores?.includes(store.uid),
  );
  const storeName = selectedStore?.name || "Unknown Store";
  const storeNameParts = storeName.split(" ");
  const storeLogoText = storeNameParts[0]?.toUpperCase() || "STORE";
  const storeLogoSubText = storeNameParts.slice(1).join(" ").toUpperCase();
  const originCity = cities.find(
    (city) => city.uid === selectedStore?.cityUid,
  );
  const destinationCity = cities.find(
    (city) => city.uid === requestData.deliveryCityUid,
  );
  const routeText = `${originCity?.name || "Origin"}, ${originCity?.provinceCode || ""}  →  ${destinationCity?.name || "Destination"}, ${destinationCity?.provinceCode || ""}`;

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
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Items</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View>
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color={theme.colors.primary}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Review your items and estimated total before continuing.
        </Text>
        <OrderSummaryTripCard
          storeName={storeName}
          storeLogoText={storeLogoText}
          storeLogoSubText={storeLogoSubText}
          routeText={routeText}
          neededBy={requestData.dayNeeded}
          latestDeliveryTime={requestData.latestDeliveryTime}
        />
        <OrderSummaryItemsList
          items={items}
          onRemoveItem={handleRemoveItem}
          onAddAnother={() =>
            router.push("/(modals)/request/build-shopping-list")
          }
        />
        <OrderSummaryEstimateCard
          estimate={estimate}
          itemCount={items.length}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Publish Request"
          onPress={handleContinue}
          loading={isCreatingRequest}
          disabled={isCreatingRequest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    height: 18,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 18,
  },
  notificationText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.primary,
    fontSize: 14,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  footer: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
}));

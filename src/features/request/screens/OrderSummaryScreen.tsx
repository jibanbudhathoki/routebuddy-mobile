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
import { useToast } from "../../../shared/components/ToastProvider";
import { validateOpenRequest } from "../validations/openRequest";
import { NotificationBellButton } from "../../../shared/components/NotificationBellButton";
import { useUnreadNotificationCount } from "../../notifications/hooks/useNotifications";

export function OrderSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const unreadCount = useUnreadNotificationCount();
  const { showToast } = useToast();
  const { requestData, updateRequestData } = useRequestCreation();
  const { createRequest, isLoading: isCreatingRequest } = useCreateRequest();
  const items = requestData.items || [];
  const estimate = calculateEstimate(items);

  const handleContinue = async () => {
    const validation = validateOpenRequest({
      stores: requestData.stores ?? [],
      items: (requestData.items ?? []).map((item) => ({
        item: item.name,
        description: item.description ?? "",
        estimatePrice:
          typeof item.estimatedPrice === "string" &&
          item.estimatedPrice.trim()
          ? Number(item.estimatedPrice)
          : Number.NaN,
      })),
      deliveryAddress: requestData.deliveryAddress ?? "",
      deliveryCityUid: requestData.deliveryCityUid ?? "",
      neededBy: requestData.dayNeeded ?? "",
      latestDeliveryBy: requestData.latestDeliveryTime ?? "",
      notes: requestData.itemsInstructions ?? "",
    });
    if (!validation.isValid) {
      showToast(validation.error);
      return;
    }

    try {
      const response = await createRequest(validation.data);

      if (response?.data?.status === "pending") {
        router.push({
          pathname: "/(modals)/request/checkout",
          params: { postId: response.data.postId, clearRequestDraft: "true" },
        });
      } else if (response.data.status === "open") {
        router.push({
          pathname: "/(modals)/request/payment-success",
          params: {
            resultType: "request-published",
            clearRequestDraft: "true",
          },
        });
      } else {
        showToast(response.message || "Failed to create request.");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create request.",
      );
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
  const originCity = selectedStore?.city;
  const destinationCity = cities.find(
    (city) => city.uid === requestData.deliveryCityUid,
  );
  const originProvince = selectedStore?.province?.name;
  const routeText = `${originCity?.name || "Origin"}${originProvince ? `, ${originProvince}` : ""}  →  ${destinationCity?.name || "Destination"}`;

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
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={() => router.push("/notifications")}
        />
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

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { PaymentSuccessDetails } from "../components/PaymentSuccessDetails";
import { useCreateOrderConversation } from "../../messages/hooks/useCreateOrderConversation";
import { useRequestCreation } from "../../request/context/RequestCreationContext";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";

export function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderUid: routeOrderUid } =
    useLocalSearchParams<{ orderUid?: string }>();
  const orderUid = typeof routeOrderUid === "string" ? routeOrderUid : "";
  const { theme } = useUnistyles();
  const {
    requestData,
    tripOrderConversation,
    setTripOrderConversation,
  } = useRequestCreation();
  const {
    mutateAsync: createOrderConversation,
    isPending: isCreatingConversation,
  } = useCreateOrderConversation();
  const [conversationError, setConversationError] = useState("");
  const conversationAttempted = useRef(false);

  const items = requestData.items || [];
  const { subtotal, serviceFee, taxes, total } = calculateEstimate(items);
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
  const routeText = `${originCity?.name || "Origin"}${formatProvince(selectedStore?.province)} → ${destinationCity?.name || "Destination"}${formatProvince(destinationCity?.province)}`;

  const startDriverConversation = useCallback(async () => {
    if (!tripOrderConversation) return;
    if (tripOrderConversation.orderUid !== orderUid) {
      setTripOrderConversation(null);
      return;
    }

    const itemLines = tripOrderConversation.items.map((item) => {
      const description = item.description ? ` (${item.description})` : "";
      const price = Number(item.estimatedPrice);
      const priceText = Number.isFinite(price) ? ` — $${price.toFixed(2)}` : "";
      return `• ${item.name}${description}${priceText}`;
    });
    const message = [
      `Payment successful for order ${tripOrderConversation.orderUid}.`,
      "",
      "Shopping list:",
      ...itemLines,
      "",
      `Estimated total: $${tripOrderConversation.total} CAD`,
    ].join("\n");

    try {
      await createOrderConversation({
        tripId: tripOrderConversation.tripUid,
        requestId: tripOrderConversation.orderUid,
        driverUid: tripOrderConversation.driverUid,
        message,
      });
      setConversationError("");
      setTripOrderConversation(null);
    } catch (error) {
      setConversationError(
        error instanceof Error
          ? error.message
          : "Unable to notify the driver. Please try again.",
      );
    }
  }, [
    createOrderConversation,
    orderUid,
    setTripOrderConversation,
    tripOrderConversation,
  ]);

  useEffect(() => {
    if (!tripOrderConversation || conversationAttempted.current) return;
    if (tripOrderConversation.orderUid !== orderUid) {
      setTripOrderConversation(null);
      return;
    }
    conversationAttempted.current = true;
    void startDriverConversation();
  }, [
    orderUid,
    setTripOrderConversation,
    startDriverConversation,
    tripOrderConversation,
  ]);

  const retryDriverConversation = () => {
    conversationAttempted.current = true;
    void startDriverConversation();
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
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close payment confirmation"
          style={styles.headerButton}
          onPress={() => router.dismissAll()}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PaymentSuccessDetails
          storeName={storeName}
          storeLogoText={storeLogoText}
          storeLogoSubText={storeLogoSubText}
          routeText={routeText}
          neededBy={requestData.dayNeeded}
          latestDeliveryTime={requestData.latestDeliveryTime}
          itemCount={items.length}
          subtotal={subtotal}
          serviceFee={serviceFee}
          taxes={taxes}
          total={total}
          conversationError={conversationError}
          isCreatingConversation={isCreatingConversation}
          onRetryConversation={retryDriverConversation}
          onGoHome={() => router.dismissAll()}
        />
      </ScrollView>
    </View>
  );
}

function formatProvince(province?: string | { name: string }) {
  const name = typeof province === "string" ? province : province?.name;
  return name ? `, ${name}` : "";
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
  headerSpacer: {
    width: 40,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
}));

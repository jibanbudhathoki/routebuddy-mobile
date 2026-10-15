import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { PaymentSuccessDetails } from "../components/PaymentSuccessDetails";
import { useCreateOrderConversation } from "../../messages/hooks/useCreateOrderConversation";
import { useRequestCreation } from "../../request/context/RequestCreationContext";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { createTripOrderMessage } from "../../messages/utils/requestOfferMessage";

export function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderUid: routeOrderUid } =
    useLocalSearchParams<{ orderUid?: string }>();
  const orderUid = typeof routeOrderUid === "string" ? routeOrderUid : "";
  const { resultType, clearRequestDraft } = useLocalSearchParams<{
    resultType?: string;
    clearRequestDraft?: string;
  }>();
  const isRequestPublished = resultType === "request-published";
  const shouldClearRequestDraft = clearRequestDraft === "true";
  const { theme } = useUnistyles();
  const {
    requestData,
    tripOrderConversation,
    setTripOrderConversation,
    resetRequestData,
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
      const priceText = Number.isFinite(price) ? ` — $${formatCurrency(price)}` : "";
      return `• ${item.name}${description}${priceText}`;
    });
    const paymentMessage = [
      "NEW PAID SHOPPING ORDER",
      "",
      `Status: Awaiting driver acceptance`,
      `Trip: ${tripOrderConversation.origin} → ${tripOrderConversation.destination}`,
      `Store${tripOrderConversation.storeNames.length === 1 ? "" : "s"}: ${tripOrderConversation.storeNames.join(", ") || "Not specified"}`,
      `Deliver to: ${tripOrderConversation.deliveryCity}${tripOrderConversation.deliveryProvince ? `, ${tripOrderConversation.deliveryProvince}` : ""}`,
      `Needed by: ${formatDateTime(tripOrderConversation.neededBy)}`,
      `Latest delivery: ${formatDateTime(tripOrderConversation.latestDeliveryBy)}`,
      "",
      "Shopping list:",
      ...(itemLines.length ? itemLines : ["• No items listed"]),
      tripOrderConversation.notes.trim()
        ? `\nRequester notes: ${tripOrderConversation.notes.trim()}`
        : "",
      "",
      "Payment breakdown:",
      `• Items subtotal: $${formatCurrency(tripOrderConversation.itemSubtotal)} CAD`,
      `• Service fee: $${formatCurrency(tripOrderConversation.serviceFee)} CAD`,
      `• Driver fee: $${formatCurrency(tripOrderConversation.driverFee)} CAD`,
      `• Platform fee: $${formatCurrency(tripOrderConversation.platformFee)} CAD`,
      `• Tax: $${formatCurrency(tripOrderConversation.tax)} CAD`,
      `• Total paid: $${formatCurrency(tripOrderConversation.total)} CAD`,
      "",
      "Payment is secured. Please review the list and accept or reject the order.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await createOrderConversation({
        tripId: tripOrderConversation.tripUid,
        requestId: tripOrderConversation.orderUid,
        driverUid: tripOrderConversation.driverUid,
        message: createTripOrderMessage(
          tripOrderConversation.orderUid,
          tripOrderConversation.driverUid,
          paymentMessage,
        ),
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

  const handleGoHome = useCallback(() => {
    if (shouldClearRequestDraft) resetRequestData();
    router.dismissAll();
  }, [resetRequestData, router, shouldClearRequestDraft]);

  useEffect(() => {
    if (!shouldClearRequestDraft) return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleGoHome();
        return true;
      },
    );
    return () => subscription.remove();
  }, [handleGoHome, shouldClearRequestDraft]);

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
          onPress={handleGoHome}
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
          isRequestPublished={isRequestPublished}
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
          onGoHome={handleGoHome}
        />
      </ScrollView>
    </View>
  );
}

function formatProvince(province?: string | { name: string }) {
  const name = typeof province === "string" ? province : province?.name;
  return name ? `, ${name}` : "";
}

function formatCurrency(value: string | number) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : "Not available";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
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

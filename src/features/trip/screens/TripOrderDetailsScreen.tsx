import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { RequestStatusOptionsSheet } from "../../request/components/RequestStatusOptionsSheet";
import type { RequestDeliveryStatus } from "../../request/types/request";
import { useUpdateRequestStatus } from "../../request/hooks/useUpdateRequestStatus";
import { styles } from "../components/tripOrderDetailsScreen.styles";
import { TripOrderDetailsContent } from "../components/TripOrderDetailsContent";
import { useRequestDetails } from "../../request/hooks/useRequestDetails";

export function TripOrderDetailsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const [showOptions, setShowOptions] = useState(false);
  const params = useLocalSearchParams<{ uid?: string }>();
  const orderUid = typeof params.uid === "string" ? params.uid : "";
  const updateStatus = useUpdateRequestStatus(orderUid);
  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useRequestDetails(orderUid);

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Order options"
            accessibilityState={{ disabled: !order }}
            disabled={!order}
            onPress={() => setShowOptions(true)}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={22}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.stateText}>Loading order details...</Text>
          </View>
        ) : error || !order ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>Order details unavailable</Text>
            <Text style={styles.stateText}>
              {error?.message ??
                (orderUid
                  ? "This order could not be found."
                  : "Order ID is missing.")}
            </Text>
            {orderUid ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => refetch()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <TripOrderDetailsContent order={order} />
        )}
      </View>
      <RequestStatusOptionsSheet
        visible={showOptions}
        currentStatus={order?.status ?? ""}
        isUpdating={updateStatus.isPending}
        pendingStatus={updateStatus.variables}
        onClose={() => setShowOptions(false)}
        onSelectStatus={handleStatusUpdate}
      />
    </AppScreen>
  );

  function handleStatusUpdate(status: RequestDeliveryStatus) {
    if (!orderUid || updateStatus.isPending) return;
    updateStatus.mutate(status, {
      onSuccess: () => {
        setShowOptions(false);
        showToast(`Request status updated to ${status}.`, {
          variant: "success",
        });
      },
      onError: (failure) => {
        showToast(
          failure instanceof Error
            ? failure.message
            : "Unable to update request status.",
        );
      },
    });
  }
}

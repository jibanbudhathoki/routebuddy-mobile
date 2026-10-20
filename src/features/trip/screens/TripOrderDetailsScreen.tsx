import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useUnistyles } from "react-native-unistyles";
import { useQueryClient } from "@tanstack/react-query";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { useCreateConversation } from "../../messages/hooks/useMessages";
import { messageService } from "../../messages/services/messageService";
import { RequestDeliveryProofSheet } from "../../request/components/RequestDeliveryProofSheet";
import { RequestStatusOptionsSheet } from "../../request/components/RequestStatusOptionsSheet";
import type {
  RequestAction,
  RequestDeliveryStatus,
} from "../../request/types/request";
import { useRespondToTripOrder } from "../../request/hooks/useRequestOffers";
import { useUpdateRequestStatus } from "../../request/hooks/useUpdateRequestStatus";
import { styles } from "../components/tripOrderDetailsScreen.styles";
import { TripOrderDetailsContent } from "../components/TripOrderDetailsContent";
import { useRequestDetails } from "../../request/hooks/useRequestDetails";
import { tripOrderKeys } from "../hooks/useTripOrders";
import { useSubmitTripOrderDeliveryProof } from "../hooks/useSubmitTripOrderDeliveryProof";

export function TripOrderDetailsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showOptions, setShowOptions] = useState(false);
  const [showProofSheet, setShowProofSheet] = useState(false);
  const params = useLocalSearchParams<{ uid?: string }>();
  const orderUid = typeof params.uid === "string" ? params.uid : "";
  const updateStatus = useUpdateRequestStatus(orderUid);
  const respondToOrder = useRespondToTripOrder();
  const createConversation = useCreateConversation();
  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useRequestDetails(orderUid);
  const deliveryProof = useSubmitTripOrderDeliveryProof(orderUid, order);

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
            onPress={() => {
              if (
                order?.status.toLowerCase() === "delivered" &&
                deliveryProof.hasPendingProof
              ) {
                setShowProofSheet(true);
                return;
              }
              setShowOptions(true);
            }}
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
            <ActivityIndicator color={theme.colors.text} />
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
        respondingAction={
          respondToOrder.isPending ? respondToOrder.variables?.action : undefined
        }
        pendingStatus={updateStatus.variables}
        onClose={() => setShowOptions(false)}
        onSelectStatus={handleStatusUpdate}
        onRespondToOrder={handleOrderResponse}
      />
      <RequestDeliveryProofSheet
        visible={showProofSheet}
        submissionState={deliveryProof.submissionState}
        preparedPhotoCount={deliveryProof.preparedPhotoCount}
        isSubmitting={deliveryProof.isSubmitting}
        onClose={() => setShowProofSheet(false)}
        onSubmit={async (photos, note) => {
          await deliveryProof.submit(photos, note);
          setShowProofSheet(false);
          showToast("Delivery proof was sent to the requester.", {
            variant: "success",
          });
        }}
      />
    </AppScreen>
  );

  async function handleStatusUpdate(status: RequestDeliveryStatus) {
    if (!orderUid || updateStatus.isPending) return;
    if (status === "delivered") {
      setShowOptions(false);
      setShowProofSheet(true);
      return;
    }
    const previousStatus = order?.status.toLowerCase();
    try {
      const updatedRequest = await updateStatus.mutateAsync(status);
      setShowOptions(false);
      const tripUid = updatedRequest.trip?.uid ?? order?.trip?.uid;
      if (tripUid) {
        await queryClient.invalidateQueries({
          queryKey: tripOrderKeys.byTrip(tripUid),
        });
      }

      if (previousStatus !== status) {
        try {
          const conversation = await createConversation.mutateAsync({
            requestId: updatedRequest.uid,
            tripId: updatedRequest.trip?.uid,
            userId: updatedRequest.requester.uid,
          });
          await messageService.sendMessage(conversation.id, {
            content: `The driver updated the request status to ${formatStatus(status)}.`,
            type: "text",
          });
          await queryClient.invalidateQueries({
            queryKey: ["messages"],
          });
          showToast(
            `Status updated to ${formatStatus(status)} and shared in chat.`,
            { variant: "success" },
          );
        } catch (messageFailure) {
          showToast(
            messageFailure instanceof Error
              ? `Status was updated, but the chat message could not be sent: ${messageFailure.message}`
              : "Status was updated, but the chat message could not be sent.",
          );
        }
      } else {
        showToast(`Request status is already ${formatStatus(status)}.`, {
          variant: "success",
        });
      }
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to update request status.",
      );
    }
  }

  async function handleOrderResponse(action: RequestAction) {
    if (!orderUid || respondToOrder.isPending) return;
    try {
      await respondToOrder.mutateAsync({ orderUid, action });
      setShowOptions(false);
      showToast(
        action === "accept" ? "Order accepted." : "Order rejected.",
        { variant: "success" },
      );
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : `Unable to ${action} this order.`,
      );
    }
  }
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}

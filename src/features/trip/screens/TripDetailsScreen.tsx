import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  Share,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { Button } from "../../../shared/components/Button";
import { useToast } from "../../../shared/components/ToastProvider";
import { styles } from "../components/tripDetailsScreen.styles";
import { DeleteTripConfirmationModal } from "../components/DeleteTripConfirmationModal";
import { TripDetailsContent } from "../components/TripDetailsContent";
import {
  TripOptionsSheet,
  type TripOptionAction,
} from "../components/TripOptionsSheet";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import { useTripDetails } from "../hooks/useTripDetails";
import { useToggleTripOrders } from "../hooks/useToggleTripOrders";
import { useUpdateTripStatus } from "../hooks/useUpdateTripStatus";
import type { TripStatus } from "../types/trip";

export function TripDetailsScreen() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const tripUid = typeof uid === "string" ? uid : "";
  const deleteTripMutation = useDeleteTrip();
  const toggleTripOrders = useToggleTripOrders();
  const updateTripStatus = useUpdateTripStatus();
  const { data: trip, error, isLoading, refetch } = useTripDetails(tripUid);

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trip options"
            accessibilityState={{ disabled: !trip }}
            disabled={!trip}
            onPress={() => setShowOptions(true)}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={22}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.stateContent}>
              <View style={styles.stateCard}>
                <Text style={styles.stateText}>Loading trip details...</Text>
              </View>
            </View>
          ) : error || !trip ? (
            <View style={styles.stateContent}>
              <View style={styles.stateCard}>
                <Text style={styles.stateTitle}>
                  Could not load trip details
                </Text>
                <Text style={styles.stateText}>
                  {error?.message ??
                    (tripUid
                      ? "Trip details are unavailable."
                      : "Trip ID is missing.")}
                </Text>
                {tripUid ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => refetch()}
                    style={styles.retryButton}
                  >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : (
            <TripDetailsContent trip={trip} />
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Start Shopping"
            onPress={() => {}}
            style={styles.startButton}
          />
          <View style={styles.buttonIcon}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={18}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
      </View>
      <TripOptionsSheet
        visible={showOptions}
        acceptsNewOrders={trip?.status.toLowerCase() === "open"}
        isUpdatingOrderAvailability={toggleTripOrders.isPending}
        tripStatus={trip?.status ?? ""}
        isUpdatingTripStatus={updateTripStatus.isPending}
        pendingTripStatus={updateTripStatus.variables?.payload.status}
        onClose={() => setShowOptions(false)}
        onToggleOrderAvailability={toggleOrderAvailability}
        onUpdateTripStatus={submitTripStatus}
        onSelect={handleTripOption}
      />
      <DeleteTripConfirmationModal
        visible={showDeleteConfirmation}
        isDeleting={deleteTripMutation.isPending}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteTrip}
      />
    </AppScreen>
  );

  async function handleTripOption(action: TripOptionAction) {
    setShowOptions(false);
    if (!trip) return;

    if (action === "share") {
      try {
        await Share.share({
          message: `Trip: ${trip.origin} to ${trip.destination}, departing ${formatDate(trip.departureAt)}.`,
        });
      } catch {
        showToast("Unable to share this trip.");
      }
      return;
    }

    if (action === "delete") {
      setShowDeleteConfirmation(true);
      return;
    }

    if (action === "cancel") {
      confirmCancelTrip();
      return;
    }

    if (action === "edit") {
      router.push({
        pathname: "/edit-trip",
        params: { uid: trip.uid },
      });
      return;
    }

    const messages: Record<
      Exclude<TripOptionAction, "share" | "delete" | "edit" | "cancel">,
      string
    > = {
      "close-orders": "Use the switch to update new order availability.",
    };
    showToast(messages[action]);
  }

  function toggleOrderAvailability(closed: boolean) {
    if (!tripUid || toggleTripOrders.isPending) return;

    toggleTripOrders.mutate(
      { uid: tripUid, closed },
      {
        onSuccess: (response) => {
          showToast(
            response.message ||
              (closed
                ? "New orders are closed for this trip."
                : "This trip is open for new orders."),
            { variant: "success" },
          );
        },
        onError: (toggleError) => {
          showToast(
            toggleError instanceof Error
              ? toggleError.message
              : "Unable to update order availability.",
          );
        },
      },
    );
  }

  function confirmCancelTrip() {
    Alert.alert(
      "Cancel this trip?",
      "This will cancel the trip and notify its requesters. This action cannot be undone.",
      [
        { text: "Keep Trip", style: "cancel" },
        {
          text: "Cancel Trip",
          style: "destructive",
          onPress: () => submitTripStatus("cancelled"),
        },
      ],
    );
  }

  function submitTripStatus(status: TripStatus) {
    if (!tripUid || updateTripStatus.isPending) return;

    updateTripStatus.mutate(
      { uid: tripUid, payload: { status } },
      {
        onSuccess: (response) => {
          setShowOptions(false);
          showToast(
            response.message ||
              `Trip status updated to ${status.replace(/_/g, " ")}.`,
            { variant: "success" },
          );
        },
        onError: (statusError) => {
          showToast(
            statusError instanceof Error
              ? statusError.message
              : "Unable to update trip status.",
          );
        },
      },
    );
  }

  function confirmDeleteTrip() {
    if (!tripUid || deleteTripMutation.isPending) return;

    deleteTripMutation.mutate(tripUid, {
      onSuccess: (response) => {
        setShowDeleteConfirmation(false);
        showToast(response.message || "Trip deleted successfully.");
        router.back();
      },
      onError: (deleteError) => {
        setShowDeleteConfirmation(false);
        showToast(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete trip.",
        );
      },
    });
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

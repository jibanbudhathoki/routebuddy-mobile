import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View, Share } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { Button } from "../../../shared/components/Button";
import { useToast } from "../../../shared/components/ToastProvider";
import { DeleteTripConfirmationModal } from "../components/DeleteTripConfirmationModal";
import { TripDetailsContent } from "../components/TripDetailsContent";
import {
  TripOptionsSheet,
  type TripOptionAction,
} from "../components/TripOptionsSheet";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import { useTripDetails } from "../hooks/useTripDetails";

export function TripDetailsScreen() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const tripUid = typeof uid === "string" ? uid : "";
  const deleteTripMutation = useDeleteTrip();
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
        onClose={() => setShowOptions(false)}
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

    const messages: Record<
      Exclude<TripOptionAction, "share" | "delete">,
      string
    > = {
      edit: "Editing trips is not available yet.",
      "close-orders": "Trip order settings are not saved yet.",
      cancel: "Trip cancellation is not available yet.",
    };
    showToast(messages[action]);
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

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 42,
    justifyContent: "space-between",
  },
  headerAction: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  stateContent: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  footer: {
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  startButton: {
    minHeight: 48,
  },
  buttonIcon: {
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    height: 48,
    justifyContent: "center",
    paddingLeft: theme.spacing.lg,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
}));

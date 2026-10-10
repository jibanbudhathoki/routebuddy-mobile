import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { MarketplaceTripDetailsActions } from "../components/MarketplaceTripDetailsActions";
import { MarketplaceTripDetailsHeader } from "../components/MarketplaceTripDetailsHeader";
import { MarketplaceTripInformation } from "../components/MarketplaceTripInformation";
import { MarketplaceTripOverview } from "../components/MarketplaceTripOverview";
import { MarketplaceTripRouteCard } from "../components/MarketplaceTripRouteCard";
import { useTripDetails } from "../hooks/useTripDetails";

export function MarketplaceTripDetailsScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const tripUid = typeof uid === "string" ? uid : "";
  const { data: trip, error, isLoading, refetch } = useTripDetails(tripUid);

  return (
    <AppScreen>
      <View style={styles.screen}>
        <MarketplaceTripDetailsHeader
          onBack={() => router.back()}
          onNotificationsPress={() =>
            showToast("Notifications are not available yet.")
          }
        />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <TripDetailsState message="Loading trip details..." />
          ) : error || !trip ? (
            <TripDetailsState
              title="Could not load trip details"
              message={
                error?.message ??
                (tripUid
                  ? "Trip details are unavailable."
                  : "Trip ID is missing.")
              }
              onRetry={tripUid ? () => refetch() : undefined}
            />
          ) : (
            <>
              <MarketplaceTripOverview trip={trip} />
              <MarketplaceTripRouteCard trip={trip} />
              <MarketplaceTripInformation trip={trip} />
            </>
          )}
        </ScrollView>
        {trip && !isLoading && !error ? (
          <MarketplaceTripDetailsActions
            onBuildShoppingList={() =>
              router.push({
                pathname: "/(modals)/request/build-trip-order",
                params: { tripUid: trip.uid },
              })
            }
            onMessageDriver={() =>
              showToast("Driver messaging is not available yet.")
            }
          />
        ) : null}
      </View>
    </AppScreen>
  );
}

function TripDetailsState({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.stateCard}>
      {title ? <Text style={styles.stateTitle}>{title}</Text> : null}
      <Text style={styles.stateText}>{message}</Text>
      {onRetry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
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

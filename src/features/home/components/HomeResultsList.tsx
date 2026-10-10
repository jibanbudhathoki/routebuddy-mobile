import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { ListAllTripsItem } from "../../trip/types/trip";
import type { MyRequestListItem } from "../../request/types/request";
import type { BrowseMode } from "./HomeBrowseControls";
import { HomeRequestCard } from "./HomeRequestCard";
import { HomeTripCard } from "./HomeTripCard";

interface HomeResultsListProps {
  mode: BrowseMode;
  trips: ListAllTripsItem[];
  requests: MyRequestListItem[];
  filteredTrips: ListAllTripsItem[];
  filteredRequests: MyRequestListItem[];
  isTripsLoading: boolean;
  tripsError: Error | null;
  isRequestsLoading: boolean;
  requestsError: Error | null;
  onRetryTrips: () => void;
  onRetryRequests: () => void;
  onResetFilters: () => void;
}

export function HomeResultsList({
  mode,
  trips,
  requests,
  filteredTrips,
  filteredRequests,
  isTripsLoading,
  tripsError,
  isRequestsLoading,
  requestsError,
  onRetryTrips,
  onRetryRequests,
  onResetFilters,
}: HomeResultsListProps) {
  const { theme } = useUnistyles();
  const isTripsMode = mode === "trips";
  const isLoading = isTripsMode ? isTripsLoading : isRequestsLoading;
  const error = isTripsMode ? tripsError : requestsError;
  const count = isTripsMode ? filteredTrips.length : filteredRequests.length;

  return (
    <ScrollView
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.sectionHeading}>
        <View style={styles.sectionTitleGroup}>
          <MaterialCommunityIcons
            name={isTripsMode ? "car-outline" : "bag-personal-outline"}
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.sectionTitle}>
            {isTripsMode ? "Trips near you" : "Open requests near you"}
          </Text>
        </View>
        <Text style={styles.resultCount}>
          {isLoading
            ? "Loading..."
            : `${count} ${isTripsMode ? "trips" : "requests"}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyDescription}>
            {isTripsMode ? "Loading trips..." : "Loading open requests..."}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={28}
            color={theme.colors.error}
          />
          <Text style={styles.emptyTitle}>
            {isTripsMode ? "Could not load trips" : "Could not load open requests"}
          </Text>
          <Text style={styles.emptyDescription}>{error.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={isTripsMode ? onRetryTrips : onRetryRequests}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : isTripsMode ? (
        filteredTrips.length ? (
          filteredTrips.map((trip) => <HomeTripCard key={trip.uid} trip={trip} />)
        ) : (
          <EmptyResults
            icon="map-search-outline"
            title="No matching trips"
            description="Try changing your search or filters."
            onReset={onResetFilters}
          />
        )
      ) : filteredRequests.length ? (
        filteredRequests.map((request) => (
          <HomeRequestCard key={request.uid} request={request} />
        ))
      ) : (
        <EmptyResults
          icon="bag-personal-outline"
          title={
            requests.length
              ? "No matching requests"
              : "No open requests nearby"
          }
          description={
            requests.length
              ? "Try changing your search or filters."
              : "Open requests will appear here when available."
          }
          onReset={requests.length ? onResetFilters : undefined}
        />
      )}
    </ScrollView>
  );
}

function EmptyResults({
  icon,
  title,
  description,
  onReset,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  onReset?: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={icon}
        size={28}
        color={theme.colors.muted}
      />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {onReset ? (
        <Pressable accessibilityRole="button" onPress={onReset}>
          <Text style={styles.resetFilters}>Clear filters</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  listContent: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  sectionTitleGroup: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  resultCount: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyDescription: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  resetFilters: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: theme.spacing.xs,
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
    fontSize: 11,
    fontWeight: "600",
  },
}));

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { useListAllRequests } from "../../request/hooks/useListAllRequests";
import type { MyRequestListItem } from "../../request/types/request";
import { useListAllTrips } from "../../trip/hooks/useListAllTrips";
import { HomeBrowseControls, type BrowseMode } from "../components/HomeBrowseControls";
import { HomeHeader } from "../components/HomeHeader";
import { HomeRequestCard } from "../components/HomeRequestCard";
import { HomeTripCard } from "../components/HomeTripCard";

export function HomeScreen() {
  const [mode, setMode] = useState<BrowseMode>("trips");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [dateFilter, setDateFilter] = useState("Any date");
  const [storeFilter, setStoreFilter] = useState("All stores");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const {
    data: trips,
    error,
    isLoading,
    refetch,
  } = useListAllTrips(mode === "trips");
  const {
    data: requests,
    error: requestsError,
    isLoading: areRequestsLoading,
    refetch: refetchRequests,
  } = useListAllRequests(mode === "requests");

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (trips ?? []).filter((trip) => {
      const matchesLocation =
        locationFilter === "All locations" ||
        trip.origin === locationFilter ||
        trip.destination === locationFilter;
      const tripDate = formatDepartureDate(trip.departureAt);
      const matchesDate =
        dateFilter === "Any date" || tripDate === dateFilter;
      const matchesStore =
        storeFilter === "All stores" ||
        trip.stores.some(
          (store) => store.toLowerCase() === storeFilter.toLowerCase(),
        );
      const searchableText = [
        trip.driver.name,
        trip.origin,
        trip.destination,
        trip.departureAt,
        trip.deliveryLatestBy,
        ...trip.stores,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesLocation &&
        matchesDate &&
        matchesStore &&
        (!showMoreFilters || trip.availableSeats > 0) &&
        (!query || searchableText.includes(query))
      );
    });
  }, [dateFilter, locationFilter, search, showMoreFilters, storeFilter, trips]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (requests ?? []).filter((request) => {
      const matchesLocation =
        locationFilter === "All locations" ||
        request.origin === locationFilter ||
        request.destination === locationFilter ||
        request.deliveryCity === locationFilter;
      const matchesDate =
        dateFilter === "Any date" ||
        formatRequestFilterDate(request.neededBy) === dateFilter;
      const matchesStore =
        storeFilter === "All stores" ||
        request.stores.some(
          (store) => store.toLowerCase() === storeFilter.toLowerCase(),
        );
      const searchableText = [
        request.requester?.name,
        request.origin,
        request.destination,
        request.deliveryCity,
        request.neededBy,
        request.latestDeliveryBy,
        ...request.stores,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesLocation &&
        matchesDate &&
        matchesStore &&
        (!query || searchableText.includes(query))
      );
    });
  }, [dateFilter, locationFilter, requests, search, storeFilter]);

  const activeLocations =
    mode === "trips"
      ? Array.from(
          new Set(
            (trips ?? []).flatMap((trip) => [trip.origin, trip.destination]),
          ),
        )
      : Array.from(
          new Set(
            (requests ?? []).flatMap((request) => [
              request.origin,
              request.destination,
              request.deliveryCity,
            ]),
          ),
        );
  const activeDates =
    mode === "trips"
      ? Array.from(
          new Set((trips ?? []).map((trip) => formatDepartureDate(trip.departureAt))),
        )
      : Array.from(
          new Set(
            (requests ?? []).map((request) =>
              formatRequestFilterDate(request.neededBy),
            ),
          ),
        );
  const activeStores =
    mode === "trips"
      ? Array.from(new Set((trips ?? []).flatMap((trip) => trip.stores)))
      : Array.from(new Set((requests ?? []).flatMap((request) => request.stores)));

  const cycleLocation = () => {
    const currentIndex = activeLocations.indexOf(locationFilter);
    setLocationFilter(
      currentIndex < 0 || currentIndex === activeLocations.length - 1
        ? "All locations"
        : activeLocations[currentIndex + 1],
    );
  };

  const cycleDate = () => {
    const currentIndex = activeDates.indexOf(dateFilter);
    setDateFilter(
      currentIndex < 0 || currentIndex === activeDates.length - 1
        ? "Any date"
        : activeDates[currentIndex + 1],
    );
  };

  const cycleStore = () => {
    const currentIndex = activeStores.indexOf(storeFilter);
    setStoreFilter(
      currentIndex < 0 || currentIndex === activeStores.length - 1
        ? "All stores"
        : activeStores[currentIndex + 1],
    );
  };

  return (
    <AppScreen>
      <HomeHeader
        location={
          locationFilter === "All locations"
            ? (mode === "trips" ? trips?.[0]?.origin : requests?.[0]?.origin) ??
              "All locations"
            : locationFilter
        }
        onLocationPress={cycleLocation}
        onNotificationsPress={() => showToast("You are all caught up.")}
      />
      <HomeBrowseControls
        mode={mode}
        search={search}
        locationFilter={locationFilter}
        dateFilter={dateFilter}
        storeFilter={storeFilter}
        showMoreFilters={showMoreFilters}
        onModeChange={setMode}
        onSearchChange={setSearch}
        onLocationFilterPress={cycleLocation}
        onDateFilterPress={cycleDate}
        onStoreFilterPress={cycleStore}
        onToggleMoreFilters={() => setShowMoreFilters((visible) => !visible)}
      />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {mode === "trips" ? (
          <>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleGroup}>
                <MaterialCommunityIcons
                  name="car-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}>Trips near you</Text>
              </View>
              <Text style={styles.resultCount}>
                {isLoading ? "Loading..." : `${filteredTrips.length} trips`}
              </Text>
            </View>
            {isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyDescription}>Loading trips...</Text>
              </View>
            ) : error ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={28}
                  color={theme.colors.error}
                />
                <Text style={styles.emptyTitle}>Could not load trips</Text>
                <Text style={styles.emptyDescription}>{error.message}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => refetch()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              </View>
            ) : filteredTrips.length ? (
              filteredTrips.map((trip) => (
                <HomeTripCard key={trip.uid} trip={trip} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="map-search-outline"
                  size={28}
                  color={theme.colors.muted}
                />
                <Text style={styles.emptyTitle}>No matching trips</Text>
                <Text style={styles.emptyDescription}>
                  Try changing your search or filters.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setSearch("");
                    setLocationFilter("All locations");
                    setDateFilter("Any date");
                    setStoreFilter("All stores");
                    setShowMoreFilters(false);
                  }}
                >
                  <Text style={styles.resetFilters}>Clear filters</Text>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleGroup}>
                <MaterialCommunityIcons
                  name="bag-personal-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}>Open requests near you</Text>
              </View>
              <Text style={styles.resultCount}>
                {areRequestsLoading
                  ? "Loading..."
                  : `${filteredRequests.length} requests`}
              </Text>
            </View>
            {areRequestsLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyDescription}>
                  Loading open requests...
                </Text>
              </View>
            ) : requestsError ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={28}
                  color={theme.colors.error}
                />
                <Text style={styles.emptyTitle}>
                  Could not load open requests
                </Text>
                <Text style={styles.emptyDescription}>
                  {requestsError.message}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => refetchRequests()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </Pressable>
              </View>
            ) : filteredRequests.length ? (
              filteredRequests.map((request: MyRequestListItem) => (
                <HomeRequestCard key={request.uid} request={request} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="bag-personal-outline"
                  size={28}
                  color={theme.colors.muted}
                />
                <Text style={styles.emptyTitle}>
                  {requests?.length
                    ? "No matching requests"
                    : "No open requests nearby"}
                </Text>
                <Text style={styles.emptyDescription}>
                  {requests?.length
                    ? "Try changing your search or filters."
                    : "Open requests will appear here when available."}
                </Text>
                {requests?.length ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSearch("");
                      setLocationFilter("All locations");
                      setDateFilter("Any date");
                      setStoreFilter("All stores");
                      setShowMoreFilters(false);
                    }}
                  >
                    <Text style={styles.resetFilters}>Clear filters</Text>
                  </Pressable>
                ) : null}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </AppScreen>
  );
}

function formatDepartureDate(departureAt: string) {
  const departure = new Date(departureAt);
  if (Number.isNaN(departure.getTime())) {
    return departureAt;
  }
  return departure.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRequestFilterDate(neededBy: string) {
  const needed = new Date(neededBy);
  if (Number.isNaN(needed.getTime())) {
    return neededBy;
  }

  return needed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
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

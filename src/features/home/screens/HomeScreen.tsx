import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { HomeBrowseControls, type BrowseMode } from "../components/HomeBrowseControls";
import { HomeHeader } from "../components/HomeHeader";
import { HomeTripCard } from "../components/HomeTripCard";
import { homeTrips } from "../data/homeTrips";
import type { HomeTrip } from "../types/home";

export function HomeScreen() {
  const [mode, setMode] = useState<BrowseMode>("trips");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("Reston");
  const [dateFilter, setDateFilter] = useState("Any date");
  const [storeFilter, setStoreFilter] = useState("All stores");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { theme } = useUnistyles();
  const { showToast } = useToast();

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    return homeTrips.filter((trip) => {
      const matchesLocation =
        locationFilter === "All locations" || trip.origin === locationFilter;
      const matchesDate =
        dateFilter === "Any date" || trip.departureLabel === dateFilter;
      const matchesStore =
        storeFilter === "All stores" ||
        trip.stores.some((store) => store.toLowerCase() === storeFilter.toLowerCase());
      const searchableText = [
        trip.driverName,
        trip.origin,
        trip.destination,
        ...trip.stores,
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
  }, [dateFilter, locationFilter, search, storeFilter]);

  const cycleLocation = () => {
    setLocationFilter((current) =>
      current === "Reston" ? "All locations" : "Reston",
    );
  };

  const cycleDate = () => {
    setDateFilter((current) => {
      if (current === "Any date") return "Mon, May 26";
      if (current === "Mon, May 26") return "Tue, May 27";
      if (current === "Tue, May 27") return "Wed, May 28";
      return "Any date";
    });
  };

  const cycleStore = () => {
    setStoreFilter((current) => {
      if (current === "All stores") return "Walmart";
      if (current === "Walmart") return "Costco";
      return "All stores";
    });
  };

  const showTripDetails = (_trip: HomeTrip) => {
    showToast("Trip details will be available when trip browsing is connected.");
  };

  return (
    <AppScreen>
      <HomeHeader
        location={locationFilter}
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
              <Text style={styles.resultCount}>{filteredTrips.length} trips</Text>
            </View>
            {filteredTrips.length ? (
              filteredTrips.map((trip) => (
                <HomeTripCard
                  key={trip.id}
                  trip={trip}
                  onViewDetails={showTripDetails}
                />
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
                  }}
                >
                  <Text style={styles.resetFilters}>Clear filters</Text>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bag-personal-outline"
              size={28}
              color={theme.colors.muted}
            />
            <Text style={styles.emptyTitle}>No open requests nearby</Text>
            <Text style={styles.emptyDescription}>
              Open requests will show here when request browsing is available.
            </Text>
          </View>
        )}
      </ScrollView>
    </AppScreen>
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
}));

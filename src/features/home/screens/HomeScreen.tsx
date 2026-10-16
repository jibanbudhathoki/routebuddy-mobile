import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useUnreadNotificationCount } from "../../notifications/hooks/useNotifications";
import { useListAllRequests } from "../../request/hooks/useListAllRequests";
import { useListAllTrips } from "../../trip/hooks/useListAllTrips";
import {
  HomeBrowseControls,
  type BrowseMode,
} from "../components/HomeBrowseControls";
import { HomeHeader } from "../components/HomeHeader";
import { HomeResultsList } from "../components/HomeResultsList";
import {
  createDateFilterOptions,
  createTextFilterOptions,
  getFilterDateKey,
  normalizeFilterValue,
} from "../utils/homeFilterOptions";

export function HomeScreen() {
  const router = useRouter();
  const unreadCount = useUnreadNotificationCount();
  const [mode, setMode] = useState<BrowseMode>("trips");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
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

  const locationOptions = useMemo(
    () =>
      createTextFilterOptions(
        mode === "trips"
          ? (trips ?? []).flatMap((trip) => [
              trip.origin,
              trip.destination,
            ])
          : (requests ?? []).flatMap((request) => [
              request.origin,
              request.destination,
              request.deliveryCity,
            ]),
        "All locations",
      ),
    [mode, requests, trips],
  );
  const dateOptions = useMemo(
    () =>
      mode === "trips"
        ? createDateFilterOptions(
            (trips ?? []).map((trip) => trip.departureAt),
          )
        : createDateFilterOptions(
            (requests ?? []).map((request) => request.neededBy),
            true,
          ),
    [mode, requests, trips],
  );
  const storeOptions = useMemo(
    () =>
      createTextFilterOptions(
        mode === "trips"
          ? (trips ?? []).flatMap((trip) => trip.stores)
          : (requests ?? []).flatMap((request) => request.stores),
        "All stores",
      ),
    [mode, requests, trips],
  );

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (trips ?? []).filter((trip) => {
      const selectedLocation = normalizeFilterValue(locationFilter);
      const selectedStore = normalizeFilterValue(storeFilter);
      const matchesLocation =
        !selectedLocation ||
        normalizeFilterValue(trip.origin) === selectedLocation ||
        normalizeFilterValue(trip.destination) === selectedLocation;
      const matchesDate =
        !dateFilter || getFilterDateKey(trip.departureAt) === dateFilter;
      const matchesStore =
        !selectedStore ||
        trip.stores.some(
          (store) => normalizeFilterValue(store) === selectedStore,
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
      const selectedLocation = normalizeFilterValue(locationFilter);
      const selectedStore = normalizeFilterValue(storeFilter);
      const matchesLocation =
        !selectedLocation ||
        normalizeFilterValue(request.origin) === selectedLocation ||
        normalizeFilterValue(request.destination) === selectedLocation ||
        normalizeFilterValue(request.deliveryCity) === selectedLocation;
      const matchesDate =
        !dateFilter ||
        getFilterDateKey(request.neededBy, true) === dateFilter;
      const matchesStore =
        !selectedStore ||
        request.stores.some(
          (store) => normalizeFilterValue(store) === selectedStore,
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

  const cycleLocation = () => {
    const currentIndex = locationOptions.findIndex(
      (option) => option.value === locationFilter,
    );
    setLocationFilter(
      locationOptions[(currentIndex + 1) % locationOptions.length]?.value ?? "",
    );
  };

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setDateFilter("");
    setStoreFilter("");
    setShowMoreFilters(false);
  };

  const changeMode = (nextMode: BrowseMode) => {
    if (nextMode !== mode) {
      setLocationFilter("");
      setDateFilter("");
      setStoreFilter("");
    }
    setMode(nextMode);
  };

  return (
    <AppScreen>
      <HomeHeader
        location={
          !locationFilter
            ? (mode === "trips" ? trips?.[0]?.origin : requests?.[0]?.origin) ??
              "All locations"
            : locationFilter
        }
        onLocationPress={cycleLocation}
        unreadCount={unreadCount}
        onNotificationsPress={() => router.push("/notifications")}
      />
      <HomeBrowseControls
        mode={mode}
        search={search}
        locationFilter={locationFilter}
        dateFilter={dateFilter}
        storeFilter={storeFilter}
        showMoreFilters={showMoreFilters}
        locationOptions={locationOptions}
        dateOptions={dateOptions}
        storeOptions={storeOptions}
        onModeChange={changeMode}
        onSearchChange={setSearch}
        onLocationFilterChange={setLocationFilter}
        onDateFilterChange={setDateFilter}
        onStoreFilterChange={setStoreFilter}
        onToggleMoreFilters={() => setShowMoreFilters((visible) => !visible)}
      />
      <HomeResultsList
        mode={mode}
        trips={trips ?? []}
        requests={requests ?? []}
        filteredTrips={filteredTrips}
        filteredRequests={filteredRequests}
        isTripsLoading={isLoading}
        tripsError={error ?? null}
        isRequestsLoading={areRequestsLoading}
        requestsError={requestsError ?? null}
        onRetryTrips={() => refetch()}
        onRetryRequests={() => refetchRequests()}
        onResetFilters={clearFilters}
      />
    </AppScreen>
  );
}

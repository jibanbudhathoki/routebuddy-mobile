import { useMemo, useState } from "react";

import { AppScreen } from "../../../shared/components/AppScreen";
import { useToast } from "../../../shared/components/ToastProvider";
import { useListAllRequests } from "../../request/hooks/useListAllRequests";
import { useListAllTrips } from "../../trip/hooks/useListAllTrips";
import {
  HomeBrowseControls,
  type BrowseMode,
} from "../components/HomeBrowseControls";
import { HomeHeader } from "../components/HomeHeader";
import { HomeResultsList } from "../components/HomeResultsList";

export function HomeScreen() {
  const [mode, setMode] = useState<BrowseMode>("trips");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [dateFilter, setDateFilter] = useState("Any date");
  const [storeFilter, setStoreFilter] = useState("All stores");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
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
      const matchesDate = dateFilter === "Any date" || tripDate === dateFilter;
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
          new Set(
            (trips ?? []).map((trip) => formatDepartureDate(trip.departureAt)),
          ),
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
      : Array.from(
          new Set((requests ?? []).flatMap((request) => request.stores)),
        );

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

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("All locations");
    setDateFilter("Any date");
    setStoreFilter("All stores");
    setShowMoreFilters(false);
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

function formatDepartureDate(departureAt: string) {
  const departure = new Date(departureAt);
  if (Number.isNaN(departure.getTime())) return departureAt;

  return departure.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRequestFilterDate(neededBy: string) {
  const needed = new Date(neededBy);
  if (Number.isNaN(needed.getTime())) return neededBy;

  return needed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

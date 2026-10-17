import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { SharedDetailLayout } from "../../../shared/components/SharedDetailLayout";
import { TripDetailsDriverSections } from "../components/TripDetailsDriverSections";
import { TripDetailsOverview } from "../components/TripDetailsOverview";
import { TripDetailsRouteSections } from "../components/TripDetailsRouteSections";
import { useSharedTripDetails } from "../hooks/useSharedTripDetails";

export function SharedTripScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const tripUid = typeof uid === "string" ? uid : "";
  const { data: trip, error, isLoading, refetch } =
    useSharedTripDetails(tripUid);

  return (
    <SharedDetailLayout
      title="Shared Trip"
      isLoading={isLoading}
      errorMessage={
        error?.message ??
        (!trip && !isLoading
          ? tripUid
            ? "Trip details are unavailable."
            : "Trip ID is missing."
          : undefined)
      }
      onBack={() => router.back()}
      onRetry={tripUid ? () => void refetch() : undefined}
    >
      {trip ? (
        <View style={styles.content}>
          <TripDetailsOverview trip={trip} />
          <TripDetailsRouteSections trip={trip} />
          <TripDetailsDriverSections trip={trip} />
        </View>
      ) : null}
    </SharedDetailLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing.sm,
  },
}));

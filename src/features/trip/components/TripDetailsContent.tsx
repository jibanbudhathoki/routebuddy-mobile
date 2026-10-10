import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";
import { TripDetailsDriverSections } from "./TripDetailsDriverSections";
import { TripDetailsOverview } from "./TripDetailsOverview";
import { TripDetailsRouteSections } from "./TripDetailsRouteSections";

export function TripDetailsContent({ trip }: { trip: TripDetailsResponse }) {
  return (
    <View style={styles.content}>
      <TripDetailsOverview trip={trip} />
      <TripDetailsRouteSections trip={trip} />
      <TripDetailsDriverSections trip={trip} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
}));

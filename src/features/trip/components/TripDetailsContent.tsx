import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";
import type { TripOrder } from "../types/trip";
import { TripDetailsDriverSections } from "./TripDetailsDriverSections";
import { TripDetailsOverview } from "./TripDetailsOverview";
import { TripDetailsRouteSections } from "./TripDetailsRouteSections";
import { TripOrdersSection } from "./TripOrdersSection";

interface TripDetailsContentProps {
  trip: TripDetailsResponse;
  orders: TripOrder[];
  isLoadingOrders: boolean;
  ordersError: Error | null;
  onRetryOrders: () => void;
  onSelectOrder: (order: TripOrder) => void;
}

export function TripDetailsContent({
  trip,
  orders,
  isLoadingOrders,
  ordersError,
  onRetryOrders,
  onSelectOrder,
}: TripDetailsContentProps) {
  return (
    <View style={styles.content}>
      <TripDetailsOverview trip={trip} />
      <TripDetailsRouteSections trip={trip} />
      <TripOrdersSection
        orders={orders}
        isLoading={isLoadingOrders}
        error={ordersError}
        onRetry={onRetryOrders}
        onSelectOrder={onSelectOrder}
      />
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
